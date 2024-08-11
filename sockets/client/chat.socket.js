const Chat = require('../../models/chat.model')


const uploadToCloudinary = require('../../helpers/uploadToCloudinary')

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;
    const roomChatId = req.params.roomChatId;

    // SocketIO 
    _io.once('connection', (socket) => {
        socket.join(roomChatId);

        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            // up len clound 
            let images = []
            if (data.images) {
                for (const imageBuffer of data.images) {
                    const link = await uploadToCloudinary(imageBuffer);
                    images.push(link);
                }
            }
            // luu vao database
            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId,
                content: data.content,
                images: images
            })
            await chat.save();

            // tra data ve Client
            _io.to(roomChatId).emit('SERVER_RETURN_MESSAGE', {
                userId: userId,
                fullname: fullname,
                content: data.content,
                images: images
            })
        })

        socket.on('CLIENT_SEND_TYPING', (type) => {
            socket.broadcast.to(roomChatId).emit('SERVER_RETURN_TYPING', {
                userId: userId,
                fullname: fullname,
                type: type
            })
        })
    });
    // end socketIO
}