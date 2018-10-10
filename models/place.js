const mongoose = require('mongoose');
			// uuid = require('uuid');

let placeSchema = new mongoose.Schema({
    name: String, 
    description: String,
    mainImage: String,
    // _id: { 
    //   type: String, 
    //   index: { unique: true }, 
    //   default: uuid.v4 
    // },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photo"
      }
    ]
});



module.exports = mongoose.model('Place', placeSchema);