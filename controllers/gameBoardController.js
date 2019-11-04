var Player = require('../models/player');
var Board = require('../models/board');

var async = require('async');



exports.render_board = function(req, res, next) {

	async.parallel({
		player_turn: function(callback) {
			Player.findOne({}, callback);
		},
		data: function(callback) {
			var query = Board.find({})
			query.sort({coordinates: 1});
			query.exec(callback);
		}
	}, function(err, results) {
		var cell_list = create_cell_list(results.data);		
		var player_info;
		if (results.player_turn.turn == 1) {
			player_info = "Player 1 (X) turn";
		} else if (results.player_turn.turn == 2) {
			player_info = "Player 2 (O) turn"
		}
		res.render('index', {turn: player_info, cells: cell_list});
	});



};



exports.reset_board = function(req, res, next) {

var query = {};
var valueUpdate = {$set: {value: 0}};

Board.updateMany(query
, valueUpdate
, function (err, result) {

    if (err) {

        console.log("update document error");

    } else {

	console.log("Game board has been reset.");
    }

});

res.redirect('/');
};






function create_cell_list(db_list) {
		
	var cell_list = [];
	var n = db_list.length;
	var i;
	for (i = 0; i < n; i++) {
		if (db_list[i].value == 0) {
			cell_list.push("");
		} else if (db_list[i].value == 1) {
			cell_list.push("X");
		} else if (db_list[i].value == -1){
			cell_list.push("O");
		}
	}



return cell_list;

}






