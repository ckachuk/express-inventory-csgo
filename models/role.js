var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RoleSchema = new Schema({
    name: {type:String, required:true, maxlength: 100, minlength: 3},
    brief_description: {type:String, required:true, maxlength: 500}
})

RoleSchema
.virtual('url')
.get(function(){
    return '/role/' + this._id
})

module.exports = mongoose.model('Role', RoleSchema);