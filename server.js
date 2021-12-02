const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');



dotenv.config();

app.use(express.json());


const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database up and running:::'))
  .catch(err => console.log(`Database no gree start, this na why: ${err.message}`));


app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);


app.listen(port, () => console.log(`Server listenig on::: ${port}`));