const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routers/user.router');

const port = process.env.PORT || 8080;
const mongoURI = process.env.MONGOURI || require('./secrets').MONGOURI;

server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(mongoURI);

server.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname + '/public/html'});
});

server.use(userRouter);

server.listen(port, function(){
    console.log('Now listening on port...', port);
});