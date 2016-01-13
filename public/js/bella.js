(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
	var data = {};
	var dataStore = {};
	var constants = {
		event: {
			USER_STATUS_CHANGE: 'USER_STATUS_CHANGE'
		},
		userStatus: {
			GUEST: 'GUEST',
			LOGGED_IN: 'LOGGED_IN'
		},
		response: {
			SUCCESS: 200,
			NOT_FOUND: 404
		}
	};

	function createData(dataName, dataValue) {
		if (data[dataName]) return;

		dataStore[dataName] = {
			data: dataValue,
			callbacks: []
		};

		data[dataName] = {
			get: function get() {
				return dataStore[dataName].data;
			},
			set: function set(value, emitter) {
				_.merge(dataStore[dataName].data, value);
				dataStore[dataName].callbacks.forEach(function (callback) {
					return callback(dataStore[dataName].data, emitter);
				});
			},
			subscribe: function subscribe(callback) {
				dataStore[dataName].callbacks.push(callback);
			}
		};
	}

	createData('user', {
		id: null,
		name: '',
		status: constants.userStatus.GUEST
	});

	window.bella = {
		constants: constants,
		data: data
	};
})();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvYmVsbGEvYmVsbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuXHR2YXIgZGF0YSA9IHt9O1xuXHR2YXIgZGF0YVN0b3JlID0ge307XG5cdHZhciBjb25zdGFudHMgPSB7XG5cdFx0ZXZlbnQ6IHtcblx0XHRcdFVTRVJfU1RBVFVTX0NIQU5HRTogJ1VTRVJfU1RBVFVTX0NIQU5HRSdcblx0XHR9LFxuXHRcdHVzZXJTdGF0dXM6IHtcblx0XHRcdEdVRVNUOiAnR1VFU1QnLFxuXHRcdFx0TE9HR0VEX0lOOiAnTE9HR0VEX0lOJ1xuXHRcdH0sXG5cdFx0cmVzcG9uc2U6IHtcblx0XHRcdFNVQ0NFU1M6IDIwMCxcblx0XHRcdE5PVF9GT1VORDogNDA0XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZURhdGEoZGF0YU5hbWUsIGRhdGFWYWx1ZSkge1xuXHRcdGlmIChkYXRhW2RhdGFOYW1lXSkgcmV0dXJuO1xuXG5cdFx0ZGF0YVN0b3JlW2RhdGFOYW1lXSA9IHtcblx0XHRcdGRhdGE6IGRhdGFWYWx1ZSxcblx0XHRcdGNhbGxiYWNrczogW11cblx0XHR9O1xuXG5cdFx0ZGF0YVtkYXRhTmFtZV0gPSB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGFTdG9yZVtkYXRhTmFtZV0uZGF0YTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSwgZW1pdHRlcikge1xuXHRcdFx0XHRfLm1lcmdlKGRhdGFTdG9yZVtkYXRhTmFtZV0uZGF0YSwgdmFsdWUpO1xuXHRcdFx0XHRkYXRhU3RvcmVbZGF0YU5hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhkYXRhU3RvcmVbZGF0YU5hbWVdLmRhdGEsIGVtaXR0ZXIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRzdWJzY3JpYmU6IGZ1bmN0aW9uIHN1YnNjcmliZShjYWxsYmFjaykge1xuXHRcdFx0XHRkYXRhU3RvcmVbZGF0YU5hbWVdLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Y3JlYXRlRGF0YSgndXNlcicsIHtcblx0XHRpZDogbnVsbCxcblx0XHRuYW1lOiAnJyxcblx0XHRzdGF0dXM6IGNvbnN0YW50cy51c2VyU3RhdHVzLkdVRVNUXG5cdH0pO1xuXG5cdHdpbmRvdy5iZWxsYSA9IHtcblx0XHRjb25zdGFudHM6IGNvbnN0YW50cyxcblx0XHRkYXRhOiBkYXRhXG5cdH07XG59KSgpOyJdfQ==
