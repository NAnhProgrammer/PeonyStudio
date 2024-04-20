window.addEventListener('DOMContentLoaded', init)

let idChatSend = ''

function init() {
    const socket = io('https://mobile-react-native-workshop-server.onrender.com');
    getUserChats()
    handleSendMessage(socket)
}

const baseUrl = 'https://mobile-react-native-workshop-server.onrender.com'

const message_container = document.getElementById('message-container')

const postRequest = async (url, body) => {
    try {
        const response = await axios.post(url, body)

        let message;
        if (response.status !== 200) {
            message = response.status
            return message
        }
        return response.data

    } catch (error) {
        console.log('Errorr post request: ', error)
    }
}

const getRequest = async (url) => {
    try {
        const response = await axios.get(url)

        let message;
        if (response.status !== 200) {
            message = response.status
            return message
        }
        return response.data
    } catch (error) {
        console.log('Errorr post request: ', error)
    }
}

const getUserChats = async () => {

    const response = await postRequest(`${baseUrl}/find-user-chats`, { userId: 'admin31267' })

    response.forEach(async element => {
        const idUser = element.members.filter(item => item !== 'admin31267').join(',')
        const user = await getRequest(`${baseUrl}/get-user-by-id?id=${idUser}`)
        const latestMessage = await postRequest(`${baseUrl}/find-latest-message`, { chatId: element._id })

        const createdAt = new Date(latestMessage.createdAt);
        const formattedCreatedAt = `${createdAt.getDate() < 10 ? '0' + createdAt.getDate() : createdAt.getDate()}-${createdAt.getMonth() + 1 < 10 ? '0' + createdAt.getMonth() : createdAt.getMonth()}-${createdAt.getFullYear()} ${createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()}:${createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()}:${createdAt.getSeconds() < 10 ? '0' + createdAt.getSeconds() : createdAt.getSeconds()}`;

        rowUserChats(user.avatar, user.lastName + ' ' + user.firstName, latestMessage.text, formattedCreatedAt, element._id)

    });
}

const rowUserChats = (img, name, message, time, idChat) => {
    const chats_body = document.getElementById('chats-body')
    chats_body.innerHTML += `
    <div
        onclick="handleChatClick('Trò chuyện cùng ${name}', '${idChat}')"
        class="flex flex-row bg-gray-50 border border-gray-50 rounded-lg text-sm group-hover:bg-white dark:bg-gray-600 dark:border-gray-700 mb-2">
        <img src="${img}"
            style="width: 7rem; height: 7rem; object-fit: cover" class="rounded-md" />
        <div class="mx-1">
            <div>
            <p class="text-base text-gray-700 dark:text-white">${name}</p>
            <p class="text-sm text-gray-700 dark:text-white">${message}</p>
            <p class="text-xs mt-4 text-gray-700 dark:text-white">${time}</p>
            </div>
        </div>
    </div>
    `
    return chats_body
}

const createMessageCard = (idSender, message, time) => {
    const messageHtml = `
        <div class="w-full flex flex-row ${idSender !== 'admin31267' ? 'justify-start' : 'justify-end'} ">
            <div style="display: inline-block;"
                class="bg-gray-200 p-2 border w-auto border-gray-50 rounded-lg text-sm group-hover:bg-white dark:bg-gray-800 dark:border-gray-700 mb-2">
                <p class="text-sm text-gray-700 dark:text-white">${message}</p>
                <p class="text-xs mt-1 text-gray-700 dark:text-white" style="${idSender !== 'admin31267' ? 'float: left;' : 'float: right;'} ">${time}</p>
            </div>
        </div>
    `;
    message_container.insertAdjacentHTML('beforeend', messageHtml);
    message_container.scrollTop = message_container.scrollHeight; // Cuộn xuống dưới cùng
}

const handleChatClick = async (text, idChat) => {
    const chat_room = document.getElementById('chat-room')

    message_container.innerHTML = ''

    chat_room.innerText = text

    idChatSend = idChat

    const socket = io('https://mobile-react-native-workshop-server.onrender.com');
    // Khi client tham gia vào một phòng
    socket.emit('join-room', idChat);

    // Khi client nhận được tin nhắn mới
    socket.on('new-message', (message) => {
        reloadChatContainer(message.chatId)
    });

    const messages = await postRequest(`${baseUrl}/find-messages`, { chatId: idChat })
    messages.forEach(element => {
        const createdAt = new Date(element.createdAt);
        const formattedCreatedAt = `${createdAt.getDate() < 10 ? '0' + createdAt.getDate() : createdAt.getDate()}-${createdAt.getMonth() + 1 < 10 ? '0' + createdAt.getMonth() : createdAt.getMonth()}-${createdAt.getFullYear()} ${createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()}:${createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()}:${createdAt.getSeconds() < 10 ? '0' + createdAt.getSeconds() : createdAt.getSeconds()}`;

        createMessageCard(element.senderId, element.text, formattedCreatedAt)
    })
}

const handleSendMessage = (socket) => {
    const text_message = document.getElementById('text-message')
    const send = document.getElementById('send')

    send.addEventListener('click', async () => {
        if (idChatSend === '') {
            alert('Chưa xác định khách hàng')
            return
        }

        if(text_message.value === ''){
            return
        }

        const content = text_message.value

        const newMessage = {
            chatId: idChatSend,
            senderId: 'admin31267',
            text: content
        }

        const addMessage = await axios.post(`${baseUrl}/create-message`, newMessage)
        
        if (addMessage.status === 200) {
            socket.emit('message', { roomName: idChatSend, message: addMessage.data })
        }

        text_message.value = ''
    }
    )
}

const reloadChatContainer = async (idChat) => {
    const message = await postRequest(`${baseUrl}/find-latest-message`, { chatId: idChat })

    const createdAt = new Date(message.createdAt);
    const formattedCreatedAt = `${createdAt.getDate() < 10 ? '0' + createdAt.getDate() : createdAt.getDate()}-${createdAt.getMonth() + 1 < 10 ? '0' + createdAt.getMonth() : createdAt.getMonth()}-${createdAt.getFullYear()} ${createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()}:${createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()}:${createdAt.getSeconds() < 10 ? '0' + createdAt.getSeconds() : createdAt.getSeconds()}`;

    createMessageCard(message.senderId, message.text, formattedCreatedAt)

}

const getLatestMessage = async (chatId) => {
    try {
        const response = await axios.post(`${baseUrl}/find-latest-message`, { chatId });
        return response.data;
    } catch (error) {
        console.error('Error fetching latest message:', error);
        return null;
    }
};


