// Dữ liệu chỉ được hiển thị như văn bản, kể cả khi chứa thẻ HTML hoặc dấu nháy.
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

// Mã hóa cả chuỗi JavaScript và thuộc tính HTML chứa chuỗi đó.
function htmlArgument(value) {
    return escapeHtml(JSON.stringify(value));
}

function matchesSearch(query, ...values) {
    const normalize = value => String(value ?? '').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
    const term = normalize(query).trim();
    return !term || values.some(value => normalize(value).includes(term));
}

// Hàm chuyển đổi các Tab trên thanh Menu
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-400', 'border-blue-500');
        btn.classList.add('text-gray-400', 'border-transparent');
        btn.removeAttribute('aria-current');
    });
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.remove('text-gray-400', 'border-transparent');
    btnElement.classList.add('text-blue-400', 'border-blue-500');
    btnElement.setAttribute('aria-current', 'page');
}

// Chụp tab đích trước khi đọc file để không chuyển ảnh sang tab vừa bấm sau đó.
document.addEventListener('paste', event => {
    const mode = document.getElementById('tab-quests').classList.contains('active') ? 'quest'
        : document.getElementById('tab-full').classList.contains('active') ? 'full' : null;
    if (!mode || document.querySelector('dialog[open]')) return;
    const item = Array.from(event.clipboardData?.items || []).find(item => item.type.startsWith('image/'));
    if (!item) return;
    event.preventDefault();
    const file = item.getAsFile();
    if (file) handleImageFile(file, mode);
});

// ==========================================
// TÍNH NĂNG EXPORT / IMPORT DATA (SAO LƯU)
// ==========================================

function exportData() {
    const backupData = {
        delta_quests: JSON.parse(localStorage.getItem('delta_quests') || "[]"),
        delta_quests_trash: JSON.parse(localStorage.getItem('delta_quests_trash') || "[]"),
        delta_translation_cache: JSON.parse(localStorage.getItem('delta_translation_cache') || "{}"),
        delta_gun_codes: JSON.parse(localStorage.getItem('delta_gun_codes') || "null"),
        delta_gun_codes_trash: JSON.parse(localStorage.getItem('delta_gun_codes_trash') || "[]") // Bổ sung rác súng
    };

    const dataString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `Delta_Backup_${today}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function validateBackupData(data) {
    const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    const isQuest = value => isObject(value)
        && typeof value.id_goc === 'string' && typeof value.dich_nghia === 'string'
        && (value.id === undefined || typeof value.id === 'string')
        && ['completed', 'isPinned'].every(key => value[key] === undefined || typeof value[key] === 'boolean')
        && (value.order === undefined || Number.isFinite(value.order))
        && (value.groupId === undefined || value.groupId === null || Number.isSafeInteger(value.groupId))
        && (value.groupColor === undefined || value.groupColor === null || typeof value.groupColor === 'string')
        && ['history', 'redoHistory'].every(key => value[key] === undefined
            || (Array.isArray(value[key]) && value[key].every(text => typeof text === 'string')));
    const isGun = value => isObject(value) && ['id', 'name', 'code'].every(key => typeof value[key] === 'string')
        && (value.note === undefined || typeof value.note === 'string');
    const validators = {
        delta_quests: value => Array.isArray(value) && value.every(isQuest),
        delta_quests_trash: value => Array.isArray(value) && value.every(isQuest),
        delta_translation_cache: value => isObject(value) && Object.values(value).every(text => typeof text === 'string'),
        delta_gun_codes: value => value === null || (Array.isArray(value) && value.every(isGun)),
        delta_gun_codes_trash: value => Array.isArray(value) && value.every(isGun)
    };
    if (!isObject(data)) throw new Error('Invalid backup');
    const entries = Object.keys(validators)
        .filter(key => Object.prototype.hasOwnProperty.call(data, key))
        .map(key => [key, data[key]]);
    if (!entries.length || entries.some(([key, value]) => !validators[key](value))) {
        throw new Error('Invalid backup');
    }
    return entries;
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            // Kiểm tra tất cả phần dữ liệu trước khi bắt đầu ghi đè.
            const entries = validateBackupData(importedData);
            if (confirm('⚠️ CẢNH BÁO: Ghi đè dữ liệu Quests & Súng có trong file backup?')) {
                for (const [key, value] of entries) {
                    localStorage.setItem(key, JSON.stringify(value));
                }

                alert('✅ Khôi phục dữ liệu thành công!');
                location.reload();
            }
        } catch (error) {
            alert('❌ File backup không hợp lệ hoặc bị lỗi định dạng!');
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}
