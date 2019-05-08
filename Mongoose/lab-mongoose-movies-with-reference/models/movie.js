const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title : {type:String},
  genre : {type:String},
  stars : {type:Array},
  description : {type:String}
})

const MovieModel = mongoose.model("movie", movieSchema);
module.exports = MovieModel;