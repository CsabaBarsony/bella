(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var HomePage = React.createClass({
	displayName: 'HomePage',

	componentDidMount: function componentDidMount() {
		bella.event.subscribe('userStatusChange', function (options, emitter) {
			console.log('user status change', options.status);
		});
	},
	render: function render() {
		return React.createElement(
			'div',
			{ className: 'bc-home-page' },
			React.createElement(
				'h1',
				null,
				'Home'
			),
			React.createElement(
				'ul',
				null,
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ href: '/quest_list.html' },
						'Quests'
					)
				)
			)
		);
	}
});

ReactDOM.render(React.createElement(HomePage, null), document.getElementById('main-section'));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiaG9tZV9wYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDaEMsa0JBQWlCLEVBQUUsNkJBQVc7QUFDN0IsT0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3BFLFVBQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ2xELENBQUMsQ0FBQztFQUNIO0FBQ0QsT0FBTSxFQUFFLGtCQUFXO0FBQ2xCLFNBQ0M7O0tBQUssU0FBUyxFQUFDLGNBQWM7R0FDNUI7Ozs7SUFBYTtHQUNiOzs7SUFDQzs7O0tBQ0M7O1FBQUcsSUFBSSxFQUFDLGtCQUFrQjs7TUFBVztLQUNqQztJQUNEO0dBQ0EsQ0FDTDtFQUNGO0NBQ0QsQ0FBQyxDQUFDOztBQUVILFFBQVEsQ0FBQyxNQUFNLENBQ2Qsb0JBQUMsUUFBUSxPQUFHLEVBQ1osUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FDdkMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgSG9tZVBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Y29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0YmVsbGEuZXZlbnQuc3Vic2NyaWJlKCd1c2VyU3RhdHVzQ2hhbmdlJywgZnVuY3Rpb24ob3B0aW9ucywgZW1pdHRlcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBzdGF0dXMgY2hhbmdlJywgb3B0aW9ucy5zdGF0dXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJiYy1ob21lLXBhZ2VcIj5cclxuXHRcdFx0XHQ8aDE+SG9tZTwvaDE+XHJcblx0XHRcdFx0PHVsPlxyXG5cdFx0XHRcdFx0PGxpPlxyXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiL3F1ZXN0X2xpc3QuaHRtbFwiPlF1ZXN0czwvYT5cclxuXHRcdFx0XHRcdDwvbGk+XHJcblx0XHRcdFx0PC91bD5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5SZWFjdERPTS5yZW5kZXIoXHJcblx0PEhvbWVQYWdlIC8+LFxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXNlY3Rpb24nKVxyXG4pO1xyXG4iXX0=
