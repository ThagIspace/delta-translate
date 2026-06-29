const HARDCODED_API_KEY = "";

let tasks = JSON.parse(localStorage.getItem('delta_quests')) || [];
let trash = JSON.parse(localStorage.getItem('delta_quests_trash')) || [];
let savedApiKey = localStorage.getItem('gemini_api_key') || "";

// viewMode: 1 (List), 2 (Grid 2 cột), 3 (Grid 3 cột)
let viewMode = 1;
let hideCompleted = false;

// Đảm bảo dữ liệu cũ có ID và order
tasks.forEach((t, i) => {
    if (!t.id) t.id = 't_' + Date.now() + Math.random().toString(36).substr(2, 9);
    if (t.order === undefined) t.order = i;
});

// Tự động ẩn phần nhập liệu nếu đã có Key
if (savedApiKey) {
    document.getElementById('apiKey').value = savedApiKey;
    document.body.classList.add('mini-mode');
}

renderTasks();
renderTrash();

function saveApiKey() {
    const key = document.getElementById('apiKey').value;
    localStorage.setItem('gemini_api_key', key);
    // Tự động ẩn sau khi nhập key mới
    if(key.trim() !== '') document.body.classList.add('mini-mode');
}

document.addEventListener('paste', async (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf('image') === 0) {
            const blob = item.getAsFile();
            const base64Img = await blobToBase64(blob);

            let mimeType = base64Img.substring(base64Img.indexOf(":") + 1, base64Img.indexOf(";"));
            if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)) {
                mimeType = 'image/jpeg';
            }

            processImage(base64Img.split(',')[1], mimeType);
        }
    }
});

async function processImage(base64Data, mimeType) {
    const apiKeyInput = document.getElementById('apiKey').value || HARDCODED_API_KEY;
    if (!apiKeyInput) return alert("Vui lòng nhập API Key!");

    const apiKeys = apiKeyInput.split(',').map(k => k.trim()).filter(k => k);
    document.getElementById('loading').style.display = 'block';

    const promptText = `Trích xuất nhiệm vụ game Delta Force. Tìm 'Mục tiêu hành động cụ thể'. Bỏ qua cốt truyện. Trả về MỘT mảng JSON: [{"id_goc": "Chữ Trung", "dich_nghia": "Dịch Việt"}]. NẾU ảnh không chứa nhiệm vụ game hoặc không liên quan, hãy trả về mảng rỗng: []`;
    const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash'];

    for (let i = 0; i < MODELS.length; i++) {
        const currentModel = MODELS[i];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKeys[0]}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: promptText },
                            { inlineData: { mimeType: mimeType, data: base64Data } }
                        ]
                    }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            const data = await response.json();

            if (data.error) {
                if (i === MODELS.length - 1) alert("Tất cả model đều lỗi hoặc quá tải!\nChi tiết: " + data.error.message);
                continue;
            }

            let resultText = data.candidates[0].content.parts[0].text;

            try {
                const newQuests = JSON.parse(resultText);
                if (newQuests.length === 0) {
                    alert("Không tìm thấy nhiệm vụ nào! Có vẻ bạn dán nhầm ảnh.");
                } else {
                    mergeQuests(newQuests);
                }
                break;
            } catch (parseError) {
                if (i === MODELS.length - 1) alert("AI không trả về JSON hợp lệ.");
            }
        } catch (error) {
            console.error(`Lỗi ở model ${currentModel}:`, error);
            if (i === MODELS.length - 1) alert("Lỗi xử lý! Xem Console (F12).");
        }
    }

    document.getElementById('loading').style.display = 'none';
}

// Danh sách màu phân biệt rõ ràng cho các nhóm liên tiếp
const GROUP_COLORS = [
    '#FF6B6B', '#4ECDC4', '#9B59B6', '#F1C40F',
    '#E67E22', '#3498DB', '#1ABC9C', '#E74C3C'
];

function mergeQuests(newQuests) {
    let highlightIds = [];
    const isGroup = newQuests.length > 1;

    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;
    let maxGroupId = tasks.length > 0 ? Math.max(...tasks.map(t => t.groupId || 0)) : 0;
    const newGroupId = isGroup ? maxGroupId + 1 : null;

    // Lấy màu cố định theo ID nhóm để tránh trùng 2 lần liên tiếp
    const groupColor = isGroup ? GROUP_COLORS[(newGroupId - 1) % GROUP_COLORS.length] : null;

    newQuests.forEach(newQ => {
        const existingTaskIndex = tasks.findIndex(t => t.id_goc === newQ.id_goc);
        if (existingTaskIndex !== -1) {
            tasks[existingTaskIndex].tien_do = newQ.tien_do;
            tasks[existingTaskIndex].completed = false;
            if (isGroup) {
                tasks[existingTaskIndex].groupColor = groupColor;
                tasks[existingTaskIndex].groupId = newGroupId;
            }
            highlightIds.push(newQ.id_goc);
        } else {
            maxOrder++;
            tasks.push({
                ...newQ,
                id: 't_' + Date.now() + Math.random().toString(36).substr(2, 9),
                completed: false,
                groupColor: groupColor,
                groupId: newGroupId,
                order: maxOrder
            });
            highlightIds.push(newQ.id_goc);
        }
    });
    saveAndRender(highlightIds);
}

// Thêm Ghi chú thủ công
function addCustomNote() {
    const text = prompt("Nhập nội dung ghi chú / quest tùy chỉnh:");
    if (!text || text.trim() === '') return;

    let maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order || 0)) : 0;

    const newNote = {
        id_goc: "📝 Ghi chú thủ công",
        dich_nghia: text.trim(),
        id: 't_' + Date.now() + Math.random().toString(36).substr(2, 9),
        completed: false,
        order: maxOrder + 1
    };

    tasks.push(newNote);
    saveAndRender([newNote.id_goc]);
}

function renderTasks(highlightIds = []) {
    const listDiv = document.getElementById('todoList');
    const countDiv = document.getElementById('taskCount');
    const completedCountSpan = document.getElementById('completedCount');

    // Tự động sắp xếp: Chưa xong lên trên (theo order), Xong xuống dưới
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.order - b.order;
    });

    listDiv.className = '';

    // Đếm thông số (Chỉ dùng completed)
    let completedCount = tasks.filter(t => t.completed).length;
    if (completedCountSpan) completedCountSpan.innerText = completedCount;

    // Xử lý Ẩn task đã xong
    let visibleTasks = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    if (countDiv) countDiv.innerText = `Đang hiển thị: ${visibleTasks.length} / ${tasks.length} quest`;

    let isGrid = viewMode > 1;

    if (isGrid) {
        listDiv.classList.add(viewMode === 2 ? 'grid-view-2' : 'grid-view-3');
        document.body.classList.add('grid-layout');
    } else {
        document.body.classList.remove('grid-layout');
    }

    // Hiển thị toàn bộ dữ liệu
    let tasksToRender = visibleTasks;

    listDiv.innerHTML = '';

    tasksToRender.forEach((task, localIndex) => {
        const absoluteIndex = localIndex;

        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;

        if (highlightIds.includes(task.id_goc)) div.classList.add('highlight');

        // Cho phép kéo thả trên mọi giao diện
        div.setAttribute('draggable', 'true');
        div.ondragstart = (e) => dragStart(e, task.id);
        div.ondragover = (e) => dragOver(e);
        div.ondrop = (e) => drop(e, task.id);
        div.ondragend = (e) => dragEnd(e);

        const hasHistory = task.history && task.history.length > 0;
        const hasRedo = task.redoHistory && task.redoHistory.length > 0;

        div.innerHTML = `
            <div class="drag-handle" title="Kéo để di chuyển">↕️</div>
            <div class="seq-number">#${absoluteIndex + 1}</div>

            <!-- Chuyển thành 1 checkbox duy nhất -->
            <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')" title="Đánh dấu hoàn thành / Chọn">

            <div class="task-content">
                <p class="task-title">
                    ${task.groupId ? `<span class="group-badge" style="color: ${task.groupColor}; border-color: ${task.groupColor};" title="Nhóm quest">🔗 Nhóm ${task.groupId}</span>` : ''}
                    ${task.dich_nghia}
                </p>
                <p class="task-original">${task.id_goc}</p>
            </div>
            <div class="task-right action-group">
                ${(hasHistory || hasRedo) ? `
                <div style="display: flex; gap: 5px;">
                    ${hasHistory ? `<button class="undo-btn" onclick="undoEdit('${task.id}')" title="Lùi lại">↩️</button>` : ''}
                    ${hasRedo ? `<button class="redo-btn" onclick="redoEdit('${task.id}')" title="Tiến tới">↪️</button>` : ''}
                </div>
                ` : ''}
                <button class="edit-btn" onclick="editTask('${task.id}')">✏️ Sửa</button>
                <button class="delete-btn" onclick="moveToTrash('${task.id}')">🗑️ Xóa</button>
            </div>
        `;
        listDiv.appendChild(div);
    });

    // Dọn dẹp DOM cũ nếu còn sót lại thẻ div phân trang
    const pageDiv = document.getElementById('pagination');
    if (pageDiv) pageDiv.innerHTML = '';

    if (highlightIds.length > 0) {
        setTimeout(() => {
            const firstHighlight = document.querySelector('.highlight');
            if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

function toggleHideCompleted() {
    hideCompleted = !hideCompleted;
    const btn = document.getElementById('btnHideCompleted');
    if(btn) {
        btn.innerHTML = hideCompleted ? '👻 Ẩn đã xong' : '👻 Hiện đã xong';
    }
    saveAndRender();
}

// Nút chọn tất cả đổi thành Đánh dấu hoàn thành tất cả các mục ĐANG HIỂN THỊ
function toggleSelectAll() {
    let visibleTasks = hideCompleted ? tasks.filter(t => !t.completed) : tasks;
    const allCompleted = visibleTasks.every(t => t.completed);
    visibleTasks.forEach(t => t.completed = !allCompleted);
    saveAndRender();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveAndRender();
}

function clearCompleted() {
    const toDeleteCount = tasks.filter(t => t.completed).length;
    if(toDeleteCount === 0) return alert("Chưa có nhiệm vụ nào được đánh dấu!");

    if(confirm(`Bạn có chắc chắn muốn chuyển ${toDeleteCount} quest đã tick vào thùng rác?`)) {
        const toDelete = tasks.filter(t => t.completed);
        trash = trash.concat(toDelete);
        tasks = tasks.filter(t => !t.completed);
        saveAndRender();
    }
}

// Thay đổi View Mode theo 3 chu kì (1, 2, 3)
function toggleViewMode() {
    viewMode = viewMode === 3 ? 1 : viewMode + 1;

    const btn = document.getElementById('btnViewMode');
    if(btn) {
        btn.innerHTML = `🔲 ${viewMode} Cột`;
    }

    saveAndRender();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const currentText = task.dich_nghia;
    const newText = prompt("Sửa bản dịch:", currentText);

    if (newText !== null && newText.trim() !== "" && newText.trim() !== currentText) {
        if (!task.history) task.history = [];
        task.history.push(currentText);
        if (task.history.length > 2) task.history.shift();

        task.redoHistory = [];
        task.dich_nghia = newText.trim();
        saveAndRender();
    }
}

function undoEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (task && task.history && task.history.length > 0) {
        if (!task.redoHistory) task.redoHistory = [];
        task.redoHistory.push(task.dich_nghia);
        const previousText = task.history.pop();
        task.dich_nghia = previousText;
        saveAndRender();
    }
}

function redoEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (task && task.redoHistory && task.redoHistory.length > 0) {
        if (!task.history) task.history = [];
        task.history.push(task.dich_nghia);
        const nextText = task.redoHistory.pop();
        task.dich_nghia = nextText;
        saveAndRender();
    }
}

function moveToTrash(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        trash.push(tasks[index]);
        tasks.splice(index, 1);
        saveAndRender();
    }
}

function toggleTrash() {
    const modal = document.getElementById('trashModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

window.onclick = function(event) {
    const modal = document.getElementById('trashModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

let draggedItemId = null;

function dragStart(e, id) {
    draggedItemId = id;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function drop(e, targetId) {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) return;

    const fromTask = tasks.find(t => t.id === draggedItemId);
    const toTask = tasks.find(t => t.id === targetId);

    if (fromTask && toTask) {
        // Đặt item được kéo lên ngay trước item đích bằng cách thao tác trên thuộc tính order
        fromTask.order = toTask.order - 0.5;

        // Cập nhật lại mảng và chuẩn hóa số nguyên cho order
        tasks.sort((a, b) => a.order - b.order);
        tasks.forEach((t, i) => t.order = i);

        saveAndRender();
    }
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItemId = null;
}

function saveAndRender(highlightIds = []) {
    localStorage.setItem('delta_quests', JSON.stringify(tasks));
    localStorage.setItem('delta_quests_trash', JSON.stringify(trash));
    renderTasks(highlightIds);
    renderTrash();
}

function renderTrash() {
    const listDiv = document.getElementById('trashList');
    const countSpan = document.getElementById('trashCount');
    listDiv.innerHTML = '';
    countSpan.innerText = trash.length;

    trash.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = `task-item`;
        div.style.opacity = '0.7';

        div.innerHTML = `
            <div class="task-content">
                <p class="task-title" style="color: #888;">${task.dich_nghia}</p>
                <p class="task-original">${task.id_goc}</p>
            </div>
            <div class="task-right action-group">
                <button class="restore-btn" onclick="restoreTask(${index})">♻️ Khôi phục</button>
                <button class="delete-btn" onclick="deletePermanent(${index})">❌ Xóa hẳn</button>
            </div>
        `;
        listDiv.prepend(div);
    });
}

function restoreTask(index) {
    tasks.push(trash[index]);
    trash.splice(index, 1);
    saveAndRender();
}

function deletePermanent(index) {
    trash.splice(index, 1);
    saveAndRender();
}

function emptyTrash() {
    if(confirm("Bạn có chắc chắn muốn xóa vĩnh viễn toàn bộ thùng rác?")) {
        trash = [];
        saveAndRender();
    }
}

function toggleMiniMode() {
    document.body.classList.toggle('mini-mode');
}

function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function exportData() {
    const data = { tasks, trash };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delta_quests_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.tasks) {
                data.tasks.forEach((t, i) => {
                    if (!t.id) t.id = 't_' + Date.now() + Math.random().toString(36).substr(2, 9);
                    if (t.order === undefined) t.order = i;
                });
                tasks = data.tasks;
            }
            if (data.trash) trash = data.trash;
            saveAndRender();
            alert('Nhập dữ liệu thành công!');
        } catch (error) {
            alert('File không hợp lệ hoặc bị lỗi!');
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}