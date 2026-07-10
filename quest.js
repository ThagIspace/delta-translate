// State cho Dịch nhiệm vụ
let tasks = JSON.parse(localStorage.getItem('delta_quests')) || [];
let trash = JSON.parse(localStorage.getItem('delta_quests_trash')) || [];
let viewMode = 1;
let hideCompleted = false;
const GROUP_COLORS = ['#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#f97316', '#3b82f6'];

// Chuẩn hóa data cũ
tasks.forEach((t, i) => {
    if (!t.id) t.id = 't_' + Date.now() + Math.random().toString(36).substr(2, 9);
    if (t.order === undefined) t.order = i;
});

// Gọi API Gemini Dịch Quest
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

function toggleHideCompleted() { hideCompleted = !hideCompleted; document.getElementById('btnHideCompleted').innerHTML = hideCompleted ? '👻 Ẩn đã xong' : '👻 Hiện đã xong'; saveAndRenderQuest(); }
function toggleSelectAll() {
    let vis = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    const allC = vis.every(t => t.completed);
    vis.forEach(t => t.completed = !allC);
    saveAndRenderQuest();
}
function toggleTask(id) { const task = tasks.find(t => t.id === id); if (task) task.completed = !task.completed; saveAndRenderQuest(); }
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
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.order - b.order;
    });

    document.getElementById('completedCount').innerText = tasks.filter(t => t.completed).length;
    let visibleTasks = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    document.getElementById('taskCount').innerText = `Đang hiển thị: ${visibleTasks.length} / ${tasks.length} quest`;

    listDiv.className = 'w-full gap-4 ' + (viewMode === 1 ? 'flex flex-col' : (viewMode === 2 ? 'grid grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'));

    listDiv.innerHTML = '';
    visibleTasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = `bg-gray-800 p-4 rounded-lg flex items-start gap-3 border-l-4 border-transparent shadow ${task.completed ? 'opacity-50' : ''}`;
        div.setAttribute('draggable', 'true');
        div.ondragstart = (e) => dragStart(e, task.id);
        div.ondragover = (e) => dragOver(e);
        div.ondrop = (e) => drop(e, task.id);
        div.ondragend = (e) => dragEnd(e);

        const hasHistory = task.history && task.history.length > 0;
        const hasRedo = task.redoHistory && task.redoHistory.length > 0;

        div.innerHTML = `
            <div class="cursor-grab text-xl text-gray-500 mt-1" title="Kéo">↕️</div>
            <div class="font-bold text-gray-500 mt-1 shrink-0">#${index + 1}</div>
            <input type="checkbox" class="w-5 h-5 mt-1 cursor-pointer accent-blue-600 shrink-0" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">

            <div class="flex-1 min-w-0">
                <p class="font-bold text-green-400 mb-1 flex items-center flex-wrap gap-2 ${task.completed ? 'line-through text-gray-500' : ''}">
                    ${task.groupId ? `<span class="text-xs border px-1 rounded" style="color: ${task.groupColor}; border-color: ${task.groupColor};">🔗 Nhóm ${task.groupId}</span>` : ''}
                    ${task.dich_nghia}
                </p>
                <p class="text-xs text-gray-500 truncate">${task.id_goc}</p>
            </div>

            <div class="flex flex-col items-end gap-2 shrink-0">
                ${(hasHistory || hasRedo) ? `
                <div class="flex gap-1">
                    ${hasHistory ? `<button class="text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="undoEdit('${task.id}')">↩️</button>` : ''}
                    ${hasRedo ? `<button class="text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="redoEdit('${task.id}')">↪️</button>` : ''}
                </div>
                ` : ''}
                <button class="text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white px-2 py-1 rounded text-xs transition" onclick="editTask('${task.id}')">✏️ Sửa</button>
                <button class="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-xs transition" onclick="moveToTrash('${task.id}')">🗑️ Xóa</button>
            </div>
        `;
        listDiv.appendChild(div);
    });
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

let draggedItemId = null;
function dragStart(e, id) { draggedItemId = id; e.target.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
function dragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function drop(e, targetId) {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) return;
    const fromTask = tasks.find(t => t.id === draggedItemId);
    const toTask = tasks.find(t => t.id === targetId);
    if (fromTask && toTask) {
        fromTask.order = toTask.order - 0.5;
        tasks.sort((a, b) => a.order - b.order);
        tasks.forEach((t, i) => t.order = i);
        saveAndRenderQuest();
    }
}
function dragEnd(e) { e.target.classList.remove('dragging'); draggedItemId = null; }

function saveAndRenderQuest() {
    localStorage.setItem('delta_quests', JSON.stringify(tasks));
    localStorage.setItem('delta_quests_trash', JSON.stringify(trash));
    renderTasks();
}

// Chạy lần đầu để load dữ liệu
renderTasks();
renderTrash();