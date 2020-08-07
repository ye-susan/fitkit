const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//config so we can use our .env file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//setting up mongoose:
//uri is where our database is stored, and where we make the connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(express.json()); //express includes body parser so we dont need to install package for it


//connect server to these routes that we made to the two database schemas
//anytime user goes to '/exercise' or '/users' in the client, server will route them to execiseRouter or usersRouter
const exerciseRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');

app.use('/exercises', exerciseRouter);
app.use('/users', usersRouter);

//starts the server, assigning it a port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})