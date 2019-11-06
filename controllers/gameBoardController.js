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



exports.click_board = function(req, res, next) {

var xy = req.body.location;

if (xy == "reset") {
	reset_board();
} else {

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
		let temp, next_turn;
		if (results.player_turn.turn== 1 ) {
			temp = 1;
			next_turn = 2;
		} else if (results.player_turn.turn == 2) {
			temp = -1;
			next_turn = 1;
		}

		let winner = update_and_check_for_winner(results.data, xy, temp);

		if (winner == 0) {
			Player.findOneAndUpdate({}, {$set:{turn: next_turn}}, {new: true}, (err, doc) => {
			if(err){
				console.log("Something went wrong when updating turn.");
			}
		});
		Board.findOneAndUpdate({coordinates: xy}, {$set:{value: temp}}, {new: true}, (err, doc) => {
			if(err){
				console.log("Something went wrong when updating the board");
			}
		});
		} else {
			reset_board();
		}
	});

}

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



function update_and_check_for_winner(db_list, xy, new_val){

let score =[
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 0, 0]
];

let = winner = 0;
let i, j, k;
let n = db_list.length;
for (i = 0; i < n; i++) {
	if (db_list[i].coordinates == xy) {
		db_list[i].value = new_val;
	}
}

k = 0;

for (i = 0; i < 5; i++) {
	for (j = 0; j < 5; j++) {
		score[i][j] = db_list[k].value;
		k = k + 1;
	}
}

let a = xy.split(".");
let x = a[0];
let y = a[1];


let row, column, diagonal1, diagonal2 = 0;

diagonal1 = check_diagonal_1(score);
diagonal2 = check_diagonal_2(score);
row = check_row(score, x);
column = check_column(score, y);


// 5 X in a row, column or diagonal. Player 1 wins.
if (row == 5 || column == 5 || diagonal1 == 5 || diagonal2 == 5) {
	winner = 1;
// 5 O in a row, column or diagonal. Player 2 wins.
} else if (row == -5 || column == -5 || diagonal1 == -5 || diagonal2 == -5) {
	winner = 2;
}

let round = count_rounds(score);

if (round == 25 && winner == 0){
	winner = 3;
}

return winner;

}



function check_row(score, x) {
	let row = 0;
	let i;
	for (i = 0; i< 5; i++) {
		row = row + score[x][i];
	}
	return row;
}


function check_column(score, y) {
	let column = 0;
	let i;
	for (i = 0; i < 5; i++) {
		column = column + score[i][y];
	}
	return column;
}



function check_diagonal_1(score) {
	let diagonal1  = 0;
	let i;
	for (i = 0; i < 5; i++) {
		diagonal1 = diagonal1 + score[i][i];
	}
	return diagonal1;
}


function check_diagonal_2(score) {
	let diagonal2 = 0;
	let i;
	let j = 4;
	for (i = 0; i < 5; i++) {
		diagonal2 = diagonal2 + score[i][j];
		j = j - 1;
	}
	return diagonal2;
}


function count_rounds(score) {

let round = 0;
let i, j;

for (i = 0; i < 5; i++) {
	for (j = 0; j < 5; j++){
		if (score[i][j] != 0) {
			round = round + 1;
		}
	}
}

return round;
}




function reset_board() {


Player.findOneAndUpdate({}, {$set:{turn: 1}}, {new: true}, (err, doc) => {
	if (err) {
		console.log("Something went wrong when resetting players turn.");
	}
});

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

}
