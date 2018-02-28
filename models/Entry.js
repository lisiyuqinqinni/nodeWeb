var mongoose = require('mongoose');
var entrySchema = require('../schemas/entry');

module.exports = mongoose.model('Entry', entrySchema);