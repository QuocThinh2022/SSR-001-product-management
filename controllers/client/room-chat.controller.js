
const User = require('../../models/user.model');
const RoomChat = require('../../models/room-chat.model')

// [GET] /rooms-chat 
async function index(req, res) {
    const rooms = await RoomChat.find({
        'users.user_id': res.locals.user.id,
        typeRoom: 'group',
    }).select('title avatar');

    res.render('client/pages/rooms-chat/index', {
        pageTitle: 'room chat',
        rooms
    })
}

// [GET] /rooms-chat/create 
async function getCreate(req, res) {
    const friendList = res.locals.user.friendList;
    for (const friend of friendList) {
        const infoFriend = await User.findById(friend.user_id).select('fullname avatar')
        friend.infoFriend = infoFriend
    }

    res.render('client/pages/rooms-chat/create', {
        pageTitle: 'Create Room',
        friendList,
    })
}

// [POST] /rooms-chat/create 
async function create(req, res) {
    const title = req.body.title;
    const usersId = req.body.usersId;
    
    if (Array.isArray(usersId) && usersId.length >= 2) {
        const dataChat = {
            title,
            typeRoom: 'group', 
            users: []
        }

        usersId.forEach(userId => {
            dataChat.users.push({
                user_id: userId,
                role: 'user'
            })
        })
        dataChat.users.push({
            user_id: res.locals.user.id,
            role: 'superAdmin'
        })
        const room = new RoomChat(dataChat)
        await room.save();
        res.redirect(`/chat/${room.id}`)
        return ;
    }
    
    req.flash('error', 'Phai chon tu 2 nguoi tro len')
    res.redirect('back')
}

module.exports = {
    index,
    getCreate,
    create,

}