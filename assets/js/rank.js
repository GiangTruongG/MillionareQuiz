
export const handleRenderRank = () => {
    async function getRankData() {
        let snapshot1 = await db.collection("users").get();
        // khai báo mảng lưu ds users
        let arr =[];
        // khai bác mảng lưu ds users đã được sắp xếp lịch sử chơi từ cao đến thấp
        let arrMax =[];
        snapshot1.docs.forEach(element => {
            arr.push(element.data())
        });
        arr.forEach(e =>{
            if (e.gameHistory.length > 0) {
                let sortArray = e.gameHistory.sort((a,b) => {
                    return b.level - a.level;
                })
                let object ={
                    ...e, gameHistory:sortArray 
                }
                arrMax.push(object)
            }
        })
        // khai báo mảng users được sắp xếp theo điểm cao nhất của mỗi người
        let data = arrMax.sort((a,b) => {
            return b.gameHistory[0].level - a.gameHistory[0].level
        })
        if(data.length <= 5) {
            renderTop5(data);
        } else {
            let lastData = data.slice(0,5);
            renderTop5(lastData);
        }
    }
    function renderTop5(data){
      let tableRank = document.querySelector('table-rank')
      tableRank.render(data)
    }
    getRankData()
}
