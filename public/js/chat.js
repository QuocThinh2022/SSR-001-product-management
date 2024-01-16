import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'


// file up load with preview 
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
});

// end file up load with preview 

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('.chat .inner-form')
if (formSendData) {
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const images = upload.cachedFileArray || [];
        const content = e.target.elements.content.value;
        if (content || images.length > 0) {
            socket.emit('CLIENT_SEND_MESSAGE', {
                content: content,
                images: images
            });
            e.target.elements.content.value = '';
            upload.resetPreviewPanel();
            socket.emit('CLIENT_SEND_TYPING', 'hidden');

        }
    })
}

// END CLIENT_SEND_MESSAGE 

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const myId = document.querySelector('[my-id]').getAttribute('my-id');
    const bodyChat = document.querySelector('.chat .inner-body');
    const div = document.createElement('div');

    let fullNameDisplay = '';
    let contentDisplay = '';
    let imagesDisplay = '';

    if (myId == data.userId)
        div.classList.add('inner-outgoing');
    else {
        div.classList.add('inner-incoming');
        fullNameDisplay = `<div class='inner-name'>${data.fullname}</div>`;
    }

    if (data.content) {
        contentDisplay = `<div class='inner-content'>${data.content}</div>`
    }

    if (data.images) {
        imagesDisplay += `<div class="inner-images">`;
        for (const image of data.images) {
            imagesDisplay += `
            <img src="${image}">
          `;
        }
        imagesDisplay += `</div>`;
    }


    div.innerHTML = `
        ${fullNameDisplay}
        ${contentDisplay}
        ${imagesDisplay}
    `;
    bodyChat.appendChild(div);
    bodyChat.scrollTop = bodyChat.scrollHeight;
})

// End SERVER_RETURN_MESSAGE


// scroll chat to bottom 
const bodyChat = document.querySelector('.chat .inner-body');
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end scroll chat to bottom 

// emoji picker 
// show popup 
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}


let timeOut; // dung cho typing...
// show typing... 
function showTyping() {
    socket.emit('CLIENT_SEND_TYPING', 'show');
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        socket.emit('CLIENT_SEND_TYPING', 'hidden');
    }, 1000)
}

const inputChat = document.querySelector('.chat .inner-form input[name="content"]');
if (inputChat) {
    inputChat.addEventListener('keyup', () => showTyping())
}
// end show typing... 

// insert icon to input
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    emojiPicker.addEventListener('emoji-click', event => {
        const inputChat = document.querySelector('.chat .inner-form input[name="content"]');
        let icon = event.detail.unicode;
        inputChat.value += icon;
        inputChat.setSelectionRange(-1, -1);
        inputChat.focus();
        // show typing
        showTyping();
    });

}
// end emoji picker 


// SERVER_RETURN_TYPING 
const elementListTyping = document.querySelector('.chat .inner-list-typing')
if (elementListTyping) {
    socket.on('SERVER_RETURN_TYPING', (data) => {
        if (data.type == 'show') {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`)

            if (!existTyping) {
                const boxTyping = document.createElement('div');
                boxTyping.classList.add('box-typing');
                boxTyping.setAttribute('user-id', data.userId);
                boxTyping.innerHTML = `
                    <div class="inner-name"> ${data.fullname}
                        <div class="inner-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                `;
                elementListTyping.appendChild(boxTyping);
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });

}
// end SERVER_RETURN_TYPING 