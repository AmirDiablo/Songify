const validator = require("validator")
const jwt = require("jsonwebtoken")
const Account = require("../models/accountModel")
const fs = require('fs')
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const {redisClient} = require("../redisClient")
const MonthlyListener = require("../models/monthlyListeners")

const createToken = (_id)=> {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: "10d" })
}

const trimer = (value)=> {
    return validator.trim(validator.escape(value).replace(" ", ""))
}

const signup = async (req, res)=> {
    const {username, email, password, isArtist} = req.body
    const newUsername = validator.trim(username)
    const newEmail = trimer(email)
    const newPassword = trimer(password)

    try{
        const account = await Account.signup(newUsername, newEmail, newPassword, isArtist)
        const token = createToken(account._id)
        res.status(200).json({id: account._id , token})
    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const userInfo = async(req, res)=> {
    const id = req.query.q
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("No such user")
        }
        const userInfo = await Account.find({_id: id})
        res.status(200).json(userInfo)
    }
    catch(err) {
        res.status(404).json({error: err.message})
    }
}

const liveSearch = async(req, res)=> {
    try{
        const q = req.query.q || ''
        console.log(q)
        if(!q) {
            return res.status(200).json([])
        }

        const results = await Account.find({username: {$regex: q, $options: 'i'}}).limit(10)
        res.status(200).json(results)
    }catch (error) {
        res.status(500).send("Server error")
    }
}

const follow = async(req, res)=> {
    const { follower, following } = req.body
    const check = await Account.findOne({_id: following, followers: follower})

    try{
        if(!check) {
            const changeFollowers = await Account.updateOne({_id: following}, {$push: {followers: follower}})
            const changeFollowings = await Account.updateOne({_id: follower}, {$push: {followings: following}})
        }else{
            const changeFollowers = await Account.updateOne({_id: following}, {$pull: {followers: follower}})
            const changeFollowings = await Account.updateOne({_id: follower}, {$pull: {followings: following}})
        }
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }

    res.status(200).json({message: "updates done"})
}

const followings = async(req, res)=> {
    const id = req.query.q
    try{
        const myFollowings = await Account.findOne({_id: id}, {followings: 1, _id: 0})
        .populate("followings")
        const newFollowings = myFollowings.followings.filter(item=> item.isArtist == true)
        res.status(200).json(newFollowings)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const userLogin = async(req, res)=> {
    const { email, password } = req.body
    const newEmail = trimer(email)
    const newPassword = trimer(password)

    try{
        const account = await Account.login(newEmail, newPassword)

        const token = createToken(account._id)

        res.status(200).json({id: account._id, token})
    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const editProfile = async(req, res)=> {

     try {
        const uploadedFile = req.files.profile[0].filename;
        const { name, id } = req.body;
        const newName = validator.escape(name)

        const currentProfile = await Account.find({ _id: id }, { profile: 1, _id: 0 });
        
        // ابتدا آپدیت را انجام دهید
        const profilePhoto = await Account.findOneAndUpdate(
            { _id: id },
            { $set: { profile: uploadedFile, username: newName } },
            { new: true } // این گزینه باعث می‌شود سند آپدیت شده برگردانده شود
        );

        // سپس فایل قدیمی را حذف کنید
        if (currentProfile[0]?.profile && fs.existsSync("../frontend/public/profiles/" + currentProfile[0].profile)) {
            fs.unlink("../frontend/public/profiles/" + currentProfile[0].profile, (err) => {
                if (err) console.log(err);
                console.log("profile photo changed");
            });
        }

        res.json(profilePhoto);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
    
}

const continueWithGoogle = async(req, res)=> {
    const {googleId, username, email} = req.body
    const check = await Account.findOne({email})
    let user;

    try{
        //login
        if(check) {
            user = check
        }else{
            const account = await Account.create({username, email, googleId, isArtist: false}) 
            user = account
        }

        const token = createToken(user._id)
        res.status(200).json({id: user._id, token})
    }catch(err) {
        res.status(500).json({error: err.message})
    }
}

const changePass = async(req, res)=> {
    const {currentPass, newPass, id} = req.body
    const user = await Account.findOne({_id: id})
    const match = await bcrypt.compare(currentPass, user.password)

    try{
        if(!match) {
            console.log("false")
            throw new Error("the password you entered is not match with the one that exist in database")
        }

        console.log('true')
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass, salt)
        const change = await Account.updateOne({_id: id}, {password: hash})
        res.status(200).json("sumbited")
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
 
}

const setPass = async(req, res)=> {
    const {newPass, id} = req.body
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass, salt)
        const setPass = await Account.updateOne({_id: id}, {password: hash})
        res.status(200).json(setPass)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const registerListener = async(req, res)=> {
    const {userId, artistId} = req.body
    const hyperloglogKey = `artistListener:${artistId}`
    const register = await redisClient.pfAdd(hyperloglogKey, userId)
    res.status(200).json("registered!")
}

const getMonthlyListeners = async(req, res)=> {
    const artistId = req.params.artistId
    const key = `monthlyListeners:${artistId}`
    const exist = await redisClient.get(key)
    let listenersCount;
    if(exist) {
        //cache hit
        listenersCount = exist
    }else{
        //cache miss
        const findDoc = await MonthlyListener.findOne({artistId}).sort({_id: -1}).limit(1)
        listenersCount = findDoc.listenersCount
        const registerToRedis = await redisClient.set(`monthlyListeners:${artistId}`, listenersCount, 'EX', 60 * 60 * 24 * 30)
    }

    res.status(200).json(listenersCount)
}

const ListenerStatics = async(req, res)=> {
    const {artistId} = req.params
    const infos = await MonthlyListener.find({artistId})
    res.status(200).json(infos)
}

const mostfamous = async(req, res)=> {
    const key = `mostFamousArtist:10`
    const exist = await redisClient.get(key) || false
    if(exist) {
        //cache hit
        res.status(200).json(JSON.parse(exist))
    }else{
        //cache miss
        const mostfamous = await Account.find({isArtist: true}).sort({followers: -1}).limit(10)
        const registerToRedis = await redisClient.set(key, JSON.stringify(mostfamous), 'EX', 60 * 60 * 24 * 7 )
        res.status(200).json(mostfamous)
    }
}

module.exports = { signup, userInfo, liveSearch, follow, followings, userLogin, editProfile, continueWithGoogle, changePass, setPass, registerListener, getMonthlyListeners, ListenerStatics, mostfamous }
