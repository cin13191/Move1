/**
 * 人生贖回計畫 - 看板核心邏輯 (GitHub 部署版)
 */

// 1. 初始化資料結構 (5 個區塊)
const defaultData = [
    { id: 'col1', title: '💡 靈感/點子', items: ['開發個人資產系統', '原創 IP 角色構思'] },
    { id: 'col2', title: '⏳ 進行中', items: ['甜點實驗：焦糖布丁', 'GitHub 部署測試'] },
    { id: 'col3', title: '🛠️ 創造/產出', items: ['機車維護記錄 App'] },
    { id: 'col4', title: '🌈 體驗/生活', items: ['試吃台北排隊甜點', '學習 Zbrush 建模'] },
    { id: 'col5', title: '✅ 已達成', items: ['人生贖回計算機'] }
];

let boardData = JSON.parse(localStorage.getItem('myKanbanData')) || defaultData;

// 2. 渲染畫面的主函式
function renderBoard() {
    const mainBoard = document.getElementById('mainBoard');
    mainBoard.innerHTML = '';

    boardData.forEach((column, colIndex) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'column';
        colDiv.innerHTML = `
            <div class="column-header">
                <input class="column-title" value="${column.title}" onchange="editColumn(${colIndex}, this.value)">
            </div>
            <div id="${column.id}" class="list-group" data-colindex="${colIndex}">
                ${column.items.map((item, itemIndex) => `
                    <div class="item" data-itemindex="${itemIndex}">
                        ${item}
                        <i class="fas fa-trash delete-btn" onclick="deleteItem(${colIndex}, ${itemIndex})"></i>
                    </div>
                `).join('')}
            </div>
            <button class="add-btn" onclick="addItem(${colIndex})">
                <i class="fas fa-plus"></i> 新增計畫
            </button>
        `;
        mainBoard.appendChild(colDiv);

        // 初始化拖拉功能
        new Sortable(document.getElementById(column.id), {
            group: 'kanban-group',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function() {
                saveAllData(); // 每次拖拉完自動儲存
            }
        });
    });
}

// 3. 動作功能：新增
window.addItem = function(colIndex) {
    const content = prompt("想要創造或體驗什麼？");
    if (content && content.trim() !== "") {
        boardData[colIndex].items.push(content.trim());
        saveAllData();
        renderBoard();
    }
};

// 4. 動作功能：刪除
window.deleteItem = function(colIndex, itemIndex) {
    // 使用非同步確認，手機操作更友善
    if (confirm("確定這個項目已經不需要了嗎？")) {
        boardData[colIndex].items.splice(itemIndex, 1);
        saveAllData();
        renderBoard();
    }
};

// 5. 動作功能：編輯標題
window.editColumn = function(colIndex, newTitle) {
    boardData[colIndex].title = newTitle;
    saveAllData();
};

// 6. 核心：存檔邏輯 (抓取目前的 DOM 順序)
function saveAllData() {
    const updatedData = [];
    const columns = document.querySelectorAll('.list-group');
    
    columns.forEach((colEl, index) => {
        const items = [];
        const itemEls = colEl.querySelectorAll('.item');
        itemEls.forEach(itemEl => {
            // 移除垃圾桶圖標的文字，只保留內容
            const text = itemEl.innerText.replace(/\n/g, '').trim();
            items.push(text);
        });
        
        updatedData.push({
            id: colEl.id,
            title: boardData[index].title,
            items: items
        });
    });

    boardData = updatedData;
    localStorage.setItem('myKanbanData', JSON.stringify(boardData));
    
    // 視覺提示儲存成功
    const status = document.getElementById('status');
    status.innerText = "已同步至 LocalStorage";
    setTimeout(() => { status.innerText = "已自動儲存"; }, 2000);
}

// 啟動系統
document.addEventListener('DOMContentLoaded', renderBoard);