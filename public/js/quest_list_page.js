(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cs = require('../helpers/cs');

var QuestListPage = React.createClass({
	displayName: 'QuestListPage',

	componentDidMount: function componentDidMount() {
		bella.event.subscribe('userStatusChange', function (options, emitter) {
			console.log('user status change', options.status);
		});
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'bc-quest-list-page' },
			React.createElement(
				'h1',
				null,
				'Quests'
			),
			React.createElement(QuestList, null)
		);
	}
});

var QuestList = React.createClass({
	displayName: 'QuestList',

	getInitialState: function getInitialState() {
		return { questList: {} };
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		cs.get('quest_list', function (response) {
			_this.setState({ questList: response.data });
		});
	},
	render: function render() {
		var questList = _.map(this.state.questList, function (quest, key) {
			return React.createElement(Quest, {
				key: key,
				questId: quest.id,
				title: quest.title,
				description: quest.description });
		});

		return React.createElement(
			'div',
			{ className: 'bc-quest-list' },
			questList
		);
	}
});

var Quest = React.createClass({
	displayName: 'Quest',

	render: function render() {
		var link = '/quest.html?quest_id=' + this.props.questId;

		return React.createElement(
			'div',
			{ className: 'bc-quest' },
			React.createElement(
				'div',
				null,
				React.createElement(
					'span',
					null,
					'title: '
				),
				React.createElement(
					'a',
					{ href: link },
					this.props.title
				)
			)
		);
	}
});

ReactDOM.render(React.createElement(QuestListPage, null), document.getElementById('main-section'));
},{"../helpers/cs":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcXVlc3RfbGlzdF9wYWdlL3F1ZXN0X2xpc3RfcGFnZS5qcyIsInNyYy9zY3JpcHRzL2hlbHBlcnMvY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jcycpO1xuXG52YXIgUXVlc3RMaXN0UGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdRdWVzdExpc3RQYWdlJyxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0YmVsbGEuZXZlbnQuc3Vic2NyaWJlKCd1c2VyU3RhdHVzQ2hhbmdlJywgZnVuY3Rpb24gKG9wdGlvbnMsIGVtaXR0ZXIpIHtcblx0XHRcdGNvbnNvbGUubG9nKCd1c2VyIHN0YXR1cyBjaGFuZ2UnLCBvcHRpb25zLnN0YXR1cyk7XG5cdFx0fSk7XG5cdH0sXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2JjLXF1ZXN0LWxpc3QtcGFnZScgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdoMScsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdCdRdWVzdHMnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChRdWVzdExpc3QsIG51bGwpXG5cdFx0KTtcblx0fVxufSk7XG5cbnZhciBRdWVzdExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUXVlc3RMaXN0JyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4geyBxdWVzdExpc3Q6IHt9IH07XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0Y3MuZ2V0KCdxdWVzdF9saXN0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7IHF1ZXN0TGlzdDogcmVzcG9uc2UuZGF0YSB9KTtcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHF1ZXN0TGlzdCA9IF8ubWFwKHRoaXMuc3RhdGUucXVlc3RMaXN0LCBmdW5jdGlvbiAocXVlc3QsIGtleSkge1xuXHRcdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUXVlc3QsIHtcblx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdHF1ZXN0SWQ6IHF1ZXN0LmlkLFxuXHRcdFx0XHR0aXRsZTogcXVlc3QudGl0bGUsXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiBxdWVzdC5kZXNjcmlwdGlvbiB9KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2RpdicsXG5cdFx0XHR7IGNsYXNzTmFtZTogJ2JjLXF1ZXN0LWxpc3QnIH0sXG5cdFx0XHRxdWVzdExpc3Rcblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFF1ZXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRkaXNwbGF5TmFtZTogJ1F1ZXN0JyxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgbGluayA9ICcvcXVlc3QuaHRtbD9xdWVzdF9pZD0nICsgdGhpcy5wcm9wcy5xdWVzdElkO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnYmMtcXVlc3QnIH0sXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnc3BhbicsXG5cdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHQndGl0bGU6ICdcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHQnYScsXG5cdFx0XHRcdFx0eyBocmVmOiBsaW5rIH0sXG5cdFx0XHRcdFx0dGhpcy5wcm9wcy50aXRsZVxuXHRcdFx0XHQpXG5cdFx0XHQpXG5cdFx0KTtcblx0fVxufSk7XG5cblJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFF1ZXN0TGlzdFBhZ2UsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1zZWN0aW9uJykpOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNzID0ge1xuXHRsb2c6IGZ1bmN0aW9uIGxvZyh0ZXh0KSB7XG5cdFx0Y29uc29sZS5sb2codGV4dCk7XG5cdH0sXG5cdGdldDogZnVuY3Rpb24gZ2V0KHVybCwgc3VjY2Vzcykge1xuXHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdHN1Y2Nlc3MoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdhamF4IGdldCBlcnJvcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR4aHIub3BlbignR0VUJywgdXJsKTtcblx0XHR4aHIuc2VuZCgpO1xuXHR9LFxuXHRwb3N0OiBmdW5jdGlvbiBwb3N0KHVybCwgZGF0YSwgc3VjY2Vzcykge1xuXHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdHN1Y2Nlc3MoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdhamF4IHBvc3QgZXJyb3InKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0eGhyLm9wZW4oJ1BPU1QnLCB1cmwpO1xuXHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXHRcdHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcblx0fSxcblx0Y29va2llOiBmdW5jdGlvbiBjb29raWUobmFtZSwgY29va2llcykge1xuXHRcdHZhciBjID0gdGhpcy5jb29raWVzKGNvb2tpZXMpO1xuXHRcdHJldHVybiBjW25hbWVdO1xuXHR9LFxuXHRjb29raWVzOiBmdW5jdGlvbiBjb29raWVzKF9jb29raWVzKSB7XG5cdFx0dmFyIG5hbWVWYWx1ZXMgPSBfY29va2llcy5zcGxpdCgnOyAnKTtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0bmFtZVZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgaSA9IGl0ZW0uc3BsaXQoJz0nKTtcblx0XHRcdHJlc3VsdFtpWzBdXSA9IGlbMV07XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblx0Z2V0UXVlcnlWYWx1ZTogZnVuY3Rpb24gZ2V0UXVlcnlWYWx1ZShxdWVyeVN0cmluZywgbmFtZSkge1xuXHRcdHZhciBhcnIgPSBxdWVyeVN0cmluZy5tYXRjaChuZXcgUmVnRXhwKG5hbWUgKyAnPShbXiZdKyknKSk7XG5cblx0XHRpZiAoYXJyKSB7XG5cdFx0XHRyZXR1cm4gYXJyWzFdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbnZhciB0ZXN0cyA9IFt7XG5cdGlkOiAxLFxuXHR0ZXN0OiBmdW5jdGlvbiB0ZXN0KCkge1xuXHRcdHZhciBjb29raWVzID0ge1xuXHRcdFx0Y3NhdGk6ICdtYWpvbScsXG5cdFx0XHRvbmU6ICd0d28nXG5cdFx0fTtcblxuXHRcdHZhciByZXN1bHQgPSB0cnVlO1xuXG5cdFx0dmFyIGMgPSBjcy5jb29raWVzKCdjc2F0aT1tYWpvbTsgb25lPXR3bycpO1xuXG5cdFx0aWYgKGMuY3NhdGkgIT09IGNvb2tpZXMuY3NhdGkpIHJlc3VsdCA9IGZhbHNlO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufSwge1xuXHRpZDogMixcblx0dGVzdDogZnVuY3Rpb24gdGVzdCgpIHtcblx0XHRyZXR1cm4gJ2JhcicgPT09IGNzLmNvb2tpZSgnZm9vJywgJ2Zvbz1iYXI7IHRlPW1ham9tJyk7XG5cdH1cbn0sIHtcblx0aWQ6IDMsXG5cdHRlc3Q6IGZ1bmN0aW9uIHRlc3QoKSB7XG5cdFx0cmV0dXJuICcxMjMnID09PSBjcy5nZXRRdWVyeVZhbHVlKCc/Y3NhdGk9bWFqb20mdXNlcl9pZD0xMjMmdmFsYW1pPXNlbW1pJywgJ3VzZXJfaWQnKTtcblx0fVxufV07XG5cbmlmIChmYWxzZSkge1xuXHR2YXIgcmVzdWx0ID0gdHJ1ZTtcblx0dGVzdHMuZm9yRWFjaChmdW5jdGlvbiAodGVzdCkge1xuXHRcdGlmICghdGVzdC50ZXN0KCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IodGVzdC5pZCArICcuIHRlc3QgZmFpbGVkJyk7XG5cdFx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHRpZiAocmVzdWx0KSB7XG5cdFx0Y29uc29sZS5sb2coJ0FsbCB0ZXN0cyBzdWNjZWVkZWQhJyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjczsiXX0=
