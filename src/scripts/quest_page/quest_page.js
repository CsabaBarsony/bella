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
var server = require('../server');

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
			server.data.wish.get(questId, (response, quest) => {
			//cs.get('/quest?quest_id=' + questId, (response) => {
				if(response.result) {
					this.setState({
						quest: quest,
						status: statuses.READY
					});
				}
				else {
					console.log('get quest error', response.message)
					this.setState({
						status: statuses.NOT_FOUND
					});
				}
			});
		}
		else {
			this.setState({
				quest: factory.quest(bella.data.user.get()),
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
		else if(this.state.status === statuses.SAVING) {
			page = (<div>saving</div>);
		}
		else if(this.state.status === statuses.READY) {
			page = (
				<div className="bc-quest-page">
					<h1>Quest</h1>
					<RCQuest
						quest={this.state.quest}
						own={this.state.quest.user && this.state.quest.user.id === cs.cookie('user_id', document.cookie)}
						loggedIn={this.state.loggedIn}
						save={this.save} />
				</div>
			);
		}

		return page;
	},
	save: function(title, description) {
		this.setState({ status: statuses.SAVING });

		cs.post('/quest', update(this.state.quest, { title: { $set: title }, description: { $set: description } }), (response) => {
			if(response.result === bella.constants.server.result.SUCCESS) {
				window.location.href = '/quest_list.html';
				//this.setState({
				//	quest: factory.quest(response.data.user, response.data),
				//	status: statuses.READY
				//});
			}
			if(response.result === bella.constants.server.result.FAIL) {
				console.error('post quest error');
			}
		});
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
		var saveButton = this.props.quest.dirty || this.state.edit ? (
			<button onClick={this.save}>Save</button>
		) : null;
		var title = this.state.edit ?
			(<input type="text" defaultValue={this.props.quest.title} ref="title" />) :
			(<span>{this.props.quest.title}</span>);
		var description = this.state.edit ?
			(<textarea cols="30" rows="10" defaultValue={this.props.quest.description} ref="description"></textarea>) :
			(<span>{this.props.quest.description}</span>);
		var user = this.props.quest.user.id ?
			(<tr>
				<td>user:</td>
				<td>{this.props.quest.user.name}</td>
			</tr>) :
			null;

		return (
			<div>
				<table>
					<tbody>
						{user}
						<tr>
							<td>title:</td>
							<td>{title}</td>
						</tr>
						<tr>
							<td>description:</td>
							<td>{description}</td>
						</tr>
						<tr>
							<td>{saveButton} {toggleEditButton}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	},
	toggleEdit: function() {
		this.setState({ edit: !this.state.edit });
	},
	save: function() {
		this.props.save(this.refs.title.value, this.refs.description.value);
		this.setState({ edit: false });
	}
});

ReactDOM.render(
	<QuestPage />,
	document.getElementById('main-section')
);
