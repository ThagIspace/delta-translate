let tasks = JSON.parse(localStorage.getItem('delta_quests')) || [];
let trash = JSON.parse(localStorage.getItem('delta_quests_trash')) || [];
let viewMode = 1;
let hideCompleted = false;
const GROUP_COLORS = ['#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#f97316', '#3b82f6'];

// Chuẩn hóa data cũ
tasks.forEach((t, i) => {
    if (!t.id) t.id = 't_' + Date.now() + Math.random().toString(36).substr(2, 9);
    if (t.order === undefined) t.order = i;
    if (t.isPinned === undefined) t.isPinned = false; // Thêm cờ ghim
});

async function processQuestImage(base64Data, mimeType) {
    const apiKeyInput = document.getElementById('apiKey').value || HARDCODED_API_KEY;
    if (!apiKeyInput) return alert("Vui lòng nhập API Key!");
    const apiKeys = apiKeyInput.split(',').map(k => k.trim()).filter(k => k);

    document.getElementById('loading').style.display = 'block';
    const promptText = `Trích xuất nhiệm vụ game Delta Force. Tìm 'Mục tiêu hành động cụ thể'. Bỏ qua cốt truyện. Trả về MỘT mảng JSON: [{"id_goc": "Chữ Trung", "dich_nghia": "Dịch Việt"}]. NẾU ảnh không chứa nhiệm vụ, trả về: []`;
    const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash'];

    for (let i = 0; i < MODELS.length; i++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELS[i]}:generateContent?key=${apiKeys[0]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }, { inlineData: { mimeType: mimeType, data: base64Data } }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });
            const data = await response.json();
            if (data.error) continue;

            const resultText = data.candidates[0].content.parts[0].text;
            const newQuests = JSON.parse(resultText);
            if (newQuests.length > 0) mergeQuests(newQuests);
            break;
        } catch (e) {
            if (i === MODELS.length - 1) console.error(e);
        }
    }
    document.getElementById('loading').style.display = 'none';
}

function mergeQuests(newQuests) {
    const isGroup = newQuests.length > 1;
    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;
    let maxGroupId = tasks.length > 0 ? Math.max(...tasks.map(t => t.groupId || 0)) : 0;
    const newGroupId = isGroup ? maxGroupId + 1 : null;
    const groupColor = isGroup ? GROUP_COLORS[(newGroupId - 1) % GROUP_COLORS.length] : null;

    newQuests.forEach(newQ => {
        const existing = tasks.find(t => t.id_goc === newQ.id_goc);
        if (existing) {
            existing.completed = false;
            if (isGroup) { existing.groupColor = groupColor; existing.groupId = newGroupId; }
        } else {
            maxOrder++;
            tasks.push({ ...newQ, id: 't_' + Date.now(), completed: false, groupColor, groupId: newGroupId, order: maxOrder });
        }
    });
    saveAndRenderQuest();
}

function addCustomNote() {
    const text = prompt("Nhập nội dung ghi chú:");
    if (!text) return;
    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;
    tasks.push({ id_goc: "📝 Ghi chú", dich_nghia: text.trim(), id: 't_' + Date.now(), completed: false, order: maxOrder + 1 });
    saveAndRenderQuest();
}

function toggleHideCompleted() {
    hideCompleted = !hideCompleted;
    document.getElementById('btnHideCompleted').innerHTML = hideCompleted ? '👻 Ẩn đã xong' : '👻 Hiện đã xong';
    saveAndRenderQuest();
}
function toggleSelectAll() {
    let vis = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    const allC = vis.every(t => t.completed);
    vis.forEach(t => t.completed = !allC);
    saveAndRenderQuest();
}
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveAndRenderQuest();
}
function clearCompleted() {
    const cTasks = tasks.filter(t => t.completed);
    if(cTasks.length === 0) return alert("Chưa có nhiệm vụ nào được đánh dấu!");
    if(confirm(`Chuyển ${cTasks.length} quest vào thùng rác?`)) {
        trash = trash.concat(cTasks);
        tasks = tasks.filter(t => !t.completed);
        saveAndRenderQuest();
    }
}
function toggleViewMode() {
    viewMode = viewMode === 3 ? 1 : viewMode + 1;
    document.getElementById('btnViewMode').innerHTML = `🔲 ${viewMode} Cột`;
    saveAndRenderQuest();
}

function renderTasks() {
    const listDiv = document.getElementById('todoList');

    // Sắp xếp: Ưu tiên Chưa xong -> Đã Ghim -> Order cũ -> Đã xong
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1; // Đã xong luôn nằm dưới cùng
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;    // Ghim luôn nằm trên cùng
        return a.order - b.order; // Sắp xếp theo vị trí thủ công
    });

    document.getElementById('completedCount').innerText = tasks.filter(t => t.completed).length;
    let visibleTasks = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    document.getElementById('taskCount').innerText = `Đang hiển thị: ${visibleTasks.length} / ${tasks.length} quest`;

    let isGrid = viewMode > 1;
    listDiv.className = 'w-full gap-4 ' + (viewMode === 1 ? 'flex flex-col' : (viewMode === 2 ? 'grid grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'));

    listDiv.innerHTML = '';

    // Tính toán Index để disable nút Lên/Xuống
    const pinnedTasks = visibleTasks.filter(t => !t.completed && t.isPinned);
    const unpinnedTasks = visibleTasks.filter(t => !t.completed && !t.isPinned);

    visibleTasks.forEach((task, index) => {
        const div = document.createElement('div');
        // Xử lý Class bọc ngoài cho từng View
        if (isGrid) {
            div.className = `bg-gray-800 p-4 rounded-lg flex flex-col h-full border-l-4 ${task.isPinned ? 'border-green-500 bg-gray-750' : 'border-transparent'} shadow transition-all ${task.completed ? 'opacity-50' : ''}`;
        } else {
            div.className = `bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4 border-l-4 ${task.isPinned ? 'border-green-500 bg-gray-750' : 'border-transparent'} shadow transition-all ${task.completed ? 'opacity-50' : ''}`;
        }

        const hasHistory = task.history && task.history.length > 0;
        const hasRedo = task.redoHistory && task.redoHistory.length > 0;

        // Kiểm tra disable nút Lên/Xuống
        let disableUp = false;
        let disableDown = false;

        if (task.completed) {
            disableUp = true; disableDown = true;
        } else if (task.isPinned) {
            if (pinnedTasks.indexOf(task) === 0) disableUp = true;
            if (pinnedTasks.indexOf(task) === pinnedTasks.length - 1) disableDown = true;
        } else {
            if (unpinnedTasks.indexOf(task) === 0) disableUp = true;
            if (unpinnedTasks.indexOf(task) === unpinnedTasks.length - 1) disableDown = true;
        }

        const btnUpStyle = disableUp ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-600';
        const btnDownStyle = disableDown ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-600';

        // Render HTML tùy theo chế độ
        if (isGrid) {
            // ==========================================
            // LAYOUT LƯỚI (GRID VIEW) - Card Dọc
            // ==========================================
            div.innerHTML = `
                <div class="flex items-center justify-between w-full mb-3 border-b border-gray-700 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-gray-500 w-6 text-right">#${index + 1}</span>
                        <input type="checkbox" class="w-5 h-5 cursor-pointer accent-blue-600" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                    </div>
                    <div class="flex items-center gap-1 flex-wrap justify-end">
                        ${task.isPinned ? `<span class="text-xs bg-green-900 text-green-400 border border-green-700 px-1.5 py-0.5 rounded font-bold">📌 Đã ghim</span>` : ''}
                        ${task.groupId ? `<span class="text-xs border px-1.5 py-0.5 rounded font-bold" style="color: ${task.groupColor}; border-color: ${task.groupColor};">🔗 Nhóm ${task.groupId}</span>` : ''}
                    </div>
                </div>

                <div class="flex-1 min-w-0 mb-3 w-full">
                    <p class="font-bold text-green-400 text-base mb-1 ${task.completed ? 'line-through text-gray-500' : ''}">${task.dich_nghia}</p>
                    <p class="text-xs text-gray-500 break-words">${task.id_goc}</p>
                </div>

                <div class="flex justify-between items-center mt-auto pt-2 gap-2 flex-wrap w-full border-t border-gray-700">
                    <div class="flex gap-1">
                        <button class="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnUpStyle}" ${disableUp ? 'disabled' : `onclick="moveTask('${task.id}', -1)"`} title="Chuyển lên">🔼</button>
                        <button class="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnDownStyle}" ${disableDown ? 'disabled' : `onclick="moveTask('${task.id}', 1)"`} title="Chuyển xuống">🔽</button>
                        <button class="text-white border ${task.isPinned ? 'border-green-500 bg-green-600' : 'border-gray-600 hover:bg-gray-600'} px-2 py-1 rounded text-xs transition" onclick="togglePin('${task.id}')" title="Ghim/Bỏ ghim">📌</button>
                    </div>

                    <div class="flex items-center gap-1 ml-auto">
                        ${(hasHistory || hasRedo) ? `
                            ${hasHistory ? `<button class="text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="undoEdit('${task.id}')">↩️</button>` : ''}
                            ${hasRedo ? `<button class="text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="redoEdit('${task.id}')">↪️</button>` : ''}
                        ` : ''}
                        <button class="text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white px-2 py-1 rounded text-xs transition font-bold" onclick="editTask('${task.id}')">Sửa</button>
                        <button class="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-xs transition font-bold" onclick="moveToTrash('${task.id}')">Xóa</button>
                    </div>
                </div>
            `;
        } else {
            // ==========================================
            // LAYOUT 1 CỘT (LIST VIEW) - Dải Ngang
            // ==========================================
            div.innerHTML = `
                <div class="flex items-center gap-3 shrink-0">
                    <div class="flex flex-col gap-1">
                        <button class="text-gray-400 ${btnUpStyle} text-xs px-1 rounded" ${disableUp ? 'disabled' : `onclick="moveTask('${task.id}', -1)"`}>🔼</button>
                        <button class="text-gray-400 ${btnDownStyle} text-xs px-1 rounded" ${disableDown ? 'disabled' : `onclick="moveTask('${task.id}', 1)"`}>🔽</button>
                    </div>
                    <span class="font-bold text-gray-500 w-6 text-right">#${index + 1}</span>
                    <input type="checkbox" class="w-5 h-5 cursor-pointer accent-blue-600" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                </div>

                <div class="flex-1 min-w-0 w-full mt-2 md:mt-0">
                    <p class="font-bold text-green-400 text-lg mb-1 flex items-center flex-wrap gap-2 ${task.completed ? 'line-through text-gray-500' : ''}">
                        ${task.isPinned ? `<span class="text-xs bg-green-900 text-green-400 border border-green-700 px-1.5 py-0.5 rounded font-bold">📌 Đã ghim</span>` : ''}
                        ${task.groupId ? `<span class="text-xs border px-1.5 py-0.5 rounded font-bold" style="color: ${task.groupColor}; border-color: ${task.groupColor};">🔗 Nhóm ${task.groupId}</span>` : ''}
                        ${task.dich_nghia}
                    </p>
                    <p class="text-sm text-gray-500 truncate">${task.id_goc}</p>
                </div>

                <div class="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 w-full md:w-auto mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-700 justify-between md:justify-start">
                    <button class="text-white border ${task.isPinned ? 'border-green-500 bg-green-600' : 'border-gray-600 hover:bg-gray-600'} px-2 py-1 rounded text-xs transition font-bold whitespace-nowrap" onclick="togglePin('${task.id}')">📌 Ghim</button>

                    <div class="flex items-center gap-2">
                        ${(hasHistory || hasRedo) ? `
                            ${hasHistory ? `<button class="text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="undoEdit('${task.id}')">↩️</button>` : ''}
                            ${hasRedo ? `<button class="text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="redoEdit('${task.id}')">↪️</button>` : ''}
                        ` : ''}
                        <button class="text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white px-3 py-1 rounded text-sm transition font-bold" onclick="editTask('${task.id}')">Sửa</button>
                        <button class="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-sm transition font-bold" onclick="moveToTrash('${task.id}')">Xóa</button>
                    </div>
                </div>
            `;
        }

        listDiv.appendChild(div);
    });
}

// Logic Mới: Ghim Task
function togglePin(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.isPinned = !task.isPinned;
        saveAndRenderQuest();
    }
}

// Logic Mới: Di chuyển Lên/Xuống
function moveTask(id, direction) {
    // Chỉ thao tác trên các task chưa hoàn thành (vì task hoàn thành mặc định bị đẩy xuống chót)
    let workingTasks = tasks.filter(t => !t.completed);

    // Tìm index của task cần di chuyển trong mảng workingTasks
    const index = workingTasks.findIndex(t => t.id === id);
    if (index === -1) return;

    // Không thể di chuyển lên nếu đang ở đầu, hoặc xuống nếu đang ở cuối
    if (index + direction < 0 || index + direction >= workingTasks.length) return;

    // Hoán đổi vị trí order với task lân cận
    const targetTask = workingTasks[index + direction];
    const currentTask = workingTasks[index];

    // Ngăn chặn việc bấm "Lên" một task không ghim vượt qua ranh giới của task đã ghim
    if(currentTask.isPinned !== targetTask.isPinned) return;

    // Đổi order
    const tempOrder = currentTask.order;
    currentTask.order = targetTask.order;
    targetTask.order = tempOrder;

    saveAndRenderQuest();
}


function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newText = prompt("Sửa bản dịch:", task.dich_nghia);
    if (newText !== null && newText.trim() !== "" && newText.trim() !== task.dich_nghia) {
        if (!task.history) task.history = [];
        task.history.push(task.dich_nghia);
        if (task.history.length > 2) task.history.shift();
        task.redoHistory = [];
        task.dich_nghia = newText.trim();
        saveAndRenderQuest();
    }
}
function undoEdit(id) { const t = tasks.find(t => t.id === id); if(t && t.history?.length) { t.redoHistory = t.redoHistory || []; t.redoHistory.push(t.dich_nghia); t.dich_nghia = t.history.pop(); saveAndRenderQuest(); } }
function redoEdit(id) { const t = tasks.find(t => t.id === id); if(t && t.redoHistory?.length) { t.history = t.history || []; t.history.push(t.dich_nghia); t.dich_nghia = t.redoHistory.pop(); saveAndRenderQuest(); } }
function moveToTrash(id) { const idx = tasks.findIndex(t => t.id === id); if(idx !== -1) { trash.push(tasks[idx]); tasks.splice(idx, 1); saveAndRenderQuest(); } }

function toggleTrash() {
    const modal = document.getElementById('trashModal');
    modal.classList.toggle('hidden');
    renderTrash();
}
function renderTrash() {
    const list = document.getElementById('trashList');
    document.getElementById('trashCount').innerText = trash.length;
    list.innerHTML = '';
    trash.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = 'bg-gray-700 p-3 rounded flex justify-between items-center opacity-70';
        div.innerHTML = `
            <div>
                <p class="text-gray-400 font-bold">${task.dich_nghia}</p>
                <p class="text-xs text-gray-500">${task.id_goc}</p>
            </div>
            <div class="flex gap-2">
                <button class="text-green-400 border border-green-400 px-2 py-1 rounded text-xs hover:bg-green-400 hover:text-white" onclick="restoreTask(${index})">♻️ Khôi phục</button>
                <button class="text-red-500 border border-red-500 px-2 py-1 rounded text-xs hover:bg-red-500 hover:text-white" onclick="deletePermanent(${index})">❌</button>
            </div>
        `;
        list.prepend(div);
    });
}
function restoreTask(index) { tasks.push(trash[index]); trash.splice(index, 1); saveAndRenderQuest(); renderTrash(); }
function deletePermanent(index) { trash.splice(index, 1); saveAndRenderQuest(); renderTrash(); }
function emptyTrash() { if(confirm("Xóa vĩnh viễn?")) { trash = []; saveAndRenderQuest(); renderTrash(); } }

function saveAndRenderQuest() {
    localStorage.setItem('delta_quests', JSON.stringify(tasks));
    localStorage.setItem('delta_quests_trash', JSON.stringify(trash));
    renderTasks();
}

// Chạy lần đầu để load dữ liệu
renderTasks();
renderTrash();