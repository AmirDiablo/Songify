const {Track, Album} = require("../models/productModel")
const Account = require('../models/accountModel')
const validator = require("validator")
const mongoose = require("mongoose")
const {redisClient, musicRepository, userRepository} = require("../redisClient")


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
    const {trackId} = req.body;
    await redisClient.incr(`streams:${trackId}`)
    res.status(200).json("recorded")
}

const getTrends = async (req, res) => {
  try {
    const topTracks = await redisClient.zrevrange('track_ranking', 0, 9, 'WITHSCORES');
    const result = [];

    for (let i = 0; i < topTracks.length; i += 2) {
      result.push({
        trackId: topTracks[i],
        streams: parseInt(topTracks[i + 1])
      });
    }
    console.log(result)
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت لیست محبوب‌ترین ترک‌ها' });
  }
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

const newRelease = async(req, res)=> {
    const exist = await redisClient.zRange('music:newReleases', 0, 19)
    
    if(exist.length != 0) {
        console.log("cache hit")
        /* const multi = redisClient.multi() */
        const promises = exist.map(id => musicRepository.fetch(`music:${id}:newRelease`));
        const results = await Promise.all(promises);
        console.log(results)
        res.status(200).json(results)
    }else{
        console.log("cache miss")
        try{
            const newReleases = await Track.find({}).sort({releaseDate: -1}).limit(20).populate("artistId")  //or based on timestamp
            const multi = redisClient.multi()
            newReleases.forEach(async(song)=> {
                musicRepository.save(`music:${song?._id}:newRelease`, {
                    title: song.title,
                    _id: song?._id.toString(),
                    cover: song.cover,
                    artistId: {_id: song.artistId._id.toString(), username: song.artistId.username},
                    fileName: song.fileName,
                    type: song.type,
                    albumName: song.albumName ? song.albumName : "",
                    streamCount: song.streamCount,
                    genre: song.genre,
                    releaseDate: new Date(song?.releaseDate).valueOf()
                })

                musicRepository.expire(`music:${song?._id}:newRelease`, 3600 * 24)

                multi.zAdd('music:newReleases', {
                    value: song._id.toString(),
                    score: song.releaseDate
                })
            })

            await multi.exec()
            await redisClient.expire('music:newReleases', 3600 * 24)
            res.status(200).json(newReleases)
        }
        catch(error) {
            console.log(error)
            res.status(500).json({error: error.message})
        }
    }
}

module.exports = { post, find, someSongs, someAlbums, postAlbum, albums, singles, songsOfAlbum, findSingle, streamMusic, randomTrack, getTrends, newRelease }