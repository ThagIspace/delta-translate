// Dữ liệu Súng mẫu
const defaultGunCodes = [
    { id: 'g1', name: 'AK47 Đục Tường (Mặc định)', code: 'AK47-12345-ABCDE' },
    { id: 'g2', name: 'M416 Ít Giật (Mặc định)', code: 'M416-99999-XYZ12' }
];

let gunCodes = JSON.parse(localStorage.getItem('delta_gun_codes')) || defaultGunCodes;
let gunTrash = JSON.parse(localStorage.getItem('delta_gun_codes_trash')) || []; // Dữ liệu Thùng rác súng
let editingGunId = null; // Biến lưu ID súng đang được sửa

function renderGunCodes() {
    const list = document.getElementById('gunCodeList');

    // Cập nhật số lượng thùng rác
    const trashCountEl = document.getElementById('gunTrashCount');
    if (trashCountEl) trashCountEl.innerText = gunTrash.length;

    list.innerHTML = '';
    gunCodes.forEach(gun => {
        const gunId = htmlArgument(gun.id);
        const div = document.createElement('div');
        div.className = 'bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-yellow-500 shadow-sm transition-all';

        // KIỂM TRA: Nếu súng này đang ở trạng thái Edit
        if (editingGunId === gun.id) {
            div.innerHTML = `
                <div class="flex-1 w-full flex flex-col gap-2">
                    <input type="text" id="editGunName_${escapeHtml(gun.id)}" value="${escapeHtml(gun.name)}" placeholder="Tên súng..." class="w-full p-2 rounded bg-gray-900 border border-blue-500 text-white focus:outline-none">
                    <input type="text" id="editGunCode_${escapeHtml(gun.id)}" value="${escapeHtml(gun.code)}" placeholder="Code súng..." class="w-full p-2 rounded bg-gray-900 border border-blue-500 text-green-400 font-mono focus:outline-none">
                </div>
                <div class="flex gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                    <button class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="saveEditGunCode(${gunId})">💾 Lưu</button>
                    <button class="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="cancelEditGunCode()">❌ Hủy</button>
                </div>
            `;
        }
        // TRẠNG THÁI BÌNH THƯỜNG
        else {
            div.innerHTML = `
                <div class="flex-1 w-full min-w-0">
                    <div class="text-lg font-bold text-white mb-1 truncate">${escapeHtml(gun.name)}</div>
                    <div class="font-mono bg-gray-900 text-green-400 px-3 py-1 rounded select-all break-all inline-block border border-gray-700 max-w-full">${escapeHtml(gun.code)}</div>
                </div>
                <div class="flex gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    <button class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="copyGunCode(${htmlArgument(gun.code)})">📋 Copy</button>
                    <button class="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="startEditGunCode(${gunId})">✏️ Sửa</button>
                    <button class="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="deleteGunCode(${gunId})">🗑️ Xóa</button>
                </div>
            `;
        }
        list.appendChild(div);
    });
}

function addGunCode() {
    const nameInput = document.getElementById('gunNameInput');
    const codeInput = document.getElementById('gunCodeInput');

    const code = codeInput.value.trim();
    let name = nameInput.value.trim();

    if (!code) {
        alert("Vui lòng dán code súng vào ô!");
        codeInput.focus();
        return;
    }
    if (!name) name = "Súng ẩn danh #" + Math.floor(1000 + Math.random() * 9000);

    gunCodes.unshift({ id: 'g_' + Date.now(), name: name, code: code });
    saveGunCodes();

    nameInput.value = '';
    codeInput.value = '';
}

/* ================= LORIC SỬA TRỰC TIẾP (INLINE) ================= */
function startEditGunCode(id) {
    editingGunId = id;
    renderGunCodes();
}

function cancelEditGunCode() {
    editingGunId = null;
    renderGunCodes();
}

function saveEditGunCode(id) {
    const gun = gunCodes.find(g => g.id === id);
    if (!gun) return;

    const newName = document.getElementById(`editGunName_${id}`).value.trim();
    const newCode = document.getElementById(`editGunCode_${id}`).value.trim();

    if (!newCode) {
        alert("Code súng không được để trống!");
        return;
    }

    gun.name = newName || "Súng ẩn danh #" + Math.floor(1000 + Math.random() * 9000);
    gun.code = newCode;
    editingGunId = null; // Tắt chế độ sửa
    saveGunCodes();
}

/* ================= LORIC THÙNG RÁC ================= */
function deleteGunCode(id) {
    if(confirm("Chuyển code súng này vào thùng rác?")) {
        const idx = gunCodes.findIndex(g => g.id === id);
        if (idx !== -1) {
            gunTrash.push(gunCodes[idx]); // Đẩy vào thùng rác
            gunCodes.splice(idx, 1);      // Xóa khỏi list chính
            saveGunCodes();
        }
    }
}

function toggleGunTrash() {
    const modal = document.getElementById('gunTrashModal');
    modal.classList.toggle('hidden');
    renderGunTrash();
}

function renderGunTrash() {
    const list = document.getElementById('gunTrashList');
    document.getElementById('gunTrashCount').innerText = gunTrash.length;
    list.innerHTML = '';

    gunTrash.forEach((gun, index) => {
        const div = document.createElement('div');
        div.className = 'bg-gray-700 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 opacity-80';
        div.innerHTML = `
            <div class="flex-1 min-w-0 mr-4">
                <p class="text-gray-300 font-bold truncate">${escapeHtml(gun.name)}</p>
                <p class="text-xs text-gray-500 font-mono truncate">${escapeHtml(gun.code)}</p>
            </div>
            <div class="flex gap-2 shrink-0 w-full sm:w-auto">
                <button class="text-green-400 border border-green-400 px-3 py-1.5 rounded text-sm hover:bg-green-400 hover:text-white font-bold flex-1 sm:flex-none" onclick="restoreGunCode(${index})">♻️ Khôi phục</button>
                <button class="text-red-500 border border-red-500 px-3 py-1.5 rounded text-sm hover:bg-red-500 hover:text-white flex-1 sm:flex-none" onclick="deletePermanentGunCode(${index})">❌</button>
            </div>
        `;
        list.prepend(div);
    });
}

function restoreGunCode(index) {
    gunCodes.unshift(gunTrash[index]);
    gunTrash.splice(index, 1);
    saveGunCodes();
    renderGunTrash();
}

function deletePermanentGunCode(index) {
    gunTrash.splice(index, 1);
    saveGunCodes();
    renderGunTrash();
}

function emptyGunTrash() {
    if(confirm("Xóa vĩnh viễn toàn bộ code súng trong thùng rác?")) {
        gunTrash = [];
        saveGunCodes();
        renderGunTrash();
    }
}

async function copyGunCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        const alertMsg = document.createElement('div');
        alertMsg.innerText = "Đã Copy!";
        alertMsg.className = "fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg font-bold z-50";
        document.body.appendChild(alertMsg);
        setTimeout(() => alertMsg.remove(), 2000);
    } catch {
        alert('Không thể copy code súng. Vui lòng cho phép trình duyệt sao chép hoặc copy thủ công.');
    }
}

function saveGunCodes() {
    localStorage.setItem('delta_gun_codes', JSON.stringify(gunCodes));
    localStorage.setItem('delta_gun_codes_trash', JSON.stringify(gunTrash)); // Lưu thêm thùng rác
    renderGunCodes();
}

renderGunCodes();
