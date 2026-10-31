// Bản xem thử: dịch/tóm tắt từ các trang nguồn tiếng Anh, không phải tên CN chính thức.
(() => {
    const quests = [
        {
            id: 'first', en: 'First Battle', zh: '初战', vi: 'Trận đầu', step: 1, map: 'Any', department: 'Assault Battalion',
            type: 'Chiến đấu', previous: 'Chưa xác minh điều kiện mở khóa', next: 'Return',
            objectives: [['进入任意行动，击杀5名敌方士兵。', 'Vào một trận Operations trên bất kỳ bản đồ nào và hạ 5 lính địch.']],
            rewards: '1.200 EXP · +1 uy tín Assault Battalion · 15.000 Tekniq Alloy · CAR-15.',
            source: 'First_Battle'
        },
        {
            id: 'return', en: 'Return', zh: '归来', vi: 'Trở về', step: 2, map: 'Zero Dam', department: 'Assault Battalion',
            type: 'Chiến đấu / Rút lui', previous: 'First Battle', next: 'Substation Investigation / Showdown / New Beginning / In To The Clouds 1',
            objectives: [
                ['在零号大坝行动中，击杀5名敌方士兵。', 'Trong trận Zero Dam, hạ 5 lính địch.'],
                ['在零号大坝行动中，完成1次撤离，单局收益达到30,000哈夫币。', 'Rút lui 1 lần ở Zero Dam với thu nhập trong một trận đạt 30.000 Tekniq Alloy.']
            ],
            rewards: '1.300 EXP · +1 uy tín Assault Battalion · 10.000 Tekniq Alloy · M870.',
            source: 'Return'
        },
        {
            id: 'showdown', en: 'Showdown', zh: '交锋', vi: 'Đối đầu', step: 3, map: 'Zero Dam', department: 'Assault Battalion',
            type: 'Điều tra', previous: 'Return', next: 'Decisive Strike / Assault Preparation',
            objectives: [
                ['在零号大坝行动中，前往管道区域调查。', 'Trong trận Zero Dam, điều tra khu vực đường ống.'],
                ['在零号大坝行动中，前往军营指定地点调查。', 'Điều tra địa điểm được chỉ định trong khu doanh trại ở Zero Dam.']
            ],
            rewards: '1.300 EXP · +1 uy tín Assault Battalion · 10.000 Tekniq Alloy.',
            source: 'Showdown'
        }
    ];
    const list = document.getElementById('wikiQuestList');
    const search = document.getElementById('wikiSearch');
    const view = document.getElementById('wikiView');
    const detail = document.getElementById('wikiQuestDetail');
    let selected = quests[0].id;
    function render() {
        const visible = quests.filter(q => matchesSearch(search.value, q.en, q.zh, q.vi, q.type, q.map, q.department, ...q.objectives.flat()));
        if (!visible.some(q => q.id === selected)) selected = visible[0]?.id;
        list.className = view.value === 'tree' ? 'wiki-tree' : 'wiki-list';
        document.getElementById('wikiCount').textContent = `${visible.length} / ${quests.length} quest đầu của nhánh mẫu · Bước là thứ tự chuỗi, không phải level mở khóa. Các nhánh khác chưa hiển thị.`;
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
            button.innerHTML = `<span lang="zh">${escapeHtml(q.zh)}</span><strong>${escapeHtml(q.vi)}</strong><small>${escapeHtml(q.en)}</small><small>Bước ${q.step} · ${q.map === 'Any' ? 'Mọi bản đồ (gồm Zero Dam)' : escapeHtml(q.map)}</small><small>${escapeHtml(q.department)} · ${escapeHtml(q.type)}</small><small>Level mở khóa: Chưa xác minh</small>`;
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
            <p class="mb-3"><strong>Đơn vị:</strong> ${escapeHtml(q.department)} · <strong>Bản đồ:</strong> ${q.map === 'Any' ? 'Mọi bản đồ (gồm Zero Dam)' : escapeHtml(q.map)}<br><strong>Level mở khóa:</strong> Chưa xác minh. Bước ${q.step} chỉ là vị trí trong nhánh mẫu.</p>
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
