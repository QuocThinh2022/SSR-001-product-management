// chuc nang gui yeu cau 
const listBtnAddFriend = document.querySelectorAll('[btn-add-friend]');
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.box-user').classList.add('add');

            const userId = button.getAttribute('btn-add-friend')
            socket.emit('CLIENT_ADD_FRIEND', userId);
        })
    })
}

// end chuc nang gui yeu cau 

// chuc nang huy gui yeu cau 
const listBtnCancelFriend = document.querySelectorAll('[btn-cancel-friend]');
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.box-user').classList.remove('add');

            const userId = button.getAttribute('btn-cancel-friend')
            socket.emit('CLIENT_CANCEL_FRIEND', userId);
        })
    })
}

// end chuc nang huy gui yeu cau

// chuc nang tu choi ket ban
const listBtnRefuseFriend = document.querySelectorAll('[btn-refuse-friend]');
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.box-user').classList.add('refuse');

            const userId = button.getAttribute('btn-refuse-friend')
            socket.emit('CLIENT_REFUSE_FRIEND', userId);
        })
    })
}

// end chuc nang tu choi ket ban

// chuc nang chap nhan ket ban
const listBtnAcceptFriend = document.querySelectorAll('[btn-accept-friend]');
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.box-user').classList.add('accepted');

            const userId = button.getAttribute('btn-accept-friend')
            socket.emit('CLIENT_ACCEPT_FRIEND', userId);
        })
    })
}

// end chuc nang chap nhan ket ban

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on('SERVER_RETURN_LENGTH_ACCEPT_FRIENDS', (data) => {
    const badgeUsersAccept = document.querySelector('[badge-users-accept]');
    const userId = badgeUsersAccept.getAttribute('badge-users-accept');
    if (userId == data.userId) {
        badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
})
// end SERVER_RETURN_LENGTH_ACCEPT_FRIENDS

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on('SERVER_RETURN_INFO_ACCEPT_FRIENDS', (data) => {
    const dataUsersAccept = document.querySelector('[data-users-accept]');
    const userId = dataUsersAccept.getAttribute('data-users-accept');
    if (userId == data.userId) {
        // ve user ra giao dien
        const newBoxUser = document.createElement('div');
        newBoxUser.classList.add('col-6');
        newBoxUser.setAttribute('user-id', data.infoUser._id);
        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src='${data.infoUser.avatar}' alt='${data.infoUser.fullname}'>
                </div>
                <div class="inner-info">
                    <div class="inner-name">${data.infoUser.fullname}</div>
                    <div class="inner-buttons">
                        <button
                            class="btn btn-sm btn-primary mr-1"
                            btn-accept-friend='${data.infoUser._id}'
                        >
                            Chap nhan
                        </button>
                        <button
                            class="btn btn-sm btn-secondary mr-1"
                            btn-refuse-friend='${data.infoUser._id}'
                        >
                            Xoa
                        </button>
                        <button
                            class="btn btn-sm btn-secondary mr-1"
                            btn-deleted-friend="btn-deleted-friend"
                            disabled="disabled"
                        >
                            Da xoa
                        </button>
                        <button
                            class="btn btn-sm btn-primary mr-1"
                            btn-accepted-friend="btn-accepted-friend"
                            disabled="disabled"
                        >
                            Da chap nhan
                        </button>
                    </div>
                </div>
            </div>
        `;
        dataUsersAccept.appendChild(newBoxUser);

        // bat su kien tu choi loi moi ket ban
        const  btnRefuseFriend = newBoxUser.querySelector('[btn-refuse-friend]');
        btnRefuseFriend.addEventListener('click', () => {
            btnRefuseFriend.closest('.box-user').classList.add('refuse');

            const userId = btnRefuseFriend.getAttribute('btn-refuse-friend')
            socket.emit('CLIENT_REFUSE_FRIEND', userId);
        })
        // bat su kien chap nhan loi moi ket ban
        const  btnAcceptFriend = newBoxUser.querySelector('[btn-accept-friend]');
        btnAcceptFriend.addEventListener('click', () => {
            btnAcceptFriend.closest('.box-user').classList.add('accepted');

            const userId = btnAcceptFriend.getAttribute('btn-accept-friend')
            socket.emit('CLIENT_ACCEPT_FRIEND', userId);
        })
    }   
})
// end SERVER_RETURN_INFO_ACCEPT_FRIENDS

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on('SERVER_RETURN_USER_ID_CANCEL_FRIEND', (data) => {
    const dataUsersAccept = document.querySelector('[data-users-accept]')
    const userId = dataUsersAccept.getAttribute('data-users-accept')

    if (userId == data.userId) {
        // Xoa A khoi danh sach B
        const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`)
        if (boxUserRemove)
            dataUsersAccept.removeChild(boxUserRemove)
    }
})
// end SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_ONLINE
socket.on('SERVER_RETURN_USER_ONLINE', (userId) => {
    const dataUsersFriend = document.querySelector('[data-users-friend]');
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector('[status]').setAttribute('status', 'online');
        }
    }
})
// end SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFLINE
socket.on('SERVER_RETURN_USER_OFFLINE', (userId) => {
    const dataUsersFriend = document.querySelector('[data-users-friend]');
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector('[status]').setAttribute('status', 'offline');
        }
    }
})
// end SERVER_RETURN_USER_OFFLINE