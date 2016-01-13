(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cs = require('../../helpers/cs');

var User = React.createClass({
	displayName: 'User',

	getInitialState: function getInitialState() {
		var user = bella.data.user.get();

		return {
			status: user.status,
			userName: user.name,
			opened: false,
			errorMessage: ''
		};
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		bella.data.user.subscribe(function (user) {
			_this.setState({
				status: user.status,
				userName: user.name
			});
		});

		if (cs.cookie('user_id', document.cookie) && cs.cookie('token', document.cookie)) {
			cs.get('userstatus', function (response) {
				if (response.result === bella.constants.server.result.SUCCESS) {
					bella.data.user.set(response.data.user, _this);
				}
			});
		} else {
			bella.user.set('status', bella.constants.userStatus.GUEST, this);
		}
	},
	render: function render() {
		if (this.state.status === bella.constants.userStatus.GUEST) {
			var errorMessage = this.state.errorMessage ? React.createElement(
				'div',
				null,
				this.state.errorMessage
			) : null;

			var popup = this.state.opened ? React.createElement(
				'div',
				{ className: 'bc-user-popup' },
				errorMessage,
				React.createElement('input', { type: 'text', ref: 'name', defaultValue: 'a' }),
				React.createElement('br', null),
				React.createElement('input', { type: 'text', ref: 'password', defaultValue: '1' }),
				React.createElement('br', null),
				React.createElement(
					'button',
					{ onClick: this.login },
					'Login'
				)
			) : null;

			return React.createElement(
				'div',
				{ className: 'bc-user' },
				React.createElement(
					'a',
					{ href: '', onClick: this.click },
					'user'
				),
				popup
			);
		} else if (this.state.status === bella.constants.userStatus.LOGGED_IN) {
			var popup = this.state.opened ? React.createElement(
				'div',
				{ className: 'bc-user-popup' },
				React.createElement(
					'a',
					{ href: '', onClick: this.logout },
					'logout'
				)
			) : null;

			return React.createElement(
				'div',
				{ className: 'bc-user' },
				React.createElement(
					'a',
					{ href: '', onClick: this.click },
					this.state.userName
				),
				popup
			);
		}
	},
	click: function click(e) {
		e.preventDefault();
		this.setState({ opened: !this.state.opened });
	},
	login: function login() {
		var _this2 = this;

		cs.post('login', {
			username: this.refs.name.value,
			password: this.refs.password.value
		}, function (response) {
			if (response.result === bella.constants.server.result.SUCCESS) {
				bella.data.user.set(response.data, _this2);
				_this2.setState({
					errorMessage: '',
					opened: false
				});
			} else if (response.result = bella.constants.server.result.FAIL) {
				bella.data.user.set({ status: bella.constants.userStatus.GUEST }, _this2);
				_this2.setState({ errorMessage: response.data.errorMessage });
			}
		});
	},
	logout: function logout(e) {
		var _this3 = this;

		e.preventDefault();
		cs.get('logout', function (response) {
			if (response.result === bella.constants.server.result.SUCCESS) {
				bella.data.user.set({
					id: null,
					name: '',
					status: bella.constants.userStatus.GUEST
				}, _this3);
				_this3.setState({ opened: false });
			}
		});
	}
});

ReactDOM.render(React.createElement(User, null), document.getElementById('bc-user-container'));
},{"../../helpers/cs":2}],2:[function(require,module,exports){
'use strict';

var cs = {
	log: function log(text) {
		console.log(text);
	},
	get: function get(url, callback) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					callback(xhr.status, JSON.parse(xhr.response));
				} else if (xhr.status === 404) {
					callback(xhr.status);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvY29tcG9uZW50cy91c2VyL3VzZXIuanMiLCJzcmMvc2NyaXB0cy9oZWxwZXJzL2NzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3MgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2NzJyk7XG5cbnZhciBVc2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1VzZXInLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHZhciB1c2VyID0gYmVsbGEuZGF0YS51c2VyLmdldCgpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0YXR1czogdXNlci5zdGF0dXMsXG5cdFx0XHR1c2VyTmFtZTogdXNlci5uYW1lLFxuXHRcdFx0b3BlbmVkOiBmYWxzZSxcblx0XHRcdGVycm9yTWVzc2FnZTogJydcblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGJlbGxhLmRhdGEudXNlci5zdWJzY3JpYmUoZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0c3RhdHVzOiB1c2VyLnN0YXR1cyxcblx0XHRcdFx0dXNlck5hbWU6IHVzZXIubmFtZVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRpZiAoY3MuY29va2llKCd1c2VyX2lkJywgZG9jdW1lbnQuY29va2llKSAmJiBjcy5jb29raWUoJ3Rva2VuJywgZG9jdW1lbnQuY29va2llKSkge1xuXHRcdFx0Y3MuZ2V0KCd1c2Vyc3RhdHVzJywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGlmIChyZXNwb25zZS5yZXN1bHQgPT09IGJlbGxhLmNvbnN0YW50cy5zZXJ2ZXIucmVzdWx0LlNVQ0NFU1MpIHtcblx0XHRcdFx0XHRiZWxsYS5kYXRhLnVzZXIuc2V0KHJlc3BvbnNlLmRhdGEudXNlciwgX3RoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YmVsbGEudXNlci5zZXQoJ3N0YXR1cycsIGJlbGxhLmNvbnN0YW50cy51c2VyU3RhdHVzLkdVRVNULCB0aGlzKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdGlmICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gYmVsbGEuY29uc3RhbnRzLnVzZXJTdGF0dXMuR1VFU1QpIHtcblx0XHRcdHZhciBlcnJvck1lc3NhZ2UgPSB0aGlzLnN0YXRlLmVycm9yTWVzc2FnZSA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHR0aGlzLnN0YXRlLmVycm9yTWVzc2FnZVxuXHRcdFx0KSA6IG51bGw7XG5cblx0XHRcdHZhciBwb3B1cCA9IHRoaXMuc3RhdGUub3BlbmVkID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2RpdicsXG5cdFx0XHRcdHsgY2xhc3NOYW1lOiAnYmMtdXNlci1wb3B1cCcgfSxcblx0XHRcdFx0ZXJyb3JNZXNzYWdlLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCByZWY6ICduYW1lJywgZGVmYXVsdFZhbHVlOiAnYScgfSksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIHJlZjogJ3Bhc3N3b3JkJywgZGVmYXVsdFZhbHVlOiAnMScgfSksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2J1dHRvbicsXG5cdFx0XHRcdFx0eyBvbkNsaWNrOiB0aGlzLmxvZ2luIH0sXG5cdFx0XHRcdFx0J0xvZ2luJ1xuXHRcdFx0XHQpXG5cdFx0XHQpIDogbnVsbDtcblxuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2JjLXVzZXInIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2EnLFxuXHRcdFx0XHRcdHsgaHJlZjogJycsIG9uQ2xpY2s6IHRoaXMuY2xpY2sgfSxcblx0XHRcdFx0XHQndXNlcidcblx0XHRcdFx0KSxcblx0XHRcdFx0cG9wdXBcblx0XHRcdCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLnN0YXRlLnN0YXR1cyA9PT0gYmVsbGEuY29uc3RhbnRzLnVzZXJTdGF0dXMuTE9HR0VEX0lOKSB7XG5cdFx0XHR2YXIgcG9wdXAgPSB0aGlzLnN0YXRlLm9wZW5lZCA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2JjLXVzZXItcG9wdXAnIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2EnLFxuXHRcdFx0XHRcdHsgaHJlZjogJycsIG9uQ2xpY2s6IHRoaXMubG9nb3V0IH0sXG5cdFx0XHRcdFx0J2xvZ291dCdcblx0XHRcdFx0KVxuXHRcdFx0KSA6IG51bGw7XG5cblx0XHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0eyBjbGFzc05hbWU6ICdiYy11c2VyJyB9LFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdhJyxcblx0XHRcdFx0XHR7IGhyZWY6ICcnLCBvbkNsaWNrOiB0aGlzLmNsaWNrIH0sXG5cdFx0XHRcdFx0dGhpcy5zdGF0ZS51c2VyTmFtZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRwb3B1cFxuXHRcdFx0KTtcblx0XHR9XG5cdH0sXG5cdGNsaWNrOiBmdW5jdGlvbiBjbGljayhlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHRoaXMuc2V0U3RhdGUoeyBvcGVuZWQ6ICF0aGlzLnN0YXRlLm9wZW5lZCB9KTtcblx0fSxcblx0bG9naW46IGZ1bmN0aW9uIGxvZ2luKCkge1xuXHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0Y3MucG9zdCgnbG9naW4nLCB7XG5cdFx0XHR1c2VybmFtZTogdGhpcy5yZWZzLm5hbWUudmFsdWUsXG5cdFx0XHRwYXNzd29yZDogdGhpcy5yZWZzLnBhc3N3b3JkLnZhbHVlXG5cdFx0fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRpZiAocmVzcG9uc2UucmVzdWx0ID09PSBiZWxsYS5jb25zdGFudHMuc2VydmVyLnJlc3VsdC5TVUNDRVNTKSB7XG5cdFx0XHRcdGJlbGxhLmRhdGEudXNlci5zZXQocmVzcG9uc2UuZGF0YSwgX3RoaXMyKTtcblx0XHRcdFx0X3RoaXMyLnNldFN0YXRlKHtcblx0XHRcdFx0XHRlcnJvck1lc3NhZ2U6ICcnLFxuXHRcdFx0XHRcdG9wZW5lZDogZmFsc2Vcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKHJlc3BvbnNlLnJlc3VsdCA9IGJlbGxhLmNvbnN0YW50cy5zZXJ2ZXIucmVzdWx0LkZBSUwpIHtcblx0XHRcdFx0YmVsbGEuZGF0YS51c2VyLnNldCh7IHN0YXR1czogYmVsbGEuY29uc3RhbnRzLnVzZXJTdGF0dXMuR1VFU1QgfSwgX3RoaXMyKTtcblx0XHRcdFx0X3RoaXMyLnNldFN0YXRlKHsgZXJyb3JNZXNzYWdlOiByZXNwb25zZS5kYXRhLmVycm9yTWVzc2FnZSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0bG9nb3V0OiBmdW5jdGlvbiBsb2dvdXQoZSkge1xuXHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGNzLmdldCgnbG9nb3V0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRpZiAocmVzcG9uc2UucmVzdWx0ID09PSBiZWxsYS5jb25zdGFudHMuc2VydmVyLnJlc3VsdC5TVUNDRVNTKSB7XG5cdFx0XHRcdGJlbGxhLmRhdGEudXNlci5zZXQoe1xuXHRcdFx0XHRcdGlkOiBudWxsLFxuXHRcdFx0XHRcdG5hbWU6ICcnLFxuXHRcdFx0XHRcdHN0YXR1czogYmVsbGEuY29uc3RhbnRzLnVzZXJTdGF0dXMuR1VFU1Rcblx0XHRcdFx0fSwgX3RoaXMzKTtcblx0XHRcdFx0X3RoaXMzLnNldFN0YXRlKHsgb3BlbmVkOiBmYWxzZSB9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFVzZXIsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmMtdXNlci1jb250YWluZXInKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3MgPSB7XG5cdGxvZzogZnVuY3Rpb24gbG9nKHRleHQpIHtcblx0XHRjb25zb2xlLmxvZyh0ZXh0KTtcblx0fSxcblx0Z2V0OiBmdW5jdGlvbiBnZXQodXJsLCBjYWxsYmFjaykge1xuXHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdGNhbGxiYWNrKHhoci5zdGF0dXMsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeGhyLnN0YXR1cyA9PT0gNDA0KSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soeGhyLnN0YXR1cyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuXHRcdHhoci5zZW5kKCk7XG5cdH0sXG5cdHBvc3Q6IGZ1bmN0aW9uIHBvc3QodXJsLCBkYXRhLCBzdWNjZXNzKSB7XG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0c3VjY2VzcyhKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FqYXggcG9zdCBlcnJvcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR4aHIub3BlbignUE9TVCcsIHVybCk7XG5cdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cdFx0eGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHR9LFxuXHRjb29raWU6IGZ1bmN0aW9uIGNvb2tpZShuYW1lLCBjb29raWVzKSB7XG5cdFx0dmFyIGMgPSB0aGlzLmNvb2tpZXMoY29va2llcyk7XG5cdFx0cmV0dXJuIGNbbmFtZV07XG5cdH0sXG5cdGNvb2tpZXM6IGZ1bmN0aW9uIGNvb2tpZXMoX2Nvb2tpZXMpIHtcblx0XHR2YXIgbmFtZVZhbHVlcyA9IF9jb29raWVzLnNwbGl0KCc7ICcpO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRuYW1lVmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBpID0gaXRlbS5zcGxpdCgnPScpO1xuXHRcdFx0cmVzdWx0W2lbMF1dID0gaVsxXTtcblx0XHR9KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXHRnZXRRdWVyeVZhbHVlOiBmdW5jdGlvbiBnZXRRdWVyeVZhbHVlKHF1ZXJ5U3RyaW5nLCBuYW1lKSB7XG5cdFx0dmFyIGFyciA9IHF1ZXJ5U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAobmFtZSArICc9KFteJl0rKScpKTtcblxuXHRcdGlmIChhcnIpIHtcblx0XHRcdHJldHVybiBhcnJbMV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHRlc3RzID0gW3tcblx0aWQ6IDEsXG5cdHRlc3Q6IGZ1bmN0aW9uIHRlc3QoKSB7XG5cdFx0dmFyIGNvb2tpZXMgPSB7XG5cdFx0XHRjc2F0aTogJ21ham9tJyxcblx0XHRcdG9uZTogJ3R3bydcblx0XHR9O1xuXG5cdFx0dmFyIHJlc3VsdCA9IHRydWU7XG5cblx0XHR2YXIgYyA9IGNzLmNvb2tpZXMoJ2NzYXRpPW1ham9tOyBvbmU9dHdvJyk7XG5cblx0XHRpZiAoYy5jc2F0aSAhPT0gY29va2llcy5jc2F0aSkgcmVzdWx0ID0gZmFsc2U7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59LCB7XG5cdGlkOiAyLFxuXHR0ZXN0OiBmdW5jdGlvbiB0ZXN0KCkge1xuXHRcdHJldHVybiAnYmFyJyA9PT0gY3MuY29va2llKCdmb28nLCAnZm9vPWJhcjsgdGU9bWFqb20nKTtcblx0fVxufSwge1xuXHRpZDogMyxcblx0dGVzdDogZnVuY3Rpb24gdGVzdCgpIHtcblx0XHRyZXR1cm4gJzEyMycgPT09IGNzLmdldFF1ZXJ5VmFsdWUoJz9jc2F0aT1tYWpvbSZ1c2VyX2lkPTEyMyZ2YWxhbWk9c2VtbWknLCAndXNlcl9pZCcpO1xuXHR9XG59XTtcblxuaWYgKGZhbHNlKSB7XG5cdHZhciByZXN1bHQgPSB0cnVlO1xuXHR0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXN0KSB7XG5cdFx0aWYgKCF0ZXN0LnRlc3QoKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcih0ZXN0LmlkICsgJy4gdGVzdCBmYWlsZWQnKTtcblx0XHRcdHJlc3VsdCA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdGlmIChyZXN1bHQpIHtcblx0XHRjb25zb2xlLmxvZygnQWxsIHRlc3RzIHN1Y2NlZWRlZCEnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNzOyJdfQ==
