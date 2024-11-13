const mongoose = require('mongoose');
const { Schema } = mongoose;

const identity_table= new Schema({
    user_id: {
        type: String,
        ref:"User"
    },
    document:[
        {
            documentType:{type: String},
            fileName:{type: String},
        }
    ],
    status:{type:Number},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

const identityTable = mongoose.model('identity_table', identity_table);

module.exports = identityTable;