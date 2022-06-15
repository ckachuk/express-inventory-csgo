var Player = require('../models/player');
var Role = require('../models/role');
var Team = require('../models/team');
const { body,validationResult } = require('express-validator');

var async = require('async');

exports.index = function(req, res, next){
    async.parallel({
        players: function(callback){
            Player.find({})
            .populate('team')
            .populate('role')
            .exec(callback);
        },
        teams: function(callback){
            Team.find({})
            .exec(callback);
        },
        roles: function(callback){
            Role.find({})
            .exec(callback);
        }
    }, function(err, results){
        if(err){ return next(err)}
        res.render('index', {title: 'Inventory csgo', player_list: results.players, team_list: results.teams, role_list: results.roles});
    })
}

exports.player_list = function(req, res, next){
    Player.find({})
    .populate('role')
    .populate('team')
    .exec(function(err, results){
        if(err) {return next(err)}
        res.render('playerView/player_list', {title: 'Player list', player_list: results})
    })
}


exports.player_detail = function(req, res, next){
    Player.findById(req.params.id)
    .populate('role')
    .populate('team')
    .exec(function(err, results){
        if(err) {return next(err)}
        res.render('playerView/player_detail', {title: 'Player detail', player: results})
    })
}



exports.player_create_get = function(req, res, next){
    async.parallel({
        teams: function(callback){
            Team.find({})
            .exec(callback)
        },
        roles: function(callback){
            Role.find({})
            .exec(callback)
        }
    }, function(err, results){
        if(err){return next(err);}
        res.render('playerView/player_form', {title: 'Create new player', teams: results.teams, roles: results.roles});
    })
}


exports.player_create_post = [
    body('full_name', 'Fullname must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('nickname', 'Nick name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('nationality', 'Nationality must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('team', 'Team must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('role', 'Role must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next)=>{
        var errors = validationResult(req)

        var player = new Player({
            full_name: req.body.full_name,
            nickname: req.body.nickname,
            team: req.body.team,
            role: req.body.role,
            nationality: req.body.nationality,
            date_of_birth: req.body.date_of_birth,
            rating_hltv: req.body.rating_hltv
        })
        
        if(!errors.isEmpty()){
            async.parallel({
                teams: function(callback){
                    Team.find({})
                    .exec(callback)
                },
                roles: function(callback){
                    Role.find({})
                    .exec(callback)
                }
            }, function(err, results){
                if(err){return next(err);}
                res.render('playerView/player_form', {title: 'Create new player', teams: results.teams, roles: results.roles, player: player, errors: errors.array()});
            })
            return;
        }
        else{
            player.save(function(err){
                if(err){ return next (err);}
                res.redirect(player.url)
            })
        }
    }
]


exports.player_delete_get = function(req, res, next){
    Player.findById(req.params.id)
    .exec(function(err, player){
        if(err) {return next(err);}
        res.render('playerView/player_delete', {title: 'Delete player', player: player})
    })
}


exports.player_delete_post = function(req, res, next){
    Player.findByIdAndRemove(req.body.playerid, function(err){
        if(err){return next(err)}
        res.redirect('/players')
    })
}


exports.player_update_get = function(req, res, next){
    async.parallel({
        player: function(callback){
            Player.findById(req.params.id)
            .exec(callback)
        },
        team_list: function(callback){
            Team.find({'player': req.params.id})
            .exec(callback)
        },
        role_list: function(callback){
            Role.find({'player': req.params.id})
            .exec(callback)
        }
    }, function(err, results){
        if(err){ return next(err);}
        res.render('playerView/player_form', {title: 'Update player', player: results.player, teams: results.team_list, roles: results.role_list})
    })
}

exports.player_update_post = [
    body('full_name', 'Fullname must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('nickname', 'Nick name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('nationality', 'Nationality must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('team', 'Team must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('role', 'Role must not be empty.').trim().isLength({ min: 1 }).escape(),
    (req, res, next)=>{
        var errors = validationResult(req)

        var player = new Player({
            full_name: req.body.full_name,
            nickname: req.body.nickname,
            team: req.body.team,
            role: req.body.role,
            nationality: req.body.nationality,
            date_of_birth: req.body.date_of_birth,
            rating_hltv: req.body.rating_hltv,
            _id: req.params.id
        })
        
        if(!errors.isEmpty()){
            async.parallel({
                teams: function(callback){
                    Team.find({})
                    .exec(callback)
                },
                roles: function(callback){
                    Role.find({})
                    .exec(callback)
                }
            }, function(err, results){
                if(err){return next(err);}
                res.render('playerView/player_form', {title: 'Create new player', teams: results.teams, roles: results.roles, player: player, errors: errors.array()});
            })
            return;
        }
        else{
            Player.findByIdAndUpdate(req.params.id, player, {} ,function(err, theplayer){
                if(err){ return next (err);}
                res.redirect(theplayer.url)
            })
        }
    }
]