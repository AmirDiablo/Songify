const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, "../frontend/public/profiles")
    },
    filename: (req, file, cb)=> {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb)=> {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jfif" || file.mimetype === "image/jpg"){
        cb(null, true)
    }else{
        cb(new Error("Only png, jpeg, jpg and jfif files are allowed"))
    }
}

const uploadProfile = multer({ storage: storage, fileFilter: fileFilter }) 

module.exports = uploadProfile