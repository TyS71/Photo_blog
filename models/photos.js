const mongoose = require('mongoose');


let photoSchema = new mongoose.Schema({
		image: String
});


module.exports = mongoose.model('photo', photoSchema);