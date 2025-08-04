const mongoose = require("mongoose")

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        default: "default.jpg"
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    tracks: [ {type: mongoose.Types.ObjectId, ref: "Track"} ],
    isPublic: {
        type: Boolean,
        required: true,
    },
    saveCount: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const savedPlaylistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
        required: true
    },
    playlistId: {
        type: mongoose.Types.ObjectId,
        ref: "Playlist",
        required: true
    }
}, {timestamps: true})

const Playlist = mongoose.model("Playlist", playlistSchema)
const SavedPlaylist = mongoose.model("SavedPlaylist", savedPlaylistSchema)

module.exports = {Playlist, SavedPlaylist}