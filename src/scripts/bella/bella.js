(function() {
	var events = [];

	var event = {
		subscribe: function(name, callback) {
			events.push({
				name: name,
				callback: callback
			});
		},
		emit: function(name, options, emitter) {
			events.forEach(function(event) {
				if(event.name === name) {
					event.callback(options, emitter);
				}
			});
		}
	};

	window.bella = {
		event: event
	};
})();
