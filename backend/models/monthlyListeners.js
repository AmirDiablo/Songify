const mongoose = require("mongoose")

const monthlyListenerSchema = new mongoose.Schema({
    artistId: {
        type: mongoose.Types.ObjectId, ref: "account",
        required: true
    },
    listenersCount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const MonthlyListener = mongoose.model("MonthlyListener", monthlyListenerSchema)

module.exports = MonthlyListener