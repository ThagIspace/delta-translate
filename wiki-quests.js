// Bản xem thử: dịch/tóm tắt từ các trang nguồn tiếng Anh, không phải tên CN chính thức.
(() => {
    const quests = [
        {
            id: 'bridges', en: 'Bridges and Shanties', zh: '桥梁与棚屋', vi: 'Cầu và lán trại',
            type: 'Điều tra', previous: 'Base Firepower', next: 'A Small Breakthrough',
            objectives: [
                ['在零号大坝行动中，调查峡谷区域的管道。', 'Trong trận Zero Dam, điều tra đường ống ở khu vực khe núi.'],
                ['在零号大坝行动中，调查峡谷区域的小屋。', 'Điều tra căn lán ở khu vực khe núi trong trận Zero Dam.']
            ],
            rewards: '2.100 EXP · +1 uy tín Assault Battalion · 10.000 Tekniq Alloy · G18. Mở mua Bizon.',
            source: 'Bridges_and_Shanties'
        },
        {
            id: 'breakthrough', en: 'A Small Breakthrough', zh: '小小的突破', vi: 'Bước đột phá nhỏ',
            type: 'Chiến đấu', previous: 'Bridges and Shanties', next: 'Fair Trade / Handicrafts',
            objectives: [
                ['在零号大坝行动中，使用AKS-74突击步枪，在20米内击杀5名敌方士兵。', 'Trong trận Zero Dam, dùng AKS-74 hạ 5 lính địch ở khoảng cách trong 20 m.']
            ],
            rewards: '2.200 EXP · +1 uy tín Assault Battalion · 10.000 Tekniq Alloy · 90 viên 9 × 19 mm PBP.',
            source: 'A_Small_Breakthrough'
        },
        {
            id: 'trade', en: 'Fair Trade', zh: '公平交易', vi: 'Trao đổi công bằng',
            type: 'Chiến đấu', previous: 'A Small Breakthrough', next: 'Outflanking Tactics / Precision Strike',
            objectives: [
                ['在零号大坝行动中，击杀2名特殊兵种敌人。', 'Trong trận Zero Dam, hạ 2 địch thuộc lớp đặc biệt: lính khiên, bắn tỉa, tên lửa, súng máy hoặc cận vệ trùm, thuộc bất kỳ phe nào.'],
                ['在零号大坝行动中，完成1次高价值目标清除合约。', 'Hoàn thành 1 hợp đồng tiêu diệt mục tiêu giá trị cao (HVT Elimination) trong trận Zero Dam.']
            ],
            rewards: '4.600 EXP · +1 uy tín Assault Battalion · 10.000 Tekniq Alloy · 60 viên 9 × 39 mm SP6.',
            source: 'Fair_Trade'
        }
    ];
    const list = document.getElementById('wikiQuestList');
    const search = document.getElementById('wikiSearch');
    const view = document.getElementById('wikiView');
    const detail = document.getElementById('wikiQuestDetail');
    let selected = quests[0].id;
    function render() {
        const visible = quests.filter(q => matchesSearch(search.value, q.en, q.zh, q.vi, q.type, ...q.objectives.flat()));
        if (!visible.some(q => q.id === selected)) selected = visible[0]?.id;
        list.className = view.value === 'tree' ? 'wiki-tree' : 'wiki-list';
        document.getElementById('wikiCount').textContent = `${visible.length} / ${quests.length} quest mẫu · Mũi tên chỉ liên kết giữa các quest mẫu liền nhau.`;
        list.replaceChildren();
        visible.forEach((q, index) => {
            if (view.value === 'tree' && index && visible[index - 1].next.split(' / ').includes(q.en)) {
                const arrow = document.createElement('span');
                arrow.className = 'wiki-arrow';
                arrow.textContent = '→';
                arrow.setAttribute('aria-hidden', 'true');
                list.appendChild(arrow);
            }
            const button = document.createElement('button');
            button.className = 'wiki-card' + (selected === q.id ? ' selected' : '');
            button.setAttribute('aria-pressed', String(selected === q.id));
            button.innerHTML = `<span lang="zh">${escapeHtml(q.zh)}</span><strong>${escapeHtml(q.vi)}</strong><small>${escapeHtml(q.en)}</small><small>Zero Dam · ${escapeHtml(q.type)}</small>`;
            button.onclick = () => { selected = q.id; render(); detail.querySelector('h3').focus(); };
            list.appendChild(button);
        });
        if (!visible.length) {
            list.textContent = 'Không có quest phù hợp.';
            detail.replaceChildren();
            return;
        }
        const q = quests.find(q => q.id === selected);
        detail.innerHTML = `<h3 tabindex="-1" class="text-xl font-bold mb-2"><span lang="zh">${escapeHtml(q.zh)}</span> · ${escapeHtml(q.vi)}</h3>
            <p class="text-gray-200 mb-3">${escapeHtml(q.en)} · Tên Trung/Việt: bản dịch tham khảo</p>
            <h4 class="font-bold mb-2">Mục tiêu</h4>
            <ol class="wiki-objectives">${q.objectives.map(([zh, vi]) => `<li><p lang="zh">${escapeHtml(zh)}</p><p class="text-green-200 mt-1">${escapeHtml(vi)}</p></li>`).join('')}</ol>
            <p class="mt-4"><strong>Phần thưởng:</strong> ${escapeHtml(q.rewards)}</p>
            <p class="mt-3"><strong>Trước:</strong> ${escapeHtml(q.previous)}</p>
            <p class="mt-1"><strong>Tiếp theo:</strong> ${escapeHtml(q.next)}</p>
            <a class="inline-block text-blue-300 underline mt-4" href="https://delta-force.fandom.com/wiki/${q.source}" target="_blank" rel="noopener noreferrer">Nguồn: ${escapeHtml(q.en)} ↗</a>`;
    }
    search.addEventListener('input', render);
    view.addEventListener('change', render);
    render();
})();
