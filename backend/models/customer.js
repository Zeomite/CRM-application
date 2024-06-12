const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    googleid: { type: String},
    email: { type: String, required: true, unique: true },
    img:{ type: String},
    password:{ type: String},
    totalSpends: { type: Number, default: 0 },
    numberOfVisits: { type: Number, default: 1}, 
    lastVisit: { type: Date, default: Date.now },
    isCampaigner: {type: Boolean, default: false}
});

module.exports = mongoose.model('Customer', CustomerSchema);
