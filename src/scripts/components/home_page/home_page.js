var HomePage = React.createClass({
	componentDidMount: function() {
		bella.data.user.subscribe((user) => {
			// do what you want!
		});
	},
	render: function() {
		return (
			<div className="bc-home-page">
				<h1>Home</h1>
				<ul>
					<li>
						<a href="/quest_list.html">Quests</a>
					</li>
				</ul>
			</div>
		);
	}
});

ReactDOM.render(
	<HomePage />,
	document.getElementById('main-section')
);
