// Dữ liệu Súng mẫu
const defaultGunCodes = [
    { id: 'g1', name: 'AK47 Đục Tường (Mặc định)', code: 'AK47-12345-ABCDE' },
    { id: 'g2', name: 'M416 Ít Giật (Mặc định)', code: 'M416-99999-XYZ12' }
];

let gunCodes = JSON.parse(localStorage.getItem('delta_gun_codes')) || defaultGunCodes;

function renderGunCodes() {
    const list = document.getElementById('gunCodeList');
    list.innerHTML = '';
    gunCodes.forEach(gun => {
        const div = document.createElement('div');
        div.className = 'bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-yellow-500 shadow-sm';
        div.innerHTML = `
            <div class="flex-1 w-full">
                <div class="text-lg font-bold text-white mb-1">${gun.name}</div>
                <div class="font-mono bg-gray-900 text-green-400 px-3 py-1 rounded select-all break-all inline-block border border-gray-700">${gun.code}</div>
            </div>
            <div class="flex gap-2 w-full sm:w-auto shrink-0">
                <button class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded font-bold shadow w-full sm:w-auto" onclick="copyGunCode('${gun.code}')">📋 Copy</button>
                <button class="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded font-bold shadow w-full sm:w-auto" onclick="editGunCode('${gun.id}')">✏️ Sửa</button>
                <button class="bg-red-600 hover:bg-red-500 px-3 py-2 rounded font-bold shadow w-full sm:w-auto" onclick="deleteGunCode('${gun.id}')">🗑️</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function addGunCode() {
    const name = prompt("Nhập Tên súng (VD: M416 Đục tường):");
    if (!name) return;
    const code = prompt("Dán Code súng vào đây:");
    if (!code) return;
    gunCodes.push({ id: 'g_' + Date.now(), name: name.trim(), code: code.trim() });
    saveGunCodes();
}

function editGunCode(id) {
    const gun = gunCodes.find(g => g.id === id);
    if (!gun) return;
    const newName = prompt("Sửa Tên súng:", gun.name);
    if (newName === null) return;
    const newCode = prompt("Sửa Code súng:", gun.code);
    if (newCode === null) return;
    gun.name = newName.trim() || gun.name;
    gun.code = newCode.trim() || gun.code;
    saveGunCodes();
}

function deleteGunCode(id) {
    if(confirm("Xóa code súng này?")) { gunCodes = gunCodes.filter(g => g.id !== id); saveGunCodes(); }
}

function copyGunCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        const alertMsg = document.createElement('div');
        alertMsg.innerText = "Đã Copy!";
        alertMsg.className = "fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg font-bold z-50";
        document.body.appendChild(alertMsg);
        setTimeout(() => alertMsg.remove(), 2000);
    });
}

function saveGunCodes() {
    localStorage.setItem('delta_gun_codes', JSON.stringify(gunCodes));
    renderGunCodes();
}

renderGunCodes();