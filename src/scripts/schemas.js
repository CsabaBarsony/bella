module.exports = {
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
                    name: {type: 'string' }
                } }

        }
    }
};
