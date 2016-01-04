var cs = require('../../helpers/cs');

var User = React.createClass({
	getInitialState: function() {
		return {
			status: 'init',
			opened: false,
			errorMessage: ''
		}
	},
	componentDidMount: function() {
		if(cs.cookie('user_id', document.cookie) && cs.cookie('token', document.cookie)) {
			cs.get('userstatus', (response) => {
				if(response.status === 'guest') {
					this.setState({ status: 'guest' });
					bella.event.emit('userStatusChange', { status: response.status }, this);
				}
				else if(response.status === 'loggedIn') {
					bella.event.emit('userStatusChange', { status: response.status }, this);
					this.setState({
						status: 'loggedIn',
						user: response.data
					});
				}
			});
		}
		else {
			this.setState({ status: 'guest' });
		}
	},
	render: function() {
		if(this.state.status === 'init') {
			return (
				<div>initializing...</div>
			);
		}
		else if(this.state.status === 'guest') {
			var errorMessage = this.state.errorMessage ?
				(
					<div>{this.state.errorMessage}</div>
				) : null;

			var popup = this.state.opened ? (
				<div className="bc-user-popup">
					{errorMessage}
					<input type="text" ref="name" defaultValue="a" /><br />
					<input type="text" ref="password" defaultValue="1" /><br />
					<button onClick={this.login}>Login</button>
				</div>
			) : null;

			return (
				<div className="bc-user">
					<a href="" onClick={this.click}>user</a>
					{popup}
				</div>
			);
		}
		else if(this.state.status === 'loggedIn') {
			var popup = this.state.opened ? (
				<div className="bc-user-popup">
					<a href="" onClick={this.logout}>logout</a>
				</div>
			) : null;

			return (
				<div className="bc-user">
					<a href="" onClick={this.click}>{this.state.user.name}</a>
					{popup}
				</div>
			);
		}
	},
	click: function(e) {
		e.preventDefault();
		this.setState({ opened: !this.state.opened });
	},
	login: function() {
		cs.post('login', {
			username: this.refs.name.value,
			password: this.refs.password.value
		}, (response) => {
			if(response.status === 'loggedIn') {
				bella.event.emit('userStatusChange', { status: response.status }, this);
				this.setState({
					errorMessage: '',
					status: 'loggedIn',
					user: response.data,
					opened: false
				});
			}
			else if(response.status === 'guest') {
				bella.event.emit('userStatusChange', { status: response.status }, this);
				this.setState({ errorMessage: response.errorMessage });
			}
		});
	},
	logout: function(e) {
		e.preventDefault();
		cs.get('logout', (response) => {
			if(response.status === 'guest') {
				bella.event.emit('userStatusChange', { status: response.status }, this);
				this.setState({
					status: 'guest',
					username: '',
					opened: false
				});
			}
		});
	}
});

ReactDOM.render(
	<User />,
	document.getElementById('bc-user-container')
);
