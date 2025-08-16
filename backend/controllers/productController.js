const {Track, Album} = require("../models/productModel")
const Account = require('../models/accountModel')
const validator = require("validator")
const mongoose = require("mongoose")
const {redisClient} = require("../redis")


const post = async(req, res)=> {
    const { title, cover, artistName, fileName, type, albumId, genre } = req.body

    try{
        const track = await Track.create({title, cover, artistName, fileName, type, albumId, genre})
        res.status(200).json(track)
    }catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const find = async(req, res)=> {
    const q = validator.escape(req.query.q) || ''

    try{
        const artistId = await Account.findOne({username: {$regex: q, $options: 'i'}})
        const results = await Track.find({$or: [ { title: {$regex: q, $options: 'i'} }, { albumName: {$regex: q, $options: 'i'} }, { genre: {$regex: q, $options: 'i'} }, { artistId: artistId }] })
        .populate("artistId")
        res.status(200).json(results)
    }catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const someSongs = async(req, res) => {
    const q = req.query.q

    try{
        const songs = await Track.find({artistId: q}).limit(10)
        .populate("artistId")
        res.status(200).json(songs)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const someAlbums = async(req, res) => {
    const id = req.query.q
    const albums = await Album.find({artistId: id}).limit(10)
    res.status(200).json(albums)
}

const postAlbum = async(req, res)=> {
    const {title, cover, artistId, genre} = req.body

    const album = await Album.create({title, cover, artistId, genre})
    res.status(200).json(album)
}

const albums = async(req, res)=> {
    const id = validator.escape(req.query.q)
    try{
        if(!id) {
            throw new Error("id is required")
        }
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("this id is not a real one")
        }
        const albums = await Album.find({artistId: id})
        .populate("artistId")
        res.status(200).json(albums)
    }
    catch(err) {

    }
}

const singles = async(req, res)=> {
    const id = validator.escape(req.query.q)
    try{
        if(!id) {
            throw new Error("id is required")
        }
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("this id is not a real one")
        }
        const singles = await Track.find({artistId: id, type: "single"})
        .populate("artistId")
        res.status(200).json(singles)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const songsOfAlbum = async(req, res)=> {
    const albumName = validator.escape(req.query.q)
    const artistId = validator.escape(req.query.n)

    try{
        if(!albumName || !artistId) {
            throw new Error("album name and artist id is required")
        }
        if(!mongoose.Types.ObjectId.isValid(artistId)) {
            throw new Error("this id is not a real one")
        }
        const songs = await Track.find({albumName: albumName, artistId: artistId})
        .populate("artistId")
        res.status(200).json(songs)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const findSingle = async(req, res)=> {
    const id = validator.escape(req.query.q)
    try{
        if(!id) {
            throw new Error("id is required")
        }
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("this id is not a real one")
        }
        const single = await Track.find({_id: id})
        res.status(200).json(single)
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

const streamMusic = async(req, res)=> {
    await redisClient.incr(`track:${req.params.id}:streams`)
    res.status(200).send("stream counted")
}

const randomTrack = async(req, res)=> {
    
    try{
        const randomMusic = await Track.aggregate([
            {'$sample': {size: 3}}
        ])
        .exec() // اجرای aggregation
        .then((musics) =>
            Track.populate(musics, { path: 'artistId' }) // پاپیولیت کردن artistId
        );
        
        res.status(200).json(randomMusic)
    }
    catch(err){
        res.status(500).json(err)
    }
}

module.exports = { post, find, someSongs, someAlbums, postAlbum, albums, singles, songsOfAlbum, findSingle, streamMusic, randomTrack }