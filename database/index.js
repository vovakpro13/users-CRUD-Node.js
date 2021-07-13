const { connect } = require('mongoose');

const { config: { DB } } = require('../constants');

connect(DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
);

module.exports.models = require('./models');