const cron = require("node-cron")
const {Track} = require("./models/productModel")
const {redisClient} = require("./redis")

//runs everyday at 11:17 AM
function startSchedule() {
    cron.schedule('0 17 11 * * *', async()=> {    //everyday at 12 AM
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

    console.log("Post scheduler started, running  every minute")
}

module.exports = startSchedule