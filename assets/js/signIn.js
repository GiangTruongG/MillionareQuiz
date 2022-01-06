const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
let inputLoginArr = document.querySelectorAll('form input[name]')
let messageArr = document.querySelectorAll('.message')

signupBtn.onclick = (()=>{
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
    messageArr.forEach(mess => {
    mess.style.display = 'none'
    })
    inputLoginArr.forEach(item => {
        item.value = ''
    })
})

loginBtn.onclick = (()=>{
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
    messageArr.forEach(mess => {
    mess.style.display = 'none'
    })
    inputLoginArr.forEach(item => {
        item.value = ''
    })
});

signupLink.onclick = (()=>{
    signupBtn.click();
    return false;
});

let login = document.getElementById("login-form")
let isLogin = JSON.parse(localStorage.getItem('isLogin'))
let startBtn = document.querySelector("#show-quizz")
let wraper = document.querySelector(".wrapper")
let logoutBtn = document.querySelector(".logout-btn")
let loginErrorMessage = document.getElementById('login-error-message')
let userId = document.getElementById("id") 
let userPassword = document.getElementById("login-password")
let nameLogin = document.querySelector("#loginName span")
let levelMax = document.querySelector("#maxLevel span")
let gameScreen = document.querySelector('.container')
let mainScreen = document.querySelector('#main-screen')
let obj = JSON.parse(localStorage.getItem('userLogin'));
let backBtn = document.querySelector('.back-btn')
let closeWraper = document.querySelector(".wrapper .close-btn")

closeWraper.addEventListener("click", function () {   
    wraper.classList.remove("active");
    messageArr.forEach(mess => {
        mess.style.display = 'none'
    })
    inputLoginArr.forEach(item => {
        item.value = ''
    })
});

// Khi khởi động, kiểm tra trong local có thông tin đăng nhập trước đó và trạng thái có đang đăng nhập k
// thì lấy thông tin đó render
if (obj && isLogin) {
    renderUser(obj)
}

// click nút "Chơi ngay" - nếu chưa đăng nhập sẽ hiện đăng nhập, nếu đã đăng nhập thì vào game
startBtn.addEventListener("click", function () {
    if (!isLogin) {
        wraper.classList.add("active");
    }
    else {
        mainScreen.style.display = "none"
        gameScreen.style.display = "flex"
    }
});


// form login khi submit (không bị lỗi gì khi nhập thông tin)
login.addEventListener('submit', function (e) {
    e.preventDefault()
    // lấy thông tin người dùng nhập vào
    let userLogin = getUserLogin()
    // kiểm tra đk nếu nhập cả 2 trường thì mới thực hiện logic, k thì báo lỗi
    if (userLogin.currentUserId && userLogin.currentUserPassword) {
        getData(userLogin)
    }
    else {
        let loginErrorMessage = document.getElementById('login-error-message')
        loginErrorMessage.style.display = 'block'
    }
});

//  hàm lấy thông tin ng dùng nhập
function getUserLogin() {
    let currentUserId = userId.value
    let currentUserPassword = userPassword.value
    return { currentUserId, currentUserPassword }
}

// Hàm lấy ds users để kiểm tra với thông tin ng dùng đang nhập
async function getData(user) {
    const snapshots2 = await db.collection("users").get()
    let right = snapshots2.docs.filter(doc => {
        return (doc.data().gameID === user.currentUserId) && (doc.data().password === user.currentUserPassword)
    })
    if (right.length === 0) {
        loginErrorMessage.style.display = 'block'
    }
    else {
        handleRenderUser(right[0].data());
        updateUserLogginId(right[0].id)
    }
}

// hàm xử lý khi thông tin đăng nhập hợp lệ
function handleRenderUser(user) {
    renderUser(user)
    wraper.classList.remove("active");
    loginErrorMessage.style.display = 'none'     
    userId.value = ''
    userPassword.value = ''
    isLogin = true
    setLocalStorage(user, isLogin)
}

// hàm lưu tt đăng nhập vào localStorage
function setLocalStorage(user, isLogin) {
    let userJson = JSON.stringify(user);
    let isLoginJson = JSON.stringify(isLogin);
    localStorage.setItem('userLogin', userJson);
    localStorage.setItem('isLogin', isLoginJson);
}

// hàm hiển thị giao diện 
function renderUser(user) {
    nameLogin.innerHTML = `${user.gameName}`
    let gameHistory = user.gameHistory
    if (gameHistory.length > 0) {
        let compareHistory = gameHistory.sort((a, b) => {
            return b.level - a.level
        })
        levelMax.innerHTML = `Điểm cao nhất: ${compareHistory[0].level}`
    } else {
        levelMax.innerHTML = 'Điểm cao nhất:'
    }
    logoutBtn.style.display = 'block'
}

function updateUserLogginId(id){
    if (id) {
        localStorage.setItem('userLoginId', JSON.stringify(id))
    } else {
        localStorage.removeItem('userLoginId')
    }
}

// lắng nghe sự kiên logout cho nút logout
logoutBtn.addEventListener('click', function () {
    isLogin = false
    let isLoginJson = JSON.stringify(isLogin);
    logoutBtn.style.display = 'none'
    nameLogin.innerHTML = ''
    levelMax.innerHTML = 'Điểm cao nhất:'
    localStorage.removeItem('userLogin')
    localStorage.setItem('isLogin', isLoginJson);
    updateUserLogginId('')
})

backBtn.addEventListener('click', ()=>{
    mainScreen.style.display = "block"
    gameScreen.style.display = "none"
    // Khi click trở lại màn hình ngoài, thì lấy lại userLogin đã được cập nhật trong Local (thông qua
    // xử lý cập nhật local sau khi cập nhật lịch sử chơi từ màn hình game)
    // và chạy lại hàm render để có thể hiển thị tt mới nhất sau khi vừa chơi xong
    let newUserRender = JSON.parse(localStorage.getItem('userLogin'))
    renderUser(newUserRender)
})