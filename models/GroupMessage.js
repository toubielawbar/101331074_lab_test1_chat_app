const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    date_sent: {
        type: String,
        required: true
    }
});

const GroupMessage = mongoose.model('Group Message', GroupMessageSchema);

module.exports = GroupMessage;