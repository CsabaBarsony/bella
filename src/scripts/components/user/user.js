var cs = require('../../helpers/cs');
var schemas = require('../../schemas');
var server = require('../../server');
var statuses = {
	GUEST: 'GUEST',
	USER: 'USER',
	REGISTER: 'REGISTER'
};
var stateChart = Stativus.createStatechart();

var User = React.createClass({
	getInitialState: function() {
		var user = schemas.user.blank();

		return {
			status: statuses.GUEST,
			userName: user.name,
			opened: false,
			errorMessage: ''
		}
	},
	componentDidMount: function() {
		stateChart.addState('small', {
			enterState: function() {
				console.log('small enter')
			},
			myEvent1: function() {
				this.goToState('big');
			},
			initialSubstate: 'red',
			states: [
				{
					name: 'red',
					enterState: function() {
						console.log('red enter')
					},
					triggerRed: function() {
						this.goToState('blue');
					}
				},
				{
					name: 'yellow',
					enterState: function() {
						console.log('yellow enter')
					}
				}
			]
		});

		stateChart.addState('big', {
			enterState: function() {
				console.log('big enter')
			},
			myEvent2: function() {
				this.goToState('small');
			},
			states: [
				{
					name: 'green',
					enterState: function() {
						console.log('green enter')
					}
				},
				{
					name: 'blue',
					enterState: function() {
						console.log('blue enter')
					}
				}
			]
		});

		stateChart.initStates('small');

		bella.data.user.subscribe((user) => {
			this.setState({
				status: user.status,
				userName: user.name
			});
		});

		if(cs.cookie('user_id', document.cookie) && cs.cookie('token', document.cookie)) {
			server.userStatus.get((result, userStatus) => {
				bella.data.user.set(userStatus, this);
			});
		}
		else {
			bella.user.set('status', bella.constants.userStatus.GUEST, this);
		}
	},
	render: function() {
		return (<button onClick={this.test}>click</button>);

		if(this.state.status === bella.constants.userStatus.GUEST) {
			var errorMessage = this.state.errorMessage ?
				(
					<div>{this.state.errorMessage}</div>
				) : null;

			var popup = this.state.opened ? (
				<div className="bc-user-popup">
					{errorMessage}
					<input type="text" ref="name" defaultValue="a" /><br />
					<input type="text" ref="password" defaultValue="1" /><br />
					<button onClick={this.login}>Login</button><br />
					<a href="" onClick={this.register}>register</a>
				</div>
			) : null;

			return (
				<div className="bc-user">
					<a href="" onClick={this.click}>user</a>
					{popup}
				</div>
			);
		}
		else if(this.state.status === bella.constants.userStatus.LOGGED_IN) {
			var popup = this.state.opened ? (
				<div className="bc-user-popup">
					<a href="" onClick={this.logout}>logout</a>
				</div>
			) : null;

			return (
				<div className="bc-user">
					<a href="" onClick={this.click}>{this.state.userName}</a>
					{popup}
				</div>
			);
		}
	},
	test: function() {
		stateChart.sendEvent('triggerRed');
	},
	click: function(e) {
		e.preventDefault();
		this.setState({ opened: !this.state.opened });
	},
	login: function() {
		server.login({
			username: this.refs.name.value,
			password: this.refs.password.value
		}, (result, data) => {
			if(result.success) {
				bella.data.user.set(data, this);
				this.setState({
					errorMessage: '',
					opened: false
				});
			}
			else {
				bella.data.user.set({ status: bella.constants.userStatus.GUEST }, this);
				this.setState({ errorMessage: 'Wrong username or password' });
			}
		});
	},
	logout: function(e) {
		e.preventDefault();
		server.logout((result) => {
			if(result.success) {
				bella.data.user.set(schemas.user.blank(), this);
				this.setState({ opened: false });
			}
		});
	},
	register: function(e) {
		e.preventDefault();
	}
});

ReactDOM.render(
	<User />,
	document.getElementById('bc-user-container')
);
