const cron = require("node-cron")
const {Track} = require("./models/productModel")
const {redisClient} = require("./redisClient")
const MonthlyListener = require("./models/monthlyListeners")
const TopPlaylists = require("./models/topPlaylists")

const cacheusers = async()=> {
    const pipeline = redisClient.pipeline()
    const users = await Account.find({followersCount: {$gte: 100}})

    for(const user of users) {
        const userKey = `user:${users._id}`
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profile: user.profile,
            isArtist: user.isArtist,
            followersCount: user.followersCount,
            followingsCount: user.followingsCount, 
        }

        pipeline.set(userKey, 3600, JSON.stringify(userData))
    }

    await pipeline.exec()
}

function startSchedule() {
    //runs every 30 minutes
    cron.schedule('*/30 * * * *', async()=> {
        try{
           const trackIds = await redisClient.keys('track:*:streams')
           for(const key of trackIds){
            const trackId = key.split(':')[1]
            const count = await redisClient.get(key)

            await Track.updateOne({_id: trackId}, {$inc: {streamCount: parseInt(count)}})
            await redisClient.del(key)
           }
        }catch (error) {
            console.log(error)
        }
    })

    //run every 6 hours
    cron.schedule('0 */6 * * *', async()=> {
        await cacheusers()
    })

    //اول هر ماه ساعت 2 
    cron.schedule('0 2 1 * *', async() => {
        const keys = await redisClient.keys("artistListener:*")
        const now = new Date()
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        const month = now.getMonth() === 0 ? 12 : now.getMonth()

        // تبدیل به فرمت YYYY-MM
        const formatted = `${year}-${month.toString().padStart(2, '0')}`

        for(const key of keys) {
            const countListeners = await redisClient.pfCount(key)
            const artistId = key.split(":")[1]
            const registerToDB = await MonthlyListener.create({artistId, listenersCount: countListeners, date: formatted})
            await redisClient.del(key)
            await redisClient.set(`monthlyListeners:${artistId}`, countListeners, 'EX', 60 * 60 * 24 * 30)
        }
        
    });

    cron.schedule('0 2 * * *', async()=> {
        const topTen = await redisClient.zRange('playlist:topDaily', 0, 9)
        await TopPlaylists.deleteMany({})

        for(const id of topTen) {
            const playlist = await redisClient.hGetAll(`playlist:${id}:daily`)
            const saveCount = parseInt(playlist.saveCount)
            const streamCount = parseInt(playlist.streamCount) || 0
            const playlistId = id
            const score = parseInt(playlist.score)
            const playlistinfo = await TopPlaylists.create({playlistId, score, saveCount, streamCount})
            const fullInfo = await playlistinfo.populate("playlistId")
            await redisClient.lPush("playlist:topDaily:result", JSON.stringify(fullInfo))
            await redisClient.del(`playlist:${id}:daily`)
        }

        await redisClient.del('playlist:topDaily')
        
    })
}

module.exports = startSchedule