const mongoose = require("mongoose")

const topPlaylistSchema = new mongoose.Schema({
    playlistId: {
        type: mongoose.Types.ObjectId, ref: "Playlist",
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: true
    },
    streamCount: {
        type: Number,
        default: 0
    },
    saveCount: {
        type: Number,
        default: 0
    }
})

const TopPlaylists = mongoose.model("TopPlaylists", topPlaylistSchema)

module.exports = TopPlaylists