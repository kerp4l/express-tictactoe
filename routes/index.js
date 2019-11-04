var express = require('express');
var router = express.Router();

var game_board_controller = require('../controllers/gameBoardController');

router.get('/', game_board_controller.render_board);

router.post('/', game_board_controller.reset_board);


module.exports = router;
