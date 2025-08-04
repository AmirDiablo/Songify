const express = require('express');
const router = express.Router();
const uploadProfile = require("../uploadProfile")
const requireAuth = require("../middlewares/userAuth")
const { signup, userInfo, liveSearch, follow, followings, userLogin, editProfile } = require("../controllers/accountController")

router.post("/signup", signup)
router.get("/userInfo", requireAuth, userInfo)
router.get('/liveSearch', liveSearch)
router.put("/follow", requireAuth, follow)
router.get('/followings', followings)
router.post("/login", userLogin)
router.patch("/editProfile", uploadProfile.fields([{name: "name", maxCount: 1}, requireAuth, {name: "profile", maxCount: 1}, {name: "id", maxCount: 1}]), editProfile)

module.exports = router