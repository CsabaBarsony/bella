module.exports = {
	Quest: class Quest {
		constructor(id, userId, title = '', description = '', dirty = false) {
			this.id = id;
			this.userId = userId;
			this.title = title;
			this.description = description;
			this.dirty = dirty;
		}
	}
};
