const express = require('express');
const router = express.Router();
const uploadProfile = require("../uploadProfile")
const requireAuth = require("../middlewares/userAuth")
const { signup, userInfo, liveSearch, follow, followings, userLogin, editProfile, continueWithGoogle, changePass, setPass, registerListener, getMonthlyListeners, ListenerStatics, mostfamous } = require("../controllers/accountController")

router.post("/signup", signup)
router.get("/userInfo",  userInfo)
router.get('/liveSearch', liveSearch)
router.put("/follow", requireAuth, follow)
router.get('/followings', followings)
router.post("/login", userLogin)
router.patch("/editProfile", uploadProfile.fields([{name: "name", maxCount: 1}, requireAuth, {name: "profile", maxCount: 1}, {name: "id", maxCount: 1}]), editProfile)
router.post("/googleSign", continueWithGoogle)
router.patch("/changePass", changePass)
router.patch("/setPass", setPass)
router.post("/registerListener", registerListener)
router.get("/monthlyListeners/:artistId", getMonthlyListeners)
router.get('/listenerStatics/:artistId', ListenerStatics)
router.get("/mostfamous", mostfamous)

module.exports = router