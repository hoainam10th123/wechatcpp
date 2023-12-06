import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'wwwroot/uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')[1]
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + `.${ext}`
    cb(null, fileName)
  }
});

const uploadMulter = multer({ storage });

export default uploadMulter;
