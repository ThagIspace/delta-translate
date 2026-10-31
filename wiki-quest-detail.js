// Dựng nội dung quest dùng chung; không quản lý màn hình hoặc dữ liệu lưu.
const WikiQuestDetail = (() => {
    function render(q, quests, parents) {
        const related = [...parents(q).map(task => [task, '← Tiền đề']), ...quests.filter(task => (task.parentIds || []).includes(q.id)).map(task => [task, 'Tiếp theo →'])];
        const links = related.map(([task, label]) => `<button type="button" class="wiki-related-quest" data-wiki-go="${escapeHtml(task.id)}"><small>${label}</small><strong>${escapeHtml(task.vi)}</strong><span lang="zh">${escapeHtml(task.zh)}</span></button>`).join('');
        return `<div class="wiki-mission-heading"><span class="wiki-mission-label">${escapeHtml(q.type)}</span><p class="wiki-detail-en" lang="zh">${escapeHtml(q.zh)}</p><h3 id="wikiDetailHeading" class="text-xl font-bold">${escapeHtml(q.vi)}</h3></div>
            <div class="wiki-detail-meta"><span>◇ Zero Dam</span><span>${escapeHtml(q.department)}</span><span>Level: ${q.level ?? 'Nguồn không ghi'}</span></div>
            <div class="wiki-detail-actions"><button type="button" class="tool-btn" data-wiki-tree="${escapeHtml(q.id)}">◇ Xem quest này trong cây</button></div>
            <h4 class="wiki-section-title">Mục tiêu nhiệm vụ</h4><ol class="wiki-objectives">${q.objectives.map(([zh, vi]) => `<li><p lang="zh">${escapeHtml(zh)}</p><p class="text-green-200 mt-2">${escapeHtml(vi)}</p></li>`).join('')}</ol>
            <div class="wiki-quest-relations"><p><strong>Tiền đề:</strong> ${escapeHtml(q.previous)}</p><p><strong>Tiếp theo:</strong> ${escapeHtml(q.next)}</p></div>
            ${links ? `<div class="wiki-related-grid" aria-label="Nhiệm vụ liên quan đã có dữ liệu">${links}</div>` : ''}
            <p class="wiki-related-help">Chỉ chuyển được tới nhiệm vụ đã có trong bộ 39 quest; các tiền đề bên ngoài vẫn giữ dạng ghi chú.</p>
            <h4 class="wiki-section-title">Phần thưởng</h4><ul class="wiki-reward-grid">${q.rewards.split(' · ').filter(Boolean).map(reward => `<li>${escapeHtml(reward)}</li>`).join('')}</ul>
            <details class="wiki-data-info"><summary>Nguồn và lưu ý bản dịch</summary>
            ${q.note ? `<p>${escapeHtml(q.note)}</p>` : ''}
            <p>${escapeHtml(q.sourceVersion)} · Đối chiếu nguồn: ${escapeHtml(q.reviewedOn)}. Mục tiêu song ngữ được tóm tắt; chưa đối chiếu mọi khác biệt giữa các phiên bản. Thứ tự cây không phải level mở khóa.</p>
            <a class="inline-block text-blue-300 underline mt-3" href="${escapeHtml(q.sourceUrl)}" target="_blank" rel="noopener noreferrer">Nguồn Leyao ↗ — mở 部门任务, tìm ${escapeHtml(q.zh)}</a></details>`;
    }
    return { render };
})();
