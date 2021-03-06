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

// Khi kh???i ?????ng, ki???m tra trong local c?? th??ng tin ????ng nh???p tr?????c ???? v?? tr???ng th??i c?? ??ang ????ng nh???p k
// th?? l???y th??ng tin ???? render
if (obj && isLogin) {
    renderUser(obj)
}

// click n??t "Ch??i ngay" - n???u ch??a ????ng nh???p s??? hi???n ????ng nh???p, n???u ???? ????ng nh???p th?? v??o game
startBtn.addEventListener("click", function () {
    if (!isLogin) {
        wraper.classList.add("active");
    }
    else {
        mainScreen.style.display = "none"
        gameScreen.style.display = "flex"
    }
});


// form login khi submit (kh??ng b??? l???i g?? khi nh???p th??ng tin)
login.addEventListener('submit', function (e) {
    e.preventDefault()
    // l???y th??ng tin ng?????i d??ng nh???p v??o
    let userLogin = getUserLogin()
    // ki???m tra ??k n???u nh???p c??? 2 tr?????ng th?? m???i th???c hi???n logic, k th?? b??o l???i
    if (userLogin.currentUserId && userLogin.currentUserPassword) {
        getData(userLogin)
    }
    else {
        let loginErrorMessage = document.getElementById('login-error-message')
        loginErrorMessage.style.display = 'block'
    }
});

//  h??m l???y th??ng tin ng d??ng nh???p
function getUserLogin() {
    let currentUserId = userId.value
    let currentUserPassword = userPassword.value
    return { currentUserId, currentUserPassword }
}

// H??m l???y ds users ????? ki???m tra v???i th??ng tin ng d??ng ??ang nh???p
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

// h??m x??? l?? khi th??ng tin ????ng nh???p h???p l???
function handleRenderUser(user) {
    renderUser(user)
    wraper.classList.remove("active");
    loginErrorMessage.style.display = 'none'     
    userId.value = ''
    userPassword.value = ''
    isLogin = true
    setLocalStorage(user, isLogin)
}

// h??m l??u tt ????ng nh???p v??o localStorage
function setLocalStorage(user, isLogin) {
    let userJson = JSON.stringify(user);
    let isLoginJson = JSON.stringify(isLogin);
    localStorage.setItem('userLogin', userJson);
    localStorage.setItem('isLogin', isLoginJson);
}

// h??m hi???n th??? giao di???n 
function renderUser(user) {
    nameLogin.innerHTML = `${user.gameName}`
    let gameHistory = user.gameHistory
    if (gameHistory.length > 0) {
        let compareHistory = gameHistory.sort((a, b) => {
            return b.level - a.level
        })
        levelMax.innerHTML = `??i???m cao nh???t: ${compareHistory[0].level}`
    } else {
        levelMax.innerHTML = '??i???m cao nh???t:'
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

// l???ng nghe s??? ki??n logout cho n??t logout
logoutBtn.addEventListener('click', function () {
    isLogin = false
    let isLoginJson = JSON.stringify(isLogin);
    logoutBtn.style.display = 'none'
    nameLogin.innerHTML = ''
    levelMax.innerHTML = '??i???m cao nh???t:'
    localStorage.removeItem('userLogin')
    localStorage.setItem('isLogin', isLoginJson);
    updateUserLogginId('')
})

backBtn.addEventListener('click', ()=>{
    mainScreen.style.display = "block"
    gameScreen.style.display = "none"
    // Khi click tr??? l???i m??n h??nh ngo??i, th?? l???y l???i userLogin ???? ???????c c???p nh???t trong Local (th??ng qua
    // x??? l?? c???p nh???t local sau khi c???p nh???t l???ch s??? ch??i t??? m??n h??nh game)
    // v?? ch???y l???i h??m render ????? c?? th??? hi???n th??? tt m???i nh???t sau khi v???a ch??i xong
    let newUserRender = JSON.parse(localStorage.getItem('userLogin'))
    renderUser(newUserRender)
})