var Role = require('../models/role');
var Player = require('../models/player');
const { body,validationResult } = require('express-validator');
var async = require('async')

exports.role_list = function(req, res, next){
    Role.find({})
    .exec(function(err, results){
        if(err) {return next(err)}
        res.render('roleView/role_list', {title: 'Role list', role_list: results})
    })
}


exports.role_detail = function(req, res, next){
    Role.findById(req.params.id)
    .exec(function(err,results){
        if(err){return next(err)}
        res.render('roleView/role_detail', {title: 'Role detail', role: results})
    })

}



exports.role_create_get = function(req, res, next){
    res.render('roleView/role_form', {title:'Create new role'});
}


exports.role_create_post = [
    body('name', 'Name must not be less than 3 characters').trim().isLength({min: 3}).escape(),
    body('brief_description', 'Description must not be less empty').trim().isLength({min:1}).escape(),
    body('brief_description', 'Description must be less than 500 characters').trim().isLength({max:500}).escape(),
    
    (req, res, next) =>{
        var errors = validationResult(req);

        var role = new Role({
            name: req.body.name,
            brief_description: req.body.brief_description
        })
        
        if(!errors.isEmpty()){
            res.render('roleView/role_form', {title:'Create new role', errors: errors.array(), role: role})
        }
        else{
            role.save(function(err){
                if(err) {return next(err)}
                res.redirect(role.url)
            })
        }
    }
]

exports.role_delete_get = function(req, res, next){
    async.parallel({
        role: function(callback){
            Role.findById(req.params.id).
            exec(callback)
        },
        players: function(callback){
            Player.find({'role':req.params.id})
            .exec(callback)
        }
    },
    function(err, results){
        if(err){return next(err)}
        res.render('roleView/role_delete', {title:'Delete role', role: results.role, player_list: results.players})
    })
}


exports.role_delete_post = function(req, res, next){
    Role.findByIdAndRemove(req.body.roleid)
    .exec(function(err){
        if(err) {return next(err);}
        res.redirect('/roles')
    })
}


exports.role_update_get = function(req, res, next){
    Role.findById(req.params.id)
    .exec(function(err, role){
        if(err) {return next(err);}
        res.render('roleView/role_form', {title: 'Update role', role: role})
    })
}

exports.role_update_post = [
    body('name', 'Name must not be less than 3 characters').trim().isLength({min: 3}).escape(),
    body('brief_description', 'Description must not be less empty').trim().isLength({min:1}).escape(),
    body('brief_description', 'Description must be less than 500 characters').trim().isLength({max:500}).escape(),
    
    (req, res, next) =>{
        var errors = validationResult(req);

        var role = new Role({
            name: req.body.name,
            brief_description: req.body.brief_description,
            _id: req.params.id
        })
        
        if(!errors.isEmpty()){
            res.render('roleView/role_form', {title:'Create new role', errors: errors.array(), role: role})
        }
        else{
            Role.findByIdAndUpdate(req.params.id, role, {} ,function(err, therole){
                if(err) {return next(err)}
                res.redirect(therole.url)
            })
        }
    }
]
