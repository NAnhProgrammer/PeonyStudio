window.addEventListener('DOMContentLoaded', init)

function init() {
    login()
}

const login = () => {
    const ip_username = document.getElementById('ip_username')
    const err_username = document.getElementById('err_username')

    const ip_password = document.getElementById('ip_password')
    const err_password = document.getElementById('err_password')

    const btn_login = document.getElementById('btn_login')

    ip_username.onclick = () => err_username.innerText = ''
    ip_password.onclick = () => err_password.innerText = ''

    btn_login.onclick = async e => {
        e.preventDefault()

        if (ip_username.value == '') {
            err_username.innerText = 'Vui lòng điền tên đăng nhập'
        }

        if (ip_password.value == '') {
            err_password.innerText = 'Vui lòng điền mật khẩu'
        }

        if (ip_username.value == '' || ip_password.value == '') {
            return
        }

        try {
            const response = await axios.post('http://localhost:3000/find-admin-by-username', { username: ip_username.value })
            if (response.data !== false) {
                const admin = await axios.post('http://localhost:3000/check-login', { username: ip_username.value, password: ip_password.value })
                if (admin.data !== false) {
                    window.location.href = 'home.html'
                    return
                } else {
                    alert('Thông tin tài khoản mật khẩu không chính xác')
                }
            } else {
                alert('Tài khoản không tồn tại')
            }

        } catch (err) { console.log(err.message) }
    }

}