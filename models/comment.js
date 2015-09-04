var mongoose = require('mongoose');
var markdown = require('markdown');

var commentSchema = new mongoose.Schema({
	name:String,
	day:String,
	tittle:String,
	comment:String
});

var commentModel = mongoose.model('comment', commentSchema);

var comment = function(name , day, tittle, ){

};