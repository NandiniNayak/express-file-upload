const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  // array of objects which is of mixed datatype
  // https://mongoosejs.com/docs/schematypes.html#arrays
  title: String,
  caption: String,
  files: [Schema.Types.Mixed]
});

mongoose.model("blogs", BlogSchema);

// Note:
// Now Mongoose supports subdocuments, which are the documented way to nest arrays,
//
// var arraySchema = new Schema({
//     property: String
// });
//
// var objectSchema = new Schema({
//     arrays: [arraySchema]
// });
