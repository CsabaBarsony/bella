var cs = require('./helpers/cs');
var inspector = require('schema-inspector');
var schemas = require('./schemas');

module.exports = {
    data: {
        wish: {
            get: function(id, callback) {
                cs.get('/quest?quest_id' + id, (response) => {
                    if(response.result === bella.constants.server.result.SUCCESS) {
                        var sResult = inspector.validation(schemas.wish, response.data);
                        debugger
                    }
                    else if(response.result === bella.constants.server.result.FAIL) {

                    }
                });
            },
            post: function(wish) {
                cs.post('/quest')
            }
        }
    }
};
