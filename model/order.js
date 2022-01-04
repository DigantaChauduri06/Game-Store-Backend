const mongoose = require('mongoose');
const {Schema, model} = mongoose;
/*
    1. create order time,
    2. delivered time,
    3. state of delivary
    4. user
    5. user country name
    6. address information
    7. phone number,
    8. order information
    
*/
const orderSchema = new Schema({
    OrderTime :{
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        gmail: {
            type: String,
            required: true
        },
        countryCode: {
            type: String,
            minlength: 2, 
            maxlength: 3,
            required:true
            
        },
        phone: {
          type: Number,
          minlength: 10, 
          required: true
        },
    },
    item: {
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        }
    },
    paymentInfo: {
        id: {
            type: String
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: "processing",
        required: true
    },
    delivariedAt: {
        type: Date,
        // required: true
    }
});

module.exports = model('Order',orderSchema);