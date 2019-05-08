const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const celebritySchema = new Schema({
  name : {type:String},  
  occupation : {type:String},
  movies : [{ type : mongoose.Schema.Types.ObjectId, ref: 'movie' }]
})

const CelebrityModel = mongoose.model("celebrity", celebritySchema);

module.exports = CelebrityModel;