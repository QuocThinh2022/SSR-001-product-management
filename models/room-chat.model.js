const mongoose = require('mongoose')

const roomChatSchema = new mongoose.Schema(
{
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [
        {
            user_id: String,
            role: String,
            
        }
    ]
},
{
    timestamps: true   
})

module.exports = mongoose.model('RoomChat', roomChatSchema, 'rooms-chat')