const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '').replace(/-/g, '') + file.originalname)
    }
  })

var data = multer({ storage: storage })


module.exports = data;