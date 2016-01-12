var cs = require('../helpers/cs');

var QuestListPage = React.createClass({
	componentDidMount: function() {
		bella.data.user.subscribe((user) => {
			// do what you want!
		});
	},
	render: function() {
		return (
			<div className="bc-quest-list-page">
				<h1>Quests</h1>
				<QuestList />
			</div>
		);
	}
});

var QuestList = React.createClass({
	getInitialState: function() {
		return { questList: {} }
	},
	componentDidMount: function() {
		cs.get('quest_list', (response) => {
			this.setState({questList: response.data});
		});
	},
	render: function() {
		var questList = _.map(this.state.questList, function(quest, key) {
			return (
				<Quest
					key={key}
					questId={quest.id}
					title={quest.title}
					description={quest.description} />
			);
		});

		return (
			<div className="bc-quest-list">
				<a href="/quest.html">New Quest</a><br />
				{questList}
			</div>
		);
	}
});

var Quest = React.createClass({
	render: function() {
		var link = '/quest.html?quest_id=' + this.props.questId;

		return (
			<div className="bc-quest">
				<div><span>title: </span><a href={link}>{this.props.title}</a></div>
			</div>
		);
	}
});

ReactDOM.render(
	<QuestListPage />,
	document.getElementById('main-section')
);
