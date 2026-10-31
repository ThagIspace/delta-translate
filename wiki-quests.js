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
    const viewport = document.getElementById('wikiViewport');
    const search = document.getElementById('wikiSearch');
    const view = document.getElementById('wikiView');
    const detail = document.getElementById('wikiQuestDetail');
    const dialog = document.getElementById('wikiQuestDialog');
    let selected = null;
    let zoom = 1;
    let graphSize = { width: 900, height: 400 };
    let pan = null;
    const byName = new Map(quests.map(q => [q.en, q]));
    const parents = q => q.previous.split(' / ').map(name => byName.get(name)).filter(Boolean);
    function layout() {
        const positions = new Map();
        const ranks = new Map();
        function rank(q, visiting = new Set()) {
            if (ranks.has(q.id)) return ranks.get(q.id);
            if (visiting.has(q.id)) throw new Error('Quest dependency cycle');
            const next = new Set(visiting).add(q.id);
            const value = Math.max(-1, ...parents(q).map(p => rank(p, next))) + 1;
            ranks.set(q.id, value);
            return value;
        }
        const columns = new Map();
        quests.forEach(q => { const col = rank(q); if (!columns.has(col)) columns.set(col, []); columns.get(col).push(q); });
        const maxRows = Math.max(1, ...Array.from(columns.values(), col => col.length));
        columns.forEach((col, x) => col.forEach((q, y) => positions.set(q.id, { x: 40 + x * 300, y: 40 + y * 230 + (maxRows - col.length) * 115 })));
        return { positions, width: 80 + columns.size * 300, height: 80 + maxRows * 230 };
    }
    const graph = layout();
    graphSize = graph;
    function updateZoom() {
        if (view.value !== 'tree') return;
        list.style.width = `${graphSize.width * zoom}px`;
        list.style.height = `${graphSize.height * zoom}px`;
        const canvas = list.querySelector('.wiki-canvas');
        if (canvas) canvas.style.transform = `scale(${zoom})`;
        document.getElementById('wikiZoomLabel').textContent = `${Math.round(zoom * 100)}%`;
        document.getElementById('wikiZoomOut').disabled = zoom <= .25;
        document.getElementById('wikiZoomIn').disabled = zoom >= 2;
    }
    function setZoom(value) {
        const previous = zoom;
        zoom = Math.max(.25, Math.min(2, value));
        const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / previous;
        const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / previous;
        updateZoom();
        viewport.scrollLeft = centerX * zoom - viewport.clientWidth / 2;
        viewport.scrollTop = centerY * zoom - viewport.clientHeight / 2;
    }
    function fit() {
        zoom = Math.max(.25, Math.min(1, (viewport.clientWidth - 16) / graphSize.width, (viewport.clientHeight - 16) / graphSize.height));
        updateZoom(); viewport.scrollTo(0, 0);
    }
    function openQuest(q) {
        selected = q.id;
        render();
        detail.innerHTML = `<p class="wiki-detail-en">${escapeHtml(q.en)}</p><h3 id="wikiDetailHeading" class="text-xl font-bold mb-3"><span lang="zh">${escapeHtml(q.zh)}</span> · ${escapeHtml(q.vi)}</h3>
            <p class="text-gray-200 mb-3">Trung/Việt: bản dịch tham khảo · Level mở khóa: ${q.level ?? 'Chưa xác minh'}</p>
            <p class="mb-4"><strong>Đơn vị:</strong> ${escapeHtml(q.department)} · <strong>Bản đồ:</strong> ${q.map === 'Any' ? 'Mọi bản đồ (gồm Zero Dam)' : escapeHtml(q.map)}</p>
            ${q.note ? `<p class="wiki-source-note">${escapeHtml(q.note)}</p>` : ''}
            <h4 class="font-bold mb-2">Mục tiêu</h4><ol class="wiki-objectives">${q.objectives.map(([zh, vi]) => `<li><p lang="zh">${escapeHtml(zh)}</p><p class="text-green-200 mt-1">${escapeHtml(vi)}</p></li>`).join('')}</ol>
            <p class="mt-4"><strong>Phần thưởng:</strong> ${escapeHtml(q.rewards)}</p>
            <p class="mt-3"><strong>Trước:</strong> ${escapeHtml(q.previous)}</p><p class="mt-1"><strong>Tiếp theo:</strong> ${escapeHtml(q.next)}</p>
            <p class="text-sm text-gray-200 mt-4">Nguồn cộng đồng, chưa đối chiếu bản game hiện tại. Không coi thứ tự cây là level mở khóa.</p>
            <a class="inline-block text-blue-300 underline mt-3" href="https://delta-force.fandom.com/wiki/${q.source}" target="_blank" rel="noopener noreferrer">Nguồn: ${escapeHtml(q.en)} ↗</a>`;
        dialog.showModal();
    }
    function render() {
        const visible = quests.filter(q => matchesSearch(search.value, q.en, q.zh, q.vi, q.type, q.map, q.department, ...q.objectives.flat()));
        document.getElementById('wikiCount').textContent = `${visible.length} / ${quests.length} quest · Cây theo điều kiện trước/sau; level chưa xác minh. Chưa phải danh mục đầy đủ.`;
        const tree = view.value === 'tree';
        document.getElementById('wikiGraphTools').hidden = !tree;
        viewport.classList.toggle('is-list', !tree);
        list.className = tree ? 'wiki-graph-space' : 'wiki-list';
        list.style.width = ''; list.style.height = '';
        list.replaceChildren();
        if (!visible.length) { list.textContent = 'Không có quest phù hợp.'; return; }
        let canvas = list;
        if (tree) {
            canvas = document.createElement('div'); canvas.className = 'wiki-canvas';
            canvas.style.width = `${graph.width}px`; canvas.style.height = `${graph.height}px`;
            list.appendChild(canvas);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', graph.width); svg.setAttribute('height', graph.height); svg.classList.add('wiki-edges'); svg.setAttribute('aria-hidden', 'true');
            const ids = new Set(visible.map(q => q.id));
            visible.forEach(q => parents(q).filter(p => ids.has(p.id)).forEach(p => {
                const a = graph.positions.get(p.id), b = graph.positions.get(q.id);
                const path = document.createElementNS(svg.namespaceURI, 'path');
                const x = a.x + 230, y = a.y + 95, endY = b.y + 95, middle = (x + b.x) / 2;
                path.setAttribute('d', `M${x} ${y} H${middle} V${endY} H${b.x}`);
                svg.appendChild(path);
            }));
            canvas.appendChild(svg);
        }
        visible.forEach(q => {
            const button = document.createElement('button'); button.type = 'button';
            button.className = 'wiki-card' + (selected === q.id ? ' selected' : '');
            button.dataset.questId = q.id;
            button.setAttribute('aria-pressed', String(selected === q.id)); button.setAttribute('aria-haspopup', 'dialog');
            button.innerHTML = `<small class="wiki-node-step">${escapeHtml(q.department)}</small><span lang="zh">${escapeHtml(q.zh)}</span><strong>${escapeHtml(q.vi)}</strong><small>${escapeHtml(q.en)}</small><small class="wiki-node-meta">◇ ${q.map === 'Any' ? 'Mọi bản đồ' : escapeHtml(q.map)} · ${escapeHtml(q.type)}</small><small>Level: ${q.level ?? 'Chưa xác minh'}</small>`;
            if (tree) { const pos = graph.positions.get(q.id); button.style.left = `${pos.x}px`; button.style.top = `${pos.y}px`; }
            button.onclick = () => openQuest(q); canvas.appendChild(button);
        });
        updateZoom();
    }
    document.getElementById('wikiCloseDetail').onclick = () => dialog.close();
    dialog.addEventListener('close', () => list.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true }));
    document.getElementById('wikiZoomIn').onclick = () => setZoom(zoom + .15);
    document.getElementById('wikiZoomOut').onclick = () => setZoom(zoom - .15);
    document.getElementById('wikiFit').onclick = fit;
    document.getElementById('wikiResetView').onclick = () => { zoom = 1; updateZoom(); viewport.scrollTo(0, 0); };
    viewport.addEventListener('pointerdown', e => {
        if (view.value !== 'tree' || e.target.closest('button') || e.button !== 0 || !e.isPrimary) return;
        pan = { id: e.pointerId, x: e.clientX, y: e.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
        viewport.setPointerCapture(e.pointerId); viewport.classList.add('panning');
    });
    viewport.addEventListener('pointermove', e => {
        if (!pan || e.pointerId !== pan.id) return;
        viewport.scrollLeft = pan.left - (e.clientX - pan.x); viewport.scrollTop = pan.top - (e.clientY - pan.y);
    });
    function endPan() {
        if (!pan) return;
        const id = pan.id; pan = null; viewport.classList.remove('panning');
        if (viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
    }
    viewport.addEventListener('pointerup', endPan); viewport.addEventListener('pointercancel', endPan); viewport.addEventListener('lostpointercapture', endPan);
    window.addEventListener('blur', endPan);
    search.addEventListener('input', render);
    view.addEventListener('change', () => { endPan(); render(); viewport.scrollTo(0, 0); });
    render();
})();
