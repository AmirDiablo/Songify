const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/userAuth")
const { post, find, someSongs, someAlbums, postAlbum, albums, singles, songsOfAlbum, findSingle, streamMusic, randomTrack, getTrends, newRelease } = require("../controllers/productController")

router.post("/post", requireAuth, post)
router.get("/find", find)
router.get("/someSongs", someSongs)
router.get("/someAlbums", someAlbums)
router.post("/postAlbum", requireAuth, postAlbum)
router.get('/albums', albums)
router.get("/singles", singles)
router.get("/songsOfAlbum", songsOfAlbum)
router.get("/findSingle", findSingle)
router.patch("/stream", streamMusic)
router.get("/getTrends", getTrends)
router.get("/random", randomTrack)
router.get('/newRelease', newRelease)

module.exports = router