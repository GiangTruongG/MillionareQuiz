// history-table component
const historyTemplate = document.createElement("template")
historyTemplate.innerHTML = `
    <table>
        <thead>
            <th>STT</th>
            <th>Thời gian</th>
            <th>Câu cao nhất</th>
        </thead>
        <tbody><tr class="loadding"><td colspan="3">Loading...</td></tr></tbody>
    </table>
    `
class HistoryTable extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: "open",
        })
        this.shadowRoot.appendChild(historyTemplate.content.cloneNode(true))
        this.list = []
        const linkElement = document.createElement("link")
        linkElement.setAttribute("rel", "stylesheet")
        linkElement.setAttribute("href", "./assets/css/history-table.css")
        this.shadowRoot.appendChild(linkElement)
    }
    render(){
        const data = this.list
        const historyContent = this.shadowRoot.querySelector("tbody")
        while (historyContent.firstChild) {
            historyContent.removeChild(historyContent.firstChild)
        }
        if(data.length){
            for (let i=0; i< data.length; i++){
                let time = new Date(parseInt(data[i].time.seconds*1000))
                let timeRender = `${time.getFullYear()}/${time.getMonth()+1}/${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    
                let html = `<tr>
                                <td class="history-stt">${i + 1}</td>
                                <td class="history-time">${timeRender}</td>
                                <td class="history-point">${data[i].level}</td>
                            </tr>`
                historyContent.innerHTML += html
            }
        } else{
            historyContent.innerHTML = `<tr><td colspan="3">Chưa có lịch sử</td></tr>`
        }
    }
    setHistory(data){
        this.list = data
        this.render()
    }
    setDefaul(){
        const historyContent = this.shadowRoot.querySelector("tbody")
        const loadding = `<tr class="loadding"><td colspan="3">Loading...</td></tr>`
        historyContent.innerHTML = loadding
    }
}
export default HistoryTable;