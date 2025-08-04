const mongoose = require('mongoose')

const TrackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: "logo.png"
    },
    artistId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true
    },
    fileName: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    albumName: {
        type: String
    },
    streamCount: {
        type: Number,
        default: 0
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    artistId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Number,
        required: true
    }

}, {timestamps: true})

const Track = mongoose.model("Track", TrackSchema)
const Album = mongoose.model("Album", albumSchema)

module.exports = { Track, Album }