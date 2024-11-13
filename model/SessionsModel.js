const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    user_id: {
        type: Number,
        required: true,
    },
    ip_address: {
        type: String,
        required: true,
    },
    user_agent: {
        type: String,
        required: true,
    },
    payload: {
        type: String,
        required: true,
    },
    last_activity: {
        type: Number,
        required: true,
    },
}, { collection: 'sessions' });

sessionSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
        Session.countDocuments({}, function (err, count) {
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

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;