var mongoose = require('mongoose');
const { DateTime } = require("luxon");
var Schema = mongoose.Schema;

var PlayerShema = new Schema({
    full_name: {type:String, required:true, maxlength: 100, minlength: 3},
    nickname:{type:String, required:true, maxlength: 100},
    date_of_birth: {type: Date},
    rating_hltv: {type: Number},
    nationality: {type: String, required:true, maxlength: 100},
    role: {type: Schema.Types.ObjectId, ref:'Role', required:true},
    team: {type: Schema.Types.ObjectId, ref:'Team', required:true}
})



PlayerShema
.virtual('url')
.get(function(){
    return '/player/' + this._id
})

PlayerShema
.virtual('date_of_birth_formatted')
.get(function(){
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
})

PlayerShema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate(); //format 'YYYY-MM-DD'
});


module.exports = mongoose.model('Player', PlayerShema);