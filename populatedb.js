#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Player = require('./models/player')
var Role = require('./models/role')
var Team = require('./models/team')


var mongoose = require('mongoose');

var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var players = []
var roles = []
var teams = []




function roleCreate(name, brief_description, cb) {
  var role = new Role({ name: name , brief_description: brief_description});
       
  role.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New role: ' + role);
    roles.push(role)
    cb(null, role);
  }   );
}

function teamCreate(name, acronym_name, brief_description, year_created, ranking_hltv, cb) {
  teamdetail = { 
    name: name,
  }
  if (acronym_name != false) teamdetail.acronym_name = acronym_name;
  if (brief_description != false) teamdetail.brief_description = brief_description;
  if (year_created != false) teamdetail.year_created = year_created;
  if (ranking_hltv != false) teamdetail.ranking_hltv = ranking_hltv;
    
  var team = new Team(teamdetail);    
  team.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New team: ' + team);
    teams.push(team)
    cb(null, team)
  }  );
}

function playerCreate(full_name, nickname, d_birth, rating_hltv, nationality, role, team, cb) {
  playerdetail = {full_name:full_name , 
  nickname: nickname,
  nationality: nationality}
  if (d_birth != false) playerdetail.date_of_birth = d_birth;
  if (rating_hltv != false) playerdetail.rating_hltv = rating_hltv;
  if (role != false) playerdetail.role = role;
  if(team != false) playerdetail.team = team;

  
  var player = new Player(playerdetail);
       
  player.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New player: ' + player);
    players.push(player)
    cb(null, player)
  }  );
}

function createTeamsRoles(cb) {
    async.series([
        function(callback) {
          var descriptionTeam = 'FaZe Clan is an American professional esports and entertainment organization founded in May 2010. They are the first international team to win a Global Offensive Major, doing so at PGL Major Antwerp 2022. ';
          teamCreate('FaZe Clan', 'FaZe', descriptionTeam, '2010-05-30', 1, callback);
        },
        function(callback) {
          var descriptionTeam = 'Cloud9 (commonly abbreviated to C9) is an American esports organization founded in 2013. In Counter-Strike: Global Offensive, Cloud9 are well-known for their underdog journey at ELEAGUE Boston 2018, becoming the first (and currently only) North American team to win a Major. '
          teamCreate('Cloud9', 'C9', descriptionTeam, '2013-04-06', 4, callback);
        },
        function(callback) {
          var descriptionRole = 'The entry fragger in CS:GO is the first person into each bombsite or objective when attacking. Their role is to initiate a push onto a site by either getting an entry kill or at least providing enough support for the rest of the team to make a play. The entry fragger will clear spots where enemies usually sit and will call out information on enemy positions.'
          roleCreate('Entry fragger', descriptionRole, callback);
        },
        function(callback) {
          var descriptionRole = 'Support players push with the entry fragger and provide cover by using utility. The support player will trade kills if the entry fragger dies and will cover other lines of site. They also provide support by using utility to aid the push or to assist the entry fragger.'
          roleCreate('Suport', descriptionRole, callback);
        },
        function(callback) {
          var descriptionRole = 'The in-game leader keeps the entire team on the same page and organizes the flow of gameplay. An in-game leader can fill almost any another position such as entry fragger or support. However, the role is still considered a key component of any team.'
          roleCreate("In game leader", descriptionRole, callback);
        },
        function(callback) {
          var descriptionRole = 'This player can effectively use the expensive weapon to hold long angles and secure key picks. Teams will often build their economy around providing this player with an AWP because the weapon is quite pricey.'
          roleCreate("AWPer", descriptionRole, callback);
        },
        function(callback) {
          var descriptionRole =  'Lurkers are players who focus on stealth and outmaneuvering the enemy team. Players who lurk are constantly trying to surprise the enemy and achieve easy kills on isolated players. Lurkers will often sit on the opposite bomb site that their team is executing and eliminate rotating players.'
          roleCreate("Lurk", descriptionRole, callback);
        },
        ],
        // optional callback
        cb);
}


function createPlayers(cb) {
    async.parallel([
        function(callback) {
          playerCreate('Håvard Nygaard', 'rain', '1994-08-27', 1.12, 'Norway',  roles[0], teams[0],callback);
        },
        function(callback) {
          playerCreate('Helvijs Saukants', 'broky', '2001-02-14', 1.13, 'Latvia',  roles[3], teams[0],callback);
        },
        function(callback) {
          playerCreate('Russel Van Dulken', 'Twistzz', '1999-10-14', 1.12, 'Canadian', roles[1], teams[0],callback);
        },
        function(callback) {
          playerCreate('Finn Andersen', 'karrigan', '1990-04-14', 0.95, 'Denmark', roles[2], teams[0],callback);
        },
        function(callback) {
          playerCreate('Robin Kool', 'ropz', '1999-12-22', 1.14, 'Estonia', roles[4], teams[0],callback);
        },
        function(callback) {
          playerCreate('Vladislav Gorshkov', 'nafany', '2001-06-15', 1.01, 'Rusia', roles[2], teams[1],callback);
        },
        function(callback) {
          playerCreate('Dmitriy Sokolov', 'sh1ro', '2001-07-15', 1.27, 'Rusia',  roles[3], teams[1],callback);
        },
        function(callback) {
          playerCreate('Timofey Yakushin', 'interz', '2000-08-04', 1.00, 'Rusia', roles[1], teams[1], callback);
        },
        function(callback) {
          playerCreate('Sergey Rykhtorov', 'Ax1Le', '2002-04-29', 1.26, 'Rusia', roles[0], teams[1],callback);
        },
        function(callback) {
          playerCreate('Abai Hasenov', 'HObbit', '1994-05-18', 1.13, 'Kazakhstan', roles[4], teams[1],callback);
        },       
        ],
        // optional callback
        cb);
}




async.series([
    createTeamsRoles,
    createPlayers
  ],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('players: '+players);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



