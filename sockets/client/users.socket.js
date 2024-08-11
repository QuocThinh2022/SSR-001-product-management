const User = require('../../models/user.model')
const RoomChat = require('../../models/room-chat.model')


module.exports = async (res) => {

    _io.once('connection', (socket) => {
        // nguoi dung gui yeu cau ket ban
        socket.on('CLIENT_ADD_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id; 
            // console.log(myUserId) // id cua A
            // console.log(userId) // id cua B
            // them id cua A vao acceptFriends cua B
            const exisUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });
            if (!exisUserAInB) {
                await User.findByIdAndUpdate(userId, {
                    $push: {acceptFriends : myUserId}
                })
            } 
            
            // them id cua B vao requestFriends cua A
            const exisUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });
            if (!exisUserBinA) {
                await User.findByIdAndUpdate(myUserId, {
                    $push: {requestFriends : userId}
                })
            }

            //  Lay do dai acceptFriends cua B va tra ve cho B
            const infoUserB = await User.findById(userId).select('acceptFriends');
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIENDS', {
                userId,
                lengthAcceptFriends,
            })

            // Lay thong tin cua ong A tra ve cho B
            const infoUserA = await User.findById(myUserId).select('avatar fullname')
            socket.broadcast.emit('SERVER_RETURN_INFO_ACCEPT_FRIENDS', {
                userId,
                infoUser: infoUserA
            })

        })

        // nguoi dung huy yeu ket ban
        socket.on('CLIENT_CANCEL_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id; 
            // xoa id cua A trong acceptFriends cua B
            const exisUserAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });
            if (exisUserAInB) {
                await User.findByIdAndUpdate(userId, {
                    $pull: {acceptFriends : myUserId}
                })
            } 
            
            // Xoa id cua B trong requestFriends cua A
            const exisUserBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });
            if (exisUserBinA) {
                await User.findByIdAndUpdate(myUserId, {
                    $pull: {requestFriends : userId}
                })
            } 

            //  Lay do dai acceptFriends cua B va tra ve cho B
            const infoUserB = await User.findById(userId).select('acceptFriends');
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIENDS', {
                userId,
                lengthAcceptFriends,
            })

            // lay userId cua A tra ve cho B
            socket.broadcast.emit('SERVER_RETURN_USER_ID_CANCEL_FRIEND', {
                userId,
                userIdA: myUserId
            })
        })

        // nguoi dung tu choi ket ban
        socket.on('CLIENT_REFUSE_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id; 
            // xoa id cua B trong acceptFriends cua A
            const exisUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });
            if (exisUserAInB) {
                await User.findByIdAndUpdate(myUserId, {
                    $pull: {acceptFriends : userId}
                })
            } 
            
            // Xoa id cua A trong requestFriends cua B
            const exisUserBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            if (exisUserBinA) {
                await User.findByIdAndUpdate(userId, {
                    $pull: {requestFriends : myUserId}
                })
            } 
        })

        // nguoi dung chap nhan ket ban
        socket.on('CLIENT_ACCEPT_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id; 

            const exisUserAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });
            
            const exisUserBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });

            // tao phong chat
            let roomChat;
            if (exisUserAInB && exisUserBinA) {
                roomChat = new RoomChat({
                    typeRoom: 'friend',
                    users: [
                        {
                            user_id: userId,
                            role: 'superAdmin'
                        },
                        {
                            user_id: myUserId,
                            role: 'superAdmin'
                        }
                    ]
                })
                await roomChat.save();
            }

            // xoa id cua B trong acceptFriends cua A
            // them id cua B vao friednList cua A
            if (exisUserAInB) {
                await User.findByIdAndUpdate(myUserId, {
                    $pull: {acceptFriends : userId},
                    $push: {friendList: {user_id: userId, room_chat_id: roomChat.id}}
                })
            } 
            
            // Xoa id cua A trong requestFriends cua B
            // them id cua A vao friednList cua B
            if (exisUserBinA) {
                await User.findByIdAndUpdate(userId, {
                    $pull: {requestFriends : myUserId},
                    $push: {friendList: {user_id: myUserId, room_chat_id: roomChat.id}}
                })
            } 

        })
    });
}