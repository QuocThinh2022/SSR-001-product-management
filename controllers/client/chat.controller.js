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

const chatSocket = require('../../sockets/client/chat.socket')

async function index(req, res) {
    // socketIO  
    chatSocket(res);

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