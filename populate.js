var Board = require('./models/board')


//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://kerpaldb:88ada812a3@cluster0-h3iz7.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var board = new Board({coordinates: '4.4', value: 0});
	
board.save(function (err) {
  if (err) return handleError(err);
  // saved!
});


