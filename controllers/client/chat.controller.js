// Khi A gui data len server, server chi tra ve cho A
// use case: vd khi A gui tin nhan nhung bi loi, thi server chi tra ve thong bao loi cho A thoi
// socket.emit('SERVER_RETURN_MESSAGE', data)

// Khi A gui data len server, server tra ve cho ca A, B, C
// use case: vd tin nhan chat
// io.emit('SERVER_RETURN_MESSAGE', data)

// Khi A gui data len server, server chi tra ve cho B, C...(khong tra ve cho A)
// usecase: vd Sinh nhat cua A -> thong bao cho B, C
// vd typing... thi B, C se thay dang soan tin...
// socket.broadcast.emit('SERVER_RETURN_MESSAGE', data)

const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')

const uploadToCloudinary = require('../../helpers/uploadToCloudinary')

async function index(req, res) {
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

    //Lay ra data
    const chats = await Chat.find({deleted: false});
    for (const chat of chats) {
        const infoUser = await User.findById(chat.user_id).select('fullname');
        chat.infoUser = infoUser;
    }

    res.render('client/pages/chat/index', {
        pageTitle: 'chat',
        chats,
    })
}

module.exports = {
    index,

}