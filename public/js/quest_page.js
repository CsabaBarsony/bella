(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cs = require('../helpers/cs');
var Quest = require('../classes').Quest;
var User = require('../classes').User;

var QuestPage = React.createClass({
	displayName: 'QuestPage',

	getInitialState: function getInitialState() {
		return {
			status: 'init',
			quest: {},
			loggedIn: bella.data.user.status === bella.constants.userStatus.LOGGED_IN
		};
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		var questId = cs.getQueryValue(document.location.search, 'quest_id');

		bella.data.user.subscribe(function (user) {
			_this.setState({ loggedIn: user.status === bella.constants.userStatus.LOGGED_IN });
		});

		if (questId) {
			cs.get('/quest?quest_id=' + questId, function (response) {
				if (response.result === 'SUCCESS') {
					_this.setState({
						quest: response.data,
						status: 'ready'
					});
				} else if (response.result === 'FAIL') {
					_this.setState({
						status: 'not_found'
					});
				} else {
					console.error('Quest request error');
					_this.setState({
						status: 'error'
					});
				}
			});
		} else {
			this.setState({
				quest: new Quest(),
				status: 'ready'
			});
		}
	},
	render: function render() {
		var page;

		if (this.state.status === 'init') {
			page = React.createElement(
				'div',
				null,
				'init'
			);
		} else if (this.state.status === 'not_found') {
			page = React.createElement(
				'div',
				null,
				'not found'
			);
		} else if (this.state.status === 'error') {
			page = React.createElement(
				'div',
				null,
				'error'
			);
		} else if (this.state.status === 'ready') {
			page = React.createElement(
				'div',
				{ className: 'bc-quest-page' },
				React.createElement(
					'h1',
					null,
					'Quest'
				),
				React.createElement(RCQuest, {
					quest: this.state.quest,
					own: this.state.quest.user.id === cs.cookie('user_id', document.cookie),
					loggedIn: this.state.loggedIn })
			);
		}

		return page;
	}
});

var RCQuest = React.createClass({
	displayName: 'RCQuest',

	getInitialState: function getInitialState() {
		return { edit: !this.props.quest.id };
	},
	render: function render() {
		var toggleEditButton = this.props.own && this.props.loggedIn ? React.createElement(
			'button',
			{ onClick: this.toggleEdit },
			this.state.edit ? 'Cancel' : 'Edit'
		) : null;
		var saveButton = this.props.quest.dirty ? React.createElement(
			'button',
			null,
			'Save'
		) : null;
		var title = this.props.quest.id ? React.createElement(
			'span',
			null,
			this.props.quest.title
		) : React.createElement('input', { type: 'text', defaultValue: this.props.quest.title });
		var description = this.props.quest.id ? React.createElement(
			'span',
			null,
			this.props.quest.description
		) : React.createElement('textarea', { cols: '30', rows: '10', defaultValue: this.props.quest.description });
		var user = this.props.quest.user ? React.createElement(
			'span',
			null,
			this.props.quest.user.name
		) : null;

		return React.createElement(
			'div',
			null,
			React.createElement(
				'span',
				null,
				'user: '
			),
			user,
			React.createElement('br', null),
			React.createElement(
				'span',
				null,
				'title: '
			),
			title,
			React.createElement('br', null),
			React.createElement(
				'span',
				null,
				'description: '
			),
			description,
			React.createElement('br', null),
			saveButton,
			toggleEditButton
		);
	},
	toggleEdit: function toggleEdit() {
		this.setState({ edit: !this.state.edit });
	}
});

ReactDOM.render(React.createElement(QuestPage, null), document.getElementById('main-section'));
},{"../classes":2,"../helpers/cs":3}],2:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = {
	Quest: function Quest(id, userId) {
		var title = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
		var description = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
		var dirty = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

		_classCallCheck(this, Quest);

		this.id = id;
		this.userId = userId;
		this.title = title;
		this.description = description;
		this.dirty = dirty;
	}
};
},{}],3:[function(require,module,exports){
'use strict';

var cs = {
	log: function log(text) {
		console.log(text);
	},
	get: function get(url, success) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					success(JSON.parse(xhr.response));
				} else {
					console.error('ajax get error');
				}
			}
		};
		xhr.open('GET', url);
		xhr.send();
	},
	post: function post(url, data, success) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					success(JSON.parse(xhr.response));
				} else {
					console.error('ajax post error');
				}
			}
		};
		xhr.open('POST', url);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(JSON.stringify(data));
	},
	cookie: function cookie(name, cookies) {
		var c = this.cookies(cookies);
		return c[name];
	},
	cookies: function cookies(_cookies) {
		var nameValues = _cookies.split('; ');
		var result = {};
		nameValues.forEach(function (item) {
			var i = item.split('=');
			result[i[0]] = i[1];
		});
		return result;
	},
	getQueryValue: function getQueryValue(queryString, name) {
		var arr = queryString.match(new RegExp(name + '=([^&]+)'));

		if (arr) {
			return arr[1];
		} else {
			return null;
		}
	}
};

var tests = [{
	id: 1,
	test: function test() {
		var cookies = {
			csati: 'majom',
			one: 'two'
		};

		var result = true;

		var c = cs.cookies('csati=majom; one=two');

		if (c.csati !== cookies.csati) result = false;

		return result;
	}
}, {
	id: 2,
	test: function test() {
		return 'bar' === cs.cookie('foo', 'foo=bar; te=majom');
	}
}, {
	id: 3,
	test: function test() {
		return '123' === cs.getQueryValue('?csati=majom&user_id=123&valami=semmi', 'user_id');
	}
}];

if (false) {
	var result = true;
	tests.forEach(function (test) {
		if (!test.test()) {
			console.error(test.id + '. test failed');
			result = false;
		}
	});
	if (result) {
		console.log('All tests succeeded!');
	}
}

module.exports = cs;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcXVlc3RfcGFnZS9xdWVzdF9wYWdlLmpzIiwic3JjL3NjcmlwdHMvY2xhc3Nlcy5qcyIsInNyYy9zY3JpcHRzL2hlbHBlcnMvY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3MgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NzJyk7XG52YXIgUXVlc3QgPSByZXF1aXJlKCcuLi9jbGFzc2VzJykuUXVlc3Q7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL2NsYXNzZXMnKS5Vc2VyO1xuXG52YXIgUXVlc3RQYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1F1ZXN0UGFnZScsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0YXR1czogJ2luaXQnLFxuXHRcdFx0cXVlc3Q6IHt9LFxuXHRcdFx0bG9nZ2VkSW46IGJlbGxhLmRhdGEudXNlci5zdGF0dXMgPT09IGJlbGxhLmNvbnN0YW50cy51c2VyU3RhdHVzLkxPR0dFRF9JTlxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0dmFyIHF1ZXN0SWQgPSBjcy5nZXRRdWVyeVZhbHVlKGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaCwgJ3F1ZXN0X2lkJyk7XG5cblx0XHRiZWxsYS5kYXRhLnVzZXIuc3Vic2NyaWJlKGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7IGxvZ2dlZEluOiB1c2VyLnN0YXR1cyA9PT0gYmVsbGEuY29uc3RhbnRzLnVzZXJTdGF0dXMuTE9HR0VEX0lOIH0pO1xuXHRcdH0pO1xuXG5cdFx0aWYgKHF1ZXN0SWQpIHtcblx0XHRcdGNzLmdldCgnL3F1ZXN0P3F1ZXN0X2lkPScgKyBxdWVzdElkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnJlc3VsdCA9PT0gJ1NVQ0NFU1MnKSB7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0cXVlc3Q6IHJlc3BvbnNlLmRhdGEsXG5cdFx0XHRcdFx0XHRzdGF0dXM6ICdyZWFkeSdcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZXNwb25zZS5yZXN1bHQgPT09ICdGQUlMJykge1xuXHRcdFx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHN0YXR1czogJ25vdF9mb3VuZCdcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdRdWVzdCByZXF1ZXN0IGVycm9yJyk7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0c3RhdHVzOiAnZXJyb3InXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0cXVlc3Q6IG5ldyBRdWVzdCgpLFxuXHRcdFx0XHRzdGF0dXM6ICdyZWFkeSdcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHBhZ2U7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5zdGF0dXMgPT09ICdpbml0Jykge1xuXHRcdFx0cGFnZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnaW5pdCdcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gJ25vdF9mb3VuZCcpIHtcblx0XHRcdHBhZ2UgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J25vdCBmb3VuZCdcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gJ2Vycm9yJykge1xuXHRcdFx0cGFnZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnZXJyb3InXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zdGF0dXMgPT09ICdyZWFkeScpIHtcblx0XHRcdHBhZ2UgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdiYy1xdWVzdC1wYWdlJyB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdoMScsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHQnUXVlc3QnXG5cdFx0XHRcdCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoUkNRdWVzdCwge1xuXHRcdFx0XHRcdHF1ZXN0OiB0aGlzLnN0YXRlLnF1ZXN0LFxuXHRcdFx0XHRcdG93bjogdGhpcy5zdGF0ZS5xdWVzdC51c2VyLmlkID09PSBjcy5jb29raWUoJ3VzZXJfaWQnLCBkb2N1bWVudC5jb29raWUpLFxuXHRcdFx0XHRcdGxvZ2dlZEluOiB0aGlzLnN0YXRlLmxvZ2dlZEluIH0pXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYWdlO1xuXHR9XG59KTtcblxudmFyIFJDUXVlc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUkNRdWVzdCcsXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHsgZWRpdDogIXRoaXMucHJvcHMucXVlc3QuaWQgfTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHRvZ2dsZUVkaXRCdXR0b24gPSB0aGlzLnByb3BzLm93biAmJiB0aGlzLnByb3BzLmxvZ2dlZEluID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdidXR0b24nLFxuXHRcdFx0eyBvbkNsaWNrOiB0aGlzLnRvZ2dsZUVkaXQgfSxcblx0XHRcdHRoaXMuc3RhdGUuZWRpdCA/ICdDYW5jZWwnIDogJ0VkaXQnXG5cdFx0KSA6IG51bGw7XG5cdFx0dmFyIHNhdmVCdXR0b24gPSB0aGlzLnByb3BzLnF1ZXN0LmRpcnR5ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdidXR0b24nLFxuXHRcdFx0bnVsbCxcblx0XHRcdCdTYXZlJ1xuXHRcdCkgOiBudWxsO1xuXHRcdHZhciB0aXRsZSA9IHRoaXMucHJvcHMucXVlc3QuaWQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J3NwYW4nLFxuXHRcdFx0bnVsbCxcblx0XHRcdHRoaXMucHJvcHMucXVlc3QudGl0bGVcblx0XHQpIDogUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgZGVmYXVsdFZhbHVlOiB0aGlzLnByb3BzLnF1ZXN0LnRpdGxlIH0pO1xuXHRcdHZhciBkZXNjcmlwdGlvbiA9IHRoaXMucHJvcHMucXVlc3QuaWQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J3NwYW4nLFxuXHRcdFx0bnVsbCxcblx0XHRcdHRoaXMucHJvcHMucXVlc3QuZGVzY3JpcHRpb25cblx0XHQpIDogUmVhY3QuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnLCB7IGNvbHM6ICczMCcsIHJvd3M6ICcxMCcsIGRlZmF1bHRWYWx1ZTogdGhpcy5wcm9wcy5xdWVzdC5kZXNjcmlwdGlvbiB9KTtcblx0XHR2YXIgdXNlciA9IHRoaXMucHJvcHMucXVlc3QudXNlciA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnc3BhbicsXG5cdFx0XHRudWxsLFxuXHRcdFx0dGhpcy5wcm9wcy5xdWVzdC51c2VyLm5hbWVcblx0XHQpIDogbnVsbDtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQndXNlcjogJ1xuXHRcdFx0KSxcblx0XHRcdHVzZXIsXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdicicsIG51bGwpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3NwYW4nLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQndGl0bGU6ICdcblx0XHRcdCksXG5cdFx0XHR0aXRsZSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdkZXNjcmlwdGlvbjogJ1xuXHRcdFx0KSxcblx0XHRcdGRlc2NyaXB0aW9uLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnYnInLCBudWxsKSxcblx0XHRcdHNhdmVCdXR0b24sXG5cdFx0XHR0b2dnbGVFZGl0QnV0dG9uXG5cdFx0KTtcblx0fSxcblx0dG9nZ2xlRWRpdDogZnVuY3Rpb24gdG9nZ2xlRWRpdCgpIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgZWRpdDogIXRoaXMuc3RhdGUuZWRpdCB9KTtcblx0fVxufSk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFF1ZXN0UGFnZSwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXNlY3Rpb24nKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0UXVlc3Q6IGZ1bmN0aW9uIFF1ZXN0KGlkLCB1c2VySWQpIHtcblx0XHR2YXIgdGl0bGUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1syXTtcblx0XHR2YXIgZGVzY3JpcHRpb24gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDMgfHwgYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyAnJyA6IGFyZ3VtZW50c1szXTtcblx0XHR2YXIgZGlydHkgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDQgfHwgYXJndW1lbnRzWzRdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1s0XTtcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBRdWVzdCk7XG5cblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy51c2VySWQgPSB1c2VySWQ7XG5cdFx0dGhpcy50aXRsZSA9IHRpdGxlO1xuXHRcdHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcblx0XHR0aGlzLmRpcnR5ID0gZGlydHk7XG5cdH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3MgPSB7XG5cdGxvZzogZnVuY3Rpb24gbG9nKHRleHQpIHtcblx0XHRjb25zb2xlLmxvZyh0ZXh0KTtcblx0fSxcblx0Z2V0OiBmdW5jdGlvbiBnZXQodXJsLCBzdWNjZXNzKSB7XG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0c3VjY2VzcyhKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FqYXggZ2V0IGVycm9yJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuXHRcdHhoci5zZW5kKCk7XG5cdH0sXG5cdHBvc3Q6IGZ1bmN0aW9uIHBvc3QodXJsLCBkYXRhLCBzdWNjZXNzKSB7XG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0c3VjY2VzcyhKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FqYXggcG9zdCBlcnJvcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR4aHIub3BlbignUE9TVCcsIHVybCk7XG5cdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cdFx0eGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHR9LFxuXHRjb29raWU6IGZ1bmN0aW9uIGNvb2tpZShuYW1lLCBjb29raWVzKSB7XG5cdFx0dmFyIGMgPSB0aGlzLmNvb2tpZXMoY29va2llcyk7XG5cdFx0cmV0dXJuIGNbbmFtZV07XG5cdH0sXG5cdGNvb2tpZXM6IGZ1bmN0aW9uIGNvb2tpZXMoX2Nvb2tpZXMpIHtcblx0XHR2YXIgbmFtZVZhbHVlcyA9IF9jb29raWVzLnNwbGl0KCc7ICcpO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRuYW1lVmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBpID0gaXRlbS5zcGxpdCgnPScpO1xuXHRcdFx0cmVzdWx0W2lbMF1dID0gaVsxXTtcblx0XHR9KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXHRnZXRRdWVyeVZhbHVlOiBmdW5jdGlvbiBnZXRRdWVyeVZhbHVlKHF1ZXJ5U3RyaW5nLCBuYW1lKSB7XG5cdFx0dmFyIGFyciA9IHF1ZXJ5U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAobmFtZSArICc9KFteJl0rKScpKTtcblxuXHRcdGlmIChhcnIpIHtcblx0XHRcdHJldHVybiBhcnJbMV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHRlc3RzID0gW3tcblx0aWQ6IDEsXG5cdHRlc3Q6IGZ1bmN0aW9uIHRlc3QoKSB7XG5cdFx0dmFyIGNvb2tpZXMgPSB7XG5cdFx0XHRjc2F0aTogJ21ham9tJyxcblx0XHRcdG9uZTogJ3R3bydcblx0XHR9O1xuXG5cdFx0dmFyIHJlc3VsdCA9IHRydWU7XG5cblx0XHR2YXIgYyA9IGNzLmNvb2tpZXMoJ2NzYXRpPW1ham9tOyBvbmU9dHdvJyk7XG5cblx0XHRpZiAoYy5jc2F0aSAhPT0gY29va2llcy5jc2F0aSkgcmVzdWx0ID0gZmFsc2U7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59LCB7XG5cdGlkOiAyLFxuXHR0ZXN0OiBmdW5jdGlvbiB0ZXN0KCkge1xuXHRcdHJldHVybiAnYmFyJyA9PT0gY3MuY29va2llKCdmb28nLCAnZm9vPWJhcjsgdGU9bWFqb20nKTtcblx0fVxufSwge1xuXHRpZDogMyxcblx0dGVzdDogZnVuY3Rpb24gdGVzdCgpIHtcblx0XHRyZXR1cm4gJzEyMycgPT09IGNzLmdldFF1ZXJ5VmFsdWUoJz9jc2F0aT1tYWpvbSZ1c2VyX2lkPTEyMyZ2YWxhbWk9c2VtbWknLCAndXNlcl9pZCcpO1xuXHR9XG59XTtcblxuaWYgKGZhbHNlKSB7XG5cdHZhciByZXN1bHQgPSB0cnVlO1xuXHR0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXN0KSB7XG5cdFx0aWYgKCF0ZXN0LnRlc3QoKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcih0ZXN0LmlkICsgJy4gdGVzdCBmYWlsZWQnKTtcblx0XHRcdHJlc3VsdCA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdGlmIChyZXN1bHQpIHtcblx0XHRjb25zb2xlLmxvZygnQWxsIHRlc3RzIHN1Y2NlZWRlZCEnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNzOyJdfQ==
