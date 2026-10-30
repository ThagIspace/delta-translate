let tasks = JSON.parse(localStorage.getItem('delta_quests')) || [];
let trash = JSON.parse(localStorage.getItem('delta_quests_trash')) || [];
let translation_cache = JSON.parse(localStorage.getItem('delta_translation_cache')) || {}; // Thêm cache dịch thuật
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
        // Tạo bộ đếm thời gian 25s để hủy request nếu mạng lag treo
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELS[i]}:generateContent?key=${apiKeys[0]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }, { inlineData: { mimeType: mimeType, data: base64Data } }] }],
                    generationConfig: { responseMimeType: "application/json" }
                }),
                signal: controller.signal // Truyền tín hiệu hủy vào fetch
            });

            clearTimeout(timeoutId); // Nếu request thành công trước 25s thì xóa bộ đếm
            const data = await response.json();
            if (data.error) continue;

            const resultText = data.candidates[0].content.parts[0].text;
            const newQuests = JSON.parse(resultText);

            if (newQuests.length > 0) mergeQuests(newQuests);
            break;
        } catch (e) {
            clearTimeout(timeoutId); // Dọn dẹp bộ đếm khi lỗi

            // Xử lý nếu nguyên nhân lỗi là do Mất mạng hoặc Timeout
            if (e.name === 'AbortError' || !navigator.onLine) {
                alert("⏱️ Lỗi kết nối mạng hoặc mạng quá chậm. Đã hủy quét ảnh!");
                break; // Thoát hẳn vòng lặp, không cố thử model khác nữa
            }

            if (i === MODELS.length - 1) console.error(e);
        }
    }

    // ĐẢM BẢO LUÔN TẮT CHỮ LOADING DÙ THÀNH CÔNG HAY THẤT BẠI
    document.getElementById('loading').style.display = 'none';
}

function mergeQuests(newQuests) {
    const isGroup = newQuests.length > 1;
    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;
    let maxGroupId = tasks.length > 0 ? Math.max(...tasks.map(t => t.groupId || 0)) : 0;
    const newGroupId = isGroup ? maxGroupId + 1 : null;
    const groupColor = isGroup ? GROUP_COLORS[(newGroupId - 1) % GROUP_COLORS.length] : null;

    newQuests.forEach(newQ => {
        // 1. Tìm xem đang có trong list chạy không
        let existing = tasks.find(t => t.id_goc === newQ.id_goc);

        // 2. Nếu không có, tìm thử trong thùng rác
        if (!existing) {
            let trashIdx = trash.findIndex(t => t.id_goc === newQ.id_goc);
            if (trashIdx !== -1) {
                existing = trash[trashIdx];
                trash.splice(trashIdx, 1); // Rút khỏi thùng rác
                tasks.push(existing);      // Đưa lại vào danh sách chính
            }
        }

        if (existing) {
            // Nếu đã có ở ngoài hoặc vừa cứu từ thùng rác ra -> Kích hoạt lại
            existing.completed = false;
            if (isGroup) { existing.groupColor = groupColor; existing.groupId = newGroupId; }
        } else {
            // 3. Kiểm tra xem quá khứ đã từng dịch và lưu Cache chưa
            let cachedTranslation = translation_cache[newQ.id_goc];
            maxOrder++;

            tasks.push({
                ...newQ,
                dich_nghia: cachedTranslation || newQ.dich_nghia, // Ưu tiên bản dịch đã lưu trong cache
                id: 't_' + Date.now() + Math.random().toString(36).substr(2, 9),
                completed: false,
                isPinned: false,
                groupColor,
                groupId: newGroupId,
                order: maxOrder
            });

            // Lưu lại vào cache để mốt dùng
            translation_cache[newQ.id_goc] = cachedTranslation || newQ.dich_nghia;
        }
    });

    // Lưu cache xuống LocalStorage
    localStorage.setItem('delta_translation_cache', JSON.stringify(translation_cache));
    saveAndRenderQuest();
}

function addCustomNote() {
    const text = prompt("Nhập nội dung ghi chú:");
    if (!text) return;
    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;
    tasks.push({ id_goc: "📝 Ghi chú", dich_nghia: text.trim(), id: 't_' + Date.now(), completed: false, isPinned: false, order: maxOrder + 1 });
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
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return a.order - b.order;
    });

    document.getElementById('completedCount').innerText = tasks.filter(t => t.completed).length;
    let visibleTasks = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    document.getElementById('taskCount').innerText = `Đang hiển thị: ${visibleTasks.length} / ${tasks.length} quest`;

    let isGrid = viewMode > 1;
    listDiv.className = 'w-full gap-4 ' + (viewMode === 1 ? 'flex flex-col' : (viewMode === 2 ? 'grid grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'));

    listDiv.innerHTML = '';

    const pinnedTasks = visibleTasks.filter(t => !t.completed && t.isPinned);
    const unpinnedTasks = visibleTasks.filter(t => !t.completed && !t.isPinned);

    visibleTasks.forEach((task, index) => {
        const taskId = htmlArgument(task.id);
        const groupColor = /^#[0-9a-f]{6}$/i.test(task.groupColor) ? task.groupColor : GROUP_COLORS[0];
        const div = document.createElement('div');
        // Thêm Class nền và viền sáng nếu được ghim
        div.className = `bg-gray-800 p-4 rounded-lg flex flex-col h-full border-l-4 ${task.isPinned ? 'border-green-500 bg-gray-750' : 'border-transparent'} shadow transition-all ${task.completed ? 'opacity-50' : ''}`;

        const hasHistory = task.history && task.history.length > 0;
        const hasRedo = task.redoHistory && task.redoHistory.length > 0;

        // Logic disable nút Lên/Xuống
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

        if (isGrid) {
            // ==========================================
            // LAYOUT LƯỚI (GRID VIEW) - Card Dọc
            // ==========================================
            div.innerHTML = `
                <div class="flex items-center justify-between w-full mb-3 border-b border-gray-700 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-gray-500 w-6 text-right">#${index + 1}</span>
                        <input type="checkbox" class="w-5 h-5 cursor-pointer accent-blue-600" ${task.completed ? 'checked' : ''} onchange="toggleTask(${taskId})">
                    </div>
                    <div class="flex items-center gap-1 flex-wrap justify-end">
                        ${task.isPinned ? `<span class="text-xs bg-green-900 text-green-400 border border-green-700 px-1.5 py-0.5 rounded font-bold">📌 Đã ghim</span>` : ''}
                        ${task.groupId ? `<span class="text-xs border px-1.5 py-0.5 rounded font-bold" style="color: ${groupColor}; border-color: ${groupColor};">🔗 Nhóm ${escapeHtml(task.groupId)}</span>` : ''}
                    </div>
                </div>

                <div class="flex-1 min-w-0 mb-3 w-full">
                    <p class="font-bold text-green-400 text-base mb-1 ${task.completed ? 'line-through text-gray-500' : ''}">${escapeHtml(task.dich_nghia)}</p>
                    <p class="text-xs text-gray-500 break-words">${escapeHtml(task.id_goc)}</p>
                </div>

                <div class="flex justify-between items-center mt-auto pt-2 gap-2 flex-wrap w-full border-t border-gray-700">
                    <div class="flex gap-1">
                        <button class="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnUpStyle}" ${disableUp ? 'disabled' : `onclick="moveTask(${taskId}, -1)"`} title="Chuyển lên">🔼</button>
                        <button class="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnDownStyle}" ${disableDown ? 'disabled' : `onclick="moveTask(${taskId}, 1)"`} title="Chuyển xuống">🔽</button>
                        <button class="text-white border ${task.isPinned ? 'border-green-500 bg-green-600' : 'border-gray-600 hover:bg-gray-600'} px-2 py-1 rounded text-xs transition" onclick="togglePin(${taskId})" title="Ghim/Bỏ ghim">📌</button>
                    </div>

                    <div class="flex items-center gap-1 ml-auto">
                        ${(hasHistory || hasRedo) ? `
                            ${hasHistory ? `<button class="text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="undoEdit(${taskId})">↩️</button>` : ''}
                            ${hasRedo ? `<button class="text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white px-2 py-0.5 rounded text-xs" onclick="redoEdit(${taskId})">↪️</button>` : ''}
                        ` : ''}
                        <button class="text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white px-2 py-1 rounded text-xs transition font-bold" onclick="editTask(${taskId})">Sửa</button>
                        <button class="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-xs transition font-bold" onclick="moveToTrash(${taskId})">Xóa</button>
                    </div>
                </div>
            `;
        } else {
            // ==========================================
            // LAYOUT 1 CỘT (LIST VIEW) - Bố cục tách rời chống lệch
            // ==========================================
            div.innerHTML = `
                <!-- Header: STT, Checkbox, Tag -->
                <div class="flex items-center justify-between w-full mb-2">
                    <div class="flex items-center gap-3">
                        <span class="font-bold text-gray-500 w-6 text-right shrink-0">#${index + 1}</span>
                        <input type="checkbox" class="w-5 h-5 cursor-pointer accent-blue-600 shrink-0" ${task.completed ? 'checked' : ''} onchange="toggleTask(${taskId})">
                    </div>
                    <div class="flex items-center gap-2 flex-wrap justify-end">
                        ${task.isPinned ? `<span class="text-xs bg-green-900 text-green-400 border border-green-700 px-1.5 py-0.5 rounded font-bold shrink-0">📌 Đã ghim</span>` : ''}
                        ${task.groupId ? `<span class="text-xs border px-1.5 py-0.5 rounded font-bold shrink-0" style="color: ${groupColor}; border-color: ${groupColor};">🔗 Nhóm ${escapeHtml(task.groupId)}</span>` : ''}
                    </div>
                </div>

                <!-- Body & Action (Cùng hàng trên Desktop, Tách hàng trên Mobile) -->
                <div class="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4">

                    <!-- Dịch nghĩa & ID gốc -->
                    <div class="flex-1 min-w-0 w-full">
                        <p class="font-bold text-green-400 text-lg mb-1 ${task.completed ? 'line-through text-gray-500' : ''}">${escapeHtml(task.dich_nghia)}</p>
                        <p class="text-sm text-gray-500 truncate w-full">${escapeHtml(task.id_goc)}</p>
                    </div>

                    <!-- Khu vực các nút bấm -->
                    <div class="flex flex-wrap items-center gap-2 shrink-0 border-t border-gray-700 md:border-none pt-3 md:pt-0 w-full md:w-auto">
                        <div class="flex gap-1 border-r border-gray-700 pr-2 mr-1">
                            <button class="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnUpStyle}" ${disableUp ? 'disabled' : `onclick="moveTask(${taskId}, -1)"`} title="Lên">🔼</button>
                            <button class="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnDownStyle}" ${disableDown ? 'disabled' : `onclick="moveTask(${taskId}, 1)"`} title="Xuống">🔽</button>
                            <button class="text-white border ${task.isPinned ? 'border-green-500 bg-green-600' : 'border-gray-600 hover:bg-gray-600'} px-2 py-1 rounded text-xs transition" onclick="togglePin(${taskId})" title="Ghim">📌</button>
                        </div>

                        ${(hasHistory || hasRedo) ? `
                            ${hasHistory ? `<button class="text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-white px-2 py-1 rounded text-xs" onclick="undoEdit(${taskId})">↩️</button>` : ''}
                            ${hasRedo ? `<button class="text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white px-2 py-1 rounded text-xs" onclick="redoEdit(${taskId})">↪️</button>` : ''}
                        ` : ''}
                        <button class="text-yellow-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white px-3 py-1 rounded text-sm transition font-bold" onclick="editTask(${taskId})">Sửa</button>
                        <button class="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-sm transition font-bold" onclick="moveToTrash(${taskId})">Xóa</button>
                    </div>
                </div>
            `;
        }

        listDiv.appendChild(div);
    });
}

function togglePin(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.isPinned = !task.isPinned;
        saveAndRenderQuest();
    }
}

function moveTask(id, direction) {
    let workingTasks = tasks.filter(t => !t.completed);
    const index = workingTasks.findIndex(t => t.id === id);
    if (index === -1) return;
    if (index + direction < 0 || index + direction >= workingTasks.length) return;

    const targetTask = workingTasks[index + direction];
    const currentTask = workingTasks[index];

    if(currentTask.isPinned !== targetTask.isPinned) return;

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

        // Cập nhật bản dịch mới vào cache luôn
        translation_cache[task.id_goc] = task.dich_nghia;
        localStorage.setItem('delta_translation_cache', JSON.stringify(translation_cache));

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
                <p class="text-gray-400 font-bold">${escapeHtml(task.dich_nghia)}</p>
                <p class="text-xs text-gray-500">${escapeHtml(task.id_goc)}</p>
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