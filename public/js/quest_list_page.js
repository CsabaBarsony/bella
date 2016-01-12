(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cs = require('../helpers/cs');

var QuestListPage = React.createClass({
	displayName: 'QuestListPage',

	componentDidMount: function componentDidMount() {
		bella.data.user.subscribe(function (user) {
			// do what you want!
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
			React.createElement(
				'a',
				{ href: '/quest.html' },
				'New Quest'
			),
			React.createElement('br', null),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcXVlc3RfbGlzdF9wYWdlL3F1ZXN0X2xpc3RfcGFnZS5qcyIsInNyYy9zY3JpcHRzL2hlbHBlcnMvY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jcycpO1xuXG52YXIgUXVlc3RMaXN0UGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdRdWVzdExpc3RQYWdlJyxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0YmVsbGEuZGF0YS51c2VyLnN1YnNjcmliZShmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0Ly8gZG8gd2hhdCB5b3Ugd2FudCFcblx0XHR9KTtcblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnYmMtcXVlc3QtbGlzdC1wYWdlJyB9LFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J2gxJyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J1F1ZXN0cydcblx0XHRcdCksXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFF1ZXN0TGlzdCwgbnVsbClcblx0XHQpO1xuXHR9XG59KTtcblxudmFyIFF1ZXN0TGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdRdWVzdExpc3QnLFxuXG5cdGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7IHF1ZXN0TGlzdDoge30gfTtcblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRjcy5nZXQoJ3F1ZXN0X2xpc3QnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdF90aGlzLnNldFN0YXRlKHsgcXVlc3RMaXN0OiByZXNwb25zZS5kYXRhIH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgcXVlc3RMaXN0ID0gXy5tYXAodGhpcy5zdGF0ZS5xdWVzdExpc3QsIGZ1bmN0aW9uIChxdWVzdCwga2V5KSB7XG5cdFx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChRdWVzdCwge1xuXHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0cXVlc3RJZDogcXVlc3QuaWQsXG5cdFx0XHRcdHRpdGxlOiBxdWVzdC50aXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IHF1ZXN0LmRlc2NyaXB0aW9uIH0pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHQnZGl2Jyxcblx0XHRcdHsgY2xhc3NOYW1lOiAnYmMtcXVlc3QtbGlzdCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdhJyxcblx0XHRcdFx0eyBocmVmOiAnL3F1ZXN0Lmh0bWwnIH0sXG5cdFx0XHRcdCdOZXcgUXVlc3QnXG5cdFx0XHQpLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudCgnYnInLCBudWxsKSxcblx0XHRcdHF1ZXN0TGlzdFxuXHRcdCk7XG5cdH1cbn0pO1xuXG52YXIgUXVlc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUXVlc3QnLFxuXG5cdHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuXHRcdHZhciBsaW5rID0gJy9xdWVzdC5odG1sP3F1ZXN0X2lkPScgKyB0aGlzLnByb3BzLnF1ZXN0SWQ7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0eyBjbGFzc05hbWU6ICdiYy1xdWVzdCcgfSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdzcGFuJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdCd0aXRsZTogJ1xuXHRcdFx0XHQpLFxuXHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdCdhJyxcblx0XHRcdFx0XHR7IGhyZWY6IGxpbmsgfSxcblx0XHRcdFx0XHR0aGlzLnByb3BzLnRpdGxlXG5cdFx0XHRcdClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59KTtcblxuUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUXVlc3RMaXN0UGFnZSwgbnVsbCksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXNlY3Rpb24nKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY3MgPSB7XG5cdGxvZzogZnVuY3Rpb24gbG9nKHRleHQpIHtcblx0XHRjb25zb2xlLmxvZyh0ZXh0KTtcblx0fSxcblx0Z2V0OiBmdW5jdGlvbiBnZXQodXJsLCBzdWNjZXNzKSB7XG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0c3VjY2VzcyhKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FqYXggZ2V0IGVycm9yJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuXHRcdHhoci5zZW5kKCk7XG5cdH0sXG5cdHBvc3Q6IGZ1bmN0aW9uIHBvc3QodXJsLCBkYXRhLCBzdWNjZXNzKSB7XG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0c3VjY2VzcyhKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FqYXggcG9zdCBlcnJvcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR4aHIub3BlbignUE9TVCcsIHVybCk7XG5cdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cdFx0eGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXHR9LFxuXHRjb29raWU6IGZ1bmN0aW9uIGNvb2tpZShuYW1lLCBjb29raWVzKSB7XG5cdFx0dmFyIGMgPSB0aGlzLmNvb2tpZXMoY29va2llcyk7XG5cdFx0cmV0dXJuIGNbbmFtZV07XG5cdH0sXG5cdGNvb2tpZXM6IGZ1bmN0aW9uIGNvb2tpZXMoX2Nvb2tpZXMpIHtcblx0XHR2YXIgbmFtZVZhbHVlcyA9IF9jb29raWVzLnNwbGl0KCc7ICcpO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRuYW1lVmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBpID0gaXRlbS5zcGxpdCgnPScpO1xuXHRcdFx0cmVzdWx0W2lbMF1dID0gaVsxXTtcblx0XHR9KTtcblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXHRnZXRRdWVyeVZhbHVlOiBmdW5jdGlvbiBnZXRRdWVyeVZhbHVlKHF1ZXJ5U3RyaW5nLCBuYW1lKSB7XG5cdFx0dmFyIGFyciA9IHF1ZXJ5U3RyaW5nLm1hdGNoKG5ldyBSZWdFeHAobmFtZSArICc9KFteJl0rKScpKTtcblxuXHRcdGlmIChhcnIpIHtcblx0XHRcdHJldHVybiBhcnJbMV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxufTtcblxudmFyIHRlc3RzID0gW3tcblx0aWQ6IDEsXG5cdHRlc3Q6IGZ1bmN0aW9uIHRlc3QoKSB7XG5cdFx0dmFyIGNvb2tpZXMgPSB7XG5cdFx0XHRjc2F0aTogJ21ham9tJyxcblx0XHRcdG9uZTogJ3R3bydcblx0XHR9O1xuXG5cdFx0dmFyIHJlc3VsdCA9IHRydWU7XG5cblx0XHR2YXIgYyA9IGNzLmNvb2tpZXMoJ2NzYXRpPW1ham9tOyBvbmU9dHdvJyk7XG5cblx0XHRpZiAoYy5jc2F0aSAhPT0gY29va2llcy5jc2F0aSkgcmVzdWx0ID0gZmFsc2U7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59LCB7XG5cdGlkOiAyLFxuXHR0ZXN0OiBmdW5jdGlvbiB0ZXN0KCkge1xuXHRcdHJldHVybiAnYmFyJyA9PT0gY3MuY29va2llKCdmb28nLCAnZm9vPWJhcjsgdGU9bWFqb20nKTtcblx0fVxufSwge1xuXHRpZDogMyxcblx0dGVzdDogZnVuY3Rpb24gdGVzdCgpIHtcblx0XHRyZXR1cm4gJzEyMycgPT09IGNzLmdldFF1ZXJ5VmFsdWUoJz9jc2F0aT1tYWpvbSZ1c2VyX2lkPTEyMyZ2YWxhbWk9c2VtbWknLCAndXNlcl9pZCcpO1xuXHR9XG59XTtcblxuaWYgKGZhbHNlKSB7XG5cdHZhciByZXN1bHQgPSB0cnVlO1xuXHR0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXN0KSB7XG5cdFx0aWYgKCF0ZXN0LnRlc3QoKSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcih0ZXN0LmlkICsgJy4gdGVzdCBmYWlsZWQnKTtcblx0XHRcdHJlc3VsdCA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdGlmIChyZXN1bHQpIHtcblx0XHRjb25zb2xlLmxvZygnQWxsIHRlc3RzIHN1Y2NlZWRlZCEnKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNzOyJdfQ==
