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
    const serviceName = document.getElementById('serviceName')
    const err_serviceName = document.getElementById('err_serviceName')
    serviceName.onclick = () => {
        err_serviceName.innerText = ''
    }

    const images = document.getElementById('images')
    const err_images = document.getElementById('err_images')
    images.onclick = () => {
        err_images.innerText = ''
    }


    const servicePrice = document.getElementById('servicePrice')
    const err_servicePrice = document.getElementById('err_servicePrice')
    servicePrice.onclick = () => {
        err_servicePrice.innerText = ''
    }

    const btn_add = document.getElementById('btn_add')

    btn_add.onclick = async e => {
        e.preventDefault()

        if (serviceName.value == '') {
            err_serviceName.innerText = 'Vui lòng nhập tên dịch vụ'
        }

        if (images.files.length == 0) {
            err_images.innerText = 'Vui lòng chọn ảnh dịch vụ'
        }

        if (servicePrice.value == '') {
            err_servicePrice.innerText = 'Vui lòng điền giá dịch vụ'
        } else if (servicePrice.value < 0) {
            err_servicePrice.innerText = 'Giá dịch vụ phải lớn hơn 0'
        }

        if (serviceName.value == '' || images.files.length == 0 || servicePrice.value == '' || servicePrice.value < 0) {
            return
        }

        try {

            const arrImg = await uploadImagesAndSaveToDatabase(images.files)

            if (arrImg.length > 0) {
                const services = {
                    id: generateRandomId('SV'),
                    serviceName: serviceName.value,
                    servicePrice: servicePrice.value,
                    images: arrImg,
                    describes: [],
                    status: true
                }

                const response = await axios.post('https://mobile-react-native-workshop-server.onrender.com/add-services', services)
                if (response.status == 200) {
                    window.location.href = '../services_manage.html'
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