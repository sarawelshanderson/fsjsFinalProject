// Load mongoose package
const mongoose = require('mongoose');

// this sets the stage for how the files are set up
const FileSchema = new mongoose.Schema({
  title: String,
  description: String,
  inBasket: String,
  created_at: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

const File = mongoose.model('File', FileSchema);

// this is where it counts the data files, if nothing then seed the seed file
File.count({}, function(err, count) {
  if (err) {
    throw err;
  }
  
  if (count > 0) return ;

  const files = require('./file.seed.json');
  File.create(files, function(err, newFiles) {
    if (err) {
      throw err;
    }
    console.log("DB seeded")
  });

});

// assign data from database to variable File
module.exports = File;
