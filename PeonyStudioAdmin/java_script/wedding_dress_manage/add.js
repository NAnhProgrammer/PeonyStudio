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
    const name = document.getElementById('name')
    const err_name = document.getElementById('err_name')
    name.onclick = () => {
        err_name.innerText = ''
    }

    const images = document.getElementById('images')
    const err_images = document.getElementById('err_images')
    images.onclick = () => {
        err_images.innerText = ''
    }


    const purchasePrice = document.getElementById('purchasePrice')
    const err_purchasePrice = document.getElementById('err_purchasePrice')
    purchasePrice.onclick = () => {
        err_purchasePrice.innerText = ''
    }

    const rentalCost = document.getElementById('rentalCost')
    const err_rentalCost = document.getElementById('err_rentalCost')
    rentalCost.onclick = () => {
        err_rentalCost.innerText = ''
    }

    const quantity = document.getElementById('quantity')
    const err_quantity = document.getElementById('err_quantity')
    quantity.onclick = () => {
        err_quantity.innerText = ''
    }

    const outstanding = document.getElementById('outstanding')
    const err_outstanding = document.getElementById('err_outstanding')
    outstanding.onclick = () => {
        err_outstanding.innerText = ''
    }

    const btn_add = document.getElementById('btn_add')

    btn_add.onclick = async e => {
        e.preventDefault()

        if (name.value == '') {
            err_name.innerText = 'Vui lòng nhập tên áo cưới'
        }

        if (images.files.length == 0) {
            err_images.innerText = 'Vui lòng chọn ảnh áo cưới'
        }

        if (purchasePrice.value == '') {
            err_purchasePrice.innerText = 'Vui lòng điền giá bán'
        } else if (purchasePrice.value < 0) {
            err_purchasePrice.innerText = 'Giá bán phải lớn hơn 0'
        }

        if (rentalCost.value == '') {
            err_rentalCost.innerText = 'Vui lòng điền giá thuê'
        } else if (rentalCost.value < 0) {
            err_rentalCost.innerText = 'Giá thuể phải lớn hơn 0'
        }

        if (quantity.value == '') {
            err_quantity.innerText = 'Vui lòng nhập số lượng'
        } else if (quantity.value < 0) {
            err_quantity.innerText = 'Số lượng phải lớn hơn 0'
        }

        if (outstanding.value == '') {
            err_outstanding.innerText = 'Vui lòng điền đặc tả áo cưới'
        }

        if (name.value == '' || images.files.length == 0 || purchasePrice.value == '' || purchasePrice.value < 0 ||
            rentalCost.value == '' || rentalCost.value < 0 || quantity.value == '' || quantity.value < 0 || outstanding.value == '') {
            return
        }

        try {

            const arrImg = await uploadImagesAndSaveToDatabase(images.files)

            if (arrImg.length > 0) {
                const weddingDress = {
                    id: generateRandomId('WD'),
                    name: name.value,
                    purchasePrice: purchasePrice.value,
                    rentalCost: rentalCost.value,
                    quantity: quantity.value,
                    outstanding: outstanding.value,
                    images: arrImg,
                    describes: [],
                    status: true
                }

                const add = await axios.post('https://mobile-react-native-workshop-server.onrender.com/add-wedding-dress', weddingDress)
                if (add.status == 200) {
                    window.location.href = '../wedding_dress_manage.html'
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
                    } catch (err) { alert('Kích thước ảnh quá lớn') }
                }
            })
            await imageDataPromise

        }
    } catch (err) { console.error(err) }

    return arrImg
}