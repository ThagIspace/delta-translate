// Dữ liệu Item mẫu
const defaultItemDatabase = [
    {
        category: "💊 Y Tế",
        items: [
            { name: 'Hộp cứu thương y tế', weight: '2.5KG', rarity: 'purple', icon: '🚑', desc: 'Hồi phục lượng lớn máu và chữa gãy xương tức thì. Thiết yếu khi giao tranh mạnh.', source: 'Bệnh viện, Trạm xá' }
        ]
    },
    {
        category: "💻 Điện Tử",
        items: [
            { name: 'Card Đồ Họa (GPU)', weight: '1.43KG', rarity: 'red', icon: '🖥️', desc: 'Linh kiện có giá trị giao dịch cực cao trên chợ đen.', source: 'Phòng Máy Chủ' }
        ]
    }
];

let itemDatabase = JSON.parse(localStorage.getItem('delta_items')) || defaultItemDatabase;
let currentItemCategory = 0;

const rarityColors = {
    'white': 'border-t-gray-300',
    'green': 'border-t-green-500',
    'blue': 'border-t-blue-500',
    'purple': 'border-t-purple-500',
    'gold': 'border-t-yellow-400',
    'red': 'border-t-red-500'
};

// Gọi API Gemini trích xuất thông tin ảnh Item
async function processItemImage(base64Data, mimeType) {
    const apiKeyInput = document.getElementById('apiKey').value || HARDCODED_API_KEY; // Dùng chung apiKey từ Quest Tab
    if (!apiKeyInput) return alert("Vui lòng nhập API Key ở tab Dịch Nhiệm Vụ!");
    const apiKeys = apiKeyInput.split(',').map(k => k.trim()).filter(k => k);

    document.getElementById('itemLoading').classList.remove('hidden');

    const promptText = `Trích xuất thông tin các vật phẩm từ ảnh. Trả về MỘT mảng JSON với cấu trúc: [{"category": "Danh mục (VD: 💊 Y Tế, 💻 Điện Tử, 🧱 Vật Liệu, 💎 Sưu Tầm, 🔑 Thẻ Khóa...)", "name": "Tên vật phẩm", "weight": "Cân nặng (VD: 2.5KG)", "rarity": "Độ hiếm (chỉ chọn 1: white, green, blue, purple, gold, red)", "desc": "Mô tả dự đoán công dụng", "source": "Nguồn gốc rớt"}]. Trả về mảng rỗng [] nếu không thấy.`;
    const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash'];

    for (let i = 0; i < MODELS.length; i++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELS[i]}:generateContent?key=${apiKeys[0]}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }, { inlineData: { mimeType: mimeType, data: base64Data } }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });
            const data = await response.json();
            if (data.error) continue;

            const resultText = data.candidates[0].content.parts[0].text;
            const newItems = JSON.parse(resultText);
            if (newItems.length > 0) mergeNewItems(newItems);
            break;
        } catch (e) {
            if (i === MODELS.length - 1) alert("Lỗi xử lý quét Item!");
        }
    }
    document.getElementById('itemLoading').classList.add('hidden');
}

function mergeNewItems(newItems) {
    newItems.forEach(newItem => {
        let catIndex = itemDatabase.findIndex(c => c.category.includes(newItem.category.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()));

        if (catIndex === -1) {
            itemDatabase.push({ category: newItem.category, items: [] });
            catIndex = itemDatabase.length - 1;
        }

        if (!newItem.icon) {
            const catName = itemDatabase[catIndex].category;
            if (catName.includes('Y Tế')) newItem.icon = '💊';
            else if (catName.includes('Điện Tử')) newItem.icon = '💻';
            else if (catName.includes('Vật Liệu')) newItem.icon = '🧱';
            else if (catName.includes('Sưu Tầm')) newItem.icon = '💎';
            else newItem.icon = '📦';
        }

        const existingItemIndex = itemDatabase[catIndex].items.findIndex(i => i.name === newItem.name);
        if (existingItemIndex === -1) {
            itemDatabase[catIndex].items.push(newItem);
        } else {
            itemDatabase[catIndex].items[existingItemIndex] = newItem;
        }
    });

    saveItemDatabase();
    renderItemTabs();
    renderItemGrid();
    alert(`Đã thêm/cập nhật ${newItems.length} vật phẩm thành công!`);
}

function saveItemDatabase() {
    localStorage.setItem('delta_items', JSON.stringify(itemDatabase));
}

function renderItemTabs() {
    const container = document.getElementById('itemCategoryTabs');
    container.innerHTML = '';
    itemDatabase.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.innerText = cat.category;
        btn.className = `px-4 py-2 rounded font-bold transition ${index === currentItemCategory ? 'bg-blue-600 text-white shadow' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`;
        btn.onclick = () => {
            currentItemCategory = index;
            renderItemTabs();
            renderItemGrid();
            document.getElementById('itemDetailPanel').innerHTML = `<div class="text-center text-gray-500 mt-10">👈 Chọn một vật phẩm để xem chi tiết</div>`;
        };
        container.appendChild(btn);
    });
}

function renderItemGrid() {
    const grid = document.getElementById('itemGrid');
    grid.innerHTML = '';
    if(!itemDatabase[currentItemCategory]) return;

    itemDatabase[currentItemCategory].items.forEach(item => {
        const card = document.createElement('div');
        const borderColor = rarityColors[item.rarity] || 'border-t-gray-500';
        card.className = `bg-gray-800 border border-gray-700 border-t-4 ${borderColor} rounded p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 transition item-card shadow relative group`;
        card.innerHTML = `
            <button class="absolute top-1 right-1 text-gray-500 hover:text-red-500 hidden group-hover:block" onclick="deleteItem(event, '${item.name}')">❌</button>
            <div class="text-4xl mb-2">${item.icon}</div>
            <div class="text-sm font-bold text-gray-200 text-center w-full truncate">${item.name}</div>
            <div class="text-xs text-gray-500 mt-1 w-full text-right">${item.weight}</div>
        `;
        card.onclick = () => showItemDetail(item, card);
        grid.appendChild(card);
    });
}

function deleteItem(e, itemName) {
    e.stopPropagation();
    if(confirm(`Xóa vật phẩm "${itemName}" khỏi cơ sở dữ liệu?`)) {
        itemDatabase[currentItemCategory].items = itemDatabase[currentItemCategory].items.filter(i => i.name !== itemName);
        saveItemDatabase();
        renderItemGrid();
        document.getElementById('itemDetailPanel').innerHTML = `<div class="text-center text-gray-500 mt-10">👈 Chọn một vật phẩm để xem chi tiết</div>`;
    }
}

function showItemDetail(item, cardElement) {
    document.querySelectorAll('.item-card').forEach(c => c.classList.remove('ring-2', 'ring-white', 'bg-gray-700'));
    cardElement.classList.add('ring-2', 'ring-white', 'bg-gray-700');

    const panel = document.getElementById('itemDetailPanel');
    const borderColor = rarityColors[item.rarity] || 'border-t-gray-500';
    panel.innerHTML = `
        <div class="border-t-4 ${borderColor} pt-4 flex gap-4 items-center mb-6 pb-4 border-b border-gray-700">
            <div class="text-6xl">${item.icon}</div>
            <div>
                <h3 class="text-2xl font-bold text-white">${item.name}</h3>
                <p class="text-gray-400 text-sm mt-1">Trọng lượng: ${item.weight}</p>
            </div>
        </div>
        <div class="text-gray-300 leading-relaxed text-sm lg:text-base flex-1">${item.desc}</div>
        <div class="mt-6 pt-4 border-t border-dashed border-gray-600 text-sm">
            <span class="text-gray-500">Nguồn gốc rớt:</span><br>
            <span class="text-gray-300 font-semibold">${item.source}</span>
        </div>
    `;
}

renderItemTabs();
renderItemGrid();