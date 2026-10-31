// Chỉ là dữ liệu tham khảo. Không suy level từ step hoặc quan hệ trước/sau.
const WIKI_QUEST_DATA = [
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
    ].map(quest => ({ ...quest, level: null, targetVerified: false, sourceVersion: 'Fandom tiếng Anh; chưa đối chiếu PC Trung Quốc', reviewedOn: '2026-10-31' }));
