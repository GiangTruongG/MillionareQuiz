import HistoryTable from "./component/history-table.js"
import RankMillionair from "./component/rank-table.js"
import { handleRenderHistory } from "./history.js"
import { handleRenderRank } from "./rank.js"
window.customElements.define('history-table', HistoryTable)
window.customElements.define('table-rank',RankMillionair)

let popUp = document.querySelector('#not-signin-message')
let historyModal = document.querySelector(".history")
let openHistoryBtn = document.querySelector('#history-btn')
let closeHistoryBtn = document.querySelector(".history .close")
let closePopup = document.querySelector('#close-popup')
let rankModal = document.querySelector('.modal')
let closeRankBtn = document.querySelector('.modal .close')
let openRankBtn = document.querySelector('.rank')

// history button
openHistoryBtn.addEventListener('click', () => {
    let userLogginId = JSON.parse(localStorage.getItem('userLoginId'))
    if (userLogginId) {
        historyModal.classList.add("active");
        handleRenderHistory(userLogginId)
    } else {
        popUp.style.display = "block"
    }
})

closePopup.addEventListener("click", ()=>{
    popUp.style.display = "none"
})

// history close button
closeHistoryBtn.addEventListener("click", () => {
    historyModal.classList.remove('active');
    const historyTable = document.querySelector("history-table")
    historyTable.setDefaul()
})

// rank table
openRankBtn.addEventListener('click', () => {
    let userLogginId = JSON.parse(localStorage.getItem('userLoginId'))
    if (userLogginId) {
        rankModal.classList.add("active");
        handleRenderRank()
    } else {
        popUp.style.display = "block"
    }
})
  
closeRankBtn.addEventListener("click", () => {
    rankModal.classList.remove('active');
    let tableRank = document.querySelector('table-rank')
    tableRank.resetTable();
})



