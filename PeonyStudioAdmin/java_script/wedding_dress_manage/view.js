window.addEventListener('DOMContentLoaded', init)

function init() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    handleShowData(id)
    popupImg(id)
    popupDescribe(id)
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

    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
    const weddingDress = response.data[0]

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
            err_add_images.innerText = 'Vui lòng chọn ảnh áo cưới'
            return
        }

        try {

            const arrImg = await uploadImagesAndSaveToDatabase(add_images.files)

            arrImg.forEach(element => {
                weddingDress.images.push(element)
            })

            await handleUpdate(weddingDress)
            window.location.reload()

        }  catch (err) {err_add_images.innerText = 'Kích thước ảnh quá lớn' }

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

const popupDescribe = async id => {

    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
    const weddingDress = response.data[0]

    const addDescribe = document.getElementById('addDescribe')
    const closePopupDescribe = document.getElementById("closePopupDescribe");
    const popup = document.getElementById("add_describe_popup");
    const describe = document.getElementById('describe')
    const err_describe = document.getElementById('err_describe')
    const btn_add_describe = document.getElementById('btn_add_describe')

    describe.onclick = () => {
        err_describe.innerText = ''
    }

    btn_add_describe.onclick = async () => {
        if (describe.value == '') {
            err_describe.innerText = 'Vui lòng nhập mô tả'
            return
        }

        try {

            weddingDress.describes.push(describe.value)

            await handleUpdate(weddingDress)
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
    addDescribe.addEventListener("click", openPopup);

    // Event listener for closing the popup when close button is clicked
    closePopupDescribe.addEventListener("click", closePopup);
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
    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
    const weddingDress = response.data[0]

    const arrImg = []
    for (let i = 0; i < weddingDress.images.length; i++) {
        const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: weddingDress.images[i] } })
        arrImg.push(image.data.image[0])
    }

    for (let i = 0; i < arrImg.length; i++) {
        createRowImg(i, arrImg[i], id)
    }

    const sId = document.getElementById('sId')

    const ipName = document.getElementById('ipName')
    const ipPurchasePrice = document.getElementById('ipPurchasePrice')
    const ipRentalCost = document.getElementById('ipRentalCost')
    const ipQuantity = document.getElementById('ipQuantity')

    const updateName = document.getElementById('updateName')
    const updatePurchasePrice = document.getElementById('updatePurchasePrice')
    const updateRentalCost = document.getElementById('updateRentalCost')
    const updateQuantity = document.getElementById('updateQuantity')

    sId.innerText = weddingDress.id

    ipName.value = weddingDress.name
    ipPurchasePrice.value = weddingDress.purchasePrice
    ipRentalCost.value = weddingDress.rentalCost
    ipQuantity.value = weddingDress.quantity

    for (let i = 0; i < weddingDress.describes.length; i++) {
        createRowDescribes(i, weddingDress.describes[i], id)
    }

    hideLoading()

    updateName.onclick = function () {
        if (ipName.value == '') {
            alert('Không thể bỏ trống tên áo cưới')
            return
        }
        weddingDress.name = ipName.value
        handleUpdate(weddingDress)
    }

    updatePurchasePrice.onclick = function () {
        if (ipPurchasePrice.value == '') {
            alert('Không thể bỏ trống giá bán')
            return
        }
        if (ipPurchasePrice.value < 0) {
            alert('Giá bán không thể là số âm')
            return
        }

        weddingDress.purchasePrice = ipPurchasePrice.value
        handleUpdate(weddingDress)
    }

    updateRentalCost.onclick = function () {
        if (ipRentalCost.value == '') {
            alert('Không thể bỏ trống giá thuê')
            return
        }
        if (ipRentalCost.value < 0) {
            alert('Giá thuê không thể là số âm')
            return
        }
        weddingDress.rentalCost = ipRentalCost.value
        handleUpdate(weddingDress)
    }

    updateQuantity.onclick = function () {
        if (ipQuantity.value == '') {
            alert('Không thể bỏ trống số lượng')
            return
        }
        if (ipQuantity.value < 0) {
            alert('Số lượng không thể là số âm')
            return
        }
        weddingDress.quantity = ipQuantity.value
        handleUpdate(weddingDress)
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
                    const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
                    const weddingDress = response.data[0]
                    weddingDress.images.splice(weddingDress.images.indexOf(imgId), 1)
                    const updateWeddingDress = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-wedding-dress', weddingDress)
                    if (updateWeddingDress.status == 200) {
                        alert('Đã xóa hình ảnh này')
                        window.location.reload()
                    }
                }


            }
        } catch (err) { console.log(err) }
    }
}

const handleSetAsAvatar = async (imgId, id) => {
    if (window.confirm('Xác nhận đặt ảnh này làm hình đại diện sản phẩm')) {
        try {
            const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
            const weddingDress = response.data[0]
            weddingDress.images.splice(weddingDress.images.indexOf(imgId), 1)
            weddingDress.images.unshift(imgId)
            const updateWeddingDress = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-wedding-dress', weddingDress)
            if (updateWeddingDress.status == 200) {
                alert('Đã đặt hình ảnh thành hình đại diện sản phẩm')
                window.location.reload()
            }

        } catch (err) { console.log(err) }
    }
}



const handleUpdate = async object => {
    try {
        const updateWeddingDress = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-wedding-dress', object)
        if (updateWeddingDress.status == 200) {
            alert('Đã cập nhật thông tin áo cưới')
        }
    } catch (err) { console.log(err) }
}

const createRowDescribes = (index, data, id) => {
    const describes_tbody = document.getElementById('describes_tbody')
    describes_tbody.innerHTML += `
    <tr
        class="bg-gray-50 border border-gray-50 text-sm group-hover:text-white dark:bg-gray-500 dark:border-gray-700 ">
        <th scope="row"
            class="px-2 py-2 text-center font-sm text-gray-700 whitespace-nowrap dark:text-white">
            ${index + 1}
        </th>
        <td class="px-8 py-2 font-sm text-gray-700 whitespace-nowrap dark:text-white">
            ${data}
        </td>
        <td class="px-2 py-2 text-lg text-center text-gray-700 dark:text-white">
            <a class="ti-trash mx-2" onClick="handleDeleteDescribe('${index}','${id}');"></a>
        </td>
    </tr>
    `
    return describes_tbody
}

const handleDeleteDescribe = async (index, id) => {
    if (window.confirm('Xác nhận xóa mô tả này')) {
        try {
            const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
            const weddingDress = response.data[0]
            weddingDress.describes.splice(index, 1)
            const updateWeddingDress = await axios.post('https://mobile-react-native-workshop-server.onrender.com/update-wedding-dress', weddingDress)
            if (updateWeddingDress.status == 200) {
                alert('Đã xóa mô tả này')
                window.location.reload()
            }

        } catch (err) { console.log(err) }
    }
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
