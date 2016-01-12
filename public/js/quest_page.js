(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cs = require('../helpers/cs');
var factory = require('../factory');
var statuses = {
	INIT: 'INIT',
	READY: 'READY',
	SAVING: 'SAVING',
	NOT_FOUND: 'NOT_FOUND',
	ERROR: 'ERROR'
};
var update = require('react-addons-update');

var QuestPage = React.createClass({
	displayName: 'QuestPage',

	getInitialState: function getInitialState() {
		return {
			status: statuses.INIT,
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
				if (response.result === bella.constants.server.result.SUCCESS) {
					_this.setState({
						quest: factory.quest(response.data.user, response.data),
						status: statuses.READY
					});
				} else if (response.result === bella.constants.server.result.FAIL) {
					_this.setState({
						status: statuses.NOT_FOUND
					});
				} else {
					console.error('Quest request error');
					_this.setState({
						status: statuses.ERROR
					});
				}
			});
		} else {
			this.setState({
				quest: factory.quest(bella.data.user.get()),
				status: statuses.READY
			});
		}
	},
	render: function render() {
		var page;

		if (this.state.status === statuses.INIT) {
			page = React.createElement(
				'div',
				null,
				'init'
			);
		} else if (this.state.status === statuses.NOT_FOUND) {
			page = React.createElement(
				'div',
				null,
				'not found'
			);
		} else if (this.state.status === statuses.ERROR) {
			page = React.createElement(
				'div',
				null,
				'error'
			);
		} else if (this.state.status === statuses.SAVING) {
			page = React.createElement(
				'div',
				null,
				'saving'
			);
		} else if (this.state.status === statuses.READY) {
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
					own: this.state.quest.user && this.state.quest.user.id === cs.cookie('user_id', document.cookie),
					loggedIn: this.state.loggedIn,
					save: this.save })
			);
		}

		return page;
	},
	save: function save(title, description) {
		this.setState({ status: statuses.SAVING });

		cs.post('/quest', update(this.state.quest, { title: { $set: title }, description: { $set: description } }), function (response) {
			if (response.result === bella.constants.server.result.SUCCESS) {
				window.location.href = '/quest_list.html';
				//this.setState({
				//	quest: factory.quest(response.data.user, response.data),
				//	status: statuses.READY
				//});
			}
			if (response.result === bella.constants.server.result.FAIL) {
				console.error('post quest error');
			}
		});
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
		var saveButton = this.props.quest.dirty || this.state.edit ? React.createElement(
			'button',
			{ onClick: this.save },
			'Save'
		) : null;
		var title = this.state.edit ? React.createElement('input', { type: 'text', defaultValue: this.props.quest.title, ref: 'title' }) : React.createElement(
			'span',
			null,
			this.props.quest.title
		);
		var description = this.state.edit ? React.createElement('textarea', { cols: '30', rows: '10', defaultValue: this.props.quest.description, ref: 'description' }) : React.createElement(
			'span',
			null,
			this.props.quest.description
		);
		var user = this.props.quest.user.id ? React.createElement(
			'tr',
			null,
			React.createElement(
				'td',
				null,
				'user:'
			),
			React.createElement(
				'td',
				null,
				this.props.quest.user.name
			)
		) : null;

		return React.createElement(
			'div',
			null,
			React.createElement(
				'table',
				null,
				React.createElement(
					'tbody',
					null,
					user,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							null,
							'title:'
						),
						React.createElement(
							'td',
							null,
							title
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							null,
							'description:'
						),
						React.createElement(
							'td',
							null,
							description
						)
					),
					React.createElement(
						'tr',
						null,
						React.createElement(
							'td',
							null,
							saveButton,
							toggleEditButton
						)
					)
				)
			)
		);
	},
	toggleEdit: function toggleEdit() {
		this.setState({ edit: !this.state.edit });
	},
	save: function save() {
		this.props.save(this.refs.title.value, this.refs.description.value);
		this.setState({ edit: false });
	}
});

ReactDOM.render(React.createElement(QuestPage, null), document.getElementById('main-section'));
},{"../factory":8,"../helpers/cs":9,"react-addons-update":3}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
module.exports = require('react/lib/update');
},{"react/lib/update":7}],4:[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Object.assign
 */

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

function assign(target, sources) {
  if (target == null) {
    throw new TypeError('Object.assign target cannot be null or undefined');
  }

  var to = Object(target);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    var from = Object(nextSource);

    // We don't currently support accessors nor proxies. Therefore this
    // copy cannot throw. If we ever supported this then we must handle
    // exceptions and side-effects. We don't support symbols so they won't
    // be transferred.

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  return to;
};

module.exports = assign;

},{}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvaW52YXJpYW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iXX0=
},{"_process":2}],6:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],7:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule update
 */

"use strict";

var assign = require("./Object.assign");
var keyOf = require("./keyOf");
var invariant = require("./invariant");

function shallowCopy(x) {
  if (Array.isArray(x)) {
    return x.concat();
  } else if (x && typeof x === 'object') {
    return assign(new x.constructor(), x);
  } else {
    return x;
  }
}

var COMMAND_PUSH = keyOf({$push: null});
var COMMAND_UNSHIFT = keyOf({$unshift: null});
var COMMAND_SPLICE = keyOf({$splice: null});
var COMMAND_SET = keyOf({$set: null});
var COMMAND_MERGE = keyOf({$merge: null});
var COMMAND_APPLY = keyOf({$apply: null});

var ALL_COMMANDS_LIST = [
  COMMAND_PUSH,
  COMMAND_UNSHIFT,
  COMMAND_SPLICE,
  COMMAND_SET,
  COMMAND_MERGE,
  COMMAND_APPLY
];

var ALL_COMMANDS_SET = {};

ALL_COMMANDS_LIST.forEach(function(command) {
  ALL_COMMANDS_SET[command] = true;
});

function invariantArrayCase(value, spec, command) {
  ("production" !== process.env.NODE_ENV ? invariant(
    Array.isArray(value),
    'update(): expected target of %s to be an array; got %s.',
    command,
    value
  ) : invariant(Array.isArray(value)));
  var specValue = spec[command];
  ("production" !== process.env.NODE_ENV ? invariant(
    Array.isArray(specValue),
    'update(): expected spec of %s to be an array; got %s. ' +
    'Did you forget to wrap your parameter in an array?',
    command,
    specValue
  ) : invariant(Array.isArray(specValue)));
}

function update(value, spec) {
  ("production" !== process.env.NODE_ENV ? invariant(
    typeof spec === 'object',
    'update(): You provided a key path to update() that did not contain one ' +
    'of %s. Did you forget to include {%s: ...}?',
    ALL_COMMANDS_LIST.join(', '),
    COMMAND_SET
  ) : invariant(typeof spec === 'object'));

  if (spec.hasOwnProperty(COMMAND_SET)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Object.keys(spec).length === 1,
      'Cannot have more than one key in an object with %s',
      COMMAND_SET
    ) : invariant(Object.keys(spec).length === 1));

    return spec[COMMAND_SET];
  }

  var nextValue = shallowCopy(value);

  if (spec.hasOwnProperty(COMMAND_MERGE)) {
    var mergeObj = spec[COMMAND_MERGE];
    ("production" !== process.env.NODE_ENV ? invariant(
      mergeObj && typeof mergeObj === 'object',
      'update(): %s expects a spec of type \'object\'; got %s',
      COMMAND_MERGE,
      mergeObj
    ) : invariant(mergeObj && typeof mergeObj === 'object'));
    ("production" !== process.env.NODE_ENV ? invariant(
      nextValue && typeof nextValue === 'object',
      'update(): %s expects a target of type \'object\'; got %s',
      COMMAND_MERGE,
      nextValue
    ) : invariant(nextValue && typeof nextValue === 'object'));
    assign(nextValue, spec[COMMAND_MERGE]);
  }

  if (spec.hasOwnProperty(COMMAND_PUSH)) {
    invariantArrayCase(value, spec, COMMAND_PUSH);
    spec[COMMAND_PUSH].forEach(function(item) {
      nextValue.push(item);
    });
  }

  if (spec.hasOwnProperty(COMMAND_UNSHIFT)) {
    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
    spec[COMMAND_UNSHIFT].forEach(function(item) {
      nextValue.unshift(item);
    });
  }

  if (spec.hasOwnProperty(COMMAND_SPLICE)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(value),
      'Expected %s target to be an array; got %s',
      COMMAND_SPLICE,
      value
    ) : invariant(Array.isArray(value)));
    ("production" !== process.env.NODE_ENV ? invariant(
      Array.isArray(spec[COMMAND_SPLICE]),
      'update(): expected spec of %s to be an array of arrays; got %s. ' +
      'Did you forget to wrap your parameters in an array?',
      COMMAND_SPLICE,
      spec[COMMAND_SPLICE]
    ) : invariant(Array.isArray(spec[COMMAND_SPLICE])));
    spec[COMMAND_SPLICE].forEach(function(args) {
      ("production" !== process.env.NODE_ENV ? invariant(
        Array.isArray(args),
        'update(): expected spec of %s to be an array of arrays; got %s. ' +
        'Did you forget to wrap your parameters in an array?',
        COMMAND_SPLICE,
        spec[COMMAND_SPLICE]
      ) : invariant(Array.isArray(args)));
      nextValue.splice.apply(nextValue, args);
    });
  }

  if (spec.hasOwnProperty(COMMAND_APPLY)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof spec[COMMAND_APPLY] === 'function',
      'update(): expected spec of %s to be a function; got %s.',
      COMMAND_APPLY,
      spec[COMMAND_APPLY]
    ) : invariant(typeof spec[COMMAND_APPLY] === 'function'));
    nextValue = spec[COMMAND_APPLY](nextValue);
  }

  for (var k in spec) {
    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
      nextValue[k] = update(value[k], spec[k]);
    }
  }

  return nextValue;
}

module.exports = update;

}).call(this,require('_process'))
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvdXBkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSB1cGRhdGVcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGFzc2lnbiA9IHJlcXVpcmUoXCIuL09iamVjdC5hc3NpZ25cIik7XG52YXIga2V5T2YgPSByZXF1aXJlKFwiLi9rZXlPZlwiKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKFwiLi9pbnZhcmlhbnRcIik7XG5cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KHgpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICByZXR1cm4geC5jb25jYXQoKTtcbiAgfSBlbHNlIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBhc3NpZ24obmV3IHguY29uc3RydWN0b3IoKSwgeCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cbn1cblxudmFyIENPTU1BTkRfUFVTSCA9IGtleU9mKHskcHVzaDogbnVsbH0pO1xudmFyIENPTU1BTkRfVU5TSElGVCA9IGtleU9mKHskdW5zaGlmdDogbnVsbH0pO1xudmFyIENPTU1BTkRfU1BMSUNFID0ga2V5T2YoeyRzcGxpY2U6IG51bGx9KTtcbnZhciBDT01NQU5EX1NFVCA9IGtleU9mKHskc2V0OiBudWxsfSk7XG52YXIgQ09NTUFORF9NRVJHRSA9IGtleU9mKHskbWVyZ2U6IG51bGx9KTtcbnZhciBDT01NQU5EX0FQUExZID0ga2V5T2YoeyRhcHBseTogbnVsbH0pO1xuXG52YXIgQUxMX0NPTU1BTkRTX0xJU1QgPSBbXG4gIENPTU1BTkRfUFVTSCxcbiAgQ09NTUFORF9VTlNISUZULFxuICBDT01NQU5EX1NQTElDRSxcbiAgQ09NTUFORF9TRVQsXG4gIENPTU1BTkRfTUVSR0UsXG4gIENPTU1BTkRfQVBQTFlcbl07XG5cbnZhciBBTExfQ09NTUFORFNfU0VUID0ge307XG5cbkFMTF9DT01NQU5EU19MSVNULmZvckVhY2goZnVuY3Rpb24oY29tbWFuZCkge1xuICBBTExfQ09NTUFORFNfU0VUW2NvbW1hbmRdID0gdHJ1ZTtcbn0pO1xuXG5mdW5jdGlvbiBpbnZhcmlhbnRBcnJheUNhc2UodmFsdWUsIHNwZWMsIGNvbW1hbmQpIHtcbiAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICBBcnJheS5pc0FycmF5KHZhbHVlKSxcbiAgICAndXBkYXRlKCk6IGV4cGVjdGVkIHRhcmdldCBvZiAlcyB0byBiZSBhbiBhcnJheTsgZ290ICVzLicsXG4gICAgY29tbWFuZCxcbiAgICB2YWx1ZVxuICApIDogaW52YXJpYW50KEFycmF5LmlzQXJyYXkodmFsdWUpKSk7XG4gIHZhciBzcGVjVmFsdWUgPSBzcGVjW2NvbW1hbmRdO1xuICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgIEFycmF5LmlzQXJyYXkoc3BlY1ZhbHVlKSxcbiAgICAndXBkYXRlKCk6IGV4cGVjdGVkIHNwZWMgb2YgJXMgdG8gYmUgYW4gYXJyYXk7IGdvdCAlcy4gJyArXG4gICAgJ0RpZCB5b3UgZm9yZ2V0IHRvIHdyYXAgeW91ciBwYXJhbWV0ZXIgaW4gYW4gYXJyYXk/JyxcbiAgICBjb21tYW5kLFxuICAgIHNwZWNWYWx1ZVxuICApIDogaW52YXJpYW50KEFycmF5LmlzQXJyYXkoc3BlY1ZhbHVlKSkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUodmFsdWUsIHNwZWMpIHtcbiAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICB0eXBlb2Ygc3BlYyA9PT0gJ29iamVjdCcsXG4gICAgJ3VwZGF0ZSgpOiBZb3UgcHJvdmlkZWQgYSBrZXkgcGF0aCB0byB1cGRhdGUoKSB0aGF0IGRpZCBub3QgY29udGFpbiBvbmUgJyArXG4gICAgJ29mICVzLiBEaWQgeW91IGZvcmdldCB0byBpbmNsdWRlIHslczogLi4ufT8nLFxuICAgIEFMTF9DT01NQU5EU19MSVNULmpvaW4oJywgJyksXG4gICAgQ09NTUFORF9TRVRcbiAgKSA6IGludmFyaWFudCh0eXBlb2Ygc3BlYyA9PT0gJ29iamVjdCcpKTtcblxuICBpZiAoc3BlYy5oYXNPd25Qcm9wZXJ0eShDT01NQU5EX1NFVCkpIHtcbiAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgT2JqZWN0LmtleXMoc3BlYykubGVuZ3RoID09PSAxLFxuICAgICAgJ0Nhbm5vdCBoYXZlIG1vcmUgdGhhbiBvbmUga2V5IGluIGFuIG9iamVjdCB3aXRoICVzJyxcbiAgICAgIENPTU1BTkRfU0VUXG4gICAgKSA6IGludmFyaWFudChPYmplY3Qua2V5cyhzcGVjKS5sZW5ndGggPT09IDEpKTtcblxuICAgIHJldHVybiBzcGVjW0NPTU1BTkRfU0VUXTtcbiAgfVxuXG4gIHZhciBuZXh0VmFsdWUgPSBzaGFsbG93Q29weSh2YWx1ZSk7XG5cbiAgaWYgKHNwZWMuaGFzT3duUHJvcGVydHkoQ09NTUFORF9NRVJHRSkpIHtcbiAgICB2YXIgbWVyZ2VPYmogPSBzcGVjW0NPTU1BTkRfTUVSR0VdO1xuICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICBtZXJnZU9iaiAmJiB0eXBlb2YgbWVyZ2VPYmogPT09ICdvYmplY3QnLFxuICAgICAgJ3VwZGF0ZSgpOiAlcyBleHBlY3RzIGEgc3BlYyBvZiB0eXBlIFxcJ29iamVjdFxcJzsgZ290ICVzJyxcbiAgICAgIENPTU1BTkRfTUVSR0UsXG4gICAgICBtZXJnZU9ialxuICAgICkgOiBpbnZhcmlhbnQobWVyZ2VPYmogJiYgdHlwZW9mIG1lcmdlT2JqID09PSAnb2JqZWN0JykpO1xuICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICBuZXh0VmFsdWUgJiYgdHlwZW9mIG5leHRWYWx1ZSA9PT0gJ29iamVjdCcsXG4gICAgICAndXBkYXRlKCk6ICVzIGV4cGVjdHMgYSB0YXJnZXQgb2YgdHlwZSBcXCdvYmplY3RcXCc7IGdvdCAlcycsXG4gICAgICBDT01NQU5EX01FUkdFLFxuICAgICAgbmV4dFZhbHVlXG4gICAgKSA6IGludmFyaWFudChuZXh0VmFsdWUgJiYgdHlwZW9mIG5leHRWYWx1ZSA9PT0gJ29iamVjdCcpKTtcbiAgICBhc3NpZ24obmV4dFZhbHVlLCBzcGVjW0NPTU1BTkRfTUVSR0VdKTtcbiAgfVxuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KENPTU1BTkRfUFVTSCkpIHtcbiAgICBpbnZhcmlhbnRBcnJheUNhc2UodmFsdWUsIHNwZWMsIENPTU1BTkRfUFVTSCk7XG4gICAgc3BlY1tDT01NQU5EX1BVU0hdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgbmV4dFZhbHVlLnB1c2goaXRlbSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoc3BlYy5oYXNPd25Qcm9wZXJ0eShDT01NQU5EX1VOU0hJRlQpKSB7XG4gICAgaW52YXJpYW50QXJyYXlDYXNlKHZhbHVlLCBzcGVjLCBDT01NQU5EX1VOU0hJRlQpO1xuICAgIHNwZWNbQ09NTUFORF9VTlNISUZUXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIG5leHRWYWx1ZS51bnNoaWZ0KGl0ZW0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHNwZWMuaGFzT3duUHJvcGVydHkoQ09NTUFORF9TUExJQ0UpKSB7XG4gICAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpLFxuICAgICAgJ0V4cGVjdGVkICVzIHRhcmdldCB0byBiZSBhbiBhcnJheTsgZ290ICVzJyxcbiAgICAgIENPTU1BTkRfU1BMSUNFLFxuICAgICAgdmFsdWVcbiAgICApIDogaW52YXJpYW50KEFycmF5LmlzQXJyYXkodmFsdWUpKSk7XG4gICAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICAgIEFycmF5LmlzQXJyYXkoc3BlY1tDT01NQU5EX1NQTElDRV0pLFxuICAgICAgJ3VwZGF0ZSgpOiBleHBlY3RlZCBzcGVjIG9mICVzIHRvIGJlIGFuIGFycmF5IG9mIGFycmF5czsgZ290ICVzLiAnICtcbiAgICAgICdEaWQgeW91IGZvcmdldCB0byB3cmFwIHlvdXIgcGFyYW1ldGVycyBpbiBhbiBhcnJheT8nLFxuICAgICAgQ09NTUFORF9TUExJQ0UsXG4gICAgICBzcGVjW0NPTU1BTkRfU1BMSUNFXVxuICAgICkgOiBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShzcGVjW0NPTU1BTkRfU1BMSUNFXSkpKTtcbiAgICBzcGVjW0NPTU1BTkRfU1BMSUNFXS5mb3JFYWNoKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICAgIEFycmF5LmlzQXJyYXkoYXJncyksXG4gICAgICAgICd1cGRhdGUoKTogZXhwZWN0ZWQgc3BlYyBvZiAlcyB0byBiZSBhbiBhcnJheSBvZiBhcnJheXM7IGdvdCAlcy4gJyArXG4gICAgICAgICdEaWQgeW91IGZvcmdldCB0byB3cmFwIHlvdXIgcGFyYW1ldGVycyBpbiBhbiBhcnJheT8nLFxuICAgICAgICBDT01NQU5EX1NQTElDRSxcbiAgICAgICAgc3BlY1tDT01NQU5EX1NQTElDRV1cbiAgICAgICkgOiBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShhcmdzKSkpO1xuICAgICAgbmV4dFZhbHVlLnNwbGljZS5hcHBseShuZXh0VmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHNwZWMuaGFzT3duUHJvcGVydHkoQ09NTUFORF9BUFBMWSkpIHtcbiAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgdHlwZW9mIHNwZWNbQ09NTUFORF9BUFBMWV0gPT09ICdmdW5jdGlvbicsXG4gICAgICAndXBkYXRlKCk6IGV4cGVjdGVkIHNwZWMgb2YgJXMgdG8gYmUgYSBmdW5jdGlvbjsgZ290ICVzLicsXG4gICAgICBDT01NQU5EX0FQUExZLFxuICAgICAgc3BlY1tDT01NQU5EX0FQUExZXVxuICAgICkgOiBpbnZhcmlhbnQodHlwZW9mIHNwZWNbQ09NTUFORF9BUFBMWV0gPT09ICdmdW5jdGlvbicpKTtcbiAgICBuZXh0VmFsdWUgPSBzcGVjW0NPTU1BTkRfQVBQTFldKG5leHRWYWx1ZSk7XG4gIH1cblxuICBmb3IgKHZhciBrIGluIHNwZWMpIHtcbiAgICBpZiAoIShBTExfQ09NTUFORFNfU0VULmhhc093blByb3BlcnR5KGspICYmIEFMTF9DT01NQU5EU19TRVRba10pKSB7XG4gICAgICBuZXh0VmFsdWVba10gPSB1cGRhdGUodmFsdWVba10sIHNwZWNba10pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXh0VmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlO1xuIl19
},{"./Object.assign":4,"./invariant":5,"./keyOf":6,"_process":2}],8:[function(require,module,exports){
'use strict';

module.exports = {
	quest: function quest(user, _quest) {
		var result = {
			user: {
				id: user.id,
				name: user.name
			}
		};

		if (_quest) {
			result.id = _quest.id;
			result.title = _quest.title;
			result.description = _quest.description;
			result.dirty = false;
		} else {
			result.id = null;
			result.title = '';
			result.description = '';
			result.dirty = true;
		}

		return result;
	}
};
},{}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL3NjcmlwdHMvcXVlc3RfcGFnZS9xdWVzdF9wYWdlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC1hZGRvbnMtdXBkYXRlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9PYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL2tleU9mLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi91cGRhdGUuanMiLCJzcmMvc2NyaXB0cy9mYWN0b3J5LmpzIiwic3JjL3NjcmlwdHMvaGVscGVycy9jcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcyA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvY3MnKTtcbnZhciBmYWN0b3J5ID0gcmVxdWlyZSgnLi4vZmFjdG9yeScpO1xudmFyIHN0YXR1c2VzID0ge1xuXHRJTklUOiAnSU5JVCcsXG5cdFJFQURZOiAnUkVBRFknLFxuXHRTQVZJTkc6ICdTQVZJTkcnLFxuXHROT1RfRk9VTkQ6ICdOT1RfRk9VTkQnLFxuXHRFUlJPUjogJ0VSUk9SJ1xufTtcbnZhciB1cGRhdGUgPSByZXF1aXJlKCdyZWFjdC1hZGRvbnMtdXBkYXRlJyk7XG5cbnZhciBRdWVzdFBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGRpc3BsYXlOYW1lOiAnUXVlc3RQYWdlJyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3RhdHVzOiBzdGF0dXNlcy5JTklULFxuXHRcdFx0cXVlc3Q6IHt9LFxuXHRcdFx0bG9nZ2VkSW46IGJlbGxhLmRhdGEudXNlci5zdGF0dXMgPT09IGJlbGxhLmNvbnN0YW50cy51c2VyU3RhdHVzLkxPR0dFRF9JTlxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0dmFyIHF1ZXN0SWQgPSBjcy5nZXRRdWVyeVZhbHVlKGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaCwgJ3F1ZXN0X2lkJyk7XG5cblx0XHRiZWxsYS5kYXRhLnVzZXIuc3Vic2NyaWJlKGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRfdGhpcy5zZXRTdGF0ZSh7IGxvZ2dlZEluOiB1c2VyLnN0YXR1cyA9PT0gYmVsbGEuY29uc3RhbnRzLnVzZXJTdGF0dXMuTE9HR0VEX0lOIH0pO1xuXHRcdH0pO1xuXG5cdFx0aWYgKHF1ZXN0SWQpIHtcblx0XHRcdGNzLmdldCgnL3F1ZXN0P3F1ZXN0X2lkPScgKyBxdWVzdElkLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnJlc3VsdCA9PT0gYmVsbGEuY29uc3RhbnRzLnNlcnZlci5yZXN1bHQuU1VDQ0VTUykge1xuXHRcdFx0XHRcdF90aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0XHRcdHF1ZXN0OiBmYWN0b3J5LnF1ZXN0KHJlc3BvbnNlLmRhdGEudXNlciwgcmVzcG9uc2UuZGF0YSksXG5cdFx0XHRcdFx0XHRzdGF0dXM6IHN0YXR1c2VzLlJFQURZXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVzcG9uc2UucmVzdWx0ID09PSBiZWxsYS5jb25zdGFudHMuc2VydmVyLnJlc3VsdC5GQUlMKSB7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0c3RhdHVzOiBzdGF0dXNlcy5OT1RfRk9VTkRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdRdWVzdCByZXF1ZXN0IGVycm9yJyk7XG5cdFx0XHRcdFx0X3RoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRcdFx0c3RhdHVzOiBzdGF0dXNlcy5FUlJPUlxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdHF1ZXN0OiBmYWN0b3J5LnF1ZXN0KGJlbGxhLmRhdGEudXNlci5nZXQoKSksXG5cdFx0XHRcdHN0YXR1czogc3RhdHVzZXMuUkVBRFlcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cdFx0dmFyIHBhZ2U7XG5cblx0XHRpZiAodGhpcy5zdGF0ZS5zdGF0dXMgPT09IHN0YXR1c2VzLklOSVQpIHtcblx0XHRcdHBhZ2UgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHQnZGl2Jyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J2luaXQnXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zdGF0dXMgPT09IHN0YXR1c2VzLk5PVF9GT1VORCkge1xuXHRcdFx0cGFnZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnbm90IGZvdW5kJ1xuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc3RhdHVzID09PSBzdGF0dXNlcy5FUlJPUikge1xuXHRcdFx0cGFnZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnZXJyb3InXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zdGF0dXMgPT09IHN0YXR1c2VzLlNBVklORykge1xuXHRcdFx0cGFnZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHRudWxsLFxuXHRcdFx0XHQnc2F2aW5nJ1xuXHRcdFx0KTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc3RhdHVzID09PSBzdGF0dXNlcy5SRUFEWSkge1xuXHRcdFx0cGFnZSA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCdkaXYnLFxuXHRcdFx0XHR7IGNsYXNzTmFtZTogJ2JjLXF1ZXN0LXBhZ2UnIH0sXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J2gxJyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdCdRdWVzdCdcblx0XHRcdFx0KSxcblx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChSQ1F1ZXN0LCB7XG5cdFx0XHRcdFx0cXVlc3Q6IHRoaXMuc3RhdGUucXVlc3QsXG5cdFx0XHRcdFx0b3duOiB0aGlzLnN0YXRlLnF1ZXN0LnVzZXIgJiYgdGhpcy5zdGF0ZS5xdWVzdC51c2VyLmlkID09PSBjcy5jb29raWUoJ3VzZXJfaWQnLCBkb2N1bWVudC5jb29raWUpLFxuXHRcdFx0XHRcdGxvZ2dlZEluOiB0aGlzLnN0YXRlLmxvZ2dlZEluLFxuXHRcdFx0XHRcdHNhdmU6IHRoaXMuc2F2ZSB9KVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGFnZTtcblx0fSxcblx0c2F2ZTogZnVuY3Rpb24gc2F2ZSh0aXRsZSwgZGVzY3JpcHRpb24pIHtcblx0XHR0aGlzLnNldFN0YXRlKHsgc3RhdHVzOiBzdGF0dXNlcy5TQVZJTkcgfSk7XG5cblx0XHRjcy5wb3N0KCcvcXVlc3QnLCB1cGRhdGUodGhpcy5zdGF0ZS5xdWVzdCwgeyB0aXRsZTogeyAkc2V0OiB0aXRsZSB9LCBkZXNjcmlwdGlvbjogeyAkc2V0OiBkZXNjcmlwdGlvbiB9IH0pLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdGlmIChyZXNwb25zZS5yZXN1bHQgPT09IGJlbGxhLmNvbnN0YW50cy5zZXJ2ZXIucmVzdWx0LlNVQ0NFU1MpIHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3F1ZXN0X2xpc3QuaHRtbCc7XG5cdFx0XHRcdC8vdGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdC8vXHRxdWVzdDogZmFjdG9yeS5xdWVzdChyZXNwb25zZS5kYXRhLnVzZXIsIHJlc3BvbnNlLmRhdGEpLFxuXHRcdFx0XHQvL1x0c3RhdHVzOiBzdGF0dXNlcy5SRUFEWVxuXHRcdFx0XHQvL30pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJlc3BvbnNlLnJlc3VsdCA9PT0gYmVsbGEuY29uc3RhbnRzLnNlcnZlci5yZXN1bHQuRkFJTCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdwb3N0IHF1ZXN0IGVycm9yJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pO1xuXG52YXIgUkNRdWVzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0ZGlzcGxheU5hbWU6ICdSQ1F1ZXN0JyxcblxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4geyBlZGl0OiAhdGhpcy5wcm9wcy5xdWVzdC5pZCB9O1xuXHR9LFxuXHRyZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblx0XHR2YXIgdG9nZ2xlRWRpdEJ1dHRvbiA9IHRoaXMucHJvcHMub3duICYmIHRoaXMucHJvcHMubG9nZ2VkSW4gPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J2J1dHRvbicsXG5cdFx0XHR7IG9uQ2xpY2s6IHRoaXMudG9nZ2xlRWRpdCB9LFxuXHRcdFx0dGhpcy5zdGF0ZS5lZGl0ID8gJ0NhbmNlbCcgOiAnRWRpdCdcblx0XHQpIDogbnVsbDtcblx0XHR2YXIgc2F2ZUJ1dHRvbiA9IHRoaXMucHJvcHMucXVlc3QuZGlydHkgfHwgdGhpcy5zdGF0ZS5lZGl0ID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdidXR0b24nLFxuXHRcdFx0eyBvbkNsaWNrOiB0aGlzLnNhdmUgfSxcblx0XHRcdCdTYXZlJ1xuXHRcdCkgOiBudWxsO1xuXHRcdHZhciB0aXRsZSA9IHRoaXMuc3RhdGUuZWRpdCA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIGRlZmF1bHRWYWx1ZTogdGhpcy5wcm9wcy5xdWVzdC50aXRsZSwgcmVmOiAndGl0bGUnIH0pIDogUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdzcGFuJyxcblx0XHRcdG51bGwsXG5cdFx0XHR0aGlzLnByb3BzLnF1ZXN0LnRpdGxlXG5cdFx0KTtcblx0XHR2YXIgZGVzY3JpcHRpb24gPSB0aGlzLnN0YXRlLmVkaXQgPyBSZWFjdC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScsIHsgY29sczogJzMwJywgcm93czogJzEwJywgZGVmYXVsdFZhbHVlOiB0aGlzLnByb3BzLnF1ZXN0LmRlc2NyaXB0aW9uLCByZWY6ICdkZXNjcmlwdGlvbicgfSkgOiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0J3NwYW4nLFxuXHRcdFx0bnVsbCxcblx0XHRcdHRoaXMucHJvcHMucXVlc3QuZGVzY3JpcHRpb25cblx0XHQpO1xuXHRcdHZhciB1c2VyID0gdGhpcy5wcm9wcy5xdWVzdC51c2VyLmlkID8gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCd0cicsXG5cdFx0XHRudWxsLFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0J3RkJyxcblx0XHRcdFx0bnVsbCxcblx0XHRcdFx0J3VzZXI6J1xuXHRcdFx0KSxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCd0ZCcsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdHRoaXMucHJvcHMucXVlc3QudXNlci5uYW1lXG5cdFx0XHQpXG5cdFx0KSA6IG51bGw7XG5cblx0XHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdCdkaXYnLFxuXHRcdFx0bnVsbCxcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdCd0YWJsZScsXG5cdFx0XHRcdG51bGwsXG5cdFx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG5cdFx0XHRcdFx0J3Rib2R5Jyxcblx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdHVzZXIsXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCd0cicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFx0J3RkJyxcblx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0J3RpdGxlOidcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0XHQndGQnLFxuXHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHR0aXRsZVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCd0cicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFx0J3RkJyxcblx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0J2Rlc2NyaXB0aW9uOidcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFxuXHRcdFx0XHRcdFx0XHQndGQnLFxuXHRcdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvblxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdCd0cicsXG5cdFx0XHRcdFx0XHRudWxsLFxuXHRcdFx0XHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcblx0XHRcdFx0XHRcdFx0J3RkJyxcblx0XHRcdFx0XHRcdFx0bnVsbCxcblx0XHRcdFx0XHRcdFx0c2F2ZUJ1dHRvbixcblx0XHRcdFx0XHRcdFx0dG9nZ2xlRWRpdEJ1dHRvblxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdCk7XG5cdH0sXG5cdHRvZ2dsZUVkaXQ6IGZ1bmN0aW9uIHRvZ2dsZUVkaXQoKSB7XG5cdFx0dGhpcy5zZXRTdGF0ZSh7IGVkaXQ6ICF0aGlzLnN0YXRlLmVkaXQgfSk7XG5cdH0sXG5cdHNhdmU6IGZ1bmN0aW9uIHNhdmUoKSB7XG5cdFx0dGhpcy5wcm9wcy5zYXZlKHRoaXMucmVmcy50aXRsZS52YWx1ZSwgdGhpcy5yZWZzLmRlc2NyaXB0aW9uLnZhbHVlKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgZWRpdDogZmFsc2UgfSk7XG5cdH1cbn0pO1xuXG5SZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChRdWVzdFBhZ2UsIG51bGwpLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1zZWN0aW9uJykpOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ3JlYWN0L2xpYi91cGRhdGUnKTsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIE9iamVjdC5hc3NpZ25cbiAqL1xuXG4vLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LmFzc2lnblxuXG5mdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2VzKSB7XG4gIGlmICh0YXJnZXQgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gdGFyZ2V0IGNhbm5vdCBiZSBudWxsIG9yIHVuZGVmaW5lZCcpO1xuICB9XG5cbiAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgZm9yICh2YXIgbmV4dEluZGV4ID0gMTsgbmV4dEluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgbmV4dEluZGV4KyspIHtcbiAgICB2YXIgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tuZXh0SW5kZXhdO1xuICAgIGlmIChuZXh0U291cmNlID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBmcm9tID0gT2JqZWN0KG5leHRTb3VyY2UpO1xuXG4gICAgLy8gV2UgZG9uJ3QgY3VycmVudGx5IHN1cHBvcnQgYWNjZXNzb3JzIG5vciBwcm94aWVzLiBUaGVyZWZvcmUgdGhpc1xuICAgIC8vIGNvcHkgY2Fubm90IHRocm93LiBJZiB3ZSBldmVyIHN1cHBvcnRlZCB0aGlzIHRoZW4gd2UgbXVzdCBoYW5kbGVcbiAgICAvLyBleGNlcHRpb25zIGFuZCBzaWRlLWVmZmVjdHMuIFdlIGRvbid0IHN1cHBvcnQgc3ltYm9scyBzbyB0aGV5IHdvbid0XG4gICAgLy8gYmUgdHJhbnNmZXJyZWQuXG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuICAgICAgICB0b1trZXldID0gZnJvbVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0bztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduO1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKCdfcHJvY2VzcycpKVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OXlaV0ZqZEM5c2FXSXZhVzUyWVhKcFlXNTBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1EyOXdlWEpwWjJoMElESXdNVE10TWpBeE5Dd2dSbUZqWldKdmIyc3NJRWx1WXk1Y2JpQXFJRUZzYkNCeWFXZG9kSE1nY21WelpYSjJaV1F1WEc0Z0tseHVJQ29nVkdocGN5QnpiM1Z5WTJVZ1kyOWtaU0JwY3lCc2FXTmxibk5sWkNCMWJtUmxjaUIwYUdVZ1FsTkVMWE4wZVd4bElHeHBZMlZ1YzJVZ1ptOTFibVFnYVc0Z2RHaGxYRzRnS2lCTVNVTkZUbE5GSUdacGJHVWdhVzRnZEdobElISnZiM1FnWkdseVpXTjBiM0o1SUc5bUlIUm9hWE1nYzI5MWNtTmxJSFJ5WldVdUlFRnVJR0ZrWkdsMGFXOXVZV3dnWjNKaGJuUmNiaUFxSUc5bUlIQmhkR1Z1ZENCeWFXZG9kSE1nWTJGdUlHSmxJR1p2ZFc1a0lHbHVJSFJvWlNCUVFWUkZUbFJUSUdacGJHVWdhVzRnZEdobElITmhiV1VnWkdseVpXTjBiM0o1TGx4dUlDcGNiaUFxSUVCd2NtOTJhV1JsYzAxdlpIVnNaU0JwYm5aaGNtbGhiblJjYmlBcUwxeHVYRzVjSW5WelpTQnpkSEpwWTNSY0lqdGNibHh1THlvcVhHNGdLaUJWYzJVZ2FXNTJZWEpwWVc1MEtDa2dkRzhnWVhOelpYSjBJSE4wWVhSbElIZG9hV05vSUhsdmRYSWdjSEp2WjNKaGJTQmhjM04xYldWeklIUnZJR0psSUhSeWRXVXVYRzRnS2x4dUlDb2dVSEp2ZG1sa1pTQnpjSEpwYm5SbUxYTjBlV3hsSUdadmNtMWhkQ0FvYjI1c2VTQWxjeUJwY3lCemRYQndiM0owWldRcElHRnVaQ0JoY21kMWJXVnVkSE5jYmlBcUlIUnZJSEJ5YjNacFpHVWdhVzVtYjNKdFlYUnBiMjRnWVdKdmRYUWdkMmhoZENCaWNtOXJaU0JoYm1RZ2QyaGhkQ0I1YjNVZ2QyVnlaVnh1SUNvZ1pYaHdaV04wYVc1bkxseHVJQ3BjYmlBcUlGUm9aU0JwYm5aaGNtbGhiblFnYldWemMyRm5aU0IzYVd4c0lHSmxJSE4wY21sd2NHVmtJR2x1SUhCeWIyUjFZM1JwYjI0c0lHSjFkQ0IwYUdVZ2FXNTJZWEpwWVc1MFhHNGdLaUIzYVd4c0lISmxiV0ZwYmlCMGJ5Qmxibk4xY21VZ2JHOW5hV01nWkc5bGN5QnViM1FnWkdsbVptVnlJR2x1SUhCeWIyUjFZM1JwYjI0dVhHNGdLaTljYmx4dWRtRnlJR2x1ZG1GeWFXRnVkQ0E5SUdaMWJtTjBhVzl1S0dOdmJtUnBkR2x2Yml3Z1ptOXliV0YwTENCaExDQmlMQ0JqTENCa0xDQmxMQ0JtS1NCN1hHNGdJR2xtSUNoY0luQnliMlIxWTNScGIyNWNJaUFoUFQwZ2NISnZZMlZ6Y3k1bGJuWXVUazlFUlY5RlRsWXBJSHRjYmlBZ0lDQnBaaUFvWm05eWJXRjBJRDA5UFNCMWJtUmxabWx1WldRcElIdGNiaUFnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnbmFXNTJZWEpwWVc1MElISmxjWFZwY21WeklHRnVJR1Z5Y205eUlHMWxjM05oWjJVZ1lYSm5kVzFsYm5RbktUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnBaaUFvSVdOdmJtUnBkR2x2YmlrZ2UxeHVJQ0FnSUhaaGNpQmxjbkp2Y2p0Y2JpQWdJQ0JwWmlBb1ptOXliV0YwSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJR1Z5Y205eUlEMGdibVYzSUVWeWNtOXlLRnh1SUNBZ0lDQWdJQ0FuVFdsdWFXWnBaV1FnWlhoalpYQjBhVzl1SUc5alkzVnljbVZrT3lCMWMyVWdkR2hsSUc1dmJpMXRhVzVwWm1sbFpDQmtaWFlnWlc1MmFYSnZibTFsYm5RZ0p5QXJYRzRnSUNBZ0lDQWdJQ2RtYjNJZ2RHaGxJR1oxYkd3Z1pYSnliM0lnYldWemMyRm5aU0JoYm1RZ1lXUmthWFJwYjI1aGJDQm9aV3h3Wm5Wc0lIZGhjbTVwYm1kekxpZGNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUhaaGNpQmhjbWR6SUQwZ1cyRXNJR0lzSUdNc0lHUXNJR1VzSUdaZE8xeHVJQ0FnSUNBZ2RtRnlJR0Z5WjBsdVpHVjRJRDBnTUR0Y2JpQWdJQ0FnSUdWeWNtOXlJRDBnYm1WM0lFVnljbTl5S0Z4dUlDQWdJQ0FnSUNBblNXNTJZWEpwWVc1MElGWnBiMnhoZEdsdmJqb2dKeUFyWEc0Z0lDQWdJQ0FnSUdadmNtMWhkQzV5WlhCc1lXTmxLQzhsY3k5bkxDQm1kVzVqZEdsdmJpZ3BJSHNnY21WMGRYSnVJR0Z5WjNOYllYSm5TVzVrWlhncksxMDdJSDBwWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR1Z5Y205eUxtWnlZVzFsYzFSdlVHOXdJRDBnTVRzZ0x5OGdkMlVnWkc5dUozUWdZMkZ5WlNCaFltOTFkQ0JwYm5aaGNtbGhiblFuY3lCdmQyNGdabkpoYldWY2JpQWdJQ0IwYUhKdmR5Qmxjbkp2Y2p0Y2JpQWdmVnh1ZlR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnBiblpoY21saGJuUTdYRzRpWFgwPSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBrZXlPZlxuICovXG5cbi8qKlxuICogQWxsb3dzIGV4dHJhY3Rpb24gb2YgYSBtaW5pZmllZCBrZXkuIExldCdzIHRoZSBidWlsZCBzeXN0ZW0gbWluaWZ5IGtleXNcbiAqIHdpdGhvdXQgbG9vc2luZyB0aGUgYWJpbGl0eSB0byBkeW5hbWljYWxseSB1c2Uga2V5IHN0cmluZ3MgYXMgdmFsdWVzXG4gKiB0aGVtc2VsdmVzLiBQYXNzIGluIGFuIG9iamVjdCB3aXRoIGEgc2luZ2xlIGtleS92YWwgcGFpciBhbmQgaXQgd2lsbCByZXR1cm5cbiAqIHlvdSB0aGUgc3RyaW5nIGtleSBvZiB0aGF0IHNpbmdsZSByZWNvcmQuIFN1cHBvc2UgeW91IHdhbnQgdG8gZ3JhYiB0aGVcbiAqIHZhbHVlIGZvciBhIGtleSAnY2xhc3NOYW1lJyBpbnNpZGUgb2YgYW4gb2JqZWN0LiBLZXkvdmFsIG1pbmlmaWNhdGlvbiBtYXlcbiAqIGhhdmUgYWxpYXNlZCB0aGF0IGtleSB0byBiZSAneGExMicuIGtleU9mKHtjbGFzc05hbWU6IG51bGx9KSB3aWxsIHJldHVyblxuICogJ3hhMTInIGluIHRoYXQgY2FzZS4gUmVzb2x2ZSBrZXlzIHlvdSB3YW50IHRvIHVzZSBvbmNlIGF0IHN0YXJ0dXAgdGltZSwgdGhlblxuICogcmV1c2UgdGhvc2UgcmVzb2x1dGlvbnMuXG4gKi9cbnZhciBrZXlPZiA9IGZ1bmN0aW9uKG9uZUtleU9iaikge1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBvbmVLZXlPYmopIHtcbiAgICBpZiAoIW9uZUtleU9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlPZjtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4vKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgdXBkYXRlXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBhc3NpZ24gPSByZXF1aXJlKFwiLi9PYmplY3QuYXNzaWduXCIpO1xudmFyIGtleU9mID0gcmVxdWlyZShcIi4va2V5T2ZcIik7XG52YXIgaW52YXJpYW50ID0gcmVxdWlyZShcIi4vaW52YXJpYW50XCIpO1xuXG5mdW5jdGlvbiBzaGFsbG93Q29weSh4KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHgpKSB7XG4gICAgcmV0dXJuIHguY29uY2F0KCk7XG4gIH0gZWxzZSBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gYXNzaWduKG5ldyB4LmNvbnN0cnVjdG9yKCksIHgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB4O1xuICB9XG59XG5cbnZhciBDT01NQU5EX1BVU0ggPSBrZXlPZih7JHB1c2g6IG51bGx9KTtcbnZhciBDT01NQU5EX1VOU0hJRlQgPSBrZXlPZih7JHVuc2hpZnQ6IG51bGx9KTtcbnZhciBDT01NQU5EX1NQTElDRSA9IGtleU9mKHskc3BsaWNlOiBudWxsfSk7XG52YXIgQ09NTUFORF9TRVQgPSBrZXlPZih7JHNldDogbnVsbH0pO1xudmFyIENPTU1BTkRfTUVSR0UgPSBrZXlPZih7JG1lcmdlOiBudWxsfSk7XG52YXIgQ09NTUFORF9BUFBMWSA9IGtleU9mKHskYXBwbHk6IG51bGx9KTtcblxudmFyIEFMTF9DT01NQU5EU19MSVNUID0gW1xuICBDT01NQU5EX1BVU0gsXG4gIENPTU1BTkRfVU5TSElGVCxcbiAgQ09NTUFORF9TUExJQ0UsXG4gIENPTU1BTkRfU0VULFxuICBDT01NQU5EX01FUkdFLFxuICBDT01NQU5EX0FQUExZXG5dO1xuXG52YXIgQUxMX0NPTU1BTkRTX1NFVCA9IHt9O1xuXG5BTExfQ09NTUFORFNfTElTVC5mb3JFYWNoKGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgQUxMX0NPTU1BTkRTX1NFVFtjb21tYW5kXSA9IHRydWU7XG59KTtcblxuZnVuY3Rpb24gaW52YXJpYW50QXJyYXlDYXNlKHZhbHVlLCBzcGVjLCBjb21tYW5kKSB7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgQXJyYXkuaXNBcnJheSh2YWx1ZSksXG4gICAgJ3VwZGF0ZSgpOiBleHBlY3RlZCB0YXJnZXQgb2YgJXMgdG8gYmUgYW4gYXJyYXk7IGdvdCAlcy4nLFxuICAgIGNvbW1hbmQsXG4gICAgdmFsdWVcbiAgKSA6IGludmFyaWFudChBcnJheS5pc0FycmF5KHZhbHVlKSkpO1xuICB2YXIgc3BlY1ZhbHVlID0gc3BlY1tjb21tYW5kXTtcbiAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICBBcnJheS5pc0FycmF5KHNwZWNWYWx1ZSksXG4gICAgJ3VwZGF0ZSgpOiBleHBlY3RlZCBzcGVjIG9mICVzIHRvIGJlIGFuIGFycmF5OyBnb3QgJXMuICcgK1xuICAgICdEaWQgeW91IGZvcmdldCB0byB3cmFwIHlvdXIgcGFyYW1ldGVyIGluIGFuIGFycmF5PycsXG4gICAgY29tbWFuZCxcbiAgICBzcGVjVmFsdWVcbiAgKSA6IGludmFyaWFudChBcnJheS5pc0FycmF5KHNwZWNWYWx1ZSkpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKHZhbHVlLCBzcGVjKSB7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgdHlwZW9mIHNwZWMgPT09ICdvYmplY3QnLFxuICAgICd1cGRhdGUoKTogWW91IHByb3ZpZGVkIGEga2V5IHBhdGggdG8gdXBkYXRlKCkgdGhhdCBkaWQgbm90IGNvbnRhaW4gb25lICcgK1xuICAgICdvZiAlcy4gRGlkIHlvdSBmb3JnZXQgdG8gaW5jbHVkZSB7JXM6IC4uLn0/JyxcbiAgICBBTExfQ09NTUFORFNfTElTVC5qb2luKCcsICcpLFxuICAgIENPTU1BTkRfU0VUXG4gICkgOiBpbnZhcmlhbnQodHlwZW9mIHNwZWMgPT09ICdvYmplY3QnKSk7XG5cbiAgaWYgKHNwZWMuaGFzT3duUHJvcGVydHkoQ09NTUFORF9TRVQpKSB7XG4gICAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICAgIE9iamVjdC5rZXlzKHNwZWMpLmxlbmd0aCA9PT0gMSxcbiAgICAgICdDYW5ub3QgaGF2ZSBtb3JlIHRoYW4gb25lIGtleSBpbiBhbiBvYmplY3Qgd2l0aCAlcycsXG4gICAgICBDT01NQU5EX1NFVFxuICAgICkgOiBpbnZhcmlhbnQoT2JqZWN0LmtleXMoc3BlYykubGVuZ3RoID09PSAxKSk7XG5cbiAgICByZXR1cm4gc3BlY1tDT01NQU5EX1NFVF07XG4gIH1cblxuICB2YXIgbmV4dFZhbHVlID0gc2hhbGxvd0NvcHkodmFsdWUpO1xuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KENPTU1BTkRfTUVSR0UpKSB7XG4gICAgdmFyIG1lcmdlT2JqID0gc3BlY1tDT01NQU5EX01FUkdFXTtcbiAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgbWVyZ2VPYmogJiYgdHlwZW9mIG1lcmdlT2JqID09PSAnb2JqZWN0JyxcbiAgICAgICd1cGRhdGUoKTogJXMgZXhwZWN0cyBhIHNwZWMgb2YgdHlwZSBcXCdvYmplY3RcXCc7IGdvdCAlcycsXG4gICAgICBDT01NQU5EX01FUkdFLFxuICAgICAgbWVyZ2VPYmpcbiAgICApIDogaW52YXJpYW50KG1lcmdlT2JqICYmIHR5cGVvZiBtZXJnZU9iaiA9PT0gJ29iamVjdCcpKTtcbiAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgbmV4dFZhbHVlICYmIHR5cGVvZiBuZXh0VmFsdWUgPT09ICdvYmplY3QnLFxuICAgICAgJ3VwZGF0ZSgpOiAlcyBleHBlY3RzIGEgdGFyZ2V0IG9mIHR5cGUgXFwnb2JqZWN0XFwnOyBnb3QgJXMnLFxuICAgICAgQ09NTUFORF9NRVJHRSxcbiAgICAgIG5leHRWYWx1ZVxuICAgICkgOiBpbnZhcmlhbnQobmV4dFZhbHVlICYmIHR5cGVvZiBuZXh0VmFsdWUgPT09ICdvYmplY3QnKSk7XG4gICAgYXNzaWduKG5leHRWYWx1ZSwgc3BlY1tDT01NQU5EX01FUkdFXSk7XG4gIH1cblxuICBpZiAoc3BlYy5oYXNPd25Qcm9wZXJ0eShDT01NQU5EX1BVU0gpKSB7XG4gICAgaW52YXJpYW50QXJyYXlDYXNlKHZhbHVlLCBzcGVjLCBDT01NQU5EX1BVU0gpO1xuICAgIHNwZWNbQ09NTUFORF9QVVNIXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIG5leHRWYWx1ZS5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHNwZWMuaGFzT3duUHJvcGVydHkoQ09NTUFORF9VTlNISUZUKSkge1xuICAgIGludmFyaWFudEFycmF5Q2FzZSh2YWx1ZSwgc3BlYywgQ09NTUFORF9VTlNISUZUKTtcbiAgICBzcGVjW0NPTU1BTkRfVU5TSElGVF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBuZXh0VmFsdWUudW5zaGlmdChpdGVtKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KENPTU1BTkRfU1BMSUNFKSkge1xuICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICBBcnJheS5pc0FycmF5KHZhbHVlKSxcbiAgICAgICdFeHBlY3RlZCAlcyB0YXJnZXQgdG8gYmUgYW4gYXJyYXk7IGdvdCAlcycsXG4gICAgICBDT01NQU5EX1NQTElDRSxcbiAgICAgIHZhbHVlXG4gICAgKSA6IGludmFyaWFudChBcnJheS5pc0FycmF5KHZhbHVlKSkpO1xuICAgIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgICBBcnJheS5pc0FycmF5KHNwZWNbQ09NTUFORF9TUExJQ0VdKSxcbiAgICAgICd1cGRhdGUoKTogZXhwZWN0ZWQgc3BlYyBvZiAlcyB0byBiZSBhbiBhcnJheSBvZiBhcnJheXM7IGdvdCAlcy4gJyArXG4gICAgICAnRGlkIHlvdSBmb3JnZXQgdG8gd3JhcCB5b3VyIHBhcmFtZXRlcnMgaW4gYW4gYXJyYXk/JyxcbiAgICAgIENPTU1BTkRfU1BMSUNFLFxuICAgICAgc3BlY1tDT01NQU5EX1NQTElDRV1cbiAgICApIDogaW52YXJpYW50KEFycmF5LmlzQXJyYXkoc3BlY1tDT01NQU5EX1NQTElDRV0pKSk7XG4gICAgc3BlY1tDT01NQU5EX1NQTElDRV0uZm9yRWFjaChmdW5jdGlvbihhcmdzKSB7XG4gICAgICAoXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WID8gaW52YXJpYW50KFxuICAgICAgICBBcnJheS5pc0FycmF5KGFyZ3MpLFxuICAgICAgICAndXBkYXRlKCk6IGV4cGVjdGVkIHNwZWMgb2YgJXMgdG8gYmUgYW4gYXJyYXkgb2YgYXJyYXlzOyBnb3QgJXMuICcgK1xuICAgICAgICAnRGlkIHlvdSBmb3JnZXQgdG8gd3JhcCB5b3VyIHBhcmFtZXRlcnMgaW4gYW4gYXJyYXk/JyxcbiAgICAgICAgQ09NTUFORF9TUExJQ0UsXG4gICAgICAgIHNwZWNbQ09NTUFORF9TUExJQ0VdXG4gICAgICApIDogaW52YXJpYW50KEFycmF5LmlzQXJyYXkoYXJncykpKTtcbiAgICAgIG5leHRWYWx1ZS5zcGxpY2UuYXBwbHkobmV4dFZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KENPTU1BTkRfQVBQTFkpKSB7XG4gICAgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOViA/IGludmFyaWFudChcbiAgICAgIHR5cGVvZiBzcGVjW0NPTU1BTkRfQVBQTFldID09PSAnZnVuY3Rpb24nLFxuICAgICAgJ3VwZGF0ZSgpOiBleHBlY3RlZCBzcGVjIG9mICVzIHRvIGJlIGEgZnVuY3Rpb247IGdvdCAlcy4nLFxuICAgICAgQ09NTUFORF9BUFBMWSxcbiAgICAgIHNwZWNbQ09NTUFORF9BUFBMWV1cbiAgICApIDogaW52YXJpYW50KHR5cGVvZiBzcGVjW0NPTU1BTkRfQVBQTFldID09PSAnZnVuY3Rpb24nKSk7XG4gICAgbmV4dFZhbHVlID0gc3BlY1tDT01NQU5EX0FQUExZXShuZXh0VmFsdWUpO1xuICB9XG5cbiAgZm9yICh2YXIgayBpbiBzcGVjKSB7XG4gICAgaWYgKCEoQUxMX0NPTU1BTkRTX1NFVC5oYXNPd25Qcm9wZXJ0eShrKSAmJiBBTExfQ09NTUFORFNfU0VUW2tdKSkge1xuICAgICAgbmV4dFZhbHVlW2tdID0gdXBkYXRlKHZhbHVlW2tdLCBzcGVjW2tdKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV4dFZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoJ19wcm9jZXNzJykpXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5eVpXRmpkQzlzYVdJdmRYQmtZWFJsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1EyOXdlWEpwWjJoMElESXdNVE10TWpBeE5Dd2dSbUZqWldKdmIyc3NJRWx1WXk1Y2JpQXFJRUZzYkNCeWFXZG9kSE1nY21WelpYSjJaV1F1WEc0Z0tseHVJQ29nVkdocGN5QnpiM1Z5WTJVZ1kyOWtaU0JwY3lCc2FXTmxibk5sWkNCMWJtUmxjaUIwYUdVZ1FsTkVMWE4wZVd4bElHeHBZMlZ1YzJVZ1ptOTFibVFnYVc0Z2RHaGxYRzRnS2lCTVNVTkZUbE5GSUdacGJHVWdhVzRnZEdobElISnZiM1FnWkdseVpXTjBiM0o1SUc5bUlIUm9hWE1nYzI5MWNtTmxJSFJ5WldVdUlFRnVJR0ZrWkdsMGFXOXVZV3dnWjNKaGJuUmNiaUFxSUc5bUlIQmhkR1Z1ZENCeWFXZG9kSE1nWTJGdUlHSmxJR1p2ZFc1a0lHbHVJSFJvWlNCUVFWUkZUbFJUSUdacGJHVWdhVzRnZEdobElITmhiV1VnWkdseVpXTjBiM0o1TGx4dUlDcGNiaUFxSUVCd2NtOTJhV1JsYzAxdlpIVnNaU0IxY0dSaGRHVmNiaUFxTDF4dVhHNWNJblZ6WlNCemRISnBZM1JjSWp0Y2JseHVkbUZ5SUdGemMybG5iaUE5SUhKbGNYVnBjbVVvWENJdUwwOWlhbVZqZEM1aGMzTnBaMjVjSWlrN1hHNTJZWElnYTJWNVQyWWdQU0J5WlhGMWFYSmxLRndpTGk5clpYbFBabHdpS1R0Y2JuWmhjaUJwYm5aaGNtbGhiblFnUFNCeVpYRjFhWEpsS0Z3aUxpOXBiblpoY21saGJuUmNJaWs3WEc1Y2JtWjFibU4wYVc5dUlITm9ZV3hzYjNkRGIzQjVLSGdwSUh0Y2JpQWdhV1lnS0VGeWNtRjVMbWx6UVhKeVlYa29lQ2twSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlQzVqYjI1allYUW9LVHRjYmlBZ2ZTQmxiSE5sSUdsbUlDaDRJQ1ltSUhSNWNHVnZaaUI0SUQwOVBTQW5iMkpxWldOMEp5a2dlMXh1SUNBZ0lISmxkSFZ5YmlCaGMzTnBaMjRvYm1WM0lIZ3VZMjl1YzNSeWRXTjBiM0lvS1N3Z2VDazdYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdjbVYwZFhKdUlIZzdYRzRnSUgxY2JuMWNibHh1ZG1GeUlFTlBUVTFCVGtSZlVGVlRTQ0E5SUd0bGVVOW1LSHNrY0hWemFEb2diblZzYkgwcE8xeHVkbUZ5SUVOUFRVMUJUa1JmVlU1VFNFbEdWQ0E5SUd0bGVVOW1LSHNrZFc1emFHbG1kRG9nYm5Wc2JIMHBPMXh1ZG1GeUlFTlBUVTFCVGtSZlUxQk1TVU5GSUQwZ2EyVjVUMllvZXlSemNHeHBZMlU2SUc1MWJHeDlLVHRjYm5aaGNpQkRUMDFOUVU1RVgxTkZWQ0E5SUd0bGVVOW1LSHNrYzJWME9pQnVkV3hzZlNrN1hHNTJZWElnUTA5TlRVRk9SRjlOUlZKSFJTQTlJR3RsZVU5bUtIc2tiV1Z5WjJVNklHNTFiR3g5S1R0Y2JuWmhjaUJEVDAxTlFVNUVYMEZRVUV4WklEMGdhMlY1VDJZb2V5UmhjSEJzZVRvZ2JuVnNiSDBwTzF4dVhHNTJZWElnUVV4TVgwTlBUVTFCVGtSVFgweEpVMVFnUFNCYlhHNGdJRU5QVFUxQlRrUmZVRlZUU0N4Y2JpQWdRMDlOVFVGT1JGOVZUbE5JU1VaVUxGeHVJQ0JEVDAxTlFVNUVYMU5RVEVsRFJTeGNiaUFnUTA5TlRVRk9SRjlUUlZRc1hHNGdJRU5QVFUxQlRrUmZUVVZTUjBVc1hHNGdJRU5QVFUxQlRrUmZRVkJRVEZsY2JsMDdYRzVjYm5aaGNpQkJURXhmUTA5TlRVRk9SRk5mVTBWVUlEMGdlMzA3WEc1Y2JrRk1URjlEVDAxTlFVNUVVMTlNU1ZOVUxtWnZja1ZoWTJnb1puVnVZM1JwYjI0b1kyOXRiV0Z1WkNrZ2UxeHVJQ0JCVEV4ZlEwOU5UVUZPUkZOZlUwVlVXMk52YlcxaGJtUmRJRDBnZEhKMVpUdGNibjBwTzF4dVhHNW1kVzVqZEdsdmJpQnBiblpoY21saGJuUkJjbkpoZVVOaGMyVW9kbUZzZFdVc0lITndaV01zSUdOdmJXMWhibVFwSUh0Y2JpQWdLRndpY0hKdlpIVmpkR2x2Ymx3aUlDRTlQU0J3Y205alpYTnpMbVZ1ZGk1T1QwUkZYMFZPVmlBL0lHbHVkbUZ5YVdGdWRDaGNiaUFnSUNCQmNuSmhlUzVwYzBGeWNtRjVLSFpoYkhWbEtTeGNiaUFnSUNBbmRYQmtZWFJsS0NrNklHVjRjR1ZqZEdWa0lIUmhjbWRsZENCdlppQWxjeUIwYnlCaVpTQmhiaUJoY25KaGVUc2daMjkwSUNWekxpY3NYRzRnSUNBZ1kyOXRiV0Z1WkN4Y2JpQWdJQ0IyWVd4MVpWeHVJQ0FwSURvZ2FXNTJZWEpwWVc1MEtFRnljbUY1TG1selFYSnlZWGtvZG1Gc2RXVXBLU2s3WEc0Z0lIWmhjaUJ6Y0dWalZtRnNkV1VnUFNCemNHVmpXMk52YlcxaGJtUmRPMXh1SUNBb1hDSndjbTlrZFdOMGFXOXVYQ0lnSVQwOUlIQnliMk5sYzNNdVpXNTJMazVQUkVWZlJVNVdJRDhnYVc1MllYSnBZVzUwS0Z4dUlDQWdJRUZ5Y21GNUxtbHpRWEp5WVhrb2MzQmxZMVpoYkhWbEtTeGNiaUFnSUNBbmRYQmtZWFJsS0NrNklHVjRjR1ZqZEdWa0lITndaV01nYjJZZ0pYTWdkRzhnWW1VZ1lXNGdZWEp5WVhrN0lHZHZkQ0FsY3k0Z0p5QXJYRzRnSUNBZ0owUnBaQ0I1YjNVZ1ptOXlaMlYwSUhSdklIZHlZWEFnZVc5MWNpQndZWEpoYldWMFpYSWdhVzRnWVc0Z1lYSnlZWGsvSnl4Y2JpQWdJQ0JqYjIxdFlXNWtMRnh1SUNBZ0lITndaV05XWVd4MVpWeHVJQ0FwSURvZ2FXNTJZWEpwWVc1MEtFRnljbUY1TG1selFYSnlZWGtvYzNCbFkxWmhiSFZsS1NrcE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCMWNHUmhkR1VvZG1Gc2RXVXNJSE53WldNcElIdGNiaUFnS0Z3aWNISnZaSFZqZEdsdmJsd2lJQ0U5UFNCd2NtOWpaWE56TG1WdWRpNU9UMFJGWDBWT1ZpQS9JR2x1ZG1GeWFXRnVkQ2hjYmlBZ0lDQjBlWEJsYjJZZ2MzQmxZeUE5UFQwZ0oyOWlhbVZqZENjc1hHNGdJQ0FnSjNWd1pHRjBaU2dwT2lCWmIzVWdjSEp2ZG1sa1pXUWdZU0JyWlhrZ2NHRjBhQ0IwYnlCMWNHUmhkR1VvS1NCMGFHRjBJR1JwWkNCdWIzUWdZMjl1ZEdGcGJpQnZibVVnSnlBclhHNGdJQ0FnSjI5bUlDVnpMaUJFYVdRZ2VXOTFJR1p2Y21kbGRDQjBieUJwYm1Oc2RXUmxJSHNsY3pvZ0xpNHVmVDhuTEZ4dUlDQWdJRUZNVEY5RFQwMU5RVTVFVTE5TVNWTlVMbXB2YVc0b0p5d2dKeWtzWEc0Z0lDQWdRMDlOVFVGT1JGOVRSVlJjYmlBZ0tTQTZJR2x1ZG1GeWFXRnVkQ2gwZVhCbGIyWWdjM0JsWXlBOVBUMGdKMjlpYW1WamRDY3BLVHRjYmx4dUlDQnBaaUFvYzNCbFl5NW9ZWE5QZDI1UWNtOXdaWEowZVNoRFQwMU5RVTVFWDFORlZDa3BJSHRjYmlBZ0lDQW9YQ0p3Y205a2RXTjBhVzl1WENJZ0lUMDlJSEJ5YjJObGMzTXVaVzUyTGs1UFJFVmZSVTVXSUQ4Z2FXNTJZWEpwWVc1MEtGeHVJQ0FnSUNBZ1QySnFaV04wTG10bGVYTW9jM0JsWXlrdWJHVnVaM1JvSUQwOVBTQXhMRnh1SUNBZ0lDQWdKME5oYm01dmRDQm9ZWFpsSUcxdmNtVWdkR2hoYmlCdmJtVWdhMlY1SUdsdUlHRnVJRzlpYW1WamRDQjNhWFJvSUNWekp5eGNiaUFnSUNBZ0lFTlBUVTFCVGtSZlUwVlVYRzRnSUNBZ0tTQTZJR2x1ZG1GeWFXRnVkQ2hQWW1wbFkzUXVhMlY1Y3loemNHVmpLUzVzWlc1bmRHZ2dQVDA5SURFcEtUdGNibHh1SUNBZ0lISmxkSFZ5YmlCemNHVmpXME5QVFUxQlRrUmZVMFZVWFR0Y2JpQWdmVnh1WEc0Z0lIWmhjaUJ1WlhoMFZtRnNkV1VnUFNCemFHRnNiRzkzUTI5d2VTaDJZV3gxWlNrN1hHNWNiaUFnYVdZZ0tITndaV011YUdGelQzZHVVSEp2Y0dWeWRIa29RMDlOVFVGT1JGOU5SVkpIUlNrcElIdGNiaUFnSUNCMllYSWdiV1Z5WjJWUFltb2dQU0J6Y0dWalcwTlBUVTFCVGtSZlRVVlNSMFZkTzF4dUlDQWdJQ2hjSW5CeWIyUjFZM1JwYjI1Y0lpQWhQVDBnY0hKdlkyVnpjeTVsYm5ZdVRrOUVSVjlGVGxZZ1B5QnBiblpoY21saGJuUW9YRzRnSUNBZ0lDQnRaWEpuWlU5aWFpQW1KaUIwZVhCbGIyWWdiV1Z5WjJWUFltb2dQVDA5SUNkdlltcGxZM1FuTEZ4dUlDQWdJQ0FnSjNWd1pHRjBaU2dwT2lBbGN5QmxlSEJsWTNSeklHRWdjM0JsWXlCdlppQjBlWEJsSUZ4Y0oyOWlhbVZqZEZ4Y0p6c2daMjkwSUNWekp5eGNiaUFnSUNBZ0lFTlBUVTFCVGtSZlRVVlNSMFVzWEc0Z0lDQWdJQ0J0WlhKblpVOWlhbHh1SUNBZ0lDa2dPaUJwYm5aaGNtbGhiblFvYldWeVoyVlBZbW9nSmlZZ2RIbHdaVzltSUcxbGNtZGxUMkpxSUQwOVBTQW5iMkpxWldOMEp5a3BPMXh1SUNBZ0lDaGNJbkJ5YjJSMVkzUnBiMjVjSWlBaFBUMGdjSEp2WTJWemN5NWxibll1VGs5RVJWOUZUbFlnUHlCcGJuWmhjbWxoYm5Rb1hHNGdJQ0FnSUNCdVpYaDBWbUZzZFdVZ0ppWWdkSGx3Wlc5bUlHNWxlSFJXWVd4MVpTQTlQVDBnSjI5aWFtVmpkQ2NzWEc0Z0lDQWdJQ0FuZFhCa1lYUmxLQ2s2SUNWeklHVjRjR1ZqZEhNZ1lTQjBZWEpuWlhRZ2IyWWdkSGx3WlNCY1hDZHZZbXBsWTNSY1hDYzdJR2R2ZENBbGN5Y3NYRzRnSUNBZ0lDQkRUMDFOUVU1RVgwMUZVa2RGTEZ4dUlDQWdJQ0FnYm1WNGRGWmhiSFZsWEc0Z0lDQWdLU0E2SUdsdWRtRnlhV0Z1ZENodVpYaDBWbUZzZFdVZ0ppWWdkSGx3Wlc5bUlHNWxlSFJXWVd4MVpTQTlQVDBnSjI5aWFtVmpkQ2NwS1R0Y2JpQWdJQ0JoYzNOcFoyNG9ibVY0ZEZaaGJIVmxMQ0J6Y0dWalcwTlBUVTFCVGtSZlRVVlNSMFZkS1R0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2h6Y0dWakxtaGhjMDkzYmxCeWIzQmxjblI1S0VOUFRVMUJUa1JmVUZWVFNDa3BJSHRjYmlBZ0lDQnBiblpoY21saGJuUkJjbkpoZVVOaGMyVW9kbUZzZFdVc0lITndaV01zSUVOUFRVMUJUa1JmVUZWVFNDazdYRzRnSUNBZ2MzQmxZMXREVDAxTlFVNUVYMUJWVTBoZExtWnZja1ZoWTJnb1puVnVZM1JwYjI0b2FYUmxiU2tnZTF4dUlDQWdJQ0FnYm1WNGRGWmhiSFZsTG5CMWMyZ29hWFJsYlNrN1hHNGdJQ0FnZlNrN1hHNGdJSDFjYmx4dUlDQnBaaUFvYzNCbFl5NW9ZWE5QZDI1UWNtOXdaWEowZVNoRFQwMU5RVTVFWDFWT1UwaEpSbFFwS1NCN1hHNGdJQ0FnYVc1MllYSnBZVzUwUVhKeVlYbERZWE5sS0haaGJIVmxMQ0J6Y0dWakxDQkRUMDFOUVU1RVgxVk9VMGhKUmxRcE8xeHVJQ0FnSUhOd1pXTmJRMDlOVFVGT1JGOVZUbE5JU1VaVVhTNW1iM0pGWVdOb0tHWjFibU4wYVc5dUtHbDBaVzBwSUh0Y2JpQWdJQ0FnSUc1bGVIUldZV3gxWlM1MWJuTm9hV1owS0dsMFpXMHBPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnYVdZZ0tITndaV011YUdGelQzZHVVSEp2Y0dWeWRIa29RMDlOVFVGT1JGOVRVRXhKUTBVcEtTQjdYRzRnSUNBZ0tGd2ljSEp2WkhWamRHbHZibHdpSUNFOVBTQndjbTlqWlhOekxtVnVkaTVPVDBSRlgwVk9WaUEvSUdsdWRtRnlhV0Z1ZENoY2JpQWdJQ0FnSUVGeWNtRjVMbWx6UVhKeVlYa29kbUZzZFdVcExGeHVJQ0FnSUNBZ0owVjRjR1ZqZEdWa0lDVnpJSFJoY21kbGRDQjBieUJpWlNCaGJpQmhjbkpoZVRzZ1oyOTBJQ1Z6Snl4Y2JpQWdJQ0FnSUVOUFRVMUJUa1JmVTFCTVNVTkZMRnh1SUNBZ0lDQWdkbUZzZFdWY2JpQWdJQ0FwSURvZ2FXNTJZWEpwWVc1MEtFRnljbUY1TG1selFYSnlZWGtvZG1Gc2RXVXBLU2s3WEc0Z0lDQWdLRndpY0hKdlpIVmpkR2x2Ymx3aUlDRTlQU0J3Y205alpYTnpMbVZ1ZGk1T1QwUkZYMFZPVmlBL0lHbHVkbUZ5YVdGdWRDaGNiaUFnSUNBZ0lFRnljbUY1TG1selFYSnlZWGtvYzNCbFkxdERUMDFOUVU1RVgxTlFURWxEUlYwcExGeHVJQ0FnSUNBZ0ozVndaR0YwWlNncE9pQmxlSEJsWTNSbFpDQnpjR1ZqSUc5bUlDVnpJSFJ2SUdKbElHRnVJR0Z5Y21GNUlHOW1JR0Z5Y21GNWN6c2daMjkwSUNWekxpQW5JQ3RjYmlBZ0lDQWdJQ2RFYVdRZ2VXOTFJR1p2Y21kbGRDQjBieUIzY21Gd0lIbHZkWElnY0dGeVlXMWxkR1Z5Y3lCcGJpQmhiaUJoY25KaGVUOG5MRnh1SUNBZ0lDQWdRMDlOVFVGT1JGOVRVRXhKUTBVc1hHNGdJQ0FnSUNCemNHVmpXME5QVFUxQlRrUmZVMUJNU1VORlhWeHVJQ0FnSUNrZ09pQnBiblpoY21saGJuUW9RWEp5WVhrdWFYTkJjbkpoZVNoemNHVmpXME5QVFUxQlRrUmZVMUJNU1VORlhTa3BLVHRjYmlBZ0lDQnpjR1ZqVzBOUFRVMUJUa1JmVTFCTVNVTkZYUzVtYjNKRllXTm9LR1oxYm1OMGFXOXVLR0Z5WjNNcElIdGNiaUFnSUNBZ0lDaGNJbkJ5YjJSMVkzUnBiMjVjSWlBaFBUMGdjSEp2WTJWemN5NWxibll1VGs5RVJWOUZUbFlnUHlCcGJuWmhjbWxoYm5Rb1hHNGdJQ0FnSUNBZ0lFRnljbUY1TG1selFYSnlZWGtvWVhKbmN5a3NYRzRnSUNBZ0lDQWdJQ2QxY0dSaGRHVW9LVG9nWlhod1pXTjBaV1FnYzNCbFl5QnZaaUFsY3lCMGJ5QmlaU0JoYmlCaGNuSmhlU0J2WmlCaGNuSmhlWE03SUdkdmRDQWxjeTRnSnlBclhHNGdJQ0FnSUNBZ0lDZEVhV1FnZVc5MUlHWnZjbWRsZENCMGJ5QjNjbUZ3SUhsdmRYSWdjR0Z5WVcxbGRHVnljeUJwYmlCaGJpQmhjbkpoZVQ4bkxGeHVJQ0FnSUNBZ0lDQkRUMDFOUVU1RVgxTlFURWxEUlN4Y2JpQWdJQ0FnSUNBZ2MzQmxZMXREVDAxTlFVNUVYMU5RVEVsRFJWMWNiaUFnSUNBZ0lDa2dPaUJwYm5aaGNtbGhiblFvUVhKeVlYa3VhWE5CY25KaGVTaGhjbWR6S1NrcE8xeHVJQ0FnSUNBZ2JtVjRkRlpoYkhWbExuTndiR2xqWlM1aGNIQnNlU2h1WlhoMFZtRnNkV1VzSUdGeVozTXBPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnYVdZZ0tITndaV011YUdGelQzZHVVSEp2Y0dWeWRIa29RMDlOVFVGT1JGOUJVRkJNV1NrcElIdGNiaUFnSUNBb1hDSndjbTlrZFdOMGFXOXVYQ0lnSVQwOUlIQnliMk5sYzNNdVpXNTJMazVQUkVWZlJVNVdJRDhnYVc1MllYSnBZVzUwS0Z4dUlDQWdJQ0FnZEhsd1pXOW1JSE53WldOYlEwOU5UVUZPUkY5QlVGQk1XVjBnUFQwOUlDZG1kVzVqZEdsdmJpY3NYRzRnSUNBZ0lDQW5kWEJrWVhSbEtDazZJR1Y0Y0dWamRHVmtJSE53WldNZ2IyWWdKWE1nZEc4Z1ltVWdZU0JtZFc1amRHbHZianNnWjI5MElDVnpMaWNzWEc0Z0lDQWdJQ0JEVDAxTlFVNUVYMEZRVUV4WkxGeHVJQ0FnSUNBZ2MzQmxZMXREVDAxTlFVNUVYMEZRVUV4WlhWeHVJQ0FnSUNrZ09pQnBiblpoY21saGJuUW9kSGx3Wlc5bUlITndaV05iUTA5TlRVRk9SRjlCVUZCTVdWMGdQVDA5SUNkbWRXNWpkR2x2YmljcEtUdGNiaUFnSUNCdVpYaDBWbUZzZFdVZ1BTQnpjR1ZqVzBOUFRVMUJUa1JmUVZCUVRGbGRLRzVsZUhSV1lXeDFaU2s3WEc0Z0lIMWNibHh1SUNCbWIzSWdLSFpoY2lCcklHbHVJSE53WldNcElIdGNiaUFnSUNCcFppQW9JU2hCVEV4ZlEwOU5UVUZPUkZOZlUwVlVMbWhoYzA5M2JsQnliM0JsY25SNUtHc3BJQ1ltSUVGTVRGOURUMDFOUVU1RVUxOVRSVlJiYTEwcEtTQjdYRzRnSUNBZ0lDQnVaWGgwVm1Gc2RXVmJhMTBnUFNCMWNHUmhkR1VvZG1Gc2RXVmJhMTBzSUhOd1pXTmJhMTBwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ1WlhoMFZtRnNkV1U3WEc1OVhHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdkWEJrWVhSbE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cXVlc3Q6IGZ1bmN0aW9uIHF1ZXN0KHVzZXIsIF9xdWVzdCkge1xuXHRcdHZhciByZXN1bHQgPSB7XG5cdFx0XHR1c2VyOiB7XG5cdFx0XHRcdGlkOiB1c2VyLmlkLFxuXHRcdFx0XHRuYW1lOiB1c2VyLm5hbWVcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKF9xdWVzdCkge1xuXHRcdFx0cmVzdWx0LmlkID0gX3F1ZXN0LmlkO1xuXHRcdFx0cmVzdWx0LnRpdGxlID0gX3F1ZXN0LnRpdGxlO1xuXHRcdFx0cmVzdWx0LmRlc2NyaXB0aW9uID0gX3F1ZXN0LmRlc2NyaXB0aW9uO1xuXHRcdFx0cmVzdWx0LmRpcnR5ID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdC5pZCA9IG51bGw7XG5cdFx0XHRyZXN1bHQudGl0bGUgPSAnJztcblx0XHRcdHJlc3VsdC5kZXNjcmlwdGlvbiA9ICcnO1xuXHRcdFx0cmVzdWx0LmRpcnR5ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNzID0ge1xuXHRsb2c6IGZ1bmN0aW9uIGxvZyh0ZXh0KSB7XG5cdFx0Y29uc29sZS5sb2codGV4dCk7XG5cdH0sXG5cdGdldDogZnVuY3Rpb24gZ2V0KHVybCwgc3VjY2Vzcykge1xuXHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdHN1Y2Nlc3MoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdhamF4IGdldCBlcnJvcicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHR4aHIub3BlbignR0VUJywgdXJsKTtcblx0XHR4aHIuc2VuZCgpO1xuXHR9LFxuXHRwb3N0OiBmdW5jdGlvbiBwb3N0KHVybCwgZGF0YSwgc3VjY2Vzcykge1xuXHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHRcdHN1Y2Nlc3MoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdhamF4IHBvc3QgZXJyb3InKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0eGhyLm9wZW4oJ1BPU1QnLCB1cmwpO1xuXHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXHRcdHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcblx0fSxcblx0Y29va2llOiBmdW5jdGlvbiBjb29raWUobmFtZSwgY29va2llcykge1xuXHRcdHZhciBjID0gdGhpcy5jb29raWVzKGNvb2tpZXMpO1xuXHRcdHJldHVybiBjW25hbWVdO1xuXHR9LFxuXHRjb29raWVzOiBmdW5jdGlvbiBjb29raWVzKF9jb29raWVzKSB7XG5cdFx0dmFyIG5hbWVWYWx1ZXMgPSBfY29va2llcy5zcGxpdCgnOyAnKTtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0bmFtZVZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgaSA9IGl0ZW0uc3BsaXQoJz0nKTtcblx0XHRcdHJlc3VsdFtpWzBdXSA9IGlbMV07XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblx0Z2V0UXVlcnlWYWx1ZTogZnVuY3Rpb24gZ2V0UXVlcnlWYWx1ZShxdWVyeVN0cmluZywgbmFtZSkge1xuXHRcdHZhciBhcnIgPSBxdWVyeVN0cmluZy5tYXRjaChuZXcgUmVnRXhwKG5hbWUgKyAnPShbXiZdKyknKSk7XG5cblx0XHRpZiAoYXJyKSB7XG5cdFx0XHRyZXR1cm4gYXJyWzFdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cbn07XG5cbnZhciB0ZXN0cyA9IFt7XG5cdGlkOiAxLFxuXHR0ZXN0OiBmdW5jdGlvbiB0ZXN0KCkge1xuXHRcdHZhciBjb29raWVzID0ge1xuXHRcdFx0Y3NhdGk6ICdtYWpvbScsXG5cdFx0XHRvbmU6ICd0d28nXG5cdFx0fTtcblxuXHRcdHZhciByZXN1bHQgPSB0cnVlO1xuXG5cdFx0dmFyIGMgPSBjcy5jb29raWVzKCdjc2F0aT1tYWpvbTsgb25lPXR3bycpO1xuXG5cdFx0aWYgKGMuY3NhdGkgIT09IGNvb2tpZXMuY3NhdGkpIHJlc3VsdCA9IGZhbHNlO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxufSwge1xuXHRpZDogMixcblx0dGVzdDogZnVuY3Rpb24gdGVzdCgpIHtcblx0XHRyZXR1cm4gJ2JhcicgPT09IGNzLmNvb2tpZSgnZm9vJywgJ2Zvbz1iYXI7IHRlPW1ham9tJyk7XG5cdH1cbn0sIHtcblx0aWQ6IDMsXG5cdHRlc3Q6IGZ1bmN0aW9uIHRlc3QoKSB7XG5cdFx0cmV0dXJuICcxMjMnID09PSBjcy5nZXRRdWVyeVZhbHVlKCc/Y3NhdGk9bWFqb20mdXNlcl9pZD0xMjMmdmFsYW1pPXNlbW1pJywgJ3VzZXJfaWQnKTtcblx0fVxufV07XG5cbmlmIChmYWxzZSkge1xuXHR2YXIgcmVzdWx0ID0gdHJ1ZTtcblx0dGVzdHMuZm9yRWFjaChmdW5jdGlvbiAodGVzdCkge1xuXHRcdGlmICghdGVzdC50ZXN0KCkpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IodGVzdC5pZCArICcuIHRlc3QgZmFpbGVkJyk7XG5cdFx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHRpZiAocmVzdWx0KSB7XG5cdFx0Y29uc29sZS5sb2coJ0FsbCB0ZXN0cyBzdWNjZWVkZWQhJyk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjczsiXX0=
