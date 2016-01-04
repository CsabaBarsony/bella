(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function () {
	var events = [];

	var event = {
		subscribe: function subscribe(name, callback) {
			events.push({
				name: name,
				callback: callback
			});
		},
		emit: function emit(name, options, emitter) {
			events.forEach(function (event) {
				if (event.name === name) {
					event.callback(options, emitter);
				}
			});
		}
	};

	window.bella = {
		event: event
	};
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYmVsbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLENBQUMsWUFBVztBQUNYLEtBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsS0FBSSxLQUFLLEdBQUc7QUFDWCxXQUFTLEVBQUUsbUJBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUNuQyxTQUFNLENBQUMsSUFBSSxDQUFDO0FBQ1gsUUFBSSxFQUFFLElBQUk7QUFDVixZQUFRLEVBQUUsUUFBUTtJQUNsQixDQUFDLENBQUM7R0FDSDtBQUNELE1BQUksRUFBRSxjQUFTLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLFNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUU7QUFDOUIsUUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtBQUN2QixVQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNqQztJQUNELENBQUMsQ0FBQztHQUNIO0VBQ0QsQ0FBQzs7QUFFRixPQUFNLENBQUMsS0FBSyxHQUFHO0FBQ2QsT0FBSyxFQUFFLEtBQUs7RUFDWixDQUFDO0NBQ0YsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBldmVudHMgPSBbXTtcclxuXHJcblx0dmFyIGV2ZW50ID0ge1xyXG5cdFx0c3Vic2NyaWJlOiBmdW5jdGlvbihuYW1lLCBjYWxsYmFjaykge1xyXG5cdFx0XHRldmVudHMucHVzaCh7XHJcblx0XHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0ZW1pdDogZnVuY3Rpb24obmFtZSwgb3B0aW9ucywgZW1pdHRlcikge1xyXG5cdFx0XHRldmVudHMuZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdGlmKGV2ZW50Lm5hbWUgPT09IG5hbWUpIHtcclxuXHRcdFx0XHRcdGV2ZW50LmNhbGxiYWNrKG9wdGlvbnMsIGVtaXR0ZXIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0d2luZG93LmJlbGxhID0ge1xyXG5cdFx0ZXZlbnQ6IGV2ZW50XHJcblx0fTtcclxufSkoKTtcclxuIl19
