export const handleRenderHistory = (userLoginId) => {
    // get data history Arr tương ứng id
    async function getHistory(id){
        const snapshots = await db.collection("users").doc(id).get()
        const userHistory = snapshots.data().gameHistory
        const historyTable = document.querySelector("history-table")
        historyTable.setHistory(userHistory)
    }
    getHistory(userLoginId)
}
