var cs = require('../../helpers/cs');

var User = React.createClass({
	getInitialState: function() {
		var user = bella.data.user.get();

		return {
			status: user.status,
			userName: user.name,
			opened: false,
			errorMessage: ''
		}
	},
	componentDidMount: function() {
		bella.data.user.subscribe((user) => {
			this.setState({
				status: user.status,
				userName: user.name
			});
		});

		if(cs.cookie('user_id', document.cookie) && cs.cookie('token', document.cookie)) {
			cs.get('userstatus', (response) => {
				if(response.result === bella.constants.server.result.SUCCESS) {
					bella.data.user.set(response.data.user, this);
				}
			});
		}
		else {
			bella.user.set('status', bella.constants.userStatus.GUEST, this);
		}
	},
	render: function() {
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
	click: function(e) {
		e.preventDefault();
		this.setState({ opened: !this.state.opened });
	},
	login: function() {
		cs.post('login', {
			username: this.refs.name.value,
			password: this.refs.password.value
		}, (response) => {
			if(response.result === bella.constants.server.result.SUCCESS) {
				bella.data.user.set(response.data, this);
				this.setState({
					errorMessage: '',
					opened: false
				});
			}
			else if(response.result = bella.constants.server.result.FAIL) {
				bella.data.user.set({ status: bella.constants.userStatus.GUEST }, this);
				this.setState({ errorMessage: response.data.errorMessage });
			}
		});
	},
	logout: function(e) {
		e.preventDefault();
		cs.get('logout', (response) => {
			if(response.result === bella.constants.server.result.SUCCESS) {
				bella.data.user.set({
					id: null,
					name: '',
					status: bella.constants.userStatus.GUEST
				}, this);
				this.setState({ opened: false });
			}
		});
	}
});

ReactDOM.render(
	<User />,
	document.getElementById('bc-user-container')
);
