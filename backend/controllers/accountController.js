const validator = require("validator")
const jwt = require("jsonwebtoken")
const Account = require("../models/accountModel")
const fs = require('fs')
const mongoose = require("mongoose")

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

module.exports = { signup, userInfo, liveSearch, follow, followings, userLogin, editProfile }
