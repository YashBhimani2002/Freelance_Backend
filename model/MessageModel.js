const mongoose = require('mongoose');

const tblMessageSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    message_type: {
        type: String
    },
    file: {
        type: String
    },
    send_message_date: {
        type: Date
    },
    reading_status: {
        type: String
    },
    user_type: {
        type: String,
        default: null
    },
    job_id: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const tblMessage = mongoose.model('tbl_message', tblMessageSchema);

module.exports = tblMessage;

//Laravel Code

// public static function Message_by_job_id($job_id) {
//     $cnt = Messages::where('job_id', $job_id)->count();
//     return $cnt;
// }
// public static function Message_by_rec_id($user_id,$jid) {
//     $cnt = Messages::where('receiver_id', $user_id)->where('job_id', $jid)->count();
//     return $cnt;
// }
