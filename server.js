// Set up Server
// Express
var express = require('express');
var app = express();
// Body-Parser
var bodyParser = require('body-parser');
// Morgan
var logger = require('morgan');
// Mongoose
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

// Morgan Code
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));


// Database Connection
mongoose.connect('mongodb://localhost/scraping');
var db = mongoose.connection;

db.on('error', function (err) {
console.log('Mongoose Error: ', err);
});
db.once('open', function () {
console.log('Mongoose connection successful.');
});


// Schemas
var Note = require('./model/Note.js');
var Article = require('./model/Article.js');


//Routes
app.get('/', function(req, res) {
  	res.send(index.html);
});



app.get('/scrape', function(req, res) {
  request('https://cnn.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('article').each(function(i, element) {

    	var result = {};

    	result.title = $(this).text();
		result.link = $(this).attr('href');

		var entry = new Article (result);

		entry.save(function(err, doc) {
		  	if (err) {
			    console.log(err);
			 } else {
			    console.log(doc);
			 }
		});

	});
});


	res.send('Scrape Complete');

});
//takes the information from our note section and populates the note section in Articles data base. I think. 

app.get('/articles', function(req, res){
	article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

app.get('/articles/:id', function(req, res){
	article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if(err){
			console.log(err);
		}else{
			res.json(doc);
		}
	});
});


app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});


app.listen(3003, function() {
  console.log('App running on port 3003!');
});

