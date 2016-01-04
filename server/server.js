"use strict";

var _ = require('lodash');
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var cookie = require('cookie-parser');
var portNumber = 3000;

var users = {
	'1': {
		id: '1',
		name: 'a',
		password: '1',
		token: false
	},
	'2': {
		id: '2',
		name: 'b',
		password: '2',
		token: false
	}
};

var questList = {
	'1': {
		id: '1',
		title: 'Old scotch whisky',
		description: 'I\'d like to have on old scotch whisky',
		userId: '1'
	},
	'2': {
		id: '2',
		title: 'Robot dog',
		description: 'I want a robot dog',
		userId: '2'
	}
};

function getQuest(id) {
	var quest = questList[id];
	if(quest) {
		var user = users[quest.userId];

		return {
			id: quest.id,
			title: quest.title,
			description: quest.description,
			user: {
				id: user.id,
				name: user.name
			}
		}
	}
	else {
		return null;
	}
}

function getUser(id) {
	var user = users[id];

	return {
		id: user.id,
		name: user.name
	}
}

function randomString() {
	var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < 32; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz+1);
	}
	return randomString;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(cookie());

app.listen(portNumber);

console.log("Server is running on port " + portNumber + "...");

app.post("/login", function(req, res){
	var response = {};
	var user = _.find(users, (user) => {
		return user.name === req.body.username;
	});
	if(user.password === req.body.password) {
		var random = randomString();
		user.token = random;
		res.cookie('user_id', user.id);
		res.cookie('token', random);
		response = {
			result: 'success',
			status: 'loggedIn',
			data: getUser(user.id)
		}
	}
	else {
		response = {
			status: 'guest',
			errorMessage: 'Wrong username or password'
		};
	}
	res.send(response);
});

app.get('/userstatus', function(req, res) {
	var response = {};
	var user = users[req.cookies.user_id];
	if(user && user.token === req.cookies.token) {
		response = {
			result: 'success',
			status: 'loggedIn',
			data: getUser(user.id)
		}
	}
	else {
		response = {
			result: 'fail',
			status: 'guest'
		}
	}
	res.send(response);
});

app.get('/logout', function(req, res) {
	var user = users[req.cookies.user_id];

	if(user) {
		user.token = false;
	}

	res.cookie('token', 'expired');
	res.send({ status: 'guest' });
});

app.get('/quest_list', function(req, res) {
	res.send({
		result: 'success',
		data: _.map(questList, q => getQuest(q.id))
	});
});

app.get('/quest', function(req, res) {
	var data = getQuest(req.query.quest_id);
	if(data) {
		res.send({
			result: 'success',
			data: data
		});
	}
	else {
		res.send({
			result: 'fail'
		});
	}
});

app.get('/user', function(req, res) {
	var data = getUser(req.query.user_id);
	if(data) {
		res.send({
			result: 'success',
			data: data
		});
	}
	else {
		res.send({
			result: 'fail'
		});
	}
});
