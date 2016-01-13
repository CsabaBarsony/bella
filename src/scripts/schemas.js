module.exports = {
	wish: {
		client: {
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
				},
				dirty: { type: 'boolean' }
			}
		},
		server: {
			wish: {
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
			}
		},
		clientToServer: function(obj) {

		},
		serverToClient: function(obj) {
			obj.dirty = false;
			return _.clone(obj);
		}
	}
};
