const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/userAuth")
const { post, find, someSongs, someAlbums, postAlbum, albums, singles, songsOfAlbum, findSingle } = require("../controllers/productController")

router.post("/post", requireAuth, post)
router.get("/find", find)
router.get("/someSongs", someSongs)
router.get("/someAlbums", someAlbums)
router.post("/postAlbum", requireAuth, postAlbum)
router.get('/albums', albums)
router.get("/singles", singles)
router.get("/songsOfAlbum", songsOfAlbum)
router.get("/findSingle", findSingle)

module.exports = router