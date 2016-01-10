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
		server: {
			result: {
				SUCCESS: 'SUCCESS',
				FAIL: 'FAIL'
			}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvYmVsbGEvYmVsbGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcblx0dmFyIGRhdGEgPSB7fTtcblx0dmFyIGRhdGFTdG9yZSA9IHt9O1xuXHR2YXIgY29uc3RhbnRzID0ge1xuXHRcdGV2ZW50OiB7XG5cdFx0XHRVU0VSX1NUQVRVU19DSEFOR0U6ICdVU0VSX1NUQVRVU19DSEFOR0UnXG5cdFx0fSxcblx0XHR1c2VyU3RhdHVzOiB7XG5cdFx0XHRHVUVTVDogJ0dVRVNUJyxcblx0XHRcdExPR0dFRF9JTjogJ0xPR0dFRF9JTidcblx0XHR9LFxuXHRcdHNlcnZlcjoge1xuXHRcdFx0cmVzdWx0OiB7XG5cdFx0XHRcdFNVQ0NFU1M6ICdTVUNDRVNTJyxcblx0XHRcdFx0RkFJTDogJ0ZBSUwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZURhdGEoZGF0YU5hbWUsIGRhdGFWYWx1ZSkge1xuXHRcdGlmIChkYXRhW2RhdGFOYW1lXSkgcmV0dXJuO1xuXG5cdFx0ZGF0YVN0b3JlW2RhdGFOYW1lXSA9IHtcblx0XHRcdGRhdGE6IGRhdGFWYWx1ZSxcblx0XHRcdGNhbGxiYWNrczogW11cblx0XHR9O1xuXG5cdFx0ZGF0YVtkYXRhTmFtZV0gPSB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGFTdG9yZVtkYXRhTmFtZV0uZGF0YTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSwgZW1pdHRlcikge1xuXHRcdFx0XHRfLm1lcmdlKGRhdGFTdG9yZVtkYXRhTmFtZV0uZGF0YSwgdmFsdWUpO1xuXHRcdFx0XHRkYXRhU3RvcmVbZGF0YU5hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayhkYXRhU3RvcmVbZGF0YU5hbWVdLmRhdGEsIGVtaXR0ZXIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRzdWJzY3JpYmU6IGZ1bmN0aW9uIHN1YnNjcmliZShjYWxsYmFjaykge1xuXHRcdFx0XHRkYXRhU3RvcmVbZGF0YU5hbWVdLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Y3JlYXRlRGF0YSgndXNlcicsIHtcblx0XHRpZDogbnVsbCxcblx0XHRuYW1lOiAnJyxcblx0XHRzdGF0dXM6IGNvbnN0YW50cy51c2VyU3RhdHVzLkdVRVNUXG5cdH0pO1xuXG5cdHdpbmRvdy5iZWxsYSA9IHtcblx0XHRjb25zdGFudHM6IGNvbnN0YW50cyxcblx0XHRkYXRhOiBkYXRhXG5cdH07XG59KSgpOyJdfQ==
