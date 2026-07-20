// Khai báo chung dùng cho toàn dự án
const HARDCODED_API_KEY = "";
let savedApiKey = localStorage.getItem('gemini_api_key') || "";

// Tự động thu gọn nếu đã có API Key
if (savedApiKey) {
    document.getElementById('apiKey').value = savedApiKey;
    document.body.classList.add('mini-mode');
}

// Lưu API Key vào LocalStorage
function saveApiKey() {
    const key = document.getElementById('apiKey').value;
    localStorage.setItem('gemini_api_key', key);
    if(key.trim() !== '') document.body.classList.add('mini-mode');
}

// Hàm hỗ trợ chuyển Blob (ảnh copy) sang Base64
function blobToBase64(blob) {
    return new Promise(resolve => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(blob);
    });
}

// Hàm chuyển đổi các Tab trên thanh Menu
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-400', 'border-blue-500');
        btn.classList.add('text-gray-400', 'border-transparent');
    });
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.remove('text-gray-400', 'border-transparent');
    btnElement.classList.add('text-blue-400', 'border-blue-500');
}

// ==========================================
// THÊM MỚI: Lắng nghe sự kiện mất/có mạng
// ==========================================
window.addEventListener('offline', () => {
    alert("⚠️ Đã mất kết nối Internet! Tính năng AI sẽ không hoạt động.");
});
window.addEventListener('online', () => {
    console.log("Đã khôi phục kết nối mạng.");
});

// Xử lý sự kiện "Ctrl + V" dùng chung và tự động phân luồng
document.addEventListener('paste', async (e) => {
    // KHI BẤM PASTE, NẾU KHÔNG CÓ MẠNG THÌ DỪNG LUÔN
    if (!navigator.onLine) {
        alert("❌ Không có kết nối mạng! Vui lòng kiểm tra lại Internet trước khi dán ảnh.");
        return;
    }

    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf('image') === 0) {
            const blob = item.getAsFile();
            const base64Img = await blobToBase64(blob);
            let mimeType = base64Img.substring(base64Img.indexOf(":") + 1, base64Img.indexOf(";"));
            if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)) mimeType = 'image/jpeg';

            const isQuestTab = document.getElementById('tab-quests').classList.contains('active');
            const isItemTab = document.getElementById('tab-items').classList.contains('active');
            const base64Data = base64Img.split(',')[1]; // Tách bỏ phần header data:image/xxx;base64,

            if (isQuestTab) {
                if(typeof processQuestImage === 'function') processQuestImage(base64Data, mimeType);
            } else if (isItemTab) {
                if(typeof processItemImage === 'function') processItemImage(base64Data, mimeType);
            } else {
                alert("Vui lòng mở tab Dịch Nhiệm Vụ hoặc Từ Điển Item để dán ảnh.");
            }
        }
    }
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

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (confirm('⚠️ CẢNH BÁO: Ghi đè toàn bộ dữ liệu Quests & Súng hiện tại bằng file backup?')) {

                if (importedData.delta_quests) localStorage.setItem('delta_quests', JSON.stringify(importedData.delta_quests));
                if (importedData.delta_quests_trash) localStorage.setItem('delta_quests_trash', JSON.stringify(importedData.delta_quests_trash));
                if (importedData.delta_translation_cache) localStorage.setItem('delta_translation_cache', JSON.stringify(importedData.delta_translation_cache));
                if (importedData.delta_gun_codes) localStorage.setItem('delta_gun_codes', JSON.stringify(importedData.delta_gun_codes));

                // Bổ sung khôi phục rác súng
                if (importedData.delta_gun_codes_trash) {
                    localStorage.setItem('delta_gun_codes_trash', JSON.stringify(importedData.delta_gun_codes_trash));
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