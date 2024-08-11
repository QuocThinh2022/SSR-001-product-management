
const mongoose = require('mongoose');

const generate = require('../helpers/generate')

const userSchema = new mongoose.Schema(
    {
        fullname: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(30)
        },
        phone: String,
        avatar: String,
        friendList: [
            {
                user_id: String,
                room_chat_id: String
            }
        ],
        acceptFriends: Array,
        requestFriends: Array,
        statusOnline: String,
        status: {
            type: String,
            default: 'active'
        },
        deleted: {
            type: Boolean,
            default: false,
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('User', userSchema, 'users')