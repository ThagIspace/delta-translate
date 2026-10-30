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
let editingGunId = null;
let selectedGunId = null;

function getVisibleGunCodes() {
    const query = document.getElementById('gunSearch').value;
    return gunCodes.filter(gun => matchesSearch(query, gun.name, gun.code, gun.note));
}

function isGunOrderLocked() {
    return editingGunId !== null || document.getElementById('gunSearch').value.trim() !== '';
}

function selectGunCode(id) {
    if (editingGunId !== null || !gunCodes.some(gun => gun.id === id)) return;
    selectedGunId = id;
    document.getElementById('gunWorkspace').classList.add('show-detail');
    renderGunCodes();
    document.getElementById('gunDetailHeading').focus();
}

function closeGunDetail() {
    if (editingGunId !== null) return;
    document.getElementById('gunWorkspace').classList.remove('show-detail');
    document.getElementById('gunSearch').focus();
}

function renderGunCodes() {
    const list = document.getElementById('gunCodeList');
    const scrollTop = list.scrollTop;
    const visible = getVisibleGunCodes();
    const ordinals = new Map(gunCodes.map((gun, index) => [gun, index + 1]));
    // Giữ bản nháp trong khung chi tiết khi một thao tác ở thùng rác cập nhật danh sách.
    if (editingGunId !== null && !gunCodes.some(gun => gun.id === editingGunId)) editingGunId = null;
    if (editingGunId === null && !visible.some(gun => gun.id === selectedGunId)) {
        selectedGunId = visible.length ? visible[0].id : null;
    }
    document.getElementById('gunTrashCount').textContent = gunTrash.length;
    document.getElementById('restoreDefaultGunCodesButton').disabled = editingGunId !== null;
    document.getElementById('addGunCodeButton').disabled = editingGunId !== null;
    document.getElementById('gunSearch').disabled = editingGunId !== null;
    document.getElementById('gunCount').textContent = `Đang hiển thị: ${visible.length} / ${gunCodes.length} code súng`;
    list.replaceChildren();
    function appendRow(gun) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gun-row' + (gun.id === selectedGunId ? ' selected' : '');
        button.disabled = editingGunId !== null;
        button.setAttribute('aria-pressed', String(gun.id === selectedGunId));
        button.title = gun.note ? `${gun.name} — ${gun.note}` : gun.name;
        button.onclick = () => selectGunCode(gun.id);
        button.innerHTML = `<span class="gun-ordinal">#${ordinals.get(gun)}</span>
            <span class="gun-row-body"><span class="gun-row-name">${escapeHtml(gun.name)}</span>
            ${gun.note ? `<span class="gun-row-note">${escapeHtml(gun.note)}</span>` : ''}</span>
            ${gun.isPinned ? '<span aria-label="Đã ghim">★</span>' : ''}`;
        list.appendChild(button);
    }
    function appendHeading(text) {
        const heading = document.createElement('h3');
        heading.className = 'gun-list-heading';
        heading.textContent = text;
        list.appendChild(heading);
    }
    const pinned = visible.filter(gun => gun.isPinned);
    if (pinned.length) {
        appendHeading('★ Đã ghim · Lối tắt');
        pinned.forEach(gun => appendRow(gun));
    }
    if (visible.length) {
        appendHeading('Tất cả · Theo thứ tự đã lưu');
        visible.forEach(gun => appendRow(gun));
    } else {
        list.textContent = gunCodes.length ? 'Không tìm thấy code súng phù hợp.' : 'Chưa có code súng. Thêm code ở phía trên.';
    }
    list.scrollTop = scrollTop;
    if (editingGunId === null) renderGunDetail();
}

function renderGunDetail() {
    const detail = document.getElementById('gunDetail');
    const gun = gunCodes.find(gun => gun.id === selectedGunId);
    const back = '<button class="tool-btn gun-back" onclick="closeGunDetail()">← Danh sách</button>';
    if (!gun) {
        detail.innerHTML = back + '<p class="text-gray-200">Chọn một code súng trong danh sách để xem chi tiết.</p>';
        return;
    }
    const id = htmlArgument(gun.id);
    const ordinal = gunCodes.indexOf(gun) + 1;
    const locked = isGunOrderLocked();
    detail.innerHTML = `${back}
        <p class="text-gray-200 text-sm mb-2">Vị trí #${ordinal} / ${gunCodes.length}</p>
        <h3 id="gunDetailHeading" tabindex="-1" class="text-xl font-bold break-words mb-4">${escapeHtml(gun.name)}</h3>
        <div class="gun-full-code">${escapeHtml(gun.code)}</div>
        ${gun.note ? `<p class="text-yellow-300 whitespace-pre-wrap break-words mt-3">${escapeHtml(gun.note)}</p>` : ''}
        <p class="text-sm text-gray-200 mt-3">Ghi chú không được copy cùng mã.</p>
        <div class="gun-actions">
            <button class="primary-btn" onclick="copyGunCode(${htmlArgument(gun.code)})">📋 Copy mã</button>
            <button class="tool-btn" onclick="toggleGunPin(${id})" aria-pressed="${Boolean(gun.isPinned)}">${gun.isPinned ? '★ Bỏ ghim' : '☆ Ghim'}</button>
            <button class="tool-btn" onclick="startEditGunCode(${id})">✏️ Sửa</button>
            <button class="tool-btn text-red-300" onclick="deleteGunCode(${id})">🗑️ Xóa</button>
        </div>
        <div class="gun-order">
            <h4 class="font-bold mb-2">Đổi vị trí</h4>
            <p class="text-sm text-gray-200 mb-3">${locked ? 'Xóa nội dung tìm kiếm để đổi vị trí trong toàn bộ danh sách.' : 'Chuyển thẳng đến số thứ tự bạn muốn. Thứ tự tự lưu; ghim chỉ tạo lối tắt.'}</p>
            <div class="gun-actions">
                <button class="tool-btn" ${locked || ordinal === 1 ? 'disabled' : ''} onclick="moveGunTo(${id}, 1)">Lên đầu</button>
                <button class="tool-btn" ${locked || ordinal === 1 ? 'disabled' : ''} onclick="moveGunTo(${id}, ${ordinal - 1})" aria-label="Chuyển lên một vị trí">↑</button>
                <button class="tool-btn" ${locked || ordinal === gunCodes.length ? 'disabled' : ''} onclick="moveGunTo(${id}, ${ordinal + 1})" aria-label="Chuyển xuống một vị trí">↓</button>
                <button class="tool-btn" ${locked || gunCodes.length < 2 ? 'disabled' : ''} onclick="promptGunPosition(${id})">Chuyển đến…</button>
                <button class="tool-btn" ${locked || ordinal === gunCodes.length ? 'disabled' : ''} onclick="moveGunTo(${id}, ${gunCodes.length})">Xuống cuối</button>
            </div>
        </div>`;
}

function toggleGunPin(id) {
    if (editingGunId !== null) return;
    const gun = gunCodes.find(gun => gun.id === id);
    if (!gun) return;
    gun.isPinned = !gun.isPinned;
    saveGunCodes();
}

function moveGunTo(id, position) {
    if (isGunOrderLocked() || !Number.isSafeInteger(position) || position < 1 || position > gunCodes.length) return;
    const from = gunCodes.findIndex(gun => gun.id === id);
    if (from < 0 || from === position - 1) return;
    const [gun] = gunCodes.splice(from, 1);
    gunCodes.splice(position - 1, 0, gun);
    saveGunCodes();
}

async function promptGunPosition(id) {
    if (isGunOrderLocked()) return;
    const gun = gunCodes.find(gun => gun.id === id);
    if (!gun) return;
    const value = await appDialogs.prompt({
        title: 'Chuyển đến vị trí', message: gun.name,
        inputLabel: `Số thứ tự từ 1 đến ${gunCodes.length}`,
        value: String(gunCodes.indexOf(gun) + 1), required: true, confirmText: 'Chuyển'
    });
    if (value === null || isGunOrderLocked()) return;
    const position = Number(value.trim());
    if (!/^\d+$/.test(value.trim()) || !Number.isSafeInteger(position) || position < 1 || position > gunCodes.length) {
        await appDialogs.alert({ title: 'Vị trí không hợp lệ', message: `Nhập số nguyên từ 1 đến ${gunCodes.length}.` });
        return;
    }
    moveGunTo(id, position);
}

async function restoreDefaultGunCodes() {
    if (editingGunId !== null) return;
    const existingCodes = new Set(gunCodes.map(gun => gun.code));
    const missing = defaultGunCodes.filter(gun => !existingCodes.has(gun.code));
    if (!missing.length) return appDialogs.alert({ title: 'Đã đủ mã mặc định', message: `Cả ${defaultGunCodes.length} mã mặc định đều đang có trong danh sách. Không có mã nào cần khôi phục.` });
    const usedIds = new Set(gunCodes.map(gun => gun.id));
    function newId() {
        let id;
        do { id = 'g_' + Date.now() + Math.random().toString(36).slice(2, 11); } while (usedIds.has(id));
        return id;
    }
    let restored = 0;
    let recreated = 0;
    for (const original of missing) {
        const trashIndex = gunTrash.findIndex(gun => gun.code === original.code);
        let gun;
        if (trashIndex !== -1) {
            [gun] = gunTrash.splice(trashIndex, 1);
            // Giữ tên/ghi chú đã sửa. Chỉ đổi id khi đụng một bản ghi đang có.
            if (usedIds.has(gun.id)) gun = { ...gun, id: newId() };
            restored++;
        } else {
            gun = { ...original, id: newId() };
            recreated++;
        }
        usedIds.add(gun.id);
        gunCodes.push(gun);
    }
    saveGunCodes();
    renderGunTrash();
    await appDialogs.alert({
        title: 'Đã khôi phục mã mặc định',
        message: `Đã lấy lại ${restored} mã từ Thùng rác và thêm lại ${recreated} mã từ bản gốc.`,
        detail: 'Các mã khôi phục nằm ở cuối danh sách; mã đang có và thứ tự cũ được giữ nguyên. Xóa ô tìm kiếm nếu chưa thấy.'
    });
}

async function addGunCode() {
    if (editingGunId !== null) return;
    const nameInput = document.getElementById('gunNameInput');
    const codeInput = document.getElementById('gunCodeInput');

    const code = codeInput.value.trim();
    let name = nameInput.value.trim();

    if (!code) {
        await appDialogs.alert('Vui lòng dán code súng vào ô!');
        codeInput.focus();
        return;
    }
    if (!name) name = "Súng ẩn danh #" + Math.floor(1000 + Math.random() * 9000);

    const id = 'g_' + Date.now() + Math.random().toString(36).slice(2, 11);
    gunCodes.unshift({ id, name, code });
    selectedGunId = id;
    document.getElementById('gunSearch').value = '';
    document.getElementById('gunWorkspace').classList.add('show-detail');
    saveGunCodes();

    nameInput.value = '';
    codeInput.value = '';
}

function startEditGunCode(id) {
    if (editingGunId !== null) return;
    const gun = gunCodes.find(gun => gun.id === id);
    if (!gun) return;
    selectedGunId = id;
    editingGunId = id;
    renderGunCodes();
    document.getElementById('gunDetail').innerHTML = `
        <h3 class="text-xl font-bold mb-4">Sửa code súng</h3>
        <div class="gun-edit-fields">
            <label>Tên súng<input id="editGunName_${escapeHtml(id)}" class="settings-input" value="${escapeHtml(gun.name)}"></label>
            <label>Mã súng<input id="editGunCode_${escapeHtml(id)}" class="settings-input" value="${escapeHtml(gun.code)}"></label>
            <label>Ghi chú (không copy cùng mã)<input id="editGunNote_${escapeHtml(id)}" class="settings-input" value="${escapeHtml(gun.note)}"></label>
        </div>
        <div class="gun-actions">
            <button class="primary-btn" onclick="saveEditGunCode(${htmlArgument(id)})">💾 Lưu</button>
            <button class="tool-btn" onclick="cancelEditGunCode()">Hủy</button>
        </div>`;
    document.getElementById(`editGunName_${id}`).focus();
}

function cancelEditGunCode() {
    editingGunId = null;
    renderGunCodes();
}

async function saveEditGunCode(id) {
    const gun = gunCodes.find(g => g.id === id);
    if (!gun) return;

    const newName = document.getElementById(`editGunName_${id}`).value.trim();
    const newCode = document.getElementById(`editGunCode_${id}`).value.trim();
    const newNote = document.getElementById(`editGunNote_${id}`).value.trim();

    if (!newCode) {
        await appDialogs.alert('Code súng không được để trống!');
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
async function deleteGunCode(id) {
    if (editingGunId !== null) return;
    const gun = gunCodes.find(item => item.id === id);
    if (!gun) return;
    if (await appDialogs.confirm({
        title: 'Chuyển code súng vào thùng rác?',
        message: gun.name,
        detail: `${gun.code}\nBạn có thể khôi phục từ Thùng rác.`,
        confirmText: 'Chuyển vào thùng rác'
    })) {
        const idx = gunCodes.findIndex(g => g.id === id);
        if (idx !== -1 && editingGunId === null) {
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
                <p class="text-xs text-gray-200 font-mono truncate">${escapeHtml(gun.code)}</p>
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

async function emptyGunTrash() {
    const selected = new Set(gunTrash);
    if (await appDialogs.confirm({
        title: 'Xóa vĩnh viễn code súng?',
        message: `Xóa vĩnh viễn ${selected.size} code súng đang có trong thùng rác?`,
        detail: 'Mã tự thêm chỉ có thể lấy lại từ backup đã xuất trước đó.',
        confirmText: 'Xóa vĩnh viễn', danger: true
    })) {
        gunTrash = gunTrash.filter(gun => !selected.has(gun));
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
        await appDialogs.alert({ title: 'Không thể copy', message: 'Trình duyệt không cho sao chép code súng. Bạn có thể chọn mã và copy thủ công.' });
    }
}

function saveGunCodes() {
    localStorage.setItem('delta_gun_codes', JSON.stringify(gunCodes));
    localStorage.setItem('delta_gun_codes_trash', JSON.stringify(gunTrash)); // Lưu thêm thùng rác
    renderGunCodes();
}

renderGunCodes();
