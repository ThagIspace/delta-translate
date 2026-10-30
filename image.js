const readingImages = { quest: false, full: false };
let lastFullImage = null;
let fullRun = null;
let fullShowingTranslation = false;
let fullHasTranslation = false;
let lastFullStatus = null;

function imageStatus(mode, message, state = 'error', retry = false) {
    if (mode === 'quest') setQuestStatus(message, state, retry);
    else setFullStatus(message, state, retry);
}
function decodeLocalImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Không mở được ảnh. Hãy dùng PNG, JPEG hoặc WebP hợp lệ.'));
        image.src = dataUrl;
    });
}
async function handleImageSelection(event, mode) {
    const file = event.target.files?.[0];
    if (file) await handleImageFile(file, mode);
    event.target.value = '';
}
async function handleImageFile(file, mode) {
    if (readingImages[mode] || (mode === 'quest' ? questRun : fullRun)) {
        imageStatus(mode, 'Đang xử lý ảnh trước. Hãy chờ hoặc hủy rồi gửi ảnh mới.', 'info');
        return;
    }
    readingImages[mode] = true;
    let image;
    try {
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Chỉ nhận PNG, JPEG hoặc WebP. Hãy đổi định dạng ảnh rồi gửi lại.');
        if (!file.size || file.size > 2 * 1024 * 1024) throw new Error('Ảnh cần có dung lượng tối đa 2 MB. Hãy cắt vùng cần dịch hoặc giảm dung lượng rồi gửi lại.');
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Không đọc được file ảnh. Hãy chọn lại ảnh.'));
            reader.onabort = () => reject(new Error('Đã dừng đọc file ảnh.'));
            reader.readAsDataURL(file);
        });
        const element = await decodeLocalImage(dataUrl);
        if (!element.naturalWidth || !element.naturalHeight || element.naturalWidth * element.naturalHeight > 16000000
            || element.naturalWidth > 10000 || element.naturalHeight > 10000) {
            throw new Error('Ảnh quá lớn để hiển thị an toàn. Hãy cắt/thu nhỏ ảnh còn tối đa 16 triệu điểm ảnh và 10.000 px mỗi cạnh.');
        }
        image = { dataUrl, base64Data: dataUrl.split(',')[1], mimeType: file.type, element };
    } catch (error) {
        imageStatus(mode, error.message);
    } finally {
        readingImages[mode] = false;
    }
    if (image) {
        if (mode === 'quest') processQuestImage(image);
        else processFullImage(image);
    }
}

function setFullStatus(message, state, canRetry = true) {
    lastFullStatus = [message, state, canRetry];
    document.getElementById('fullStatus').hidden = false;
    const text = document.getElementById('fullStatusText');
    text.textContent = message;
    text.className = state === 'error' ? 'text-red-400' : state === 'success' ? 'text-green-400' : 'text-gray-200';
    const busy = !!fullRun;
    document.getElementById('retryFullButton').textContent = `Thử lại bằng ${AI_PROVIDERS[aiProvider].name}`;
    document.getElementById('retryFullButton').hidden = busy || !canRetry || !lastFullImage;
    document.getElementById('cancelFullButton').hidden = !busy;
    const other = otherAiProvider(aiProvider);
    const button = document.getElementById('otherFullButton');
    button.hidden = busy || !canRetry || !lastFullImage || !getAiKey(other);
    button.textContent = `Thử ảnh này bằng ${AI_PROVIDERS[other].name}`;
}
function retryFullImage() { if (lastFullImage && !fullRun) processFullImage(lastFullImage); }
function retryFullOtherProvider() {
    if (lastFullImage && !fullRun) processFullImage(lastFullImage, otherAiProvider(aiProvider));
}
function cancelFullTranslation() {
    if (!fullRun) return;
    fullRun.controller.abort();
    fullRun = null;
    setFullStatus('Đã hủy xử lý; yêu cầu đã gửi vẫn có thể tính vào hạn mức của nhà cung cấp.', 'info');
}
function showFullImage(translated) {
    fullShowingTranslation = translated && fullHasTranslation;
    document.getElementById('fullOriginal').hidden = fullShowingTranslation;
    document.getElementById('fullCanvas').hidden = !fullShowingTranslation;
    document.getElementById('fullOriginalButton').setAttribute('aria-pressed', String(!fullShowingTranslation));
    document.getElementById('fullTranslatedButton').setAttribute('aria-pressed', String(fullShowingTranslation));
}
function clearFullTranslation() {
    fullHasTranslation = false;
    document.getElementById('fullTranslatedButton').disabled = true;
    document.getElementById('downloadFullButton').disabled = true;
    document.getElementById('fullTextDetails').hidden = true;
    document.getElementById('fullTextList').replaceChildren();
    const canvas = document.getElementById('fullCanvas');
    canvas.width = 0;
    canvas.height = 0;
    showFullImage(false);
}
async function processFullImage(image, provider = aiProvider) {
    if (fullRun) return;
    lastFullImage = image;
    document.getElementById('fullOriginal').src = image.dataUrl;
    document.getElementById('fullPreview').hidden = false;
    clearFullTranslation();
    const run = { controller: new AbortController(), provider };
    fullRun = run;
    setFullStatus(`Đang dịch toàn ảnh bằng ${AI_PROVIDERS[provider].name}…`, 'info', false);
    try {
        const result = await requestAiTranslation('full', image, provider, {
            signal: run.controller.signal,
            onProgress: message => { if (fullRun === run) setFullStatus(message, 'info', false); }
        });
        if (fullRun !== run) return;
        if (!result.items.length) {
            fullRun = null;
            setFullStatus('AI không tìm thấy chữ đọc được trong ảnh. Hãy thử ảnh rõ hơn.', 'info');
            return;
        }
        const warnings = renderTranslatedImage(image.element, result.items);
        renderFullText(result.items);
        fullRun = null;
        fullHasTranslation = true;
        document.getElementById('fullTranslatedButton').disabled = false;
        document.getElementById('downloadFullButton').disabled = false;
        showFullImage(true);
        setFullStatus(`Đã dựng ${result.items.length} vùng dịch bằng ${AI_PROVIDERS[provider].name}. Đối chiếu ảnh gốc vì vị trí có thể sai.${warnings ? ` Có ${warnings} vùng chữ quá dài/nhỏ; xem bản dịch chữ bên dưới để đọc đầy đủ.` : ''}`, 'success', false);
    } catch (error) {
        if (fullRun !== run) return;
        fullRun = null;
        clearFullTranslation();
        setFullStatus(error instanceof AiRequestError ? error.message : 'Không dựng được ảnh dịch. Hãy thử ảnh nhỏ hơn hoặc mở Yandex.', 'error');
    }
}

function wrapCanvasText(context, text, width) {
    const lines = [];
    for (const paragraph of text.split(/\r?\n/)) {
        let line = '';
        for (const word of paragraph.split(/\s+/).filter(Boolean)) {
            const candidate = line ? `${line} ${word}` : word;
            if (context.measureText(candidate).width <= width) { line = candidate; continue; }
            if (line) { lines.push(line); line = ''; }
            for (const char of word) {
                if (line && context.measureText(line + char).width > width) { lines.push(line); line = ''; }
                line += char;
            }
        }
        lines.push(line);
    }
    return lines;
}
function renderTranslatedImage(image, blocks) {
    const buffer = document.createElement('canvas');
    buffer.width = image.naturalWidth;
    buffer.height = image.naturalHeight;
    const context = buffer.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.drawImage(image, 0, 0);
    let warnings = 0;
    for (const block of blocks) {
        const [top, left, bottom, right] = block.box;
        const x = Math.floor(left * buffer.width / 1000);
        const y = Math.floor(top * buffer.height / 1000);
        const width = Math.max(1, Math.ceil(right * buffer.width / 1000) - x);
        const height = Math.max(1, Math.ceil(bottom * buffer.height / 1000) - y);
        const padding = Math.min(5, Math.floor(width / 10), Math.floor(height / 10));
        const innerWidth = Math.max(1, width - padding * 2);
        const innerHeight = Math.max(1, height - padding * 2);
        const maximum = Math.max(1, Math.min(48, Math.floor(innerHeight * .8)));
        const minimum = Math.min(8, maximum);
        let size = maximum;
        let lines;
        for (; size >= minimum; size--) {
            context.font = `600 ${size}px Arial, sans-serif`;
            lines = wrapCanvasText(context, block.translated, innerWidth);
            if (lines.length * size * 1.2 <= innerHeight || size === minimum) break;
        }
        const lineHeight = size * 1.2;
        const maxLines = Math.max(1, Math.floor(innerHeight / lineHeight));
        if (lines.length > maxLines || size < 8 || lines.some(line => context.measureText(line).width > innerWidth)) warnings++;
        context.save();
        context.beginPath();
        context.rect(x, y, width, height);
        context.clip();
        context.fillStyle = '#111827';
        context.fillRect(x, y, width, height);
        context.fillStyle = '#f9fafb';
        context.textBaseline = 'top';
        lines.slice(0, maxLines).forEach((line, index) => context.fillText(line, x + padding, y + padding + index * lineHeight));
        context.restore();
    }
    const output = document.getElementById('fullCanvas');
    output.width = buffer.width;
    output.height = buffer.height;
    const outputContext = output.getContext('2d');
    if (!outputContext) throw new Error('Canvas unavailable');
    outputContext.drawImage(buffer, 0, 0);
    return warnings;
}
function renderFullText(blocks) {
    const list = document.getElementById('fullTextList');
    list.replaceChildren();
    blocks.forEach((block, index) => {
        const section = document.createElement('div');
        section.className = 'p-3 rounded bg-gray-800 border border-gray-700';
        const original = document.createElement('p');
        original.className = 'text-sm text-gray-400 whitespace-pre-wrap break-words';
        original.textContent = `${index + 1}. ${block.original}`;
        const translated = document.createElement('p');
        translated.className = 'text-green-400 whitespace-pre-wrap break-words';
        translated.textContent = block.translated;
        section.append(original, translated);
        list.append(section);
    });
    document.getElementById('fullTextDetails').hidden = false;
}
function downloadFullImage() {
    if (!fullHasTranslation) return;
    try {
        document.getElementById('fullCanvas').toBlob(blob => {
            if (!blob) { setFullStatus('Không xuất được PNG. Hãy thử ảnh nhỏ hơn.', 'error', false); return; }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Delta_Translated.png';
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
    } catch { setFullStatus('Không xuất được PNG. Hãy thử ảnh nhỏ hơn.', 'error', false); }
}
function openImageViewer(mode) {
    const image = mode === 'quest' ? lastQuestImage : lastFullImage;
    if (!image) return;
    try {
        const translated = mode === 'full' && fullShowingTranslation;
        const viewer = document.getElementById('viewerImage');
        viewer.src = translated ? document.getElementById('fullCanvas').toDataURL('image/png') : image.dataUrl;
        viewer.classList.remove('natural-size');
        document.getElementById('imageViewerTitle').textContent = translated ? 'Ảnh dịch — phóng to' : 'Ảnh gốc — phóng to';
        document.getElementById('imageViewer').showModal();
    } catch { imageStatus(mode, 'Không mở được ảnh phóng to. Hãy thử ảnh nhỏ hơn.', 'error'); }
}
document.getElementById('imageViewer').addEventListener('close', () => document.getElementById('viewerImage').removeAttribute('src'));
