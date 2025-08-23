const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/userAuth")
const {createPlaylist, myPlaylists, playlistInfo, addToPlaylist, editPlaylist, deleteFromApp, deleteFromLibrary, deleteFromPlaylst, savePlaylist, findPlaylist, accountPlaylist, countDailyStream, dailyTopPlaylists} = require("../controllers/playlistController")
const upload = require("../upload")

router.post("/create", requireAuth, createPlaylist)
router.get("/myPlaylists", requireAuth, myPlaylists)
router.get("/playlistInfo", playlistInfo)
router.patch("/addToPlaylist", requireAuth, addToPlaylist)
router.patch("/editPlaylist", upload.single("file"), editPlaylist)
router.delete("/delete", requireAuth, deleteFromApp)
router.delete("/deleteFromLibrary", requireAuth, deleteFromLibrary)
router.patch("/deleteFromPlaylst", requireAuth, deleteFromPlaylst)
router.post("/savePlaylist", requireAuth, savePlaylist)
router.get("/findPlaylist", findPlaylist)
router.get("/accountPlaylist", requireAuth, accountPlaylist)
router.post("/countDailyStream", countDailyStream)
router.get("/dailyTopPlaylists", dailyTopPlaylists)

module.exports = router