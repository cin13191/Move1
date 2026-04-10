/**
 * 人生贖回計畫 - 看板核心邏輯
 * 具備新增、刪除、編輯區塊功能
 */

// 1. 預設資料結構 (如果 LocalStorage 沒資料時使用)
let boardData = JSON.parse(localStorage.getItem('myKanbanData')) || [
    { id: 'col1', title: '💡 創造靈感', items: ['設計 A-You 貼圖', '測試 Flutter 新元件'] },
    { id: 'col2', title: '⏳ 進行中', items: ['甜點配方實驗'] },
    { id: 'col3', title: '✅ 已達成', items: ['贖回計算機專案'] }
];

const mainBoard = document.getElementById('mainBoard');

// 2. 渲染看板
function renderBoard() {
    mainBoard.innerHTML = '';
    boardData.forEach((column, colIndex) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'column';
        colDiv.innerHTML = `
            <div class="column-header">
                <input class="column-title" value="${column.title}" onchange="editColumn(${colIndex}, this.value)">
                <i class="fas fa-ellipsis-v" style="color: #999;"></i>
            </div>
            <div id="${column.id}" class="list-group">
                ${column.items.map((item, itemIndex) => `
                    <div class="item">
                        ${item}
                        <i class="fas fa-times delete-btn" onclick="deleteItem(${colIndex}, ${itemIndex})"></i>
                    </div>
                `).join('')}
            </div>
            <button class="add-btn" onclick="addItem(${colIndex})">+ 新增項目</button>
        `;
        mainBoard.appendChild(colDiv);

        // 初始化 Sortable 拖拉功能
        new Sortable(document.getElementById(column.id), {
            group: 'kanban',
            animation: 150,
            onEnd: () => saveAllData()
        });
    });
}

// 3. 功能：新增項目
window.addItem = function(colIndex) {
    const content = prompt("請輸入新計畫內容：");
    if (content) {
        boardData[colIndex].items.push(content);
        saveAllData();
        renderBoard();
    }
};

// 4. 功能：刪除項目
window.deleteItem = function(colIndex, itemIndex) {
    if (confirm("確定要刪除這個項目嗎？")) {
        boardData[colIndex].items.splice(itemIndex, 1);
        saveAllData();
        renderBoard();
    }
};

// 5. 功能：編輯區塊標題
window.editColumn = function(colIndex, newTitle) {
    boardData[colIndex].title = newTitle;
    saveAllData();
};

// 6. 儲存至 LocalStorage
function saveAllData() {
    // 這裡我們重新抓取當前的 DOM 狀態以確保排序正確
    const newState = boardData.map(col => {
        const items = Array.from(document.getElementById(col.id).children)
                           .filter(el => el.classList.contains('item'))
                           .map(el => el.innerText.trim());
        return { ...col, items };
    });
    boardData = newState;
    localStorage.setItem('myKanbanData', JSON.stringify(boardData));
}

// 7. 雲端同步建議 (給想更聰明 10 倍的妳)
window.saveToCloud = function() {
    alert("LocalStorage 已儲存！\n提示：若要跨裝置，可將此 JSON 存至 GitHub Gist 或 GAS。");
    console.log("當前資料 JSON:", JSON.stringify(boardData));
};

// 初始執行
renderBoard();