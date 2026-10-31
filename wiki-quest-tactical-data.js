// 11/32 quest Chiến thuật từ đầu chuỗi. Mọi map hoặc nộp đồ ngoài trận.
const WIKI_TACTICAL_QUEST_DATA = [
  {
    "id": "leyao_262",
    "en": "阿萨拉热线-内勤1",
    "zh": "阿萨拉热线-内勤1",
    "vi": "Đường dây Ahsarah · Nội cần 1",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "Không có tiền đề trong nguồn",
    "next": "阿萨拉热线-外勤1",
    "parentIds": [],
    "objectives": [
      [
        "提交AKS-74U，安装XRO/XR0快速反应瞄准镜。",
        "Nộp 1 AKS-74U gắn kính phản xạ phản ứng nhanh XRO/XR0 (快速反应瞄准镜)."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2100 · AKS-74U突击步枪 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  },
  {
    "id": "leyao_266",
    "en": "阿萨拉热线-外勤1",
    "zh": "阿萨拉热线-外勤1",
    "vi": "Đường dây Ahsarah · Thực địa 1",
    "map": "Any",
    "department": "Chiến thuật · 战术部门",
    "type": "Chiến đấu",
    "previous": "阿萨拉热线-内勤1",
    "next": "阿萨拉热线-内勤2 / 阿萨拉热线-外勤2",
    "parentIds": [
      "leyao_262"
    ],
    "objectives": [
      [
        "任意战区：用AKS-74U击败6名敌方士兵。",
        "Ở bất kỳ map Operations nào, dùng AKS-74U hạ 6 lính địch. Có thể thực hiện tại Zero Dam."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2100 · 5.45x39mm BT x 60 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Mọi map, bao gồm Zero Dam."
  },
  {
    "id": "leyao_263",
    "en": "阿萨拉热线-内勤2",
    "zh": "阿萨拉热线-内勤2",
    "vi": "Đường dây Ahsarah · Nội cần 2",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "阿萨拉热线-外勤1",
    "next": "阿萨拉热线-枪匠1",
    "parentIds": [
      "leyao_266"
    ],
    "objectives": [
      [
        "提交UZI，安装35发弹匣。",
        "Nộp 1 UZI gắn băng đạn 35 viên UZI (nguồn ghi UZ1 35发弹匣)."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2400 · UZI冲锋枪 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  },
  {
    "id": "leyao_265",
    "en": "阿萨拉热线-外勤2",
    "zh": "阿萨拉热线-外勤2",
    "vi": "Đường dây Ahsarah · Thực địa 2",
    "map": "Any",
    "department": "Chiến thuật · 战术部门",
    "type": "Chiến đấu",
    "previous": "阿萨拉热线-外勤1",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_266"
    ],
    "objectives": [
      [
        "任意战区：用UZI在25米内击败8名敌方士兵。",
        "Ở bất kỳ map Operations nào, dùng UZI hạ 8 lính địch trong 25 m. Có thể thực hiện tại Zero Dam."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1200 · 9x19mm RIP x 60 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Mọi map, bao gồm Zero Dam."
  },
  {
    "id": "leyao_264",
    "en": "阿萨拉热线-枪匠1",
    "zh": "阿萨拉热线-枪匠1",
    "vi": "Đường dây Ahsarah · Thợ súng 1",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "阿萨拉热线-内勤2",
    "next": "阿萨拉热线-内勤3",
    "parentIds": [
      "leyao_263"
    ],
    "objectives": [
      [
        "提交SG552：后座力控制≥65，操控速度≥60。",
        "Nộp 1 SG552 đã cải trang đạt kiểm soát giật ≥65 và tốc độ thao tác ≥60. Nguồn không yêu cầu chỉ số khác."
      ]
    ],
    "rewards": "Uy tín department x 2 · EXP x 2600 · 5.56x45mm M855A1 x 120 · Haff Coins x 50000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  },
  {
    "id": "leyao_261",
    "en": "阿萨拉热线-内勤3",
    "zh": "阿萨拉热线-内勤3",
    "vi": "Đường dây Ahsarah · Nội cần 3",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "阿萨拉热线-枪匠1",
    "next": "阿萨拉热线-外勤3 / 阿萨拉热线-枪匠2 / 阿萨拉热线-内勤4",
    "parentIds": [
      "leyao_264"
    ],
    "objectives": [
      [
        "提交MP5：实用垂直握把、MP5战术枪管组合、XRO/XR0快速反应瞄准镜、实用消音器。",
        "Nộp 1 MP5 gắn 4 phụ kiện: tay cầm dọc thực dụng (实用垂直握把), bộ nòng chiến thuật MP5 (MP5战术枪管组合), kính XRO/XR0 phản ứng nhanh và giảm thanh thực dụng (实用消音器)."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 2600 · MP5冲锋枪 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  },
  {
    "id": "leyao_258",
    "en": "阿萨拉热线-外勤3",
    "zh": "阿萨拉热线-外勤3",
    "vi": "Đường dây Ahsarah · Thực địa 3",
    "map": "Any",
    "department": "Chiến thuật · 战术部门",
    "type": "Chiến đấu",
    "previous": "阿萨拉热线-内勤3",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_261"
    ],
    "objectives": [
      [
        "任意战区：用MP5击败3名敌方特战干员。",
        "Ở bất kỳ map Operations nào, dùng MP5 hạ 3 đặc nhiệm người chơi đối phương. Có thể thực hiện tại Zero Dam."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1550 · M1014霰弹枪 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Mọi map, bao gồm Zero Dam."
  },
  {
    "id": "leyao_259",
    "en": "阿萨拉热线-枪匠2",
    "zh": "阿萨拉热线-枪匠2",
    "vi": "Đường dây Ahsarah · Thợ súng 2",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "阿萨拉热线-内勤3",
    "next": "阿萨拉热线-枪匠3",
    "parentIds": [
      "leyao_261"
    ],
    "objectives": [
      [
        "提交SMG-45：后座力控制≥65，操控速度≥60，消音和任意瞄准镜。",
        "Nộp 1 SMG-45 đạt kiểm soát giật ≥65, tốc độ thao tác ≥60, có hiệu ứng giảm thanh và kính ngắm bất kỳ."
      ]
    ],
    "rewards": "Uy tín department x 2 · EXP x 2900 · 9x19mm PBP x 60 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  },
  {
    "id": "leyao_260",
    "en": "阿萨拉热线-内勤4",
    "zh": "阿萨拉热线-内勤4",
    "vi": "Đường dây Ahsarah · Nội cần 4",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "阿萨拉热线-内勤3",
    "next": "阿萨拉热线-外勤4 / 阿萨拉热线-内勤7",
    "parentIds": [
      "leyao_261"
    ],
    "objectives": [
      [
        "提交M1014：导轨护木、竞赛阻手器、展开的伸缩托、反射式瞄准镜、DBAL-X2紫色激光。",
        "Nộp 1 M1014 gắn 5 phụ kiện: ốp nòng ray M1014 (M1014导轨护木), chặn tay thi đấu (竞赛阻手器), báng rút 1014 ở trạng thái mở (1014伸缩托(展开)), kính phản xạ (反射式瞄准镜) và laser tím DBAL-X2 (DBAL-X2紫色激光镭指)."
      ]
    ],
    "rewards": "Uy tín department x 3 · EXP x 2900 · .338 Lap Mag AP x 10 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  },
  {
    "id": "leyao_255",
    "en": "阿萨拉热线-外勤4",
    "zh": "阿萨拉热线-外勤4",
    "vi": "Đường dây Ahsarah · Thực địa 4",
    "map": "Any",
    "department": "Chiến thuật · 战术部门",
    "type": "Chiến đấu",
    "previous": "阿萨拉热线-内勤4",
    "next": "Không có nhiệm vụ tiếp theo trong nguồn",
    "parentIds": [
      "leyao_260"
    ],
    "objectives": [
      [
        "任意战区：用M1014在20米内击败6名敌方士兵。",
        "Ở bất kỳ map Operations nào, dùng M1014 hạ 6 lính địch trong 20 m. Có thể thực hiện tại Zero Dam."
      ]
    ],
    "rewards": "Uy tín department x 1 · EXP x 1700 · 12 Gauge独头 AP-20 x 30 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Mọi map, bao gồm Zero Dam."
  },
  {
    "id": "leyao_256",
    "en": "阿萨拉热线-内勤7",
    "zh": "阿萨拉热线-内勤7",
    "vi": "Đường dây Ahsarah · Nội cần 7",
    "map": "Ngoài trận",
    "department": "Chiến thuật · 战术部门",
    "type": "Cải trang / nộp súng",
    "previous": "阿萨拉热线-内勤4",
    "next": "阿萨拉热线-外勤7 / 阿萨拉热线-内勤8",
    "parentIds": [
      "leyao_260"
    ],
    "objectives": [
      [
        "提交Mini-14：聚合物一体枪托、死寂消音器、战术垂直握把、30发弹匣、XCOG/XC0G突击3.5倍瞄准镜。",
        "Nộp 1 Mini-14 gắn 5 phụ kiện: báng polymer liền khối (Mini-14聚合物一体枪托), giảm thanh Dead Silence (死寂消音器), tay cầm dọc chiến thuật (战术垂直握把), băng 30 viên Mini-14 và kính XCOG/XC0G tấn công 3.5×."
      ]
    ],
    "rewards": "Uy tín department x 2 · EXP x 3100 · Mini-14射手步枪 x 1 · Haff Coins x 20000",
    "level": null,
    "source": "leyao",
    "sourceUrl": "https://leyao.fun/",
    "sourceVersion": "Leyao · dữ liệu department công khai; phiên bản game chưa ghi rõ",
    "sourceVerified": true,
    "reviewedOn": "2026-10-31",
    "note": "Nhiệm vụ cải trang/nộp súng ngoài trận, không yêu cầu vào map. Tên phụ kiện và yêu cầu theo nguồn; có khác biệt cách ghi XRO/XR0, XCOG/XC0G và lỗi gõ trong nguồn, cần đối chiếu tên hiển thị trong game."
  }
];
