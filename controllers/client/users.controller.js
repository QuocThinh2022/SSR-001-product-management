const User = require('../../models/user.model')

const usersSocket = require('../../sockets/client/users.socket')

// [GET] /users/not-friend 
async function getNotFriend(req, res) {
    // Socket
    usersSocket(res);
    // end socket 

    const userId = res.locals.user.id;
    const myUser = await User.findById(userId).select('requestFriends acceptFriends');
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const users = await User.find({
        $and: [
            {_id: {$ne: userId}},
            {_id: {$nin: requestFriends}},
            {_id: {$nin: acceptFriends}},
        ],
        status: 'active',
        deleted: false,
    }).select('avatar fullname');

    res.render('client/pages/users/not-friend.pug', {
        pagaTitle: 'Danh sach nguoi dung',
        users,
    })
}


module.exports = {
    getNotFriend,

}