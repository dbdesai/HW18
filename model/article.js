var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: {
		type: String, 
		required: true
	},
	content: {
		type: String, 
		required: true
	},
	note: {
		type: Schema.Type.ObjectId,
	}
});

var article = mongoose.model('article', articleSchema);
module.exports = article;


