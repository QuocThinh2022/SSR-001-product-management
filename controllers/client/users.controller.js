const User = require('../../models/user.model')

const usersSocket = require('../../sockets/client/users.socket')

// [GET] /users/not-friend 
async function getNotFriend(req, res) {
    // Socket
    usersSocket(res);
    // end socket 

    const userId = res.locals.user.id;
    const myUser = await User.findById(userId).select('requestFriends acceptFriends friendList');
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const friendList = myUser.friendList.map(item => item.user_id);
    const users = await User.find({
        $and: [
            {_id: {$ne: userId}},
            {_id: {$nin: requestFriends}},
            {_id: {$nin: acceptFriends}},
            {_id: {$nin: friendList}}
        ],
        status: 'active',
        deleted: false,
    }).select('avatar fullname');

    res.render('client/pages/users/not-friend.pug', {
        pagaTitle: 'Danh sach nguoi dung',
        users,
    })
}

// [GET] /users/request 
async function getRequest(req, res) {
    // Socket
    usersSocket(res);
    // end socket 
    const userId = res.locals.user.id;

    const myUser = await User.findById(userId).select('requestFriends')
    const requestFriends = myUser.requestFriends;

    const users = await User.find({
        _id: {$in: requestFriends},
        status: 'active',
        deleted: false,
    }).select('avatar fullname')


    res.render('client/pages/users/request.pug', {
        pageTitle: 'loi moi da gui',
        users
    })
}

// [GET] /users/accept
async function getAccept(req, res) {
    // Socket
    usersSocket(res);
    // end socket 
    const userId = res.locals.user.id;

    const myUser = await User.findById(userId).select('acceptFriends')
    const acceptFriends = myUser.acceptFriends;

    const users = await User.find({
        _id: {$in: acceptFriends},
        status: 'active',
        deleted: false,
    }).select('avatar fullname')


    res.render('client/pages/users/accept.pug', {
        pageTitle: 'loi moi ket ban',
        users
    })
}

async function getFriends(req, res) {
    // Socket
    usersSocket(res);
    // end socket 
    
    const userId = res.locals.user.id;
    const myUser = await User.findById(userId).select('friendList')
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);

    const users = await User.find({
        _id: {$in: friendListId},
        status: 'active',
        deleted: false,
    }).select('avatar fullname statusOnline')

    users.forEach(user => {
        const infoUser = friendList.find(friend => friend.user_id == user.id);
        user.roomChatId = infoUser.room_chat_id;
    })


    res.render('client/pages/users/friends.pug', {
        pageTitle: 'loi moi ket ban',
        users
    })
}

module.exports = {
    getNotFriend,
    getRequest,
    getAccept,
    getFriends,

}