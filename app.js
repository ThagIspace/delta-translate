const appDialogs = SiteDialog.create({ labels: {
    alertTitle: 'Thông báo', confirmTitle: 'Xác nhận', promptTitle: 'Nhập nội dung',
    ok: 'Đã hiểu', confirm: 'Xác nhận', cancel: 'Hủy', save: 'Lưu',
    inputLabel: 'Nội dung', requiredMessage: 'Vui lòng nhập nội dung.'
} });
let importingBackup = false;

// Cuộn trang chính; không tác động các khung cuộn riêng hoặc hộp thoại.
(() => {
    const button = document.getElementById('scrollToTop');
    const main = document.querySelector('main');
    const update = () => {
        button.hidden = Math.max(window.scrollY, main.scrollTop) < 300;
    };
    window.addEventListener('scroll', update, { passive: true });
    main.addEventListener('scroll', update, { passive: true });
    window.addEventListener('pageshow', update);
    button.addEventListener('click', () => {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
        window.scrollTo({ top: 0, behavior });
        main.scrollTo({ top: 0, behavior });
    });
    update();
})();

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
        btn.classList.add('text-gray-200', 'border-transparent');
        btn.removeAttribute('aria-current');
    });
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.remove('text-gray-200', 'border-transparent');
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
        && (value.note === undefined || typeof value.note === 'string')
        && (value.isPinned === undefined || typeof value.isPinned === 'boolean');
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
    if (importingBackup) return;
    const file = event.target.files[0];
    if (!file) return;
    importingBackup = true;

    const reader = new FileReader();
    reader.onload = async function(e) {
        let reloadRequested = false;
        try {
            const importedData = JSON.parse(e.target.result);
            // Kiểm tra tất cả phần dữ liệu trước khi bắt đầu ghi đè.
            const entries = validateBackupData(importedData);
            if (await appDialogs.confirm({
                title: 'Nhập dữ liệu từ backup?',
                message: 'Ghi đè dữ liệu nhiệm vụ và code súng có trong file backup?',
                detail: 'Các phần dữ liệu có trong file sẽ thay thế dữ liệu hiện tại. Hãy xuất backup trước nếu cần giữ bản cũ.',
                confirmText: 'Ghi đè dữ liệu', danger: true
            })) {
                // Hộp thoại mới không đóng băng JavaScript như confirm/alert native.
                // Không để kết quả AI trả muộn ghi đè backup trong lúc chờ thông báo.
                if (typeof cancelQuestTranslation === 'function') cancelQuestTranslation();
                if (typeof cancelFullTranslation === 'function') cancelFullTranslation();
                for (const [key, value] of entries) {
                    localStorage.setItem(key, JSON.stringify(value));
                }

                await appDialogs.alert({ title: 'Đã khôi phục dữ liệu', message: 'Dữ liệu đã được nhập. Trang sẽ tải lại sau khi bạn đóng thông báo.' });
                location.reload();
                reloadRequested = true;
            }
        } catch (error) {
            await appDialogs.alert({ title: 'Không nhập được backup', message: 'File backup không hợp lệ, sai định dạng hoặc trình duyệt không lưu được dữ liệu.' });
        } finally {
            if (!reloadRequested) importingBackup = false;
            event.target.value = '';
        }
    };
    const reportReadFailure = async () => {
        try { await appDialogs.alert({ title: 'Không đọc được backup', message: 'Hãy chọn lại file backup rồi thử lại.' }); }
        finally { importingBackup = false; event.target.value = ''; }
    };
    reader.onerror = reader.onabort = reportReadFailure;
    try { reader.readAsText(file); } catch { void reportReadFailure(); }
}
