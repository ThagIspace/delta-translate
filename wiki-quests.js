// Điều khiển Wiki Quest: chọn department, lọc và chuyển màn. Dữ liệu/renderer/cây nằm ở file riêng.
(() => {
    const quests = [...WIKI_QUEST_DATA, ...WIKI_TACTICAL_QUEST_DATA];
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
    const byId = new Map(quests.map(q => [q.id, q]));
    const parents = q => (q.parentIds || []).map(id => byId.get(id)).filter(Boolean);
    const graphView = WikiQuestGraph.create({ quests, parents, list, viewport, view, onSelect: q => openQuest(q) });
    const questHTML = q => WikiQuestDetail.render(q, quests, parents);
    function openQuest(q, modal = true) {
        selected = q.id;
        render();
        if (modal) { detail.innerHTML = questHTML(q); if (!dialog.open) dialog.showModal(); detail.scrollTop = 0; }
        else {
            document.getElementById('wikiMissionScreen').classList.add('show-mission-detail');
            document.getElementById('wikiMissionContent').scrollTop = 0;
            document.getElementById('wikiInlineHeading')?.focus({ preventScroll: false });
        }
    }
    function revealQuest(q, tree) {
        const wasModal = dialog.open;
        graphView.endPan();
        search.value = '';
        document.getElementById('wikiType').value = '';
        document.getElementById('wikiMap').value = '';
        document.getElementById('wikiDepartment').value = q.department;
        selected = q.id;
        if (!tree) {
            openQuest(q, wasModal);
            return;
        }
        if (dialog.open) dialog.close();
        screen = 'tree'; view.value = 'tree';
        render();
        graphView.focusQuest(q.id);
    }
    function handleQuestNavigation(event) {
        const button = event.target.closest('button[data-wiki-go], button[data-wiki-tree]');
        if (!button) return;
        const q = byId.get(button.dataset.wikiGo || button.dataset.wikiTree);
        if (q) revealQuest(q, Boolean(button.dataset.wikiTree));
    }
    detail.addEventListener('click', handleQuestNavigation);
    document.getElementById('wikiMissionContent').addEventListener('click', handleQuestNavigation);
    function renderGameScreen(visible) {
        document.getElementById('wikiDepartmentHome').hidden = screen !== 'home';
        document.getElementById('wikiExplorer').hidden = screen === 'home';
        document.getElementById('wikiMissionScreen').hidden = screen !== 'missions';
        document.getElementById('wikiTreeScreen').hidden = screen !== 'tree';
        view.parentElement.hidden = screen !== 'tree';
        document.getElementById('wikiToggleTree').textContent = screen === 'tree' ? '☷ Danh sách nhiệm vụ' : '◇ Cây nhiệm vụ';
        const departmentValue = document.getElementById('wikiDepartment').value;
        document.getElementById('wikiCurrentDepartment').textContent = departmentValue || 'Tất cả department';
        document.getElementById('wikiSidebarDepartment').textContent = departmentValue || 'Tất cả department';
        document.getElementById('wikiSidebarCount').textContent = `${visible.length} nhiệm vụ đang hiển thị`;
        document.querySelectorAll('#wikiDepartmentTabs button').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.department === departmentValue));
        });
        if (!visible.some(q => q.id === selected)) selected = visible[0]?.id || null;
        const missionList = document.getElementById('wikiMissionList');
        const listScroll = missionList.scrollTop;
        missionList.replaceChildren();
        visible.forEach(q => {
            const button = document.createElement('button');
            button.type = 'button'; button.className = 'wiki-mission-row' + (selected === q.id ? ' active' : '');
            button.setAttribute('aria-pressed', String(selected === q.id));
            button.innerHTML = `<span lang="zh">${escapeHtml(q.zh)}</span><strong>${escapeHtml(q.vi)}</strong><small>◇ ${escapeHtml(q.map === 'Any' ? 'Mọi map · gồm Zero Dam' : q.map)}</small>`;
            button.onclick = () => openQuest(q, false);
            missionList.appendChild(button);
        });
        missionList.scrollTop = listScroll;
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
            && (!map || q.map === map || (map === 'Zero Dam' && q.map === 'Any'))
            && (!type || q.type === type));
        const visible = eligible.filter(q => matchesSearch(search.value, q.en, q.zh, q.vi, q.type, q.map, q.department, ...q.objectives.flat()));
        renderGameScreen(visible);
        document.getElementById('wikiCount').textContent = `${visible.length} / ${quests.length} quest đã nhập · 39 Zero Dam + 11 Chiến thuật (mọi map/ngoài trận). Không lọc theo level.`;
        graphView.render(visible, selected);
    }
    const home = document.getElementById('wikiDepartmentHome');
    const departments = [
        ['Chiến đấu · 战斗部门', '战斗部门', 'Chiến đấu', '△', 'combat'],
        ['Y tế · 医疗部门', '医疗部门', 'Y tế', '✚', 'medical'],
        ['Chiến thuật · 战术部门', '战术部门', 'Chiến thuật', '◇', 'tactical'],
        ['Hậu cần · 后勤部门', '后勤部门', 'Hậu cần', '⬡', 'logistics'],
        ['Nghiên cứu · 研发部门', '研发部门', 'Nghiên cứu', '⌘', 'research']
    ];
    departments.forEach(([value, zh, vi, icon, theme]) => {
        const count = value ? quests.filter(q => q.department === value).length : 0;
        const button = document.createElement('button'); button.type = 'button';
        button.className = 'wiki-department-card dept-' + theme;
        button.disabled = count === 0;
        button.innerHTML = `<span class="wiki-dept-kicker">DEPARTMENT / ${theme === 'tactical' ? 'TACTICAL' : 'ZERO DAM'}</span><span class="wiki-dept-emblem" aria-hidden="true">${icon}</span><span class="wiki-dept-title" lang="zh">${zh}</span><strong>${vi}</strong><span class="wiki-dept-count">${count ? count + ' quest · Xem nhiệm vụ →' : 'Chưa có dữ liệu Zero Dam'}</span>`;
        const choose = () => {
            graphView.endPan();
            document.getElementById('wikiDepartment').value = value;
            search.value = ''; document.getElementById('wikiType').value = ''; document.getElementById('wikiMap').value = '';
            selected = null;
            if (screen === 'home') screen = 'missions';
            document.getElementById('wikiMissionScreen').classList.remove('show-mission-detail');
            document.getElementById('wikiMissionList').scrollTop = 0;
            render();
            document.getElementById('wikiMissionContent').scrollTop = 0;
            viewport.scrollTo(0, 0);
        };
        button.onclick = choose;
        const tab = document.createElement('button'); tab.type = 'button';
        tab.className = 'wiki-department-tab'; tab.dataset.department = value || 'unavailable';
        tab.disabled = count === 0;
        tab.innerHTML = `<span lang="zh">${zh}</span><strong>${vi}</strong><small>${count ? count + ' quest' : 'Chưa có dữ liệu'}</small>`;
        tab.onclick = choose;
        document.getElementById('wikiDepartmentTabs').appendChild(tab);
        home.appendChild(button);
    });
    document.getElementById('wikiBackHome').onclick = () => { graphView.endPan(); screen = 'home'; render(); };
    document.getElementById('wikiToggleTree').onclick = () => { graphView.endPan(); screen = screen === 'tree' ? 'missions' : 'tree'; render(); };
    document.getElementById('wikiCloseDetail').onclick = () => dialog.close();
    dialog.addEventListener('close', () => list.querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true }));
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
    view.addEventListener('change', () => { graphView.endPan(); render(); viewport.scrollTo(0, 0); });
    render();
})();
