const {Schema} = require("redis-om")

const userSchema = new Schema("user", {
  username: {type: "string"},
  email: {type: "string"},
  _id: {type: 'string'},
  profile: {type: 'string'},
  followingsCount: {type: 'number'},
  followersCount: {type: 'number'},
  isArtist: {type: 'boolean'},
})

module.exports = userSchema
