const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const multer = require('multer');




dotenv.config();

app.use(express.json());


const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database up and running:::'))
  .catch(err => console.log(`Database no gree start, this na why: ${err.message}`));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/v1/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded successfully');
});


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/categories', categoryRoute);



app.listen(port, () => console.log(`Server listenig on::: ${port}`));