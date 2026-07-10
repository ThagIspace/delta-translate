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

// Xử lý sự kiện "Ctrl + V" dùng chung và tự động phân luồng
document.addEventListener('paste', async (e) => {
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