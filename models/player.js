var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema(
	{
	turn: {type: Number, required: true},
	}
);

module.exports = mongoose.model('Player', PlayerSchema);

