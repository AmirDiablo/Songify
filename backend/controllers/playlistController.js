const {Playlist, SavedPlaylist} = require("../models/playlistModel")
const mongoose = require("mongoose")
const validator = require("validator")
const {redisClient} = require('../redisClient')
const TopPlaylists = require("../models/topPlaylists")

const createPlaylist = async(req, res)=> {
    const { name, creatorId, isPublic } = validator.escape(req.body)
    try{
        if(!name || creatorId || isPublic) {
            throw new Error("name, creatorId and isPublic should be specified")
        }
        if(!mongoose.Types.ObjectId.isValid(creatorId)) {
            throw new Error("the id is not a real one")
        }
        const playlist = await Playlist.create({name, creatorId, isPublic})
        res.status(200).json(playlist)
    }
    catch(err) {

    }
}

const myPlaylists = async(req, res)=> {
    const id = req.query.q || null
    try{
        if(!id) {
            throw new Error("id is required")
        }
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("the id is not a real one")
        }
        const playlists = await Playlist.find({creatorId: id})
        const saved = await SavedPlaylist.find({userId: id}).populate("playlistId")
        let arr = []
        saved.forEach(item=> {
            arr.push(item.playlistId)
        })

        const AllPlaylists = playlists.concat(arr)
        res.status(200).json(AllPlaylists)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const playlistInfo = async(req, res)=> {
    const playlistId = req.query.q
    try{
        if(!playlistId) {
            throw new Error("playlist id is required")
        }
        if(!mongoose.Types.ObjectId.isValid(playlistId)) {
            throw new Error("the id is not a real one")
        }
        const playlist = await Playlist.findOne({_id: playlistId}).populate("creatorId")
        .populate({
                path: "tracks",
                populate: {
                    path: "artistId"
                }
            })
        res.status(200).json(playlist)
    }
    catch(err) {
        res.status(500).json({error:err.message})
    }
}

const addToPlaylist = async(req, res)=> {
    const { trackId, playlistId, userId } = req.body
    
    try{
        if(!trackId || !playlistId || !userId) {
            throw new Error("track, playlistId and userId is required")
        }
        const check = await Playlist.findOne({_id: playlistId, creatorId: userId})
        const isExist = await Playlist.findOne({_id: playlistId, tracks: trackId})
        if(!check) {
            throw new Error("only playlist owner can edit this playlist")
        }

        if(isExist) {
            throw new Error("this song is already exist in your playlist")
        }

        const track = await Playlist.updateOne({_id: playlistId}, {$push: {tracks: trackId}})
        res.status(200).json(track)
    }
    catch(err) {
        console.log(err.message)
        res.status(500).json(err)
    }
    
    
}

const editPlaylist = async(req, res)=> {
    const uploadedFile = req.file
    const {name, id} = req.body
    const newName = validator.escape(name)
    const validTypes = ["image/jpg", "image/jpeg", "image/png", "image/jfif"]

    try{
        if(!uploadedFile || !name || !id) {
            throw new Error("file, name and id is required")
        }
        if(!validTypes.includes(uploadedFile.mimetype)) {
            throw new Error("this file type is not valid")
        }
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("the id is not a real one")
        }
        const change = await Playlist.updateOne({_id: id}, {cover: uploadedFile.filename, name: newName})
        res.status(200).json(change)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }

    
}

const deleteFromApp = async(req, res)=> {
    const {playlistId, userId} = req.body

    try{
        if(!playlistId || !userId) {
            throw new Error("playlistId and userId is required")
        }
        if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("the id is not a real one")
        }
        const match = await Playlist.findOne({_id: playlistId, creatorId: userId})
        let playlist;

        if(match) {
            playlist = await Playlist.deleteOne({_id: playlistId})
        }

        res.status(200).json(playlist)
    }
    catch(err) {

    }
    
}

const deleteFromLibrary = async(req, res)=> {
    const {playlistId, userId} = req.body
    const multi = redisClient.multi()
    try{
        if(!playlistId || !userId) {
            throw new Error("playlistId and userId is required")
        }
        if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("this id is not a real one")
        }
        const playlist = await SavedPlaylist.deleteOne({userId, playlistId})
        const value = await redisClient.hGet(`playlist:${playlistId}:daily`, "saveCount")
        if(value) {
            multi.hIncrBy(`playlist:${playlistId}:daily`, "saveCount", -1)
            multi.hIncrBy(`playlist:${playlistId}:daily`, "score", -3)
            await redisClient.zIncrBy("playlist:topDaily", -3, playlistId)
        }
        await multi.exec()
        const decreaseSave = await Playlist.updateOne({_id: playlistId}, {$inc: {saveCount: -1}})
        res.status(200).json(playlist)
    }
    catch(err) {

    }
}

const deleteFromPlaylst = async(req, res)=> {
    const {userId, playlistId, songId} = req.body
    try{
        if(!playlistId || !songId || !userId) {
            throw new Error("playlistId and songId is required")
        }
        if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("this id is not a real one")
        }

        const track = await Playlist.findOneAndUpdate({_id: playlistId, creatorId: userId}, {$pull: {tracks: songId} })
        res.status(200).json(track)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const savePlaylist = async(req, res)=> {
    const {userId, playlistId} = req.body
    const multi =  redisClient.multi()
    try{
        if(!userId || !playlistId) {
            throw new Error("userId and playlistId is required")
        }
        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
            throw new Error("this id is not a real one")
        }
        const save = await SavedPlaylist.create({userId, playlistId})
        multi.hIncrBy(`playlist:${playlistId}:daily`, "saveCount", 1)
        multi.hIncrBy(`playlist:${playlistId}:daily`, "score", 3)
        await redisClient.zIncrBy(`playlist:topDaily`, 3, playlistId)
        await multi.exec()
        const increaseSave = await Playlist.updateOne({_id: playlistId}, {$inc: {saveCount: 1}})
        res.status(200).json(save)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const findPlaylist = async(req, res)=> {
    const playlistName = validator.escape(req.query.q)
    try{
        const playlist = await Playlist.find({name: {$regex: playlistName, $options: "i"}, isPublic: true})
        .populate("creatorId")
        res.status(200).json(playlist)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const accountPlaylist = async(req, res)=> {
    const userId = req.query.q
    try{
        if(!userId) {
            throw new Error("userId is required")
        }
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("this id is not a real one")
        }
        const playlist = await Playlist.find({creatorId: userId})
        res.status(200).json(playlist)
    }
    catch(err) {

    }
}

const countDailyStream = async(req, res)=> {
    const multi = redisClient.multi()
    const {playlistId} = req.body
    multi.hIncrBy(`playlist:${playlistId}:daily`, "streamCount", 1)
    multi.hIncrBy(`playlist:${playlistId}:daily`, "score", 1)
    await multi.exec()
    await redisClient.zIncrBy(`playlist:topDaily`, 1, playlistId)
    res.status(200).json("stream recorded")
}

const dailyTopPlaylists = async(req, res)=> {
    const exist =  await redisClient.lRange('playlist:topDaily:result', 0, 9)
    const jsonString = `[${exist.join(',')}]`; // ترکیب رشته‌ها به یک آرایه JSON
    const parsedData = JSON.parse(jsonString);
    if(parsedData.length != 0) {
        res.status(200).json(parsedData)
    }else{
        const topTen = await TopPlaylists.find({})
        .populate({
                path: "playlistId",
                populate: {
                    path: "creatorId"
                }
            })
        for(const item of topTen) {
            await redisClient.lPush("playlist:topDaily:result", JSON.stringify(item))
        }
        res.status(200).json(topTen)
    }
}

module.exports = { createPlaylist, myPlaylists, playlistInfo, addToPlaylist, editPlaylist, deleteFromApp, deleteFromLibrary, deleteFromPlaylst, savePlaylist, findPlaylist, accountPlaylist, countDailyStream, dailyTopPlaylists }