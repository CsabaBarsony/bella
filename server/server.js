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

function setQuest(quest, rId, userId) {
	return {
		id: quest.id || rId,
		title: quest.title,
		description: quest.description,
		userId: quest.user.id || userId
	};
}

function getUser(id) {
	var user = users[id];

	return {
		id: user.id,
		name: user.name
	}
}

function randomString(length) {
	var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < length; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
}

function authorize(req) {
	if(!req.cookies || !req.cookies.user_id || !req.cookies.token ) return false;
	return users[req.cookies.user_id].token === req.cookies.token;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use(cookie());

app.listen(portNumber);

console.log("Server is running on port " + portNumber + "...");

app.post("/login", function(req, res){
	var user = _.find(users, (user) => {
		return user.name === req.body.username;
	});
	if(user.password === req.body.password) {
		var random = randomString(32);
		user.token = random;
		res.cookie('user_id', user.id);
		res.cookie('token', random);
		var userData = getUser(user.id);
		userData.status = 'LOGGED_IN';

		res.send(userData);
	}
	else {
		res.status(404).send();
	}
});

app.get('/userStatus', function(req, res) {
	var user = users[req.cookies.user_id];
	if(user) {
		var userData = getUser(user.id);
		if(user.token === req.cookies.token) {
			userData.status = 'LOGGED_IN';
		}
		else {
			userData.status = 'GUEST';
		}
		res.send(userData);
	}
	res.status(404).send();
});

app.get('/logout', function(req, res) {
	var user = users[req.cookies.user_id];

	if(user) {
		user.token = false;
	}

	res.cookie('token', 'expired').send();
});

app.get('/quest_list', function(req, res) {
	res.send({
		result: 'SUCCESS',
		data: _.map(questList, q => getQuest(q.id))
	});
});

app.get('/wish', function(req, res) {
	var data = getQuest(req.query.id);
	data ? res.send(data) : res.status(404).send();
});

app.post('/quest', function(req, res) {
	if(authorize(req)) {
		if(req.body.id) {
			if(questList[req.body.id].userId === req.cookies.user_id) {
				questList[req.body.id] = setQuest(req.body);
				res.send({
					result: 'SUCCESS',
					data: getQuest(req.body.id)
				});
				console.log(questList);
			}
			else {
				res.send({ result: 'FAIL' });
			}
		}
		else {
			var rId = randomString(10);
			questList[rId] = setQuest(req.body, rId, req.cookies.user_id);
			console.log(questList);
			res.send({
				result: 'SUCCESS',
				data: getQuest(rId)
			});
		}
	}
	else {
		res.send({ result: 'FAIL' });
	}
});

app.get('/user', function(req, res) {
	var data = getUser(req.query.id);
	data ? res.send(data) : res.status(404).send();
});
