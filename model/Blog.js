const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  filename: String
})

mongoose.model('blogs', BlogSchema);
