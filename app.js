const express = require('express');
const multer = require('multer');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
.then(() => console.log("db connected"))
.catch((err) => console.log(err));

// set storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  // file name with time stamps, to store a unique name with file extension
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).array('myImage', 10); //for single files, use arrays for multiple files

// check file type
const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // check extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type

  const mimetype = fileTypes.test(file.mimetype);

  if(mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only')
  }
}

require('./model/blog');
const Blog = mongoose.model('blogs');
// middle ware start
app.use(express.static('public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// middleware end
app.get('/', (req, res) => {
    // Blog.find()
    // .then(blogs => {
    //   console.log('found blogs')
    //   console.log(blogs)
    // })
    // res.render('home',{
    //   files: blogs
    // });
    res.render('home');
});

app.post('/upload', (req, res) => {

  upload(req, res, (err) => {
    if (err) {
      console.log('error from upload fucntion')
      res.render('home', {
        msg: err
      });
    } else {
      // res.send('test');
      if(req.files == undefined) {
        res.render('home', {
          msg: 'Error: No file selected'
        });
      } else {
        // save to database
        let newBlog = {
          files: req.files
        }
        new Blog(newBlog)
        .save()
        .then (blogs => {
          console.log('posted blogs')
          // console.log(blogs);
          res.redirect('/upload');
        })
      }
    }
  });
});
// fetch all the posts uploaded
app.get('/upload', (req, res) => {
  Blog.find()
   .then(blogs => {
     console.log('found blogs');
     console.log(blogs);
     res.render('home', {
       blogs: blogs
     });
   })
   .catch(err => console.log(err));
});

app.listen(port, () => console.log(`server started on port ${port}`));
