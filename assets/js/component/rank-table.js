const rankTemplate = document.createElement("template");
rankTemplate.innerHTML = `<table>
                          <thead>
                              <th>Hạng</th>
                              <th>Tên người chơi</th>
                              <th>Câu cao nhất</th>
                          </thead>
                          <tbody></tbody>
                      </table>`

class RankMillionair extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open",
        });
        this.shadowRoot.appendChild(rankTemplate.content.cloneNode(true));
        let linkElemet = document.createElement('link');
        linkElemet.setAttribute('href','./assets/css/tablerank.css')
        linkElemet.setAttribute('rel','stylesheet')
        this.shadowRoot.appendChild(linkElemet)
    }
    resetTable(){
        const body = this.shadowRoot.querySelector('tbody')
        while(body.firstChild){
        body.removeChild(body.firstChild);
        }
    }
    render(data){
        const body = this.shadowRoot.querySelector('tbody')
        data.forEach((e,index)=>{
            let top;
            let rank;
            switch(index){
                case 0:
                    rank = "<img src='./assets/img/top1.jpg'/>";
                    top = 'rank top1';
                    break;
                case 1:
                    rank= "<img src='./assets/img/top2.jpg'/>";
                    top = 'rank top2';
                    break;
                case 2:
                    rank = "<img src='./assets/img/top3.jpg'/>";
                    top = 'rank top3';
                    break;
                case 3:
                    rank ='4';
                    break;
                case 4: 
                    rank = '5';
                    break;
            }
            let row = `<tr class="${top}">
                        <td class="rank-icon">${rank}</td>
                        <td class="rank-name">${e.gameName}</td>
                        <td class="rank-point-time">${e.gameHistory[0].level}
                            <img src="https://img.icons8.com/ultraviolet/40/000000/lightning-bolt.png" alt="hinhanh"/>
                        </td>
                    </tr>`;
            body.innerHTML+=row;
        }) 
    }
}
export default RankMillionair