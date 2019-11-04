var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BoardSchema = new Schema(
	{
	coordinates: {type: String, required: true},
	value: {type: Number, required: true},
	}
);

module.exports = mongoose.model('Board', BoardSchema);

