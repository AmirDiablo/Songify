require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const verificationRoutes = require('./routes/verification')
const accountRoutes = require("./routes/accountRoutes")
const productRoutes = require("./routes/productRoutes")
const playlistRoutes = require("./routes/playlistRoutes")
const app = express()

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// Routes
app.use("/api/account", accountRoutes)
app.use('/api/verification', verificationRoutes);
app.use("/api/product", productRoutes)
app.use("/api/playlist", playlistRoutes)


mongoose.connect(process.env.MONGODB_URI)
.then(()=> {
    app.listen(process.env.PORT, ()=> {
        console.log("connected to DB and server start listen on port", process.env.PORT)
    })
})
.catch((err)=> {
    console.log(err)
})