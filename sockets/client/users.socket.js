const User = require('../../models/user.model')



module.exports = async (res) => {

    _io.once('connection', (socket) => {
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

        })
    });
}