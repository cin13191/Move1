/**
 * 人生贖回計畫 - 看板核心邏輯 (GitHub 部署修正版)
 */

// 1. 初始化資料結構
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
    if (!mainBoard) return;
    mainBoard.innerHTML = '';

    boardData.forEach((column, colIndex) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'column';
        colDiv.innerHTML = `
            <div class="column-header">
                <input class="column-title" value="${column.title}" data-col="${colIndex}">
            </div>
            <div id="${column.id}" class="list-group" data-col="${colIndex}">
                ${column.items.map((item, itemIndex) => `
                    <div class="item">
                        ${item}
                        <i class="fas fa-trash delete-btn" data-col="${colIndex}" data-item="${itemIndex}"></i>
                    </div>
                `).join('')}
            </div>
            <button class="add-btn" data-col="${colIndex}">
                <i class="fas fa-plus"></i> 新增計畫
            </button>
        `;
        mainBoard.appendChild(colDiv);

        // 初始化拖拉功能
        new Sortable(document.getElementById(column.id), {
            group: 'kanban-group',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: () => saveAllData()
        });
    });
}

// 3. 事件監聽 (解決 onclick 失效問題)
document.addEventListener('click', function(e) {
    // 處理新增項目
    if (e.target.closest('.add-btn')) {
        const colIndex = e.target.closest('.add-btn').dataset.col;
        const content = prompt("想要創造或體驗什麼？");
        if (content && content.trim() !== "") {
            boardData[colIndex].items.push(content.trim());
            saveAndRefresh();
        }
    }

    // 處理刪除項目
    if (e.target.closest('.delete-btn')) {
        const btn = e.target.closest('.delete-btn');
        const colIndex = btn.dataset.col;
        const itemIndex = btn.dataset.item;
        if (confirm("確定這個項目已經不需要了嗎？")) {
            boardData[colIndex].items.splice(itemIndex, 1);
            saveAndRefresh();
        }
    }
});

// 處理編輯標題
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('column-title')) {
        const colIndex = e.target.dataset.col;
        boardData[colIndex].title = e.target.value;
        saveAllData();
    }
});

// 4. 儲存與重新整理
function saveAndRefresh() {
    saveAllData();
    renderBoard();
}

function saveAllData() {
    const updatedData = [];
    const columns = document.querySelectorAll('.list-group');
    
    columns.forEach((colEl, index) => {
        const items = [];
        const itemEls = colEl.querySelectorAll('.item');
        itemEls.forEach(itemEl => {
            // 抓取純文字內容 (排除圖標文字)
            const text = itemEl.childNodes[0].textContent.trim();
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
    
    const status = document.getElementById('status');
    if (status) {
        status.innerText = "已自動儲存";
        setTimeout(() => { status.innerText = "人生進度追蹤中"; }, 2000);
    }
}

// 啟動
window.onload = renderBoard;
