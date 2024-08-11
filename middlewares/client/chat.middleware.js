const RoomChat = require('../../models/room-chat.model')

module.exports.isAccess = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const roomChatId = req.params.roomChatId;
        
        const isAccessRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            'users.user_id': userId,
        })
        
        if (!isAccessRoomChat) {
            res.redirect('/users/friends');
            return ;
        }

        next();
    } catch {
        res.redirect('/users/friends');
    }
}