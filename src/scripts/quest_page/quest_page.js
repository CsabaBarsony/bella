var cs = require('../helpers/cs');
var Quest = require('../classes').Quest;
var User = require('../classes').User;

var QuestPage = React.createClass({
	getInitialState: function() {
		return {
			status: 'init',
			quest: {}
		};
	},
	componentDidMount: function() {
		var questId = cs.getQueryValue(document.location.search, 'quest_id');

		bella.event.subscribe('userStatusChange', (details) => {
			this.setState({ status: details.status });
		});

		if(questId) {
			cs.get('/quest?quest_id=' + questId, (response) => {
				if(response.result === 'success') {
					this.setState({
						quest: response.data,
						status: 'ready'
					});
				}
				else if(response.result === 'fail') {
					this.setState({
						status: 'not_found'
					});
				}
				else {
					console.error('Quest request error');
					this.setState({
						status: 'error'
					});
				}
			});
		}
		else {
			this.setState({
				quest: new Quest(),
				status: 'ready'
			});
		}
	},
	render: function() {
		var page;

		if(this.state.status === 'init') {
			page = (<div>init</div>);
		}
		else if(this.state.status === 'not_found') {
			page = (<div>not found</div>);
		}
		else if(this.state.status === 'error') {
			page = (<div>error</div>);
		}
		// Itt tartok: account status és component status összevesznek.
		else if(this.state.status === 'ready') {
			page = (
				<div className="bc-quest-page">
					<h1>Quest</h1>
					<RCQuest
						quest={this.state.quest}
						own={this.state.quest.user.id === cs.cookie('user_id', document.cookie)}
						loggedIn={this.state.status === 'loggedIn'} />
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
