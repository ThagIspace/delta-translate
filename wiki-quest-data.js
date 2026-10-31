// 39/78 quest Zero Dam. Tóm tắt điều kiện, không sao chép cốt truyện.
const WIKI_QUEST_DATA = [
  {
    "id": "leyao_144",
    "en": "防护装备",
    "zh": "防护装备",
    "vi": "Trang bị bảo hộ",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Hỗn hợp",
    "previous": "Không có tiền đề trong nguồn",
    "next": "建造者：基础构建-1 / 短兵相接1 / 猎甲者 / 头部防护",
    "parentIds": [],
    "objectives": [
      [
        "撤离带出绿色以上护甲1件。",
        "Rút lui thành công và mang ra tổng cộng 1 áo giáp phẩm chất xanh lá trở lên."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2100 · TG-H防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_76",
    "en": "英雄启程",
    "zh": "英雄启程",
    "vi": "Khởi hành của người hùng",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Hỗn hợp",
    "previous": "Không có tiền đề trong nguồn",
    "next": "医疗保障",
    "parentIds": [],
    "objectives": [
      [
        "使用药品2次，成功撤离1次。",
        "Dùng vật phẩm tiêu hao thuộc nhóm thuốc 2 lần; rút lui thành công 1 lần."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1200 · 野战急救包 x 2 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_233",
    "en": "归来",
    "zh": "归来",
    "vi": "Trở về",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "首战",
    "next": "高耸入云1 / 电站搜寻 / 新的开端 / 好戏开幕",
    "parentIds": [],
    "objectives": [
      [
        "单局收益达到30000哈夫币并撤离1次；击败5名士兵。",
        "Rút lui 1 lần với thu nhập một trận đạt 30.000 Haff Coins; hạ 5 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1300 · M870霰弹枪 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 首战. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_143",
    "en": "头部防护",
    "zh": "头部防护",
    "vi": "Bảo vệ đầu",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Hỗn hợp",
    "previous": "防护装备",
    "next": "战略目标 / 攻守兼备",
    "parentIds": [
      "leyao_144"
    ],
    "objectives": [
      [
        "戴绿色以上头盔击败5名士兵。",
        "Đội mũ xanh lá trở lên và hạ 5 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2700 · TG-H防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_292",
    "en": "游客中心",
    "zh": "游客中心",
    "vi": "Trung tâm du khách",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "收藏家:现金为王-1",
    "next": "监控设施",
    "parentIds": [],
    "objectives": [
      [
        "带出游客中心的阿萨拉娱乐月刊；单局完成。",
        "Nhặt tạp chí giải trí Ahsarah tại trung tâm du khách rồi mang ra khi rút lui. Mục tiêu phải hoàn tất trong một trận, nếu không sẽ đặt lại."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2900 · TG-H防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 收藏家:现金为王-1. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_153",
    "en": "好戏开幕",
    "zh": "好戏开幕",
    "vi": "Màn mở đầu",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Điều tra",
    "previous": "归来",
    "next": "强袭准备 / 一锤定音",
    "parentIds": [
      "leyao_233"
    ],
    "objectives": [
      [
        "调查管道和军营指定地点。",
        "Điều tra khu vực đường ống và địa điểm chỉ định trong doanh trại."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1300 · 5.56x45mm M855 x 60 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_90",
    "en": "战略目标",
    "zh": "战略目标",
    "vi": "Mục tiêu chiến lược",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "头部防护",
    "next": "主楼风云 / 电站调查",
    "parentIds": [
      "leyao_143"
    ],
    "objectives": [
      [
        "带出电站旁哨站的行政楼布局图。",
        "Lấy bản bố trí tòa hành chính trong nhà chốt gác cạnh trạm điện rồi mang ra khi rút lui."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2800 · DAS 防弹头盔 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_5",
    "en": "紧急治疗",
    "zh": "紧急治疗",
    "vi": "Điều trị khẩn cấp",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Hỗn hợp",
    "previous": "医疗保障",
    "next": "以弱胜强",
    "parentIds": [],
    "objectives": [
      [
        "支援专家用激素枪自疗50点；击败6名士兵。",
        "Chọn chuyên gia hỗ trợ, dùng súng kích thích để tự hồi tổng cộng 50 máu thực tế; hạ 6 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1300 · 瓶装抗生素 x 5 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 医疗保障. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_290",
    "en": "监控设施",
    "zh": "监控设施",
    "vi": "Thiết bị giám sát",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "游客中心",
    "next": "坚壁清野 / 贵宾空间",
    "parentIds": [
      "leyao_292"
    ],
    "objectives": [
      [
        "带出行政楼的监控手机和洗手间摄像头。",
        "Lấy điện thoại giám sát ở vị trí chỉ định trong tòa hành chính và camera trong nhà vệ sinh; mang cả hai ra khi rút lui."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 3400 · DAS 防弹头盔 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_229",
    "en": "强袭准备",
    "zh": "强袭准备",
    "vi": "Chuẩn bị đột kích",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "好戏开幕",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_153"
    ],
    "objectives": [
      [
        "击败1名阿萨拉盾兵；完成1次清理目标区域敌人行动。",
        "Hạ 1 lính khiên Ahsarah; hoàn thành 1 hoạt động dọn sạch địch trong khu vực mục tiêu."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 850 · 5.45x39mm BT x 60 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_145",
    "en": "主楼风云",
    "zh": "主楼风云",
    "vi": "Biến động tòa nhà chính",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Điều tra",
    "previous": "战略目标",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_90"
    ],
    "objectives": [
      [
        "调查行政楼，击败5名士兵，收集并提交2件便携胸包。",
        "Điều tra phòng chỉ định trong tòa hành chính; hạ 5 lính trong khu hành chính; thu thập và nộp 2 túi đeo ngực cỡ nhỏ (便携胸包)."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1600 · TG-H防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_146",
    "en": "电站调查",
    "zh": "电站调查",
    "vi": "Điều tra trạm điện",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Điều tra",
    "previous": "战略目标",
    "next": "情报收集",
    "parentIds": [
      "leyao_90"
    ],
    "objectives": [
      [
        "调查主变电站；自备间谍笔放入电厂二楼指定房间。",
        "Điều tra vị trí chỉ định ở trạm biến điện chính; đặt bút gián điệp trong phòng chỉ định ở tầng 2 nhà máy điện. Cần tự chuẩn bị bút."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2400 · 射手战术背心 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_288",
    "en": "坚壁清野",
    "zh": "坚壁清野",
    "vi": "Tiêu thổ",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Hỗn hợp",
    "previous": "监控设施",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_290"
    ],
    "objectives": [
      [
        "击败5名士兵。",
        "Hạ 5 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1850 · 标准护甲维修包 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_289",
    "en": "贵宾空间",
    "zh": "贵宾空间",
    "vi": "Không gian VIP",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Điều tra",
    "previous": "监控设施",
    "next": "电站勘测 / 蓝调协奏 / 取而代之 / 主变电站",
    "parentIds": [
      "leyao_290"
    ],
    "objectives": [
      [
        "调查游客中心指定房间。",
        "Điều tra phòng chỉ định tại trung tâm du khách."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2800 · TG-H防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_228",
    "en": "基础火力",
    "zh": "基础火力",
    "vi": "Hỏa lực cơ bản",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Điều tra",
    "previous": "一锤定音",
    "next": "经典风格 / 桥梁与陋居",
    "parentIds": [],
    "objectives": [
      [
        "调查主变电站；带出拾取的突击步枪和冲锋枪各1把。",
        "Điều tra vị trí chỉ định ở trạm biến điện chính; rút lui mang theo 1 súng trường tấn công nhặt trong trận và 1 súng tiểu liên nhặt trong trận."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 4200 · VSS射手步枪 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 一锤定音. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_119",
    "en": "情报收集",
    "zh": "情报收集",
    "vi": "Thu thập tình báo",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Hỗn hợp",
    "previous": "电站调查",
    "next": "平安归来 / 主楼勘察",
    "parentIds": [
      "leyao_146"
    ],
    "objectives": [
      [
        "完成1次高价值目标行动；穿蓝色以上护甲在20米内击败2名特殊兵种。",
        "Hoàn thành 1 hoạt động tiêu diệt mục tiêu giá trị cao; mặc giáp xanh dương trở lên và hạ 2 lính đặc biệt trong 20 m. Bao gồm lính khiên, bắn tỉa, tên lửa, súng máy hoặc cận vệ trùm."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 3000 · MC201 头盔 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_71",
    "en": "秘密回收",
    "zh": "秘密回收",
    "vi": "Thu hồi bí mật",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "以弱胜强",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [],
    "objectives": [
      [
        "带出军营一楼的徽记继电器1个；单局完成。",
        "Lấy rơ-le có huy hiệu trên kệ ở tầng 1 doanh trại rồi mang 1 chiếc ra khi rút lui. Phải hoàn tất trong một trận, nếu không sẽ đặt lại."
      ]
    ],
    "rewards": "Uy tín department x 3 · EXP x 850 · 战地医疗箱 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 以弱胜强. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_73",
    "en": "军医使命",
    "zh": "军医使命",
    "vi": "Sứ mệnh quân y",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Hỗn hợp",
    "previous": "以弱胜强",
    "next": "知己知彼",
    "parentIds": [],
    "objectives": [
      [
        "带出绿色以上医疗收集物3件；交易行上架价格超过5000的物品3件。",
        "Rút lui mang ra tổng cộng 3 vật phẩm sưu tầm nhóm y tế xanh lá trở lên; đăng bán thành công 3 vật phẩm có giá trên 5.000 trên chợ."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1600 · DEK野战手术包 x 2 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 以弱胜强. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_329",
    "en": "主变电站",
    "zh": "主变电站",
    "vi": "Trạm biến điện chính",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Điều tra",
    "previous": "贵宾空间",
    "next": "骇客行动1",
    "parentIds": [
      "leyao_289"
    ],
    "objectives": [
      [
        "5分钟内调查电站；带出主变电站正门的强化火药。",
        "Điều tra vị trí chỉ định ở trạm điện trong 5 phút đầu; lấy thuốc súng tăng cường ở cổng chính trạm biến điện chính rồi mang ra khi rút lui."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 3400 · DAS 防弹头盔 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_226",
    "en": "经典风格",
    "zh": "经典风格",
    "vi": "Phong cách cổ điển",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "基础火力",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_228"
    ],
    "objectives": [
      [
        "使用CAR-15击败5名士兵。",
        "Dùng CAR-15 hạ 5 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 950 · 9x39mm SP6 x 60 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_227",
    "en": "桥梁与陋居",
    "zh": "桥梁与陋居",
    "vi": "Cầu và lán tạm",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Điều tra",
    "previous": "基础火力",
    "next": "一点突破",
    "parentIds": [
      "leyao_228"
    ],
    "objectives": [
      [
        "调查河谷管道和小屋。",
        "Điều tra trước đường ống và trong căn nhà ở khu vực thung lũng sông."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2100 · G18 x 1",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_117",
    "en": "平安归来",
    "zh": "平安归来",
    "vi": "Trở về an toàn",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Hỗn hợp",
    "previous": "情报收集",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_119"
    ],
    "objectives": [
      [
        "将2个阿萨拉士兵箱带到坝内指定点；击败5名士兵。",
        "Mang 2 thùng lính Ahsarah đến địa điểm chỉ định bên trong khu đập; hạ 5 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1450 · DAS 防弹头盔 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_118",
    "en": "主楼勘察",
    "zh": "主楼勘察",
    "vi": "Khảo sát tòa nhà chính",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Điều tra",
    "previous": "情报收集",
    "next": "先驱遗产 / 护甲搜集",
    "parentIds": [
      "leyao_119"
    ],
    "objectives": [
      [
        "调查行政楼西楼和集装箱区；侦察专家用侦察箭完成2次侦察。",
        "Điều tra điểm chỉ định ở cánh tây tòa hành chính và khu container; chọn chuyên gia trinh sát, dùng mũi tên trinh sát thành công 2 lần."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 3100 · Hvk快拆防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_72",
    "en": "知己知彼",
    "zh": "知己知彼",
    "vi": "Biết mình biết địch",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "军医使命",
    "next": "有内鬼",
    "parentIds": [
      "leyao_73"
    ],
    "objectives": [
      [
        "带出游客中心办公室的强化酒精。",
        "Lấy cồn tăng cường trong văn phòng trung tâm du khách và mang ra khi rút lui."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1800 · DVE止疼片 x 2 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_326",
    "en": "骇客行动1",
    "zh": "骇客行动1",
    "vi": "Chiến dịch hacker 1",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Điều tra",
    "previous": "主变电站",
    "next": "大坝扫除",
    "parentIds": [
      "leyao_329"
    ],
    "objectives": [
      [
        "调查主变电站指定点及一楼服务器；撤离1次。",
        "Điều tra điểm chỉ định và máy chủ tầng 1 ở trạm biến điện chính; rút lui 1 lần."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2900 · 射手战术背心 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_225",
    "en": "一点突破",
    "zh": "一点突破",
    "vi": "Đột phá một điểm",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "桥梁与陋居",
    "next": "手工艺品 / 公平交易",
    "parentIds": [
      "leyao_227"
    ],
    "objectives": [
      [
        "使用AKS-74U在20米内击败5名士兵。",
        "Dùng AKS-74U hạ 5 lính địch trong khoảng cách 20 m."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2200 · 9x19mm PBP x 90 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_115",
    "en": "先驱遗产",
    "zh": "先驱遗产",
    "vi": "Di sản người tiên phong",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "主楼勘察",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_118"
    ],
    "objectives": [
      [
        "带出行政楼集装箱区的特殊头盔套件，并完成高价值目标行动。",
        "Lấy bộ phụ kiện mũ đặc biệt trong khu container tòa hành chính; hoàn thành hoạt động tiêu diệt mục tiêu giá trị cao; mang bộ phụ kiện ra khi rút lui."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1800 · TG-H防弹衣 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_1",
    "en": "有内鬼",
    "zh": "有内鬼",
    "vi": "Có nội gián",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "知己知彼",
    "next": "神奇药剂",
    "parentIds": [
      "leyao_72"
    ],
    "objectives": [
      [
        "准备水泥厂宿舍201通行条件；取徽记抗炎药放到游客中心草丛。",
        "Lấy thuốc kháng viêm có huy hiệu ở vị trí chỉ định trong nhà máy xi măng; đặt thuốc vào bụi cây trung tâm du khách. Cần chuẩn bị quyền vào phòng ký túc xá nhà máy xi măng 201."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2400 · 高级头盔维修组合 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_325",
    "en": "大坝扫除",
    "zh": "大坝扫除",
    "vi": "Càn quét đập",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Hỗn hợp",
    "previous": "骇客行动1",
    "next": "拉闸行动",
    "parentIds": [
      "leyao_326"
    ],
    "objectives": [
      [
        "击败8名士兵。",
        "Hạ 8 lính địch."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2900 · MC201 头盔 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_217",
    "en": "公平交易",
    "zh": "公平交易",
    "vi": "Trao đổi công bằng",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "一点突破",
    "next": "精准打击 / 迂回战术",
    "parentIds": [
      "leyao_225"
    ],
    "objectives": [
      [
        "击败2名特殊兵种；完成1次高价值目标行动。",
        "Hạ 2 lính đặc biệt bất kỳ: lính khiên, bắn tỉa, tên lửa, súng máy hoặc cận vệ trùm; hoàn thành 1 hoạt động tiêu diệt mục tiêu giá trị cao."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 4600 · 9x39mm SP6 x 60 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_114",
    "en": "三角力量",
    "zh": "三角力量",
    "vi": "Sức mạnh Delta",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Hỗn hợp",
    "previous": "护甲搜集",
    "next": "清洁工作",
    "parentIds": [],
    "objectives": [
      [
        "收集蓝色以上头盔和护甲各1件；后勤军需处购买或兑换紫色以上护甲。",
        "Thu thập 1 mũ và 1 giáp xanh dương trở lên; mua hoặc đổi 1 giáp tím trở lên tại quân nhu bộ phận hậu cần."
      ]
    ],
    "rewards": "Uy tín department x 2 · EXP x 3300 · Hvk快拆防弹衣 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 护甲搜集. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_324",
    "en": "拉闸行动",
    "zh": "拉闸行动",
    "vi": "Chiến dịch kéo cầu dao",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Hỗn hợp",
    "previous": "大坝扫除",
    "next": "档案搜索 / 骇客行动2",
    "parentIds": [
      "leyao_325"
    ],
    "objectives": [
      [
        "手动开启工业电梯撤离点1次；撤离1次。",
        "Tự kích hoạt điểm rút lui thang máy công nghiệp 1 lần bằng cầu dao ở tòa hành chính hoặc trạm điện; rút lui 1 lần."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 3000 · Hvk快拆防弹衣 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_214",
    "en": "精准打击",
    "zh": "精准打击",
    "vi": "Tấn công chính xác",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "公平交易",
    "next": "极限追猎",
    "parentIds": [
      "leyao_217"
    ],
    "objectives": [
      [
        "完成清理目标区域敌人及破坏物资室铁门行动各1次。",
        "Hoàn thành 1 hoạt động dọn sạch địch trong khu vực mục tiêu và 1 hoạt động phá cửa sắt phòng vật tư."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1250 · 7.62x51mm M80 x 60 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_215",
    "en": "迂回战术",
    "zh": "迂回战术",
    "vi": "Chiến thuật vòng sườn",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Điều tra",
    "previous": "公平交易",
    "next": "锐箭在弦",
    "parentIds": [
      "leyao_217"
    ],
    "objectives": [
      [
        "调查水泥厂加工室；在水泥厂击败3名士兵。",
        "Điều tra phòng gia công nhà máy xi măng; hạ 3 lính trong phạm vi nhà máy."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2400 · SCAR-H战斗步枪 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_113",
    "en": "清洁工作",
    "zh": "清洁工作",
    "vi": "Công việc vệ sinh",
    "map": "Zero Dam",
    "department": "Hậu cần · 后勤部门",
    "type": "Hỗn hợp",
    "previous": "三角力量",
    "next": "楼宇扫荡",
    "parentIds": [
      "leyao_114"
    ],
    "objectives": [
      [
        "5分钟内取行政楼二楼厕所的特殊香皂并放至停车场仓库；单局完成。",
        "Lấy xà phòng đặc biệt trong nhà vệ sinh tầng 2 tòa hành chính trong 5 phút đầu; đặt tại kho bãi đỗ xe. Phải hoàn tất trong một trận, nếu không sẽ đặt lại."
      ]
    ],
    "rewards": "Uy tín department x 2 · EXP x 3300 · H07 战术头盔 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_69",
    "en": "隐秘之路",
    "zh": "隐秘之路",
    "vi": "Con đường bí mật",
    "map": "Zero Dam",
    "department": "Y tế · 医疗部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "神奇药剂",
    "next": "水泥厂解密",
    "parentIds": [],
    "objectives": [
      [
        "带出军营秘密通道的化学废物资料；单局完成。",
        "Lấy tài liệu chất thải hóa học trong đường hầm bí mật ở doanh trại và mang ra khi rút lui. Phải hoàn tất trong một trận, nếu không sẽ đặt lại."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2100 · 精密头盔维修包 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo. Tiền đề nằm ngoài 39 quest đang hiển thị: 神奇药剂. Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_322",
    "en": "档案搜索",
    "zh": "档案搜索",
    "vi": "Tìm kiếm hồ sơ",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Điều tra",
    "previous": "拉闸行动",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_324"
    ],
    "objectives": [
      [
        "调查行政楼东楼档案室、东楼102室及西楼服务器室。",
        "Điều tra phòng lưu trữ cánh đông, phòng 102 cánh đông và phòng máy chủ cánh tây tòa hành chính."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1500 · 标准护甲维修包 x 1 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_323",
    "en": "骇客行动2",
    "zh": "骇客行动2",
    "vi": "Chiến dịch hacker 2",
    "map": "Zero Dam",
    "department": "Nghiên cứu · 研发部门",
    "type": "Thu thập / giao vật phẩm",
    "previous": "拉闸行动",
    "next": "连锁战术 / 绝密突围",
    "parentIds": [
      "leyao_324"
    ],
    "objectives": [
      [
        "带出行政楼指定点的病毒闪存盘；单局完成。",
        "Lấy USB virus ở vị trí chỉ định trong tòa hành chính rồi mang ra khi rút lui. Phải hoàn tất trong một trận, nếu không sẽ đặt lại."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 3700 · H07 战术头盔 x 1 · Haff Coins x 30000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  },
  {
    "id": "leyao_199",
    "en": "极限追猎",
    "zh": "极限追猎",
    "vi": "Cuộc săn cực hạn",
    "map": "Zero Dam",
    "department": "Chiến đấu · 战斗部门",
    "type": "Hỗn hợp",
    "previous": "精准打击",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_214"
    ],
    "objectives": [
      [
        "在行政楼区域击败赛伊德1次。",
        "Hạ Saeed 1 lần trong khu vực tòa hành chính."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1750 · 7.62x54R LPS x 60 · Haff Coins x 10000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Tất cả mục tiêu ở Zero Dam; bản Việt là bản dịch tham khảo.  Tên phần thưởng chưa có bản Việt giữ nguyên tiếng Trung."
  }
];
