const HARDCODED_API_KEY = "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=";

let tasks = JSON.parse(localStorage.getItem('delta_quests')) || [];
let trash = JSON.parse(localStorage.getItem('delta_quests_trash')) || [];
let savedApiKey = localStorage.getItem('gemini_api_key') || "";

let currentPage = 1;
const ITEMS_PER_PAGE = 5;
let isGridView = false;

if (savedApiKey) {
    document.getElementById('apiKey').value = savedApiKey;
}

renderTasks();
renderTrash();

function saveApiKey() {
    const key = document.getElementById('apiKey').value;
    localStorage.setItem('gemini_api_key', key);
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

    // Cập nhật prompt: Yêu cầu trả về mảng rỗng [] nếu không tìm thấy quest
    const promptText = `Trích xuất nhiệm vụ game Delta Force. Tìm 'Mục tiêu hành động cụ thể'. Bỏ qua cốt truyện. Trả về MỘT mảng JSON: [{"id_goc": "Chữ Trung", "dich_nghia": "Dịch Việt"}]. NẾU ảnh không chứa nhiệm vụ game hoặc không liên quan, hãy trả về mảng rỗng: []`;

    const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash'];

    let success = false;

    for (let i = 0; i < MODELS.length; i++) {
        const currentModel = MODELS[i];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKeys[0]}`; // Dùng key đầu tiên hoặc có thể lặp key tùy logic của bạn

        try {
            console.log(`Đang thử model: ${currentModel}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: promptText },
                            { inline_data: { mime_type: mimeType, data: base64Data } }
                        ]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                console.warn(`Model ${currentModel} lỗi:`, data.error.message);
                if (i === MODELS.length - 1) {
                    alert("Tất cả model đều lỗi hoặc quá tải!\nChi tiết: " + data.error.message);
                }
                continue;
            }

            let resultText = data.candidates[0].content.parts[0].text;
            const jsonMatch = resultText.match(/\[[\s\S]*\]/);

            if (jsonMatch) {
                const newQuests = JSON.parse(jsonMatch[0]);

                // Xử lý khi AI trả về mảng rỗng
                if (newQuests.length === 0) {
                    alert("Không tìm thấy nhiệm vụ nào! Có vẻ bạn dán nhầm ảnh.");
                } else {
                    mergeQuests(newQuests);
                }

                success = true;
                break;
            } else {
                console.log("Dữ liệu gốc:", resultText);
                if (i === MODELS.length - 1) alert("AI không trả về JSON hợp lệ.");
            }
        } catch (error) {
            console.error(`Lỗi ở model ${currentModel}:`, error);
            if (i === MODELS.length - 1) alert("Lỗi xử lý! Xem Console (F12).");
        }
    }

    document.getElementById('loading').style.display = 'none';
}

function mergeQuests(newQuests) {
    let highlightIds = [];
    newQuests.forEach(newQ => {
        const existingTaskIndex = tasks.findIndex(t => t.id_goc === newQ.id_goc);
        if (existingTaskIndex !== -1) {
            tasks[existingTaskIndex].tien_do = newQ.tien_do;
            tasks[existingTaskIndex].completed = false; // Bỏ tick nếu up lại ảnh
            // KHÔNG đè dich_nghia để giữ nguyên text bạn đã sửa
            highlightIds.push(newQ.id_goc);
        } else {
            tasks.push({ ...newQ, completed: false });
            highlightIds.push(newQ.id_goc);
        }
    });
    saveAndRender(highlightIds);
}

function renderTasks(highlightIds = []) {
    const listDiv = document.getElementById('todoList');
    const countDiv = document.getElementById('taskCount');
    const completedCountSpan = document.getElementById('completedCount');

    listDiv.innerHTML = '';
    if (countDiv) countDiv.innerText = `Tổng số quest hiện có: ${tasks.length}`;

    let completedCount = tasks.filter(t => t.completed).length;
    if (completedCountSpan) completedCountSpan.innerText = completedCount;

    // Xử lý bật/tắt class giao diện 3 cột
    if (isGridView) {
        listDiv.classList.add('grid-view');
        document.body.classList.add('grid-layout');
    } else {
        listDiv.classList.remove('grid-view');
        document.body.classList.remove('grid-layout');
    }

    // Logic lấy dữ liệu theo chế độ
    let tasksToRender = [];
    let totalPages = 1;

    if (isGridView) {
        tasksToRender = tasks; // Hiện tất cả không phân trang
    } else {
        totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        tasksToRender = tasks.slice(startIdx, endIdx);
    }

    tasksToRender.forEach((task, localIndex) => {
        const absoluteIndex = isGridView ? localIndex : ((currentPage - 1) * ITEMS_PER_PAGE) + localIndex;

        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;

        if (highlightIds.includes(task.id_goc)) div.classList.add('highlight');

        // Chỉ cho phép drag thả khi ở dạng danh sách
        if (!isGridView) {
            div.setAttribute('draggable', 'true');
            div.ondragstart = (e) => dragStart(e, absoluteIndex);
            div.ondragover = (e) => dragOver(e);
            div.ondrop = (e) => drop(e, absoluteIndex);
            div.ondragend = (e) => dragEnd(e);
        }

        const hasHistory = task.history && task.history.length > 0;
        const hasRedo = task.redoHistory && task.redoHistory.length > 0;

        div.innerHTML = `
            ${!isGridView ? `<div class="drag-handle" title="Kéo để di chuyển">↕️</div>` : ''}
            <div class="seq-number">#${absoluteIndex + 1}</div>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${absoluteIndex})">
            <div class="task-content">
                <p class="task-title">${task.dich_nghia}</p>
                <p class="task-original">${task.id_goc}</p>
            </div>
            <div class="task-right action-group">
                ${(hasHistory || hasRedo) ? `
                <div style="display: flex; gap: 5px;">
                    ${hasHistory ? `<button class="undo-btn" onclick="undoEdit(${absoluteIndex})" title="Lùi lại">↩️</button>` : ''}
                    ${hasRedo ? `<button class="redo-btn" onclick="redoEdit(${absoluteIndex})" title="Tiến tới">↪️</button>` : ''}
                </div>
                ` : ''}
                <button class="edit-btn" onclick="editTask(${absoluteIndex})">✏️ Sửa</button>
                <button class="delete-btn" onclick="moveToTrash(${absoluteIndex})">🗑️ Xóa</button>
            </div>
        `;
        listDiv.appendChild(div);
    });

    if (!isGridView) {
        renderPagination(totalPages);
    } else {
        const pageDiv = document.getElementById('pagination');
        if (pageDiv) pageDiv.innerHTML = ''; // Ẩn thanh trang khi ở chế độ 3 cột
    }

    // Scroll tới quest mới paste
    if (highlightIds.length > 0) {
        setTimeout(() => {
            if (!isGridView && currentPage !== 1) {
                currentPage = 1;
                saveAndRender(highlightIds);
            } else {
                const firstHighlight = document.querySelector('.highlight');
                if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
}

// 3 Hàm mới để hỗ trợ
function renderPagination(totalPages) {
    let pageDiv = document.getElementById('pagination');
    if (!pageDiv) {
        pageDiv = document.createElement('div');
        pageDiv.id = 'pagination';
        pageDiv.className = 'pagination';
        document.getElementById('todoList').after(pageDiv);
    }

    if (tasks.length <= ITEMS_PER_PAGE) {
        pageDiv.innerHTML = '';
        return;
    }

    pageDiv.innerHTML = `
        <button onclick="changePage(-1)" class="btn-secondary" ${currentPage === 1 ? 'disabled' : ''}>⬅️ Trước</button>
        <span>Trang ${currentPage} / ${totalPages}</span>
        <button onclick="changePage(1)" class="btn-secondary" ${currentPage === totalPages ? 'disabled' : ''}>Sau ➡️</button>
    `;
}

function changePage(step) {
    currentPage += step;
    saveAndRender();
}

function toggleViewMode() {
    isGridView = !isGridView;
    saveAndRender();
}

function editTask(index) {
    const currentText = tasks[index].dich_nghia;
    const newText = prompt("Sửa bản dịch:", currentText);

    if (newText !== null && newText.trim() !== "" && newText.trim() !== currentText) {
        if (!tasks[index].history) tasks[index].history = [];

        tasks[index].history.push(currentText);
        if (tasks[index].history.length > 2) tasks[index].history.shift();

        // Khi sửa mới thì xóa lịch sử redo
        tasks[index].redoHistory = [];

        tasks[index].dich_nghia = newText.trim();
        saveAndRender();
    }
}

function undoEdit(index) {
    if (tasks[index].history && tasks[index].history.length > 0) {
        if (!tasks[index].redoHistory) tasks[index].redoHistory = [];

        // Đưa text hiện tại vào Redo
        tasks[index].redoHistory.push(tasks[index].dich_nghia);

        // Lấy text cũ từ Undo ra dùng
        const previousText = tasks[index].history.pop();
        tasks[index].dich_nghia = previousText;

        saveAndRender();
    }
}

function redoEdit(index) {
    if (tasks[index].redoHistory && tasks[index].redoHistory.length > 0) {
        if (!tasks[index].history) tasks[index].history = [];

        // Đưa text hiện tại ngược lại vào Undo
        tasks[index].history.push(tasks[index].dich_nghia);

        // Lấy text từ Redo ra dùng
        const nextText = tasks[index].redoHistory.pop();
        tasks[index].dich_nghia = nextText;

        saveAndRender();
    }
}

function toggleTrash() {
    const modal = document.getElementById('trashModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

// Bấm ra ngoài modal để đóng
window.onclick = function(event) {
    const modal = document.getElementById('trashModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Các hàm xử lý sự kiện Drag & Drop
let draggedItemIndex = null;

function dragStart(e, index) {
    draggedItemIndex = index;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function dragOver(e) {
    e.preventDefault(); // Cho phép drop
    e.dataTransfer.dropEffect = 'move';
}

function drop(e, targetIndex) {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    // Cắt quest đang kéo và chèn vào vị trí mới
    const itemToMove = tasks.splice(draggedItemIndex, 1)[0];
    tasks.splice(targetIndex, 0, itemToMove);

    saveAndRender();
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItemIndex = null;
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

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function moveToTrash(index) {
    trash.push(tasks[index]);
    tasks.splice(index, 1);
    saveAndRender();
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

function clearCompleted() {
    const completedTasks = tasks.filter(task => task.completed);
    trash = trash.concat(completedTasks);
    tasks = tasks.filter(task => !task.completed);
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