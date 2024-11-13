const mongoose = require('mongoose');

const praikiFeesSchema = new mongoose.Schema({
    id:{
        type:Number,
    },
    fees: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['0', '1'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'praiki_fees' });

praikiFeesSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
        PraikiFees.countDocuments({}, function (err, count) {
            if (err) {
                return next(err);
            }
            doc.id = count + 1;
            next();
        });
    } else {
        next();
    }
});

const PraikiFees = mongoose.model('PraikiFees', praikiFeesSchema);

module.exports = PraikiFees;