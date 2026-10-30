// Danh sách mặc định do người dùng cung cấp. Ghi chú không nằm trong mã copy.
const defaultGunCodes = [
    { id: 'default_sg552', name: 'SG552突击步枪', code: 'SG552突击步枪-烽火地带-6HCQFHG0ABHCU4OACUUHS' },
    { id: 'default_smg45', name: 'SMG-45冲锋枪', code: 'SMG-45冲锋枪-烽火地带-6HD33I40ABHCU4OACUUHS' },
    { id: 'default_m870', name: 'M870霰弹枪', code: 'M870霰弹枪-烽火地带-6HD3BJC0ABHCU4OACUUHS' },
    { id: 'default_m14', name: 'M14射手步枪', code: 'M14射手步枪-烽火地带-6I0ELBO015HC761BV7JNH' },
    { id: 'default_m249', name: 'M249轻机枪', code: 'M249轻机枪-烽火地带-6HD4IB40ABHCU4OACUUHS' },
    { id: 'default_357', name: '.357左轮', code: '.357左轮-烽火地带-6HO203404BO3C3LIQOLK7' },
    { id: 'default_vector', name: 'Vector冲锋枪', code: 'Vector冲锋枪-烽火地带-6HNK42K007GGG98EOUC9L', note: 'CHỈ LÀM KHI CÀY MỐC LVL 33' },
    { id: 'default_m4a1', name: 'M4A1突击步枪', code: 'M4A1突击步枪-烽火地带-6LBBE5003OOS4TEFF043Q', note: 'CHỈ LÀM KHI CÀY MỐC LVL 40' }
];

let gunCodes = JSON.parse(localStorage.getItem('delta_gun_codes')) || defaultGunCodes.map(gun => ({ ...gun }));
let gunTrash = JSON.parse(localStorage.getItem('delta_gun_codes_trash')) || []; // Dữ liệu Thùng rác súng
let editingGunId = null; // Biến lưu ID súng đang được sửa

function getVisibleGunCodes() {
    const query = document.getElementById('gunSearch').value;
    return gunCodes.filter(gun => matchesSearch(query, gun.name, gun.code, gun.note));
}

function renderGunCodes() {
    const list = document.getElementById('gunCodeList');

    // Cập nhật số lượng thùng rác
    const trashCountEl = document.getElementById('gunTrashCount');
    if (trashCountEl) trashCountEl.innerText = gunTrash.length;

    list.innerHTML = '';
    const visibleGunCodes = getVisibleGunCodes();
    document.getElementById('addDefaultGunCodesButton').disabled = editingGunId !== null;
    document.getElementById('gunCount').textContent = `Đang hiển thị: ${visibleGunCodes.length} / ${gunCodes.length} code súng`;
    if (!visibleGunCodes.length) {
        list.textContent = gunCodes.length ? 'Không tìm thấy code súng phù hợp.' : 'Chưa có code súng. Thêm code ở phía trên.';
    }
    visibleGunCodes.forEach((gun, visibleIndex) => {
        const gunId = htmlArgument(gun.id);
        const ordinal = gunCodes.indexOf(gun) + 1;
        const disableUp = editingGunId !== null || visibleIndex === 0;
        const disableDown = editingGunId !== null || visibleIndex === visibleGunCodes.length - 1;
        const div = document.createElement('div');
        div.className = 'bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-yellow-500 shadow-sm transition-all';

        // KIỂM TRA: Nếu súng này đang ở trạng thái Edit
        if (editingGunId === gun.id) {
            div.innerHTML = `
                <div class="flex-1 w-full flex flex-col gap-2">
                    <span class="text-sm text-gray-400 font-bold">#${ordinal}</span>
                    <input type="text" id="editGunName_${escapeHtml(gun.id)}" value="${escapeHtml(gun.name)}" placeholder="Tên súng..." class="w-full p-2 rounded bg-gray-900 border border-blue-500 text-white focus:outline-none">
                    <input type="text" id="editGunCode_${escapeHtml(gun.id)}" value="${escapeHtml(gun.code)}" placeholder="Code súng..." class="w-full p-2 rounded bg-gray-900 border border-blue-500 text-green-400 font-mono focus:outline-none">
                    <input type="text" id="editGunNote_${escapeHtml(gun.id)}" value="${escapeHtml(gun.note)}" placeholder="Ghi chú (không nằm trong mã copy)..." aria-label="Ghi chú code súng" class="w-full p-2 rounded bg-gray-900 border border-gray-700 text-yellow-300 focus:outline-none">
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
                    <div class="text-lg font-bold text-white mb-1 break-words"><span class="text-gray-400 mr-2">#${ordinal}</span>${escapeHtml(gun.name)}</div>
                    <div class="font-mono bg-gray-900 text-green-400 px-3 py-1 rounded select-all break-all inline-block border border-gray-700 max-w-full">${escapeHtml(gun.code)}</div>
                    ${gun.note ? `<p class="text-yellow-300 text-sm mt-2 whitespace-pre-wrap break-words">${escapeHtml(gun.note)}</p>` : ''}
                </div>
                <div class="flex flex-wrap gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    <button class="tool-btn" ${disableUp ? 'disabled' : ''} onclick="moveGunCode(${gunId}, -1)" aria-label="Chuyển ${escapeHtml(gun.name)} lên" title="Chuyển lên trong kết quả đang hiện">↑</button>
                    <button class="tool-btn" ${disableDown ? 'disabled' : ''} onclick="moveGunCode(${gunId}, 1)" aria-label="Chuyển ${escapeHtml(gun.name)} xuống" title="Chuyển xuống trong kết quả đang hiện">↓</button>
                    <button class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="copyGunCode(${htmlArgument(gun.code)})">📋 Copy</button>
                    <button class="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="startEditGunCode(${gunId})">✏️ Sửa</button>
                    <button class="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded font-bold shadow flex-1 sm:flex-none" onclick="deleteGunCode(${gunId})">🗑️ Xóa</button>
                </div>
            `;
        }
        list.appendChild(div);
    });
}

function moveGunCode(id, direction) {
    if (editingGunId !== null || ![-1, 1].includes(direction)) return;
    const visible = getVisibleGunCodes();
    const index = visible.findIndex(gun => gun.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= visible.length) return;
    const from = gunCodes.indexOf(visible[index]);
    const to = gunCodes.indexOf(visible[next]);
    [gunCodes[from], gunCodes[to]] = [gunCodes[to], gunCodes[from]];
    saveGunCodes();
}

function addDefaultGunCodes() {
    if (editingGunId !== null) return;
    const existingCodes = new Set([...gunCodes, ...gunTrash].map(gun => gun.code));
    const missing = defaultGunCodes.filter(gun => !existingCodes.has(gun.code));
    if (!missing.length) return alert('Các mã mặc định đã có trong danh sách hoặc thùng rác.');
    gunCodes.push(...missing.map(gun => ({ ...gun, id: 'g_' + Date.now() + Math.random().toString(36).slice(2, 11) })));
    saveGunCodes();
    alert(`Đã bổ sung ${missing.length} mã mặc định ở cuối danh sách. Xóa ô tìm kiếm nếu chưa thấy.`);
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
    const newNote = document.getElementById(`editGunNote_${id}`).value.trim();

    if (!newCode) {
        alert("Code súng không được để trống!");
        return;
    }

    gun.name = newName || "Súng ẩn danh #" + Math.floor(1000 + Math.random() * 9000);
    gun.code = newCode;
    if (newNote) gun.note = newNote;
    else delete gun.note;
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
                ${gun.note ? `<p class="text-yellow-300 text-sm mt-1 whitespace-pre-wrap break-words">${escapeHtml(gun.note)}</p>` : ''}
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
