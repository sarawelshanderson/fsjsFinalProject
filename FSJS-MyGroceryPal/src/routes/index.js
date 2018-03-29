// src/routes/index.js


// set up shorthand
const router = require('express').Router();
const mongoose = require('mongoose');


router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});


//Get a list of all files in the DB at mLab
router.get('/file', function(req, res, next) {
  const fileModel = mongoose.model('File');

  fileModel.find({deleted: {$ne: true}}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  
    res.json(files);
  });
});


//  Get file by id, pass id as a param of URL
router.get('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;

  const file = FILES.find(entry => entry.id === fileId);
  // create an error if file cannot be found by id
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});


// POST create a new file
router.post('/file', function(req, res, next) {
  const File = mongoose.model('File');
  const fileData = {
    title: req.body.title,
    description: req.body.description,
    inBasket: req.body.inBasket,
  };
  // create an error if file cannot be created
  File.create(fileData, function(err, newFile) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newFile);
  });
});


// PUT update an existing file
router.put('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
   const fileId = req.params.fileId;

  File.findById(fileId, function(err, file) {
    // handle the errors if file cannot be found by id or there is no file by that id
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }
    
    file.title = req.body.title;
    file.description = req.body.description;
    file.inBasket = req.body.inBasket;

    // handle errors if file cannot be updated
    file.save(function(err, savedFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedFile);
    })

  })

});


// DELETE delete a file from the list displayed
router.delete('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
  const fileId = req.params.fileId;

  // handle the errors if file cannot be found by id or there is no file by that id
  File.findById(fileId, function(err, file) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    // file is not really deleted in mLab
    file.deleted = true;

    file.save(function(err, deletedFile) {
      res.json(deletedFile);
    })

  })
});

// make it publicly available to anything outside the file const router = require('express').Router();
module.exports = router;

