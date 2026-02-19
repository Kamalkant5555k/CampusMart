const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Books', 'Electronics', 'Hostel Items', 'Other items'],
        required: true
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Used'],
        default: 'Used'
    },
//     img: {
//     data: Buffer,
//     contentType: String
//   },

img: {
  type: String,  // store image path or cloud URL
  required: true
},


    // sellerName: {
    //     type: String,
    //     required: true
    // },
    // sellerContact: {
    //     type: String,
    //     required: true
    // },
    // collegeName: {
    //     type: String,
    //     required: true
    // },
    // location: {
    //     type: String,
    //     default: 'Campus'
    // },
    // isAvailable: {
    //     type: Boolean,
    //     default: true
    // }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
