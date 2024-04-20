window.addEventListener('DOMContentLoaded', init)

function init() {
    handleAdd()
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

const handleAdd = () => {
    const title = document.getElementById('title')
    const err_title = document.getElementById('err_title')
    title.onclick = () => {
        err_title.innerText = ''
    }

    const images = document.getElementById('images')
    const err_images = document.getElementById('err_images')
    images.onclick = () => {
        err_images.innerText = ''
    }


    const content = document.getElementById('content')
    const err_content = document.getElementById('err_content')
    content.onclick = () => {
        err_content.innerText = ''
    }

    const btn_add = document.getElementById('btn_add')

    btn_add.onclick = async e => {
        e.preventDefault()

        if (title.value == '') {
            err_title.innerText = 'Vui lòng nhập tiêu đề tin tức'
        }

        if (images.files.length == 0) {
            err_images.innerText = 'Vui lòng chọn ảnh tin tức'
        }

        if (content.value == '') {
            err_content.innerText = 'Vui lòng điền nội dung tin tức'
        }

        if (title.value == '' || images.files.length == 0 || content.value == '' || content.value < 0) {
            return
        }

        try {

            const arrImg = await uploadImagesAndSaveToDatabase(images.files)

            if (arrImg.length > 0) {
                const news = {
                    id: generateRandomId('NE'),
                    title: title.value,
                    content: content.value,
                    images: arrImg,
                    status: true
                }

                const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/add-news', news)
                if (response.status == 200) {
                    window.location.href = '../news_manage.html'
                    return
                }
            }
        } catch (err) { console.log(err.message) }

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
                    try {
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
                    } catch (err) { alert('Kích thước ảnh quá lớn, Vui lòng chọn ảnh khác') }
                }
            })
            await imageDataPromise

        }
    } catch (err) { console.error(err) }

    return arrImg
}