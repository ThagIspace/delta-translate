// Chỉ lưu thứ tự menu; di chuyển phần tử thật để giữ tab hiện tại và liên kết.
(() => {
    const nav = document.getElementById('nav-tabs');
    const arrangeButton = document.getElementById('navArrangeButton');
    const help = document.getElementById('navArrangeHelp');
    const status = document.getElementById('navOrderStatus');
    const storageKey = 'delta_nav_order';
    const items = new Map();
    let arranging = false;
    let drag = null;
    let frame = null;
    let suppressClick = false;

    for (const link of Array.from(nav.children)) {
        const id = link.dataset.tab || link.dataset.navId;
        const label = link.textContent.trim();
        const item = document.createElement('div');
        item.className = 'nav-item';
        item.dataset.navId = id;
        const handle = document.createElement('button');
        handle.type = 'button';
        handle.className = 'nav-control nav-handle';
        handle.textContent = '⠿';
        handle.setAttribute('aria-label', `Kéo để di chuyển ${label}; hoặc dùng phím mũi tên trái, phải`);
        handle.hidden = true;
        nav.insertBefore(item, link);
        item.append(handle, link);
        const arrows = document.createElement('span');
        arrows.className = 'nav-arrows';
        for (const [direction, text] of [[-1, '←'], [1, '→']]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'nav-control nav-move';
            button.textContent = text;
            button.setAttribute('aria-label', `Chuyển ${label} sang ${direction === -1 ? 'trái' : 'phải'}`);
            button.onclick = () => moveBy(item, direction);
            arrows.appendChild(button);
        }
        arrows.hidden = true;
        item.appendChild(arrows);
        items.set(id, { item, link, handle, arrows, label });
        handle.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            moveBy(item, event.key === 'ArrowLeft' ? -1 : 1);
        });
        handle.addEventListener('pointerdown', event => startDrag(event, item));
        handle.addEventListener('pointermove', updateDrag);
        handle.addEventListener('pointerup', event => finishDrag(event, true));
        handle.addEventListener('pointercancel', event => finishDrag(event, false));
        handle.addEventListener('lostpointercapture', event => finishDrag(event, false));
    }
    const defaultOrder = Array.from(items.keys());
    const order = () => Array.from(nav.children, item => item.dataset.navId);
    function applyOrder(ids) {
        const known = Array.isArray(ids) ? ids.filter(id => typeof id === 'string' && items.has(id)) : [];
        for (const id of new Set([...known, ...defaultOrder])) nav.appendChild(items.get(id).item);
    }
    try { applyOrder(JSON.parse(localStorage.getItem(storageKey))); } catch { /* Dùng thứ tự gốc nếu dữ liệu lưu không đọc được. */ }

    function saveOrder(item) {
        refreshControls();
        const position = item ? order().indexOf(item.dataset.navId) + 1 : null;
        const message = item ? `${items.get(item.dataset.navId).label}: vị trí ${position} / ${items.size}.` : 'Đã khôi phục thứ tự ban đầu.';
        try {
            localStorage.setItem(storageKey, JSON.stringify(order()));
            status.textContent = `${message} Đã lưu.`;
        } catch {
            status.textContent = `${message} Không lưu được trên trình duyệt; thứ tự chỉ giữ đến khi tải lại trang.`;
        }
    }
    function refreshControls() {
        const ids = order();
        ids.forEach((id, index) => {
            const entry = items.get(id);
            entry.arrows.children[0].disabled = index === 0;
            entry.arrows.children[1].disabled = index === ids.length - 1;
        });
    }
    function moveBy(item, direction) {
        if (!arranging || drag) return;
        const neighbor = direction < 0 ? item.previousElementSibling : item.nextElementSibling;
        if (!neighbor) return;
        nav.insertBefore(item, direction < 0 ? neighbor : neighbor.nextElementSibling);
        saveOrder(item);
        // Nút ở mép có thể vừa bị disabled; đưa focus về tay nắm của cùng mục.
        items.get(item.dataset.navId).handle.focus({ preventScroll: true });
        item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    function clearMarkers() {
        for (const { item } of items.values()) item.classList.remove('nav-drop-before', 'nav-drop-after');
    }
    function markTarget() {
        clearMarkers();
        const others = Array.from(nav.children).filter(item => item !== drag.item);
        const before = others.find(item => {
            const rect = item.getBoundingClientRect();
            return drag.x < rect.left + rect.width / 2;
        });
        drag.before = before || null;
        const target = before || others[others.length - 1];
        if (target) target.classList.add(before ? 'nav-drop-before' : 'nav-drop-after');
    }
    function autoScroll() {
        frame = null;
        if (!drag?.active) return;
        const rect = nav.getBoundingClientRect();
        const speed = drag.x < rect.left + 48 ? -10 : drag.x > rect.right - 48 ? 10 : 0;
        if (speed) nav.scrollLeft += speed;
        markTarget();
        frame = requestAnimationFrame(autoScroll);
    }
    function startDrag(event, item) {
        if (!arranging || drag || !event.isPrimary || event.button !== 0) return;
        drag = { item, handle: event.currentTarget, pointerId: event.pointerId, startX: event.clientX, x: event.clientX, active: false, before: null };
        drag.handle.setPointerCapture(event.pointerId);
    }
    function updateDrag(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        drag.x = event.clientX;
        if (!drag.active && Math.abs(drag.x - drag.startX) > 5) {
            drag.active = true;
            drag.item.classList.add('nav-dragging');
            frame = requestAnimationFrame(autoScroll);
        }
        if (drag.active) markTarget();
    }
    function finishDrag(event, commit) {
        if (!drag || (event && event.pointerId !== drag.pointerId)) return;
        const current = drag;
        if (event && commit) current.x = event.clientX;
        if (commit && current.active) markTarget();
        drag = null;
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        current.item.classList.remove('nav-dragging');
        clearMarkers();
        if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
        if (current.active) {
            suppressClick = true;
            setTimeout(() => { suppressClick = false; }, 0);
        }
        if (commit && current.active) {
            nav.insertBefore(current.item, current.before);
            saveOrder(current.item);
            current.handle.focus({ preventScroll: true });
            current.item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    }
    nav.addEventListener('click', event => {
        if (suppressClick || (arranging && !event.target.closest('.nav-control'))) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
    // Chặn cả thao tác mở link bằng chuột giữa trong chế độ sắp xếp.
    nav.addEventListener('auxclick', event => {
        if (arranging) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    nav.addEventListener('dragstart', event => {
        if (arranging) event.preventDefault();
    });
    function setArranging(value) {
        finishDrag(null, false);
        arranging = value;
        nav.classList.toggle('nav-arranging', value);
        help.hidden = !value;
        arrangeButton.setAttribute('aria-pressed', String(value));
        arrangeButton.textContent = value ? '✓ Xong' : '↔ Sắp xếp menu';
        for (const entry of items.values()) {
            entry.handle.hidden = !value;
            entry.arrows.hidden = !value;
            if (value) entry.link.setAttribute('aria-disabled', 'true');
            else entry.link.removeAttribute('aria-disabled');
        }
        refreshControls();
        status.textContent = value ? 'Đang sắp xếp menu. Các mục tạm ngừng mở trang.' : '';
    }
    arrangeButton.onclick = () => setArranging(!arranging);
    document.getElementById('navResetButton').onclick = () => {
        if (!arranging) return;
        finishDrag(null, false);
        applyOrder(defaultOrder);
        saveOrder();
    };
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !arranging || document.querySelector('dialog[open]')) return;
        if (drag) finishDrag(null, false);
        else { setArranging(false); arrangeButton.focus(); }
    });
    window.addEventListener('blur', () => finishDrag(null, false));
})();
