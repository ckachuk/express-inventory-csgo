var express = require('express');
var router = express.Router();
var player_controller = require('../controllers/playerController')
var role_controller = require('../controllers/roleController')
var team_controller = require('../controllers/teamController');
const player = require('../models/player');

/* GET home page. */
router.get('/', player_controller.index);

//routes for player

router.get('/player/create', player_controller.player_create_get);

router.post('/player/create', player_controller.player_create_post);

router.get('/player/:id/delete', player_controller.player_delete_get);

router.post('/player/:id/delete', player_controller.player_delete_post);

router.get('/player/:id/update', player_controller.player_update_get);

router.post('/player/:id/update', player_controller.player_update_post);

router.get('/player/:id', player_controller.player_detail);

router.get('/players', player_controller.player_list);

//router for role

router.get('/role/create', role_controller.role_create_get);

router.post('/role/create', role_controller.role_create_post);

router.get('/role/:id/delete', role_controller.role_delete_get);

router.post('/role/:id/delete', role_controller.role_delete_post);

router.get('/role/:id/update', role_controller.role_update_get);

router.post('/role/:id/update', role_controller.role_update_post);

router.get('/role/:id', role_controller.role_detail);

router.get('/roles', role_controller.role_list);


//routes for team

router.get('/team/create', team_controller.team_create_get);

router.post('/team/create', team_controller.team_create_post);

router.get('/team/:id/delete', team_controller.team_delete_get);

router.post('/team/:id/delete', team_controller.team_delete_post);

router.get('/team/:id/update', team_controller.team_update_get);

router.post('/team/:id/update', team_controller.team_update_post);

router.get('/team/:id', team_controller.team_detail);

router.get('/teams', team_controller.team_list);


module.exports = router;
