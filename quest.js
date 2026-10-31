let tasks = JSON.parse(localStorage.getItem('delta_quests')) || [];
let trash = JSON.parse(localStorage.getItem('delta_quests_trash')) || [];
let translation_cache = JSON.parse(localStorage.getItem('delta_translation_cache')) || {}; // Thêm cache dịch thuật
let viewMode = 3;
let sortByGroup = false;
let questUndo = null;
let questUndoTimer = null;
let hideCompleted = false;
const GROUP_COLORS = ['#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#f97316', '#3b82f6'];

// Chuẩn hóa data cũ
tasks.forEach((t, i) => {
    if (!t.id) t.id = 't_' + Date.now() + Math.random().toString(36).substr(2, 9);
    if (t.order === undefined) t.order = i;
    if (t.isPinned === undefined) t.isPinned = false; // Thêm cờ ghim
});

// Ảnh và yêu cầu của tab nhiệm vụ độc lập với tab dịch toàn ảnh.
let lastQuestImage = null;
let questRun = null;
let lastQuestStatus = null;

function setQuestStatus(message, state, canRetry = true) {
    lastQuestStatus = [message, state, canRetry];
    document.getElementById('questStatus').classList.remove('hidden');
    const text = document.getElementById('questStatusText');
    text.textContent = message;
    text.className = state === 'error' ? 'text-red-400' : state === 'success' ? 'text-green-400' : 'text-gray-200';
    const busy = !!questRun;
    document.getElementById('loading').style.display = busy ? 'block' : 'none';
    const retry = document.getElementById('retryQuestButton');
    retry.textContent = `Thử lại bằng ${AI_PROVIDERS[aiProvider].name}`;
    retry.classList.toggle('hidden', busy || !canRetry || !lastQuestImage);
    retry.disabled = busy;
    document.getElementById('cancelQuestButton').hidden = !busy;
    const other = otherAiProvider(aiProvider);
    const otherButton = document.getElementById('otherQuestButton');
    otherButton.hidden = busy || !canRetry || !lastQuestImage || !getAiKey(other);
    otherButton.textContent = `Thử ảnh này bằng ${AI_PROVIDERS[other].name}`;
}
function retryQuestImage() { if (lastQuestImage && !questRun) processQuestImage(lastQuestImage); }
function retryQuestOtherProvider() {
    if (lastQuestImage && !questRun) processQuestImage(lastQuestImage, otherAiProvider(aiProvider));
}
function cancelQuestTranslation() {
    if (!questRun) return;
    questRun.controller.abort();
    questRun = null;
    setQuestStatus('Đã hủy xử lý; yêu cầu đã gửi vẫn có thể tính vào hạn mức của nhà cung cấp.', 'info');
}
async function processQuestImage(image, provider = aiProvider) {
    if (questRun || importingBackup) return;
    lastQuestImage = image;
    document.getElementById('questOriginal').src = image.dataUrl;
    document.getElementById('questPreview').hidden = false;
    const run = { controller: new AbortController(), provider };
    questRun = run;
    setQuestStatus(`Đang dịch nhiệm vụ bằng ${AI_PROVIDERS[provider].name}…`, 'info', false);
    try {
        const result = await requestAiTranslation('quest', image, provider, {
            signal: run.controller.signal,
            onProgress: message => { if (questRun === run) setQuestStatus(message, 'info', false); }
        });
        if (questRun !== run) return;
        questRun = null;
        if (!result.items.length) {
            setQuestStatus('AI không tìm thấy nhiệm vụ trong ảnh. Hãy gửi ảnh rõ phần mục tiêu nhiệm vụ.', 'info');
            return;
        }
        try { mergeQuests(result.items); }
        catch {
            setQuestStatus('Đã đọc ảnh nhưng không lưu/hiển thị được nhiệm vụ. Xuất Data để sao lưu và kiểm tra dung lượng trình duyệt.', 'error', false);
            return;
        }
        setQuestStatus(`Đã xử lý ${result.items.length} nhiệm vụ bằng ${AI_PROVIDERS[provider].name}. Mục trùng được dùng lại. Nếu chưa thấy, kiểm tra bộ lọc tìm kiếm.`, 'success', false);
    } catch (error) {
        if (questRun !== run) return;
        questRun = null;
        setQuestStatus(error instanceof AiRequestError ? error.message : 'Không xử lý được ảnh nhiệm vụ. Hãy thử lại.', 'error');
    }
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

async function addCustomNote() {
    const text = await appDialogs.prompt({ title: 'Thêm ghi chú', message: 'Nhập nội dung ghi chú cho danh sách nhiệm vụ.', multiline: true, required: true });
    if (text === null || !text.trim()) return;
    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;
    tasks.push({ id_goc: "📝 Ghi chú", dich_nghia: text.trim(), id: 't_' + Date.now(), completed: false, isPinned: false, order: maxOrder + 1 });
    saveAndRenderQuest();
}

function toggleHideCompleted() {
    hideCompleted = !hideCompleted;
    document.getElementById('btnHideCompleted').innerHTML = hideCompleted ? '👻 Ẩn đã xong' : '👻 Hiện đã xong';
    saveAndRenderQuest();
}
function showQuestUndo(message, restore) {
    clearTimeout(questUndoTimer);
    questUndo = restore;
    document.getElementById('questUndoMessage').textContent = message;
    document.getElementById('questUndoToast').hidden = false;
    questUndoTimer = setTimeout(dismissQuestUndo, 3000);
}
function dismissQuestUndo() {
    clearTimeout(questUndoTimer);
    questUndoTimer = null;
    questUndo = null;
    document.getElementById('questUndoToast').hidden = true;
}
function undoQuestAction() {
    const restore = questUndo;
    dismissQuestUndo();
    if (restore) { restore(); saveAndRenderQuest(); }
}
function rememberQuestFields(entries, field, message) {
    const changes = entries.map(task => ({ task, before: task[field] }));
    return () => {
        changes.forEach(change => { change.after = change.task[field]; });
        showQuestUndo(message, () => changes.forEach(({ task, before, after }) => {
            if (tasks.includes(task) && task[field] === after) task[field] = before;
        }));
    };
}
function toggleQuestGrouping() {
    const before = sortByGroup;
    sortByGroup = !sortByGroup;
    saveAndRenderQuest();
    showQuestUndo('Đã đổi cách sắp xếp nhóm.', () => { sortByGroup = before; });
}
function toggleSelectAll() {
    const vis = getVisibleTasks();
    const allC = vis.every(t => t.completed);
    if (!vis.length) return;
    const remember = rememberQuestFields(vis, 'completed', 'Đã đổi đánh dấu các quest đang hiện.');
    vis.forEach(t => t.completed = !allC);
    remember();
    saveAndRenderQuest();
}
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const remember = rememberQuestFields([task], 'completed', task.completed ? 'Đã bỏ đánh dấu hoàn thành.' : 'Đã đánh dấu hoàn thành quest.');
    task.completed = !task.completed;
    remember();
    saveAndRenderQuest();
}
async function clearCompleted() {
    const cTasks = tasks.filter(t => t.completed);
    if(cTasks.length === 0) return appDialogs.alert('Chưa có nhiệm vụ nào được đánh dấu!');
    const selected = new Set(cTasks);
    if (await appDialogs.confirm({ title: 'Dọn nhiệm vụ đã tick?', message: `Chuyển ${cTasks.length} nhiệm vụ đã tick vào thùng rác?`, detail: 'Bao gồm các mục đã tick đang bị bộ lọc ẩn. Bạn có thể khôi phục từ Thùng rác.', confirmText: 'Chuyển vào thùng rác' })) {
        const confirmed = tasks.filter(task => selected.has(task) && task.completed);
        trash = trash.concat(confirmed);
        tasks = tasks.filter(task => !confirmed.includes(task));
        saveAndRenderQuest();
    }
}
function toggleViewMode() {
    viewMode = viewMode === 3 ? 1 : viewMode + 1;
    document.getElementById('btnViewMode').innerHTML = `🔲 ${viewMode} Cột`;
    saveAndRenderQuest();
}

function getVisibleTasks() {
    const query = document.getElementById('questSearch').value;
    return tasks.filter(task => (!hideCompleted || !task.completed)
        && matchesSearch(query, task.dich_nghia, task.id_goc));
}

function renderTasks() {
    const listDiv = document.getElementById('todoList');

    // Sắp xếp: Ưu tiên Chưa xong -> Đã Ghim -> Order cũ -> Đã xong
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        if (sortByGroup && (a.groupId || 0) !== (b.groupId || 0)) {
            return (a.groupId || Number.MAX_SAFE_INTEGER) - (b.groupId || Number.MAX_SAFE_INTEGER);
        }
        return a.order - b.order;
    });

    document.getElementById('btnQuestGrouping').textContent = sortByGroup ? '🔗 Theo nhóm: Bật' : '🔗 Theo nhóm: Tắt';
    document.getElementById('btnQuestGrouping').setAttribute('aria-pressed', String(sortByGroup));
    document.getElementById('completedCount').innerText = tasks.filter(t => t.completed).length;
    const visibleTasks = getVisibleTasks();
    document.getElementById('taskCount').innerText = `Đang hiển thị: ${visibleTasks.length} / ${tasks.length} quest`;

    let isGrid = viewMode > 1;
    listDiv.className = 'w-full gap-4 ' + (viewMode === 1 ? 'flex flex-col' : (viewMode === 2 ? 'grid grid-cols-1 md:grid-cols-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'));

    listDiv.innerHTML = '';
    if (!visibleTasks.length) {
        listDiv.textContent = tasks.length ? 'Không có nhiệm vụ phù hợp với bộ lọc hiện tại.' : 'Chưa có nhiệm vụ. Dán ảnh hoặc thêm ghi chú để bắt đầu.';
    }

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

        const sameGroup = t => !sortByGroup || (t.groupId || null) === (task.groupId || null);
        const pinnedPeers = pinnedTasks.filter(sameGroup);
        const unpinnedPeers = unpinnedTasks.filter(sameGroup);
        if (task.completed) {
            disableUp = true; disableDown = true;
        } else if (task.isPinned) {
            if (pinnedPeers.indexOf(task) === 0) disableUp = true;
            if (pinnedPeers.indexOf(task) === pinnedPeers.length - 1) disableDown = true;
        } else {
            if (unpinnedPeers.indexOf(task) === 0) disableUp = true;
            if (unpinnedPeers.indexOf(task) === unpinnedPeers.length - 1) disableDown = true;
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
                        <span class="font-bold text-gray-200 w-6 text-right">#${index + 1}</span>
                        <input type="checkbox" class="w-5 h-5 cursor-pointer accent-blue-600" ${task.completed ? 'checked' : ''} onchange="toggleTask(${taskId})">
                    </div>
                    <div class="flex items-center gap-1 flex-wrap justify-end">
                        ${task.isPinned ? `<span class="text-xs bg-green-900 text-green-400 border border-green-700 px-1.5 py-0.5 rounded font-bold">📌 Đã ghim</span>` : ''}
                        ${task.groupId ? `<span class="text-xs border px-1.5 py-0.5 rounded font-bold" style="color: ${groupColor}; border-color: ${groupColor};">🔗 Nhóm ${escapeHtml(task.groupId)}</span>` : ''}
                    </div>
                </div>

                <div class="flex-1 min-w-0 mb-3 w-full">
                    <p class="font-bold text-green-400 text-base mb-1 ${task.completed ? 'line-through text-gray-200' : ''}">${escapeHtml(task.dich_nghia)}</p>
                    <p class="text-xs text-gray-200 break-words">${escapeHtml(task.id_goc)}</p>
                </div>

                <div class="flex justify-between items-center mt-auto pt-2 gap-2 flex-wrap w-full border-t border-gray-700">
                    <div class="flex gap-1">
                        <button class="text-gray-200 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnUpStyle}" ${disableUp ? 'disabled' : `onclick="moveTask(${taskId}, -1)"`} title="Chuyển lên">🔼</button>
                        <button class="text-gray-200 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnDownStyle}" ${disableDown ? 'disabled' : `onclick="moveTask(${taskId}, 1)"`} title="Chuyển xuống">🔽</button>
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
                        <span class="font-bold text-gray-200 w-6 text-right shrink-0">#${index + 1}</span>
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
                        <p class="font-bold text-green-400 text-lg mb-1 ${task.completed ? 'line-through text-gray-200' : ''}">${escapeHtml(task.dich_nghia)}</p>
                        <p class="text-sm text-gray-200 truncate w-full">${escapeHtml(task.id_goc)}</p>
                    </div>

                    <!-- Khu vực các nút bấm -->
                    <div class="flex flex-wrap items-center gap-2 shrink-0 border-t border-gray-700 md:border-none pt-3 md:pt-0 w-full md:w-auto">
                        <div class="flex gap-1 border-r border-gray-700 pr-2 mr-1">
                            <button class="text-gray-200 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnUpStyle}" ${disableUp ? 'disabled' : `onclick="moveTask(${taskId}, -1)"`} title="Lên">🔼</button>
                            <button class="text-gray-200 border border-gray-600 px-2 py-1 rounded text-xs transition ${btnDownStyle}" ${disableDown ? 'disabled' : `onclick="moveTask(${taskId}, 1)"`} title="Xuống">🔽</button>
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
    if (![-1, 1].includes(direction)) return;
    const moving = tasks.find(task => task.id === id);
    if (!moving) return;
    const workingTasks = getVisibleTasks().filter(task => !task.completed
        && task.isPinned === moving.isPinned
        && (!sortByGroup || (task.groupId || null) === (moving.groupId || null)));
    const index = workingTasks.findIndex(t => t.id === id);
    if (index === -1) return;
    if (index + direction < 0 || index + direction >= workingTasks.length) return;

    const targetTask = workingTasks[index + direction];
    const currentTask = workingTasks[index];

    if(currentTask.isPinned !== targetTask.isPinned) return;

    const remember = rememberQuestFields([currentTask, targetTask], 'order', 'Đã đổi thứ tự quest.');
    const tempOrder = currentTask.order;
    currentTask.order = targetTask.order;
    targetTask.order = tempOrder;
    remember();
    saveAndRenderQuest();
}

async function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newText = await appDialogs.prompt({ title: 'Sửa bản dịch', message: task.id_goc, value: task.dich_nghia, inputLabel: 'Bản dịch', multiline: true, required: true });
    if (!tasks.includes(task)) return;
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
                <p class="text-gray-200 font-bold">${escapeHtml(task.dich_nghia)}</p>
                <p class="text-xs text-gray-200">${escapeHtml(task.id_goc)}</p>
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
async function emptyTrash() {
    const selected = new Set(trash);
    if (await appDialogs.confirm({ title: 'Xóa vĩnh viễn nhiệm vụ?', message: `Xóa vĩnh viễn ${selected.size} nhiệm vụ đang có trong thùng rác?`, detail: 'Không thể khôi phục từ Thùng rác sau thao tác này.', confirmText: 'Xóa vĩnh viễn', danger: true })) {
        trash = trash.filter(task => !selected.has(task));
        saveAndRenderQuest();
        renderTrash();
    }
}

function saveAndRenderQuest() {
    localStorage.setItem('delta_quests', JSON.stringify(tasks));
    localStorage.setItem('delta_quests_trash', JSON.stringify(trash));
    renderTasks();
}

// Chạy lần đầu để load dữ liệu
renderTasks();
renderTrash();
