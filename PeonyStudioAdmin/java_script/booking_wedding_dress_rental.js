window.addEventListener('DOMContentLoaded', init)

function init() {
    callAPI()
}

const formatCurrency = amount => {
    // Chuyển số sang chuỗi và ngược lại để thêm dấu phẩy
    const strAmount = amount.toString().split('').reverse().join('');

    let formattedAmount = '';
    for (let i = 0; i < strAmount.length; i++) {
        formattedAmount += strAmount[i];
        if ((i + 1) % 3 === 0 && i !== strAmount.length - 1) {
            formattedAmount += ',';
        }
    }

    // Đảo ngược chuỗi để có định dạng tiền tốt nhất
    return formattedAmount.split('').reverse().join('');
}

const createRow = (object) => {
    const wedding_dress_tbody = document.getElementById('wedding_dress_tbody')
    const createdAt = new Date(object.bookingTime);
    const formattedCreatedAt = `${createdAt.getDate() < 10 ? '0' + createdAt.getDate() : createdAt.getDate()}-${createdAt.getMonth() + 1 < 10 ? '0' + createdAt.getMonth() : createdAt.getMonth()}-${createdAt.getFullYear()} ${createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()}:${createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()}:${createdAt.getSeconds() < 10 ? '0' + createdAt.getSeconds() : createdAt.getSeconds()}`;
    wedding_dress_tbody.innerHTML += `
    <tr class="bg-gray-50 border border-gray-50 text-sm group-hover:text-white dark:bg-gray-500 dark:border-gray-700">
        <th scope="row"
            class="px-8 py-2 font-sm text-gray-700 whitespace-nowrap dark:text-white">
            ${object.id}
        </th>
        <td class="px-1 py-2 text-gray-700 dark:text-white">
            ${formattedCreatedAt}
        </td>
   
        <td class="px-4 py-2 text-center text-gray-700 dark:text-white">
            ${object.id_User}
        </td>
        <td class="px-2 py-2 text-gray-700 dark:text-white">
        ${object.id_WeddingDress}
         </td>

        <td class="px-2 py-2 text-gray-700 dark:text-white">
            ${object.status === 0 ? 'Chờ xác nhận' : 'Đã xác nhận'}
        </td>
        <td class="px-1 py-2 text-center text-base text-gray-700 dark:text-white">
            <a class="ti-eye"></a>
            <a class="ti-reload"></a>
        </td>
    </tr>
    `
    return wedding_dress_tbody
}

const callAPI = async () => {
    const api = 'https://mobile-react-native-workshop-server.onrender.com/get-list-book-wedding-dress-rental'

    try {
        const response = await axios.get(api)
        response.data.forEach(async element => {
            // const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: element.images[0] } })
            createRow(element)
        });

    } catch (err) { console.log(err.message) }
}

const handleView = id => {
    window.location.href = `wedding_dress_manage/view.html?id=${id}`
    return
}

const handleDelete = async id => {
    try {
        if (window.confirm('Xác nhận xóa áo cưới này')) {

            const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
            const weddingDress = response.data[0]
            console.log(weddingDress)
            for (let i = 0; i < weddingDress.images.length; i++) {

                const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: weddingDress.images[i] } })
                console.log(image.data.image[0])

                const deleteCloud = await axios.delete(`https://mobile-react-native-workshop-server.onrender.com/delete-cloud-image/${image.data.image[0].publicId}`)
                if (deleteCloud.status == 200) {
                    axios.get(`https://mobile-react-native-workshop-server.onrender.com/delete-image`, { params: { id: image.data.image[0].id } })
                }
            }
            const deleteWeddingDress = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/delete-wedding-dress`, { params: { id: weddingDress.id } })
            if (deleteWeddingDress.data.errorCode == 200) {
                alert('Đã xóa áo cưới')
                window.location.reload()
                return
            } else {
                alert('Đã xảy ra lỗi')
            }

        }
    } catch (err) { console.log(err.message) }
}

const handleChangeStatus = async id => {
    try {

        const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-wedding-dress-by-id', { params: { id: id } })
        const data = response.data[0]

        if (data.status == true) {
            if (window.confirm('Xác nhận hủy kích hoạt áo cưới này')) {
                data.status = false
                const response = await axios.post(`https://mobile-react-native-workshop-server.onrender.com/update-wedding-dress`, data)
                if (response.data.errorCode !== 404) {
                    alert('Đã thay đổi trạng thái')
                    window.location.reload()
                    return
                } else {
                    alert('Đã xảy ra lỗi')
                }

            }
        } else {
            if (window.confirm('Xác nhận kích hoạt áo cưới này')) {
                data.status = true
                const response = await axios.post(`https://mobile-react-native-workshop-server.onrender.com/update-wedding-dress`, data)
                if (response.data.errorCode !== 404) {
                    alert('Đã thay đổi trạng thái')
                    window.location.reload()
                    return
                } else {
                    alert('Đã xảy ra lỗi')
                }

            }
        }

    } catch (err) { console.log(err.message) }
}