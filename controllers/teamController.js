var Team = require('../models/team');
var Player = require('../models/player');
var async = require('async');
const { body,validationResult } = require('express-validator');
const multer  = require('multer')
const fs = require('fs')


const storage = multer.diskStorage({
    destination(req, file, cb) {
      const path = `./public/images/teams/`;
      cb(null, path);
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


exports.team_list = function(req, res, next){
    Team.find({})
    .exec(function(err, results){
        if(err) {return next(err)}
        res.render('teamView/team_list', {title: 'Team list', team_list: results})
    })
}


exports.team_detail = function(req, res, next){
    async.parallel({
        team: function(callback){
            Team.findById(req.params.id)
            .exec(callback)
        },
        players: function(callback){
            Player.find({'team': req.params.id})
            .populate('role')
            .exec(callback)
        }
    }, function(err, results){
        if(err) {return next(err)}
        res.render('teamView/team_detail', {title: 'Team details', team: results.team, player_list: results.players})
    })
}



exports.team_create_get = function(req, res, next){
    res.render('teamView/team_form', {title: 'Create a new team'})
}


exports.team_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next)=>{
        var errors = validationResult(req)

        const receivedPath = req.file.path;
        const cleanedPath = receivedPath.slice(6);

        var team = new Team({
            name: req.body.name,
            acronym_name: req.body.acronym_name,
            brief_description: req.body.brief_description,
            year_created: req.body.year_created,
            ranking_hltv: req.body.ranking_hltv,
            logo_team: cleanedPath
        })

        if(!errors.isEmpty){
            res.render('teamView/team_form', {title: 'Create a new team', team: team, errors: errors.array()})
        }
        else{
            team.save(function(err){
                if(err){ return next(err);}
                res.redirect(team.url)
            })
        }
        
    }
   
]

exports.team_delete_get = function(req, res, next){
    async.parallel({
        team: function(callback){
            Team.findById(req.params.id)
            .exec(callback)
        },
        players: function(callback){
            Player.find({'team': req.params.id})
            .exec(callback)
        }
    },function(err, results){
        if(err) {return next(err)}
        res.render('teamView/team_delete', {title: 'Team delete', team: results.team, player_list: results.players})
    })
}


exports.team_delete_post = function(req, res, next){
    Team.findByIdAndRemove(req.body.teamid, function(err){
        if(err){ return next(err)}
        res.redirect('/teams')
    })
}


exports.team_update_get = function(req, res, next){
    Team.findById(req.params.id)
    .exec(function(err, team){
        if(err) {return next(err);}
        res.render('teamView/team_form', {title: 'Update team', team: team})
    })
}

exports.team_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    
    (req, res, next)=>{
        var errors = validationResult(req)
        const receivedPath = req.file.path;
        const cleanedPath = receivedPath.slice(6);

        var team = new Team({
            name: req.body.name,
            acronym_name: req.body.acronym_name,
            brief_description: req.body.brief_description,
            year_created: req.body.year_created,
            ranking_hltv: req.body.ranking_hltv,
            logo_team: cleanedPath,
            _id: req.params.id, 
        })
        
        if(!errors.isEmpty){
            res.render('teamView/team_form', {title: 'Create a new team', team: team, errors: errors.array()})
        }
        else{
            Team.findById(req.params.id, function(err, team_logo){
                if(err){return next(err)}
                if(undefined!= team_logo.logo_team){
                    path = './public/'+ team_logo.logo_team
                    fs.unlink(path, (err) => {
                        if (err) {
                            console.error(err)
                        }            
                        //file removed
                    })
                } 
            })

            Team.findByIdAndUpdate(req.params.id, team, {},function(err, theteam){
                if(err){ return next(err);}

                res.redirect(theteam.url);
            })
        }
        
    }
   
]
