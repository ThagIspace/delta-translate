// Bố cục cây, đường nối, phóng to và kéo vùng nhìn.
const WikiQuestGraph = {
    create({ quests, parents, list, viewport, view, onSelect }) {
        let zoom = 1;
        let graphSize = { width: 900, height: 400 };
        let pan = null;
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
        function render(visible, selected) {
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
                button.onclick = () => onSelect(q); canvas.appendChild(button);
            });
            updateZoom();
        }
        document.getElementById('wikiZoomIn').onclick = () => setZoom(zoom + .15);
        document.getElementById('wikiZoomOut').onclick = () => setZoom(zoom - .15);
        document.getElementById('wikiFit').onclick = fit;
        document.getElementById('wikiResetView').onclick = reset;
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
        function reset() { zoom = 1; updateZoom(); viewport.scrollTo(0, 0); }
        function focusQuest(id) {
            zoom = 1; updateZoom();
            const position = graph.positions.get(id);
            if (!position) return;
            viewport.scrollTo({ left: Math.max(0, position.x + 115 - viewport.clientWidth / 2), top: Math.max(0, position.y + 95 - viewport.clientHeight / 2) });
            Array.from(list.querySelectorAll('[data-quest-id]')).find(node => node.dataset.questId === id)?.focus({ preventScroll: true });
        }
        return { render, endPan, focusQuest };
    }
};
