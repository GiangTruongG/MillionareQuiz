
let signupSubmit = document.getElementById('signup-btn')
signupSubmit.addEventListener('click', function (e) {
    e.preventDefault()
    getDataSignup()
})
async function getDataSignup() {
    const snapshots3 = await db.collection("users").get()
    const userData = []
    snapshots3.forEach(doc => {
        userData.push(doc.data())
    });
    checkUsers(userData)
}
async function addUser(user) {
    await db.collection("users").add({
        avt: "https://i.pinimg.com/280x280_RS/44/25/cd/4425cd0d105af26f18bf695bfa95b1db.jpg",
        gameHistory: [],
        gameID: user.nameID,
        gameName: user.nameGame,
        password: user.cfsignupPassword,
    })
}
let inputArray = document.querySelectorAll('.signup input[name]')
inputArray.forEach(item => {
    item.addEventListener('input', function () {
        let messageArr = document.querySelectorAll('.message')
        messageArr.forEach(mess => {
            mess.style.display = 'none'
        })
    })
})

function checkUsers(userData) {
    let nameID = document.getElementById('username')
    let nameGame = document.getElementById('gamename')
    let signupPassword = document.getElementById('signup-password')
    let cfsignupPassword = document.getElementById('cfpassword')
    let userSignup = {
        nameID: nameID.value,
        nameGame: nameGame.value,
        signupPassword: signupPassword.value,
        cfsignupPassword: cfsignupPassword.value,
    }
    let checker = userData.filter(item => {
        return item.gameID === userSignup.nameID || item.gameName === userSignup.nameGame
    })
    let checkCf = userSignup.signupPassword === userSignup.cfsignupPassword
    let errorSignup = document.getElementById('signup-error-message')
    let errorCf = document.getElementById('cf-error-message')
    let errorLeghth = document.getElementById('length-error-message')
    let successSignupMess = document.getElementById('signup-success-message')
    let checkLength = Array.from(inputArray).some(item => {
        return item.value.length < 6
    })
    if (checker.length > 0) {
        errorSignup.style.display = 'block'
    } else if (!checkCf) {
        errorCf.style.display = 'block'
    } else if (checkLength) {
        errorLeghth.style.display = 'block'
    } else {
        addUser(userSignup)
        successSignupMess.style.display = 'block'
        cfsignupPassword.value = ''
        signupPassword.value = ''
    }

}


