var _ = require('lodash');

module.exports = {
	wish: {
		blank: function() {
			return {
				title: '',
				description: '',
				dirty: true
			}
		},
		client: {
			type: 'object',
			properties: {
				id: { type: ['string', 'null'], optional: true },
				title: { type: 'string' },
				description: { type: 'string' },
				user: {
					type: 'object',
					optional: true,
					properties: {
						id: { tpye: 'string' },
						name: { type: 'string' }
					}
				},
				dirty: { type: 'boolean' }
			}
		},
		server: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				title: { type: 'string' },
				description: { type: 'string' },
				user: {
					type: 'object',
					properties: {
						id: { tpye: 'string' },
						name: { type: 'string' }
					}
				}
			}
		},
		clientToServer: function(obj) {

		},
		serverToClient: function(obj) {
			obj.dirty = false;
			return _.clone(obj);
		}
	},
	user: {
		blank: function() {
			return {
				id: null,
				name: '',
				status: bella.constants.userStatus.GUEST
			}
		},
		client: {
			type: 'object',
			properties: {
				id: { type: ['string', 'null'], optional: true },
				name: { type: 'string' },
				status: { type: 'string', eq: _.values(bella.constants.userStatus) }
			}
		},
		server: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				name: { type: 'string' },
				status: { type: 'string', eq: _.values(bella.constants.userStatus) }
			}
		},
		clientToServer: function(obj) {

		},
		serverToClient: function(obj) {

		}
	}
};
