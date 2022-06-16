var express = require('express');
var router = express.Router();
var player_controller = require('../controllers/playerController')
var role_controller = require('../controllers/roleController')
var team_controller = require('../controllers/teamController');
const multer =require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
    if(file.fieldname === 'image_player'){
        const path = `./public/images/players/`;
        cb(null, path);
    }
    else if(file.fieldname=== 'logo_team'){
        const path = `./public/images/teams/`;
        cb(null, path);
    }
    },
    filename(req, file, cb) {
      cb(null, Date.now() + "-" +file.originalname);
    },
  });
  
function checkImgErrors(req, file, cb) {
    if (!file.mimetype.match(/^image/)) {
      cb(new Error("Only images allowed."));
    }
    cb(null, true);
  }
  
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter(req, file, callback) {
      checkImgErrors(req, file, callback);
    },
  });




/* GET home page. */
router.get('/', player_controller.index);

//routes for player

router.get('/player/create', player_controller.player_create_get);

router.post('/player/create',upload.single('image_player'), player_controller.player_create_post);

router.get('/player/:id/delete', player_controller.player_delete_get);

router.post('/player/:id/delete', player_controller.player_delete_post);

router.get('/player/:id/update', player_controller.player_update_get);

router.post('/player/:id/update', upload.single('image_player'), player_controller.player_update_post);

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

router.post('/team/create',upload.single('logo_team'), team_controller.team_create_post);

router.get('/team/:id/delete', team_controller.team_delete_get);

router.post('/team/:id/delete', team_controller.team_delete_post);

router.get('/team/:id/update', team_controller.team_update_get);

router.post('/team/:id/update', upload.single('logo_team'), team_controller.team_update_post);

router.get('/team/:id', team_controller.team_detail);

router.get('/teams', team_controller.team_list);


module.exports = router;
