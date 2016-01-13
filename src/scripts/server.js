var cs = require('./helpers/cs');
var inspector = require('schema-inspector');
var schemas = require('./schemas');

module.exports = {
    data: {
        wish: {
            get: function(id, callback) {
                cs.get('/wish?id=' + id, (status, wish) => {
                    if(status === bella.constants.response.SUCCESS) {
						var validation = inspector.validate(schemas.wish.server, wish);
						if(!validation.valid) {
							console.error('wish validation error', validation.format());
						}
						callback({ success: true }, schemas.wish.serverToClient(wish));
                    }
                    else if(status === bella.constants.response.NOT_FOUND) {
						callback({ success: false, message: 'Wish not found' });
                    }
                });
            },
            post: function(wish) {
                cs.post('/quest')
            }
        }
    }
};
