// Bản xem thử: dịch/tóm tắt từ các trang nguồn tiếng Anh, không phải tên CN chính thức.
(() => {
    const quests = WIKI_QUEST_DATA;
    const ids = new Set();
    quests.forEach(q => {
        if (!q.id || ids.has(q.id) || !q.en || !q.department || !q.map || !q.source) throw new Error('Invalid quest metadata');
        if (q.level !== null && (!Number.isSafeInteger(q.level) || q.level < 1)) throw new Error('Invalid quest level');
        ids.add(q.id);
    });
    const list = document.getElementById('wikiQuestList');
    const viewport = document.getElementById('wikiViewport');
    const search = document.getElementById('wikiSearch');
    const view = document.getElementById('wikiView');
    const detail = document.getElementById('wikiQuestDetail');
    const dialog = document.getElementById('wikiQuestDialog');
    let selected = null;
    let screen = 'home';
    let zoom = 1;
    let graphSize = { width: 900, height: 400 };
    let pan = null;
    const byId = new Map(quests.map(q => [q.id, q]));
    const parents = q => (q.parentIds || []).map(id => byId.get(id)).filter(Boolean);
    function layout(candidates = quests) {
        const candidateIds = new Set(candidates.map(q => q.id));
        const positions = new Map();
        const ranks = new Map();
        function rank(q, visiting = new Set()) {
            if (ranks.has(q.id)) return ranks.get(q.id);
            if (visiting.has(q.id)) throw new Error('Quest dependency cycle');
            const next = new Set(visiting).add(q.id);
            const value = Math.max(-1, ...parents(q).filter(p => candidateIds.has(p.id)).map(p => rank(p, next))) + 1;
            ranks.set(q.id, value);
            return value;
        }
        const columns = new Map();
        candidates.forEach(q => { const col = rank(q); if (!columns.has(col)) columns.set(col, []); columns.get(col).push(q); });
        const maxRows = Math.max(1, ...Array.from(columns.values(), col => col.length));
        columns.forEach((col, x) => col.forEach((q, y) => positions.set(q.id, { x: 40 + x * 300, y: 40 + y * 230 + (maxRows - col.length) * 115 })));
        return { positions, width: 80 + columns.size * 300, height: 80 + maxRows * 230 };
    }
    let graph = layout();
    graphSize = graph;
    function updateZoom() {
        if (view.value !== 'tree') return;
        list.style.width = `${graphSize.width * zoom}px`;
        list.style.height = `${graphSize.height * zoom}px`;
        const canvas = list.querySelector('.wiki-canvas');
        if (canvas) canvas.style.transform = `scale(${zoom})`;
        document.getElementById('wikiZoomLabel').textContent = `${Math.round(zoom * 100)}%`;
        document.getElementById('wikiZoomOut').disabled = zoom <= .05;
        document.getElementById('wikiZoomIn').disabled = zoom >= 2;
    }
    function setZoom(value) {
        const previous = zoom;
        zoom = Math.max(.05, Math.min(2, value));
        const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / previous;
        const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / previous;
        updateZoom();
        viewport.scrollLeft = centerX * zoom - viewport.clientWidth / 2;
        viewport.scrollTop = centerY * zoom - viewport.clientHeight / 2;
    }
    function fit() {
        zoom = Math.max(.05, Math.min(1, (viewport.clientWidth - 16) / graphSize.width, (viewport.clientHeight - 16) / graphSize.height));
        updateZoom(); viewport.scrollTo(0, 0);
    }
    function questHTML(q) {
        return `<p class="wiki-detail-en">${escapeHtml(q.en)}</p><h3 id="wikiDetailHeading" class="text-xl font-bold mb-3"><span lang="zh">${escapeHtml(q.zh)}</span> · ${escapeHtml(q.vi)}</h3>
            <p class="text-gray-200 mb-3">Tên Trung theo nguồn · Bản Việt và mục tiêu song ngữ là bản tóm tắt tham khảo. Level mở khóa: ${q.level ?? 'Nguồn không ghi'}</p>
            <p class="mb-4"><strong>Đơn vị:</strong> ${escapeHtml(q.department)} · <strong>Bản đồ:</strong> ${q.map === 'Any' ? 'Mọi bản đồ (gồm Zero Dam)' : escapeHtml(q.map)}</p>
            ${q.note ? `<p class="wiki-source-note">${escapeHtml(q.note)}</p>` : ''}
            <h4 class="font-bold mb-2">Mục tiêu</h4><ol class="wiki-objectives">${q.objectives.map(([zh, vi]) => `<li><p lang="zh">${escapeHtml(zh)}</p><p class="text-green-200 mt-1">${escapeHtml(vi)}</p></li>`).join('')}</ol>
            <p class="mt-4"><strong>Phần thưởng:</strong> ${escapeHtml(q.rewards)}</p>
            <p class="mt-3"><strong>Trước:</strong> ${escapeHtml(q.previous)}</p><p class="mt-1"><strong>Tiếp theo:</strong> ${escapeHtml(q.next)}</p>
            <p class="text-sm text-gray-200 mt-4">${escapeHtml(q.sourceVersion)} · Đối chiếu nguồn: ${escapeHtml(q.reviewedOn)}. Khác biệt giữa các phiên bản chưa được đối chiếu đầy đủ. Không coi thứ tự cây là level mở khóa.</p>
            <a class="inline-block text-blue-300 underline mt-3" href="${escapeHtml(q.sourceUrl)}" target="_blank" rel="noopener noreferrer">Nguồn Leyao ↗ — mở mục 部门任务, tìm ${escapeHtml(q.zh)}</a>`;
    }
    function openQuest(q, modal = true) {
        selected = q.id;
        render();
        if (modal) { detail.innerHTML = questHTML(q); dialog.showModal(); }
        else {
            document.getElementById('wikiMissionScreen').classList.add('show-mission-detail');
            document.getElementById('wikiInlineHeading')?.focus({ preventScroll: false });
        }
    }
    function renderGameScreen(visible) {
        document.getElementById('wikiDepartmentHome').hidden = screen !== 'home';
        document.getElementById('wikiExplorer').hidden = screen === 'home';
        document.getElementById('wikiMissionScreen').hidden = screen !== 'missions';
        document.getElementById('wikiTreeScreen').hidden = screen !== 'tree';
        view.parentElement.hidden = screen !== 'tree';
        document.getElementById('wikiToggleTree').textContent = screen === 'tree' ? '☷ Danh sách nhiệm vụ' : '◇ Cây nhiệm vụ';
        document.getElementById('wikiCurrentDepartment').textContent = document.getElementById('wikiDepartment').value || 'Tất cả department';
        if (!visible.some(q => q.id === selected)) selected = visible[0]?.id || null;
        const missionList = document.getElementById('wikiMissionList');
        missionList.replaceChildren();
        visible.forEach(q => {
            const button = document.createElement('button');
            button.type = 'button'; button.className = 'wiki-mission-row' + (selected === q.id ? ' active' : '');
            button.setAttribute('aria-pressed', String(selected === q.id));
            button.innerHTML = `<span lang="zh">${escapeHtml(q.zh)}</span><strong>${escapeHtml(q.vi)}</strong><small>◇ Zero Dam</small>`;
            button.onclick = () => openQuest(q, false);
            missionList.appendChild(button);
        });
        if (!visible.length) missionList.textContent = 'Không có quest phù hợp.';
        const content = document.getElementById('wikiMissionContent');
        const q = byId.get(selected);
        content.innerHTML = q ? '<button type="button" id="wikiBackMissionList" class="tool-btn wiki-back-missions">← Danh sách nhiệm vụ</button>' + questHTML(q).replace('id="wikiDetailHeading"', 'id="wikiInlineHeading" tabindex="-1"') : '<p>Chọn nhiệm vụ trong danh sách.</p>';
        const back = document.getElementById('wikiBackMissionList');
        if (back) back.onclick = () => {
            document.getElementById('wikiMissionScreen').classList.remove('show-mission-detail');
            missionList.querySelector('[aria-pressed="true"]')?.focus();
        };
    }
    function render() {
        const department = document.getElementById('wikiDepartment').value;
        const map = document.getElementById('wikiMap').value;
        const type = document.getElementById('wikiType').value;
        const eligible = quests.filter(q => (!department || q.department === department)
            && (!map || q.map === map)
            && (!type || q.type === type));
        const visible = eligible.filter(q => matchesSearch(search.value, q.en, q.zh, q.vi, q.type, q.map, q.department, ...q.objectives.flat()));
        renderGameScreen(visible);
        document.getElementById('wikiCount').textContent = `${visible.length} / ${quests.length} quest đã nhập · 39/78 quest ghi rõ Zero Dam, không bắt buộc map khác. Không lọc theo level.`;
        graph = layout(visible); graphSize = graph;
        const highlighted = new Set();
        function markAncestors(q) {
            if (!q || highlighted.has(q.id)) return;
            highlighted.add(q.id); parents(q).forEach(markAncestors);
        }
        markAncestors(quests.find(q => q.id === selected));
        const tree = view.value === 'tree';
        document.getElementById('wikiGraphTools').hidden = !tree;
        viewport.classList.toggle('is-list', !tree);
        list.className = tree ? 'wiki-graph-space' : 'wiki-list';
        list.style.width = ''; list.style.height = '';
        list.replaceChildren();
        if (!visible.length) { list.textContent = 'Không có quest phù hợp. Thử xóa tìm kiếm hoặc đổi bộ lọc.'; return; }
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
                if (highlighted.has(q.id) && highlighted.has(p.id)) path.classList.add('highlighted');
                svg.appendChild(path);
            }));
            canvas.appendChild(svg);
        }
        visible.forEach(q => {
            const button = document.createElement('button'); button.type = 'button';
            button.className = 'wiki-card' + (selected === q.id ? ' selected' : highlighted.has(q.id) ? ' ancestor' : '');
            button.dataset.questId = q.id;
            button.setAttribute('aria-pressed', String(selected === q.id)); button.setAttribute('aria-haspopup', 'dialog');
            button.innerHTML = `<small class="wiki-node-step">${escapeHtml(q.department)}</small><span lang="zh">${escapeHtml(q.zh)}</span><strong>${escapeHtml(q.vi)}</strong><small class="wiki-node-meta">◇ ${q.map === 'Any' ? 'Mọi bản đồ' : escapeHtml(q.map)} · ${escapeHtml(q.type)}</small><small>Level: ${q.level ?? 'Chưa xác minh'}</small>`;
            if (tree) { const pos = graph.positions.get(q.id); button.style.left = `${pos.x}px`; button.style.top = `${pos.y}px`; }
            button.onclick = () => openQuest(q); canvas.appendChild(button);
        });
        updateZoom();
    }
    const home = document.getElementById('wikiDepartmentHome');
    const departments = [
        ['Chiến đấu · 战斗部门', '战斗部门', 'Chiến đấu', '△', 'combat'],
        ['Y tế · 医疗部门', '医疗部门', 'Y tế', '✚', 'medical'],
        ['', '战术部门', 'Chiến thuật', '◇', 'tactical'],
        ['Hậu cần · 后勤部门', '后勤部门', 'Hậu cần', '⬡', 'logistics'],
        ['Nghiên cứu · 研发部门', '研发部门', 'Nghiên cứu', '⌘', 'research']
    ];
    departments.forEach(([value, zh, vi, icon, theme]) => {
        const count = value ? quests.filter(q => q.department === value).length : 0;
        const button = document.createElement('button'); button.type = 'button';
        button.className = 'wiki-department-card dept-' + theme;
        button.disabled = count === 0;
        button.innerHTML = `<span class="wiki-dept-kicker">DEPARTMENT / ZERO DAM</span><span class="wiki-dept-emblem" aria-hidden="true">${icon}</span><span class="wiki-dept-title" lang="zh">${zh}</span><strong>${vi}</strong><span class="wiki-dept-count">${count ? count + ' quest · Xem nhiệm vụ →' : 'Chưa có dữ liệu Zero Dam'}</span>`;
        button.onclick = () => {
            document.getElementById('wikiDepartment').value = value;
            search.value = ''; document.getElementById('wikiType').value = ''; document.getElementById('wikiMap').value = '';
            selected = null; screen = 'missions';
            document.getElementById('wikiMissionScreen').classList.remove('show-mission-detail');
            render();
        };
        home.appendChild(button);
    });
    document.getElementById('wikiBackHome').onclick = () => { screen = 'home'; render(); };
    document.getElementById('wikiToggleTree').onclick = () => { screen = screen === 'tree' ? 'missions' : 'tree'; render(); };
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
    for (const [id, key] of [['wikiDepartment', 'department'], ['wikiMap', 'map'], ['wikiType', 'type']]) {
        const select = document.getElementById(id);
        const values = [...new Set(quests.map(q => q[key]))];
        values.forEach(value => {
            const option = document.createElement('option'); option.value = value;
            option.textContent = value === 'Any' ? 'Mọi bản đồ' : value;
            select.appendChild(option);
        });
        select.addEventListener('change', render);
    }
    document.getElementById('wikiClearFilters').onclick = () => {
        search.value = '';
        ['wikiDepartment', 'wikiMap', 'wikiType'].forEach(id => { document.getElementById(id).value = ''; });
        render();
    };
    search.addEventListener('input', render);
    view.addEventListener('change', () => { endPan(); render(); viewport.scrollTo(0, 0); });
    render();
})();
