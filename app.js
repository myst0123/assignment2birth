//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
//load environment variables
var dotenv = require('dotenv');
dotenv.load();

//fbgraph
var graph = require('fbgraph');

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
//more setting up configuration for express
//Allows cookie access and interaction
app.use(express.cookieParser() );
app.use(express.session({ secret: 'nyan cat'}));
app.use(app.router);

//routes
app.get('/', function(req,res) { 
	res.render("index");
});

//fbgraph authentication
app.get('/auth/facebook', function(req, res) {
	if (!req.query.code) {
		var authUrl = graph.getOauthUrl({
			'client_id': process.env.facebook_client_id,
			'redirect_uri': 'http://localhost:3000/auth/facebook',
			'scope': 'user_friends, friends_birthday'//you want to update scope to what you want in your app
		});

		if (!req.query.error) {
			res.redirect(authUrl);
		} else {
			res.send('access denied');
		}
		return;
	}
	graph.authorize({
		'client_id': process.env.facebook_client_id,
		'redirect_uri': 'http://localhost:3000/auth/facebook',
		'client_secret': process.env.facebook_client_secret,
		'code': req.query.code
	}, function( err, facebookRes) {
		res.redirect('/facebook');
	});
});

app.get('/facebook', function(req, res) {
	res.render('facebook');
});

app.get('/facebook/default', function(req, res) {

	graph.get('/me/friends', function(err, response) {
		data = {};
		var data = [];
		var friends_length = response.data.length;
		var month;
		var jan = 0;
		var feb = 0;
		var mar = 0;
		var apr = 0;
		var may = 0;
		var jun = 0;
		var jul = 0;
		var aug = 0;
		var sep = 0;
		var oct = 0;
		var nov = 0;
		var dec = 0;

		function increment(i) {
		graph.get("/" + response.data[i].id, {fields: 'name, id, birthday'}, function(err2, response2) {
		if(i < friends_length-1) {
			var birthday = response2.birthday;
			if(birthday) {
			month = birthday.substr(0, birthday.indexOf('/'));

			if(month == "01"){
				jan = jan + 1;
			}
			else if(month == "02"){
				feb = feb + 1;
			}
			else if(month == "03"){
				mar = mar + 1;
			}
			else if(month == "04"){
				apr = apr + 1;
			}
			else if(month == "05"){
				may = may + 1;
			}
			else if(month == "06"){
				jun = jun + 1;
			}
			else if(month == "07"){
				jul = jul + 1;
			}
			else if(month == "08"){
				aug = aug + 1;
			}
			else if(month == "09"){
				sep = sep + 1;
			}
			else if(month == "10"){
				oct = oct + 1;
			}
			else if(month == "11"){
				nov = nov + 1;
			}
			else if(month == "12"){
				dec = dec + 1;
			}
		}
			increment(i+1);
		  }
		  else {
		  	var temp = {};
		  	temp.name = "jan";
		  	temp.posts = jan;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "feb";
		  	temp.posts = feb;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "mar";
		  	temp.posts = mar;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "apr";
		  	temp.posts = apr;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "may";
		  	temp.posts = may;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "jun";
		  	temp.posts = jun;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "jul";
		  	temp.posts = jul;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "aug";
		  	temp.posts = aug;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "sep";
		  	temp.posts = sep;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "oct";
		  	temp.posts = oct;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "nov";
		  	temp.posts = nov;
		  	data.push(temp);

		  	var temp = {};
		  	temp.name = "dec";
		  	temp.posts = dec;
		  	data.push(temp);

		  	console.log(data);
		  	res.json(data);
		  }
		});
	}

increment(0);

	});
});

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
