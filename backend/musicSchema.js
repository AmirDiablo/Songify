const {Schema, Embeded} = require("redis-om")


const musicSchema = new Schema("music", {
  _id: {type: "string"},
  title: {type: "string"},
  cover: {type: "string"},
  artistId: {type: 'string', path: '$.music.artistId'},
  artistName: {type: 'string', path: '$.music.username'},
  fileName: {type: 'string'},
  type: {type: 'string'},
  albumName: {type: 'string'},
  streamCount: {type: 'number'},
  genre: {type: "string"},
  releaseDate: {type: "date"}
})

module.exports = musicSchema
