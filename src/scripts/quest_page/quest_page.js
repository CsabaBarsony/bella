var cs = require('../helpers/cs');
var Quest = require('../classes').Quest;
var User = require('../classes').User;
var statuses = {
	INIT: 'INIT',
	READY: 'READY',
	NOT_FOUND: 'NOT_FOUND',
	ERROR: 'ERROR'
};

var QuestPage = React.createClass({
	getInitialState: function() {
		return {
			status: statuses.INIT,
			quest: {},
			loggedIn: bella.data.user.status === bella.constants.userStatus.LOGGED_IN
		};
	},
	componentDidMount: function() {
		var questId = cs.getQueryValue(document.location.search, 'quest_id');

		bella.data.user.subscribe((user) => {
			this.setState({ loggedIn: user.status === bella.constants.userStatus.LOGGED_IN});
		});

		if(questId) {
			cs.get('/quest?quest_id=' + questId, (response) => {
				if(response.result === bella.constants.server.result.SUCCESS) {
					this.setState({
						quest: response.data,
						status: statuses.READY
					});
				}
				else if(response.result === bella.constants.server.result.FAIL) {
					this.setState({
						status: statuses.NOT_FOUND
					});
				}
				else {
					console.error('Quest request error');
					this.setState({
						status: statuses.ERROR
					});
				}
			});
		}
		else {
			this.setState({
				quest: new Quest(),
				status: statuses.READY
			});
		}
	},
	render: function() {
		var page;

		if(this.state.status === statuses.INIT) {
			page = (<div>init</div>);
		}
		else if(this.state.status === statuses.NOT_FOUND) {
			page = (<div>not found</div>);
		}
		else if(this.state.status === statuses.ERROR) {
			page = (<div>error</div>);
		}
		else if(this.state.status === statuses.READY) {
			page = (
				<div className="bc-quest-page">
					<h1>Quest</h1>
					<RCQuest
						quest={this.state.quest}
						own={this.state.quest.user.id === cs.cookie('user_id', document.cookie)}
						loggedIn={this.state.loggedIn} />
				</div>
			);
		}

		return page;
	}
});

var RCQuest = React.createClass({
	getInitialState: function() {
		return { edit: !this.props.quest.id };
	},
	render: function() {
		var toggleEditButton = (this.props.own && this.props.loggedIn) ? (
			<button onClick={this.toggleEdit}>{this.state.edit ? 'Cancel' : 'Edit'}</button>
		) : null;
		var saveButton = this.props.quest.dirty ? (
			<button>Save</button>
		) : null;
		var title = this.props.quest.id ?
			(<span>{this.props.quest.title}</span>) :
			(<input type="text" defaultValue={this.props.quest.title} />);
		var description = this.props.quest.id ?
			(<span>{this.props.quest.description}</span>) :
			(<textarea cols="30" rows="10" defaultValue={this.props.quest.description}></textarea>);
		var user = this.props.quest.user ?
			(<span>{this.props.quest.user.name}</span>) :
			null;

		return (
			<div>
				<span>user: </span>{user}<br />
				<span>title: </span>{title}<br />
				<span>description: </span>{description}<br />
				{saveButton}
				{toggleEditButton}
			</div>
		);
	},
	toggleEdit: function() {
		this.setState({ edit: !this.state.edit });
	}
});

ReactDOM.render(
	<QuestPage />,
	document.getElementById('main-section')
);
