window.addEventListener('DOMContentLoaded', init)

function init() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    handleShowData(id)
    popupImg(id)
}

const truncateString = (text, length) => {
    let result = ''
    text.length > length ? result = text.substring(0, length) + '...' : result = text
    return result
}

function generateRandomId(prefix) {
    const digits = '0123456789';

    // Tạo một chuỗi ngẫu nhiên gồm 4 chữ số
    let randomDigits = '';
    for (let i = 0; i < 5; i++) {
        randomDigits += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    // Kết hợp chuỗi text và chuỗi chứa các số ngẫu nhiên
    const randomId = `${prefix}${randomDigits}`;

    return randomId;
}

function showLoading() {
    document.getElementById("loading-popup").style.display = "flex";
}

// Hàm ẩn popup loading
function hideLoading() {
    document.getElementById("loading-popup").style.display = "none";
}

const popupImg = async id => {

    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-news-by-id', { params: { id: id } })
    const news = response.data[0]

    const addImg = document.getElementById('addImg')
    const closePopupImg = document.getElementById("closePopupImg");
    const popup = document.getElementById("add_image_popup");
    const add_images = document.getElementById('add_images')
    const err_add_images = document.getElementById('err_add_images')
    const btn_add_images = document.getElementById('btn_add_images')

    add_images.onclick = () => {
        err_add_images.innerText = ''
    }

    btn_add_images.onclick = async () => {
        if (add_images.files.length == 0) {
            err_add_images.innerText = 'Vui lòng chọn ảnh dịch vụ'
            return
        }

        try {

            const arrImg = await uploadImagesAndSaveToDatabase(add_images.files)

            arrImg.forEach(element => {
                news.images.push(element)
            })

            await handleUpdate(news)
            window.location.reload()

        } catch (err) { console.log(err.message) }

    }


    const openPopup = () => {
        popup.style.display = "block"; // Display the popup
    }

    // Function to close the popup
    const closePopup = () => {
        popup.style.display = "none"; // Hide the popup
    }

    // Event listener for opening the popup when button is clicked
    addImg.addEventListener("click", openPopup);

    // Event listener for closing the popup when close button is clicked
    closePopupImg.addEventListener("click", closePopup);
}

const createRowImg = (index, object, id) => {
    const image_tbody = document.getElementById('image_tbody')
    if (index == 0) {
        image_tbody.innerHTML += `
        <tr class="bg-gray-50 border border-gray-50 text-sm group-hover:text-white dark:bg-gray-500 dark:border-gray-700">
            <th scope="row"
                class="px-3 py-2 text-center font-sm text-red-500 whitespace-nowrap dark:text-red-700">
                ${index + 1}
            </th>
            <th class="px-3 py-2 text-red-500 text-center dark:text-red-700">
                ${object.id}
            </th>
            <td class="px-3 py-2 text-gray-700 flex item-center justify-center dark:text-white">
                <img src="${object.secureUrl}" style="width: 80px; height: 80px;object-fit: contain">
            </td>
            <td class="px-3 py-2 text-xs font-thin text-blue-600  dark:text-blue-400">
                <a href="${object.secureUrl}">${truncateString(object.secureUrl, 100)}</a>
            </td>
            <td class="px-3 py-2 text-lg text-center text-gray-700 dark:text-white">
                <a class="ti-trash" onClick="handleDeleteImg('${object.id}','${id}');"></a>
            </td>
        </tr>
        `
    } else {
        image_tbody.innerHTML += `
        <tr class="bg-gray-50 border border-gray-50 text-sm group-hover:text-white dark:bg-gray-500 dark:border-gray-700">
            <th scope="row"
                class="px-3 py-2 text-center font-sm text-gray-700 whitespace-nowrap dark:text-white">
                ${index + 1}
            </th>
            <th class="px-3 py-2 text-gray-700 text-center dark:text-white">
                ${object.id}
            </th>
            <td class="px-3 py-2 text-gray-700 flex item-center justify-center dark:text-white">
                <img src="${object.secureUrl}" style="width: 80px; height: 80px;object-fit: contain">
            </td>
            <td class="px-3 py-2 text-xs font-thin text-blue-600  dark:text-blue-400">
                <a href="${object.secureUrl}">${object.secureUrl}</a>
            </td>
            <td class="px-3 py-2 text-center text-lg text-gray-700 dark:text-white">
                <a class="ti-trash mx-1" onClick="handleDeleteImg('${object.id}','${id}');"></a>
                <a class="ti-arrow-up mx-1" onClick="handleSetAsAvatar('${object.id}','${id}');"></a>
            </td>
        </tr>
        `
    }
    return image_tbody
}

const handleShowData = async id => {

    showLoading()
    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-news-by-id', { params: { id: id } })
    const news = response.data[0]

    const arrImg = []
    for (let i = 0; i < news.images.length; i++) {
        const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: news.images[i] } })
        arrImg.push(image.data.image[0])
    }

    for (let i = 0; i < arrImg.length; i++) {
        createRowImg(i, arrImg[i], id)
    }

    const sId = document.getElementById('sId')

    const ipTitle = document.getElementById('ipTitle')
    const ipContent = document.getElementById('ipContent')

    const updateTitle = document.getElementById('updateTitle')
    const updateContent = document.getElementById('updateContent')

    sId.innerText = news.id

    ipTitle.value = news.title
    ipContent.value = news.content

    hideLoading()

    updateTitle.onclick = function () {
        if (ipTitle.value == '') {
            alert('Không thể bỏ trống tiêu đề')
            return
        }
        news.title = ipTitle.value
        handleUpdate(news)
    }

    updateContent.onclick = function () {
        if (ipContent.value == '') {
            alert('Không thể bỏ trống nội dung')
            return
        }
        news.content = ipContent.value
        handleUpdate(news)
    }
}

const handleDeleteImg = async (imgId, id) => {
    if (window.confirm('Xác nhận xóa hình ảnh này')) {
        try {
            const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: imgId } })

            const deleteCloud = await axios.delete(`https://mobile-react-native-workshop-server.onrender.com/delete-cloud-image/${image.data.image[0].publicId}`)
            if (deleteCloud.status == 200) {

                const deleteImage = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/delete-image`, { params: { id: imgId } })
                if (deleteImage.status == 200) {
                    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-news-by-id', { params: { id: id } })
                    const news = response.data[0]
                    news.images.splice(news.images.indexOf(imgId), 1)
                    const updatenews = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-news', news)
                    if (updatenews.status == 200) {
                        alert('Đã xóa hình ảnh này')
                        window.location.reload()
                    }
                }
            }
        } catch (err) { console.log(err) }
    }
}

const handleSetAsAvatar = async (imgId, id) => {
    if (window.confirm('Xác nhận đặt ảnh này làm hình tiêu đề')) {
        try {
            const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-news-by-id', { params: { id: id } })
            const news = response.data[0]
            news.images.splice(news.images.indexOf(imgId), 1)
            news.images.unshift(imgId)
            const updatenews = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-news', news)
            if (updatenews.status == 200) {
                alert('Đã đặt hình ảnh thành hình tiêu đề')
                window.location.reload()
            }

        } catch (err) { console.log(err) }
    }
}

const handleUpdate = async object => {
    try {
        const updatenews = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-news', object)
        if (updatenews.status == 200) {
            alert('Đã cập nhật thông tin tin tức')
        }
    } catch (err) { console.log(err) }
}

const uploadImagesAndSaveToDatabase = async files => {
    const arrImg = []

    try {
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader()

            const imageDataPromise = new Promise((resolve, reject) => {
                reader.readAsDataURL(files[i])

                reader.onload = async () => {
                    const imageData = reader.result
                    const upload = await axios.post(`https://mobile-react-native-workshop-server.onrender.com/upload-to-cloud`, { imageData: imageData })
                    const { secure_url, public_id } = upload.data

                    const data = {
                        id: generateRandomId('IMG'),
                        publicId: public_id,
                        secureUrl: secure_url
                    }

                    const saveResponse = await axios.post('https://mobile-react-native-workshop-server.onrender.com/add-image', data)
                    arrImg.push(saveResponse.data.image.id)

                    resolve()
                }
            })
            await imageDataPromise

        }
    } catch (err) { alert('Kích thước ảnh quá lớn') }

    return arrImg
}

const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

const li_manage = document.getElementById('li_manage')
const list_manage = document.getElementById('list_manage')
list_manage.classList.add('hide')

li_manage.onclick = () => {
    list_manage.classList.toggle('show')
}

const li_booking = document.getElementById('li_booking')
const list_booking = document.getElementById('list_booking')
list_booking.classList.add('hide')
li_booking.onclick = () => {
    list_booking.classList.toggle('show')
}
