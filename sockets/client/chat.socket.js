const Chat = require('../../models/chat.model')


const uploadToCloudinary = require('../../helpers/uploadToCloudinary')

module.exports = async (res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;

    // SocketIO 
    _io.once('connection', (socket) => {
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
                content: data.content,
                images: images
            })
            await chat.save();

            // tra data ve Client
            _io.emit('SERVER_RETURN_MESSAGE', {
                userId: userId,
                fullname: fullname,
                content: data.content,
                images: images
            })
        })

        socket.on('CLIENT_SEND_TYPING', (type) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                userId: userId,
                fullname: fullname,
                type: type
            })
        })
    });
    // end socketIO
}