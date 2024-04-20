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

const createRow = (object, url) => {
    const news_tbody = document.getElementById('news_tbody')
    news_tbody.innerHTML += `
    <tr class="bg-gray-50 border border-gray-50 text-sm group-hover:text-white dark:bg-gray-500 dark:border-gray-700">
        <th scope="row"
            class="px-8 py-2 font-sm text-gray-700 whitespace-nowrap dark:text-white">
            ${object.id}
        </th>
        <td class="px-1 py-2 text-gray-700 dark:text-white">
            ${object.title}
        </td>
        <td class="px-1 py-2 flex justify-center item-center text-gray-700 dark:text-white">
            <img src="${url}" style="width: 80px; height: 80px;object-fit: contain">
        </td>
        <td class="px-1 py-2 text-center text-gray-700 dark:text-white">
            ${object.status == true ? 'Kích hoạt' : 'Chờ kích hoạt'}
        </td>
        <td class="px-1 py-2 text-center text-base text-gray-700 dark:text-white">
            <a class="ti-eye" onClick="handleView('${object.id}');"></a>
            <a class="ti-reload" onClick="handleChangeStatus('${object.id}');"></a>
        </td>
    </tr>
    `
    return news_tbody
}

const callAPI = async () => {
    const api = 'https://mobile-react-native-workshop-server.onrender.com/get-list-news'

    try {
        const response = await axios.get(api)
        response.data.forEach(async element => {
            const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: element.images[0] } })
            createRow(element, image.data.image[0].secureUrl)
        });

    } catch (err) { console.log(err.message) }
}

const handleView = id => {
    window.location.href = `news_manage/view.html?id=${id}`
    return
}

const handleDelete = async id => {
    try {
        if (window.confirm('Xác nhận xóa tin tức này')) {
            const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-news-by-id', { params: { id: id } })
            const news = response.data[0]
            console.log(news)
            for (let i = 0; i < news.images.length; i++) {
                const image = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-image-by-id', { params: { id: news.images[i] } })
                console.log(image.data.image[0])

                const deleteCloud = await axios.delete(`https://mobile-react-native-workshop-server.onrender.com/delete-cloud-image/${image.data.image[0].publicId}`)
                if (deleteCloud.status == 200) {
                    axios.get(`https://mobile-react-native-workshop-server.onrender.com/delete-image`, { params: { id: image.data.image[0].id } })
                }
            }
            const deletenews = await axios.get(`https://mobile-react-native-workshop-server.onrender.com/delete-news`, { params: { id: news.id } })
            if (deletenews.data.errorCode == 200) {
                alert('Đã xóa tin tức')
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

        const response = await axios.get('https://mobile-react-native-workshop-server.onrender.com/get-news-by-id', { params: { id: id } })
        const data = response.data[0]

        if (data.status == true) {
            if (window.confirm('Xác nhận hủy kích hoạt dịch vụ này')) {
                data.status = false
                const response = await axios.post(`https://mobile-react-native-workshop-server.onrender.com/update-news`, data)
                if (response.data.errorCode !== 404) {
                    alert('Đã thay đổi trạng thái')
                    window.location.reload()
                    return
                } else {
                    alert('Đã xảy ra lỗi')
                }

            }
        } else {
            if (window.confirm('Xác nhận kích hoạt dịch vụ này')) {
                data.status = true
                const response = await axios.post(`https://mobile-react-native-workshop-server.onrender.com/update-news`, data)
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