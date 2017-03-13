var debug = require('debug')('sockettest:server');
var http = require('http');
var port = '3000';
var app = require('./app');
var Twitter = require('twitter');
var config = require('./_config');
var env = require('dotenv').config();
// var port = process.env.PORT || 8000;

var server = app.listen(port, () => {
  console.log('The server is listening on port', port);
});

var io = require('socket.io').listen(server);

var client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

var hashtags = '#puppy, #puppies, #kitten, #kittens';

client.stream('statuses/filter', {
  track: hashtags
}, function(stream) {
  stream.on('data', function(tweet) {
    io.emit('newTweet', tweet);
  });
  stream.on('error', function(error) {
    throw error;
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});
