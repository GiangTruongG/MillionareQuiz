let question = document.getElementById('question');
let answers = document.querySelectorAll('.answers');
let questionNumbers = document.querySelectorAll('.question-numbers')
let correctAnswer = '';
let loseModal = document.getElementById('lose-modal');
let closeBtn = document.querySelectorAll('#close-btn');
let winModal = document.getElementById('win-modal');
let countdownTimer = document.getElementById('countdown-timer');
let startGameBtn = document.getElementById('start-btn');
let timer;
let number = 1;
let isPlaying = false

function clearAll() {
    question.innerText = '';
    answers.forEach(answer => {
        answer.innerText = '';
    })
}

closeBtn.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        loseModal.style.display = 'none';
        winModal.style.display = 'none';
        countdownTimer.innerText = 15;
        startGameBtn.style.display = 'block';
        clearAll();
    })
})

async function changingQuestion(randomQuestion) {
    await db.collection('questions').doc(`group-${number}`).get().then(doc => {
        question.innerText = doc.data()[randomQuestion].question;
        answers.forEach((answer, index) => {
            answer.innerText = doc.data()[randomQuestion].answers[index];
        })
    })
}

function updateCountdown() {
    let seconds = countdownTimer.innerText - 1;
    countdownTimer.innerText = seconds;
    if(seconds == 0){
        loseModal.style.display = 'block';
        clearInterval(timer);
        updateData();
        changingQuestion();
        colorChangeQuestionNumber();
    }
}

async function correctAnswers(randomQuestion) {
    await db.collection('questions').doc(`group-${number}`).get().then(doc => {
        correctAnswer = doc.data()[randomQuestion].correctAnswer;
    })
}

function colorChangeQuestionNumber () {
    questionNumbers.forEach(questionNumber => {
        questionNumber.style.boxShadow = 'none';
        questionNumber.style.border = 'none';
    })
    questionNumbers[number - 1].style.boxShadow = '0px 0px 15px 10px rgb(243, 155, 23)';
    questionNumbers[number - 1].style.border = '3px solid rgb(255, 102, 0)';
}

async function updateData(id) {
    let currentDoc = await db.collection('users').doc(id).get();
    let currentHistory = currentDoc.data().gameHistory;
    await db.collection('users').doc(id).update({
        gameHistory: [
            ...currentHistory,
            {
                level: number - 1,
                time: new Date()
            }
        ]
    }).then(()=>{
        // hàm xử lý sau khi cập nhật lịch sử chơi lên database
        // thì set lại userLogin trong local để khi quay lại màn hình ngoài
        // có thể render lại thông tin mới nhất
        setNewLocalStorage(id)
    })
    number = 1;
}

function renderAnswers() {
    answers.forEach(answer => {
        answer.addEventListener('click', () => {
            if (isPlaying) {
                if(answer.innerText && answer.innerText === correctAnswer){
                    number++;
                    countdownTimer.innerText = 15;
                    if(number == 11){
                        winModal.style.display = 'block';
                    }
                    let newRandomNumber = Math.round(Math.random()* 4) + 1
                    let newRandomQuestion = 'C' + newRandomNumber;
                    changeInTotal(newRandomQuestion);
                } else {
                    let userLogginId = JSON.parse(localStorage.getItem('userLoginId'))
                    updateData(userLogginId);
                    loseModal.style.display = 'block';
                    clearInterval(timer);
                    isPlaying = false
                }
            }
        })
    })
}

startGameBtn.addEventListener('click', (event) => {
    let randomNumber = Math.round(Math.random()* 4) + 1;
    let randomQuestion = 'C' + randomNumber;
    isPlaying = true
    changeInTotal(randomQuestion);
    timer = setInterval(updateCountdown, 1000);
    event.target.style.display = 'none';
})

function changeInTotal(randomQuestion) {
    changingQuestion(randomQuestion);
    correctAnswers(randomQuestion);
    colorChangeQuestionNumber();
}

async function setNewLocalStorage(id) {
    let newDoc = await db.collection('users').doc(id).get()
    let userUpdated = JSON.stringify(newDoc.data())
    localStorage.setItem('userLogin', userUpdated)
}

renderAnswers();




