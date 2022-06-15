var mongoose = require('mongoose');
const { DateTime } = require("luxon");
var Schema = mongoose.Schema;


var TeamSchema = new Schema({
    name: {type:String, required:true, maxlength:100},
    acronym_name: {type:String, maxlength:6},
    brief_description: {type:String, maxlength: 300},
    year_created: {type:Date},
    ranking_hltv: {type: Number}
})



TeamSchema
.virtual('url')
.get(function(){
    return '/team/' + this._id
})


TeamSchema
.virtual('year_created_formatted')
.get(function(){
    return DateTime.fromJSDate(this.year_created).toLocaleString(DateTime.DATE_MED);
})

TeamSchema
.virtual('year_created_yyyy_mm_dd')
.get(function () {
  return DateTime.fromJSDate(this.year_created).toISODate(); //format 'YYYY-MM-DD'
});


module.exports = mongoose.model('Team', TeamSchema);