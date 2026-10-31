# Delta Tools

Web HTML/CSS/JavaScript thuần cho Delta Force, không có backend, database hay bước build.

## Wiki Quest — Zero Dam, đợt 1 (31/10/2026)

Bản giao diện cơ bản theo bố cục game: mở Wiki Quest sẽ thấy 5 thẻ department,
chọn thẻ để vào màn danh sách bên trái và nội dung nhiệm vụ bên phải. Chiến thuật
chưa có quest phù hợp nên hiển thị chưa có dữ liệu, không giả điều kiện khóa.
Nút **Cây nhiệm vụ** mở sơ đồ hiện có; nút **Chọn department** quay về màn thẻ.
Trên điện thoại, chọn quest để mở chi tiết và dùng nút quay lại danh sách.
Ảnh nhân vật chưa bổ sung, hiện dùng biểu tượng và nền màu. Bản UI này chỉ rà
source/diff; tests/browser QA: **NOT RUN**. Kết quả QA 14 kiểm tra bên dưới thuộc
bản trước thay đổi bố cục này.

Đợt hoàn thiện tiếp theo thêm thanh chuyển nhanh 5 department, bảng tên/số quest
ở cột trái, khối mục tiêu song ngữ, các ô phần thưởng và mục nguồn/bản dịch có
thể mở rộng. Giữ vị trí cuộn danh sách khi chọn quest; chuyển department xóa bộ
lọc cũ và trở về danh sách trên mobile. Không thêm dữ liệu hoặc giả tiến độ game.
Đợt này chỉ rà source/diff; tests/browser QA: **NOT RUN**, CI: **NOT CHECKED**.

Phạm vi mới thay thế mốc level 35: nhập một nửa quest ghi rõ Zero Dam và không
bắt buộc bản đồ khác. Dữ liệu Leyao có 333 quest department; 80 mục nhắc Zero Dam,
loại 2 mục bắt buộc map khác còn 78. App nhập 39 mục đầu theo độ sâu chuỗi tiền đề
trong nguồn, rồi thứ tự department và thứ tự nguồn. Đây không phải 39 level đầu.
Phân bổ: Chiến đấu 11, Hậu cần 11, Y tế 7, Nghiên cứu 10. Chiến thuật không có mục
đáp ứng bộ lọc trên. Không gán quest mọi map thành quest riêng Zero Dam.

Nguồn: [Leyao · 部门任务](https://leyao.fun/), đọc ngày 31/10/2026. Tên Trung,
department, ID và quan hệ cha/con lấy từ nguồn. Tên Việt và mục tiêu song ngữ là
bản dịch/tóm tắt tham khảo; phần thưởng giữ tên vật phẩm Trung nếu chưa có bản Việt.
Không sao chép cốt truyện. Chưa đối chiếu toàn bộ điều kiện trong game hoặc xác
nhận phiên bản của nguồn; không mặc định bản Trung/Garena/quốc tế giống hệt nhau.
Level không có trong nguồn giữ null, không dùng `sort` hoặc độ sâu cây làm level.

Dữ liệu ở `wiki-quest-data.js`; `parentIds` chỉ nối tiền đề có trong bộ 39 mục.
Tiền đề bên ngoài chỉ ghi chú, không nối tắt sang tổ tiên xa hơn và không nhập
quest của map khác. Cây có kéo vùng trống, zoom, vừa màn hình, tô sáng nhánh trước,
lọc department/map/loại, tìm Trung–Việt và hộp chi tiết. Bố cục/fit tính lại theo
kết quả lọc. Còn 39 quest phù hợp chưa nhập, không tự coi đợt 1 là cây đầy đủ.

Kiểm tra đợt này: cú pháp 2 file JS PASS; 39 bản ghi duy nhất, tên Trung/parent ID
khớp dữ liệu nguồn, map Zero Dam và level null PASS. Browser QA 14 kiểm tra PASS
ở 1280 và 390 px: số mục, department, fit, modal, link nguồn, tìm kiếm Trung/Việt,
trạng thái rỗng và mobile. Không thấy lỗi console trong luồng đã chạy. Không gọi
AI thật. Kiểm chứng trong game: NOT RUN; CI: NOT CHECKED. Các ghi chú bên dưới là
lịch sử và không thay thế trạng thái hiện tại ở mục này.

## Trạng thái bàn giao — 30/10/2026

Tạm dừng phát triển tại bản xem thử Wiki Quest. Đã triển khai giao diện code súng
gọn với khung chi tiết, ghim và chuyển đến số thứ tự; menu có kéo thả, nút trái/phải,
tự lưu và khôi phục thứ tự. Khi bấm **Xong**, dòng trạng thái sắp xếp được xóa.
Wiki Quest hiện có 3 nhiệm vụ Zero Dam song ngữ, cây/danh sách và tìm kiếm.

Các thay đổi mới đã rà source/diff; tests/browser QA cho code súng, menu và Wiki
Quest: **NOT RUN**. CI: **NOT CHECKED**. Người dùng đã phản hồi menu sắp xếp dùng
được trước khi sửa dòng trạng thái; đây không phải kết quả QA toàn bộ.

Khi tiếp tục: ưu tiên QA local bằng dữ liệu giả, không gọi Gemini/Groq thật;
đối chiếu tên quest Trung với bản game người dùng chơi trước khi mở rộng dữ liệu.
Đây là đề xuất bước tiếp theo, chưa thực hiện. Wiki Item vẫn để sau cùng.

## Chạy local trên Windows

Yêu cầu Python 3 có lệnh `python`. Mở PowerShell trong thư mục project:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start-local.ps1
```

Mở <http://127.0.0.1:8765>. Giữ cửa sổ PowerShell mở, nhấn `Ctrl+C` để dừng.
Nếu cổng bận, thêm `-Port 8766` vào lệnh. Server chỉ lắng nghe trên máy local.
Dùng cùng trình duyệt, địa chỉ và cổng để thấy lại dữ liệu; `localhost` và
`127.0.0.1` có vùng lưu trữ riêng. Đây là server phát triển local.

## Điều hướng và hướng dẫn người mới

Danh sách dịch nhiệm vụ mặc định 3 cột trên màn hình rộng (tự giảm cột trên
màn hình nhỏ). Nút **Theo nhóm** gom theo nhóm ảnh đã dịch trong từng trạng thái
hoàn thành/ghim; không tạo nhóm mới. Khi bật, nút lên/xuống đổi thứ tự trong cùng
nhóm. Tick/bỏ tick, chọn tất cả mục đang hiện, đổi thứ tự và bật/tắt nhóm có toast
**Hoàn tác** ở giữa cạnh phải. Toast tự đóng sau 3 giây; thao tác mới tính lại
thời gian từ đầu. Không lưu qua tải lại trang; hoàn tác chỉ khôi phục trường bị đổi
trên quest còn trong danh sách. Tests/browser QA cho thay đổi này: **NOT RUN**;
CI: **NOT CHECKED**.

- **Dịch nhiệm vụ:** đọc riêng mục tiêu nhiệm vụ từ ảnh, giữ danh sách, ghi chú,
  tìm kiếm, ghim, tick, đổi thứ tự và thùng rác hiện có. Không tìm thấy nhiệm vụ
  thì báo rõ và không thêm mục. Có ảnh gốc gần nhất và nút phóng to.
- **Dịch toàn ảnh:** bản thử nghiệm đọc mọi vùng chữ rồi dựng chữ Việt trên ô nền
  che vùng chữ gốc. Chuyển ảnh gốc/ảnh dịch, phóng to, xem đầy đủ chữ bên dưới
  và tải PNG. Kết quả không đi vào danh sách nhiệm vụ.
- **Yandex ↗:** mở đúng đường dẫn Trung → Việt trong tab ngoài. App không tự
  tải ảnh lên Yandex; người dùng chủ động chọn ảnh tại đó.
- **Code súng:** quản lý, tìm kiếm, copy, chỉnh sửa và thùng rác; không cần key.
  Danh sách mặc định gồm 8 mã người dùng cung cấp: SG552, SMG-45, M870, M14,
  M249, .357, Vector và M4A1, theo đúng thứ tự này. Vector có ghi chú mốc LVL 33,
  M4A1 có ghi chú mốc LVL 40; ghi chú hiển thị riêng, không nằm trong mã copy.
  Chưa kiểm chứng khả năng nhập các mã này trong game.
- **Wiki Item:** chỉ có thông báo sẽ làm sau cùng. `item.js` cũ được giữ nguyên
  trong repo nhưng không tải vào trang vì chứa bản sao các khai báo của quest.
- **Wiki Quest:** bản xem thử 3 quest Zero Dam, tên/mục tiêu Trung–Việt là bản
  dịch tham khảo từ nguồn tiếng Anh. Có tìm kiếm, cây cuộn ngang, danh sách,
  chi tiết và link nguồn từng quest; không cần API key. Chưa có cây đầy đủ,
  phóng to/thu nhỏ hoặc kéo vùng trống để di chuyển cây.

Lần truy cập đầu có khung bắt đầu, có thể bỏ qua. **Hướng dẫn** luôn mở được
qua thanh trên; **Cài đặt AI** chứa liên kết lấy key Gemini/Groq.

## Hộp thoại dùng chung

Thông báo, xác nhận và nhập ghi chú/bản dịch dùng hộp thoại giữa màn hình thay
cho `alert/confirm/prompt` của trình duyệt. Có hàng đợi, Hủy/Esc, nhãn hành động
cụ thể và màu cảnh báo khi xóa vĩnh viễn/ghi đè. Thông báo nhỏ “Đã copy” và
trạng thái dịch vẫn hiển thị tại chỗ.

Bộ độc lập tại [`shared/dialog`](shared/dialog/README.md) chỉ cần sao chép
`dialog.js` và `dialog.css` sang site khác, không phụ thuộc Tailwind hay dữ liệu
Delta Tools. Có theme sáng/tối, nhãn tùy chỉnh và `example.html` minh họa riêng.
Không thay `window.alert/confirm/prompt`; code gọi phải chờ bằng `await`.

Khi xác nhận nhập backup, app hủy các yêu cầu AI đang chờ trước khi ghi đè và
không nhận ảnh mới cho tới khi hoàn tất/hủy luồng nhập. Việc này tránh kết quả
AI trả muộn ghi lại dữ liệu cũ trong lúc hộp thông báo thành công đang mở.

## Cài đặt AI và key

1. Mở **Cài đặt AI**, chọn nhà cung cấp mặc định Gemini hoặc Groq.
2. Mở [Google AI Studio](https://aistudio.google.com/api-keys) hoặc
   [Groq Console](https://console.groq.com/keys), tự đăng nhập/tạo key nếu tài khoản
   cho phép. Dán key vào đúng ô và bấm **Lưu cài đặt**. Chỉ cần một nhà cung cấp.
3. Không chọn **Ghi nhớ key**: dùng `sessionStorage`, trong phiên tab hiện tại,
   vẫn qua được tải lại trang. Chọn ghi nhớ: dùng `localStorage` trên trình duyệt.
   Key Gemini đã lưu trước bản cập nhật vẫn được đọc từ khóa lưu cũ.
4. Có nút ẩn/hiện, copy và xóa từng key. Xóa trong app không thu hồi key tại
   nhà cung cấp. Không đưa key vào source, báo cáo hoặc commit. Key đã ghi nhớ
   nằm trong bộ nhớ trình duyệt, không phù hợp máy dùng chung.

Mở trang, mở Cài đặt và lưu key không gọi AI. “Đã nhập key” không phải xác nhận
key có quyền/model/hạn mức hợp lệ. App không tự kiểm tra key. Hai tab hiển thị
nhà cung cấp mặc định; trạng thái xử lý ghi nhà cung cấp thực sự đang dùng.

App gọi REST trực tiếp bằng `fetch`, không thêm SDK/dependency:

- Gemini: giữ hai model đã cấu hình `gemini-3.1-flash-lite`, `gemini-3.5-flash`;
  key gửi bằng header `x-goog-api-key`.
- Groq: `qwen/qwen3.8-27b`, đầu vào ảnh và JSON mode theo
  [Groq Vision](https://console.groq.com/docs/vision) và
  [Chat API](https://console.groq.com/docs/api-reference#chat-create).
- Kết quả nhiệm vụ là JSON `{ "quests": [...] }`; kết quả toàn ảnh là
  `{ "blocks": [{ "original": "...", "translated": "...", "box": [0, 0, 100, 100] }] }`.
  Tọa độ vùng chữ theo `[ymin, xmin, ymax, xmax]`, chuẩn hóa 0–1000. App kiểm tra
  kiểu dữ liệu, biên và kích thước vùng trước khi dựng ảnh; không coi dữ liệu AI
  là HTML hoặc mã thực thi. Tham khảo
  [Gemini image understanding](https://ai.google.dev/gemini-api/docs/image-understanding).

Không tự chuyển nhà cung cấp khi lỗi. Sau lỗi có nút thử lại ghi rõ tên AI;
nhà cung cấp còn lại chỉ được gọi khi người dùng bấm nút tương ứng và đã nhập key.
Gemini có thể thử model dự phòng cùng nhà cung cấp khi lỗi model, máy chủ hoặc
kết quả không hợp lệ; không tự lặp khi lỗi key/quyền/hạn mức. Mỗi lần thử có
thời gian chờ 25 giây, gồm cả đọc phản hồi.

## Gửi ảnh, kết quả và giới hạn

- Dán ảnh bằng Ctrl+V tại tab dịch hoặc chọn file PNG/JPEG/WebP, tối đa 2 MiB.
  Giới hạn giải mã: 16 triệu điểm ảnh, tối đa 10.000 px mỗi cạnh. Cắt/thu nhỏ
  ảnh trước khi gửi nếu vượt giới hạn. Không đổi nhãn MIME để giả định dạng ảnh.
- Gửi ảnh và thử lại sẽ gửi ảnh đến AI được chọn, có thể dùng hạn mức/phát sinh
  phí theo tài khoản. Chưa xác minh quyền truy cập/model/hạn mức bằng API thật.
- Hai tab giữ ảnh, kết quả, trạng thái và yêu cầu riêng. Đổi tab không chuyển ảnh
  hoặc hủy yêu cầu. Khi đang xử lý, ảnh mới trong cùng tab được từ chối kèm nhắc
  chờ/hủy rồi gửi lại. Nếu clipboard có nhiều ảnh, chỉ lấy ảnh đầu tiên.
- Nút **Hủy xử lý** hủy chờ và bỏ kết quả trả muộn, không hứa hoàn lượt/phí của
  yêu cầu đã gửi. Lưu cài đặt giữa lúc dịch không thay key/provider của yêu cầu đó.
- Ảnh và kết quả toàn ảnh chỉ nằm trong bộ nhớ trang, mất khi tải lại và không
  vào backup. Nhiệm vụ/code súng tiếp tục lưu theo các khóa cũ.
- Bản dựng ảnh dùng ô nền màu tối và chữ sáng; không phục hồi nền phía sau chữ.
  Chữ quá dài được thu nhỏ/giới hạn trong vùng, có cảnh báo và danh sách chữ đầy
  đủ bên dưới. Vị trí chữ, nhận diện chữ nhỏ và bản dịch có thể sai. Khả năng
  định vị chữ của Groq trên ảnh game chưa được kiểm chứng. Không cam kết chất
  lượng tương đương Yandex.
- Giao diện tải Tailwind từ CDN; AI cũng cần Internet. Không tự nhúng trang
  Yandex hoặc gọi API không chính thức của Yandex.

## Dữ liệu cũ, tìm kiếm và sao lưu

Tìm kiếm nhiệm vụ theo bản dịch/chữ gốc/ghi chú, tìm code súng theo tên/mã;
không phân biệt chữ hoa và dấu tiếng Việt. Xóa ô tìm để bỏ lọc.
**Chọn mục đang hiện** chỉ tick/bỏ tick kết quả đang lọc. Nút lên/xuống đổi thứ
thự trong các mục đang hiện và cùng trạng thái ghim. **Xóa tất cả đã tick**
chuyển mọi nhiệm vụ đã tick vào thùng rác, kể cả mục bị bộ lọc ẩn; có xác nhận số mục.

Thanh điều hướng có nút **Sắp xếp menu**. Kéo tay nắm ⠿ sang trái/phải,
hoặc dùng nút ←/→ hay phím mũi tên khi focus ở tay nắm. Vạch sáng báo vị trí
thả; kéo gần mép thanh menu để cuộn ngang. Bấm **Xong** để trở lại dùng các mục.
Trong chế độ sắp xếp, các mục không chuyển tab/mở Yandex. Tab hiện tại giữ nguyên.
**Khôi phục thứ tự ban đầu** đưa menu về thứ tự gốc. Thứ tự tự lưu theo trình
duyệt và địa chỉ trang, không đồng bộ thiết bị và không nằm trong Xuất/Nhập Data.
Không đọc được dữ liệu thứ tự thì dùng mặc định; mục mới sẽ được bổ sung cuối menu.

Code súng dùng danh sách gọn có vùng cuộn riêng và ô tìm kiếm luôn ở phía trên.
Chọn một dòng để xem mã đầy đủ, copy, sửa hoặc xóa trong khung chi tiết;
trên điện thoại, dùng nút **Danh sách** để quay lại. Tìm kiếm gồm tên, mã và ghi chú.
**Ghim** tạo lối tắt ở đầu vùng danh sách, không thay đổi thứ tự gốc; mã đã ghim
vẫn xuất hiện trong phần **Tất cả** với cùng số thứ tự.

Trong khung chi tiết, dùng **Chuyển đến…** để nhập số thứ tự, **Lên đầu**,
**Xuống cuối** hoặc ↑/↓. Mục được lấy khỏi vị trí cũ và chèn vào vị trí mới;
các mục còn lại giữ thứ tự tương đối. Khi tìm kiếm, thao tác đổi thứ tự tạm khóa.
Thứ tự lưu theo mảng hiện có, không thêm trường `order`. Trạng thái ghim dùng
trường tùy chọn `isPinned` và đi theo mã vào thùng rác/backup; backup cũ vẫn nhập được.
Khi chỉnh sửa, tìm kiếm, chọn mục khác, thêm mã và khôi phục mặc định tạm khóa
để giữ nội dung đang nhập. Ghi chú có thể sửa/xóa và không copy cùng mã.

Danh sách đã lưu, kể cả danh sách rỗng, không bị tự thay bằng mặc định mới. Bấm
**Khôi phục mã mặc định** để lấy lại mã mặc định còn thiếu trong danh sách:

- Nếu còn trong Thùng rác, lấy lại bản ghi đó và giữ tên/ghi chú đã sửa.
- Nếu đã xóa vĩnh viễn, thêm lại bản gốc có sẵn trong app, gồm ghi chú LVL.
- Mã đang có được giữ nguyên, không thêm trùng; các mã khôi phục nối vào cuối
  theo thứ tự mặc định và không đổi thứ tự danh sách đang có. Mã trong Thùng
  rác trùng với mã đang có cũng được giữ nguyên trong Thùng rác.
- Chỉ áp dụng cho 8 chuỗi code mặc định, không khôi phục mã tự thêm. Nếu đã sửa
  chuỗi code của một bản mặc định, bản sửa không bị ghi đè; bản gốc thiếu có
  thể được thêm lại riêng. Mã tự thêm đã xóa vĩnh viễn cần backup để lấy lại.

Người chưa lưu danh sách sẽ thấy 8 mã mặc định ngay khi mở tab. Backup cũ không
có ghi chú vẫn nhập được; trường `note` mới là tùy chọn và phải là chuỗi nếu có.

**Xuất Data** giữ định dạng backup nhiệm vụ/cache dịch/code súng và thùng rác
hiện có. Không xuất key, ảnh hoặc cấu hình AI. **Nhập Data** kiểm tra cấu trúc
trước khi ghi đè các phần có trong file; vẫn hỗ trợ backup chỉ chứa một phần.
Xóa dữ liệu trang trong trình duyệt có thể làm mất dữ liệu và key đã lưu.

## Cấu trúc và trạng thái kiểm chứng

- `index.html`, `style.css`: các mục điều hướng, hộp Cài đặt/Hướng dẫn, khung ảnh.
- `app.js`: chuyển tab, định tuyến dán ảnh, tìm kiếm và backup.
- `ai.js`: key/provider, onboarding, gọi API và kiểm tra kết quả JSON.
- `quest.js`: xử lý nhiệm vụ và dữ liệu danh sách hiện có.
- `image.js`: nhận/giải mã ảnh, trạng thái toàn ảnh, dựng canvas, phóng to và xuất PNG.
- `gun.js`: tính năng code súng hiện có, không sửa trong đợt này.

Ngày 30/10/2026 đã chạy browser QA local với ảnh/key/phản hồi giả, thay `fetch`
và chặn kết nối API bằng CSP `connect-src 'none'` trên địa chỉ QA riêng.
130/130 phép kiểm tra hợp lệ đạt: điều hướng/hướng dẫn, key cũ và cách lưu key,
chọn provider, hai luồng dịch, dữ liệu lỗi, hủy/phản hồi muộn, timeout, PNG,
backup không chứa key/ảnh và dữ liệu danh sách cũ. Bốn phép đo ban đầu không
hợp lệ do ô password bị che hoặc đọc trước khi file tải xong đã được thay bằng
kiểm tra yêu cầu giả/đợi đúng trạng thái, không tính vào 130 phép kiểm tra.

QA bắt đầu từ `7772e8f`, phát hiện phản hồi HTTP 200 không đọc được JSON bị Groq
báo nhầm là kết quả bị ngắt. Đã sửa nhánh kiểm tra phản hồi và chạy lại nhánh
liên quan cho cả Gemini/Groq cùng các luồng thành công. Kết quả 70/70 ở
`d46e111` là bằng chứng lịch sử riêng.

Đợt chỉnh UI tiếp theo đã chạy 24/24 kiểm tra tại viewport 320, 390, 768 và
1280 px với dữ liệu giả, vẫn chặn API thật. Nút chọn ảnh có nhãn tiếng Việt,
dùng được bằng chuột/bàn phím; hướng dẫn bắt đầu đổi giữa một/ba cột; nút
Lưu/Đóng của Cài đặt AI nằm trong khung khi cuộn phần nhập key. Đây là kiểm tra
bố cục bằng kích thước trình duyệt giả lập, chưa phải điện thoại thật.

API thật, độ chính xác dịch/vị trí trên ảnh game, QA trên điện thoại thật, test suite và
lint/typecheck: **NOT RUN**. CI: **NOT CHECKED**. Kết quả giả lập không chứng
minh quyền truy cập model, hạn mức hoặc chất lượng dịch thực tế.

Đợt cập nhật danh sách code súng mặc định, ghi chú và đổi thứ tự chỉ rà diff;
sau đó đã xác nhận trên tab local thực tế hiển thị đủ 8 mã mới, số thứ tự,
nút ↑/↓ và ghi chú LVL 33/40. Trang dùng mã phiên bản trên URL tài nguyên local
để tránh HTML mới đi cùng JavaScript/CSS còn trong cache; đổi mã phiên bản khi
cập nhật các tài nguyên này. Chưa chạy QA thao tác đổi thứ tự, copy, lưu lại
hoặc backup cho thay đổi code súng mới. Các kết quả QA phía trên là bằng chứng
của các đợt trước, không xác minh các thao tác mới đó.

Đợt hộp thoại dùng chung và trang minh họa chỉ rà source/diff. Tests/browser QA
cho component và các luồng mới: **NOT RUN**; CI: **NOT CHECKED**. Chưa xác minh
việc tái dùng trên site khác bằng chạy thực tế.

Đợt đổi nút sang Khôi phục mã mặc định chỉ rà source/diff; test/QA cho hành vi
khôi phục từ Thùng rác hoặc bản gốc: **NOT RUN**.

Đợt giao diện code súng gọn, khung chi tiết, ghim và chuyển đến vị trí chỉ rà
source/diff. Tests/browser QA, lưu lại và nhập/xuất backup cho thay đổi này:
**NOT RUN**. CI: **NOT CHECKED**.

Wiki Quest hiện dùng 3 quest đầu nhánh Assault Battalion: First Battle → Return
→ Showdown, thay cho 3 quest giữa chuỗi ở bản mẫu trước. First Battle áp dụng mọi
bản đồ; Return và Showdown ở Zero Dam. Map và đơn vị hiển thị theo từng bản ghi.
Nguồn riêng từng quest xác nhận quan hệ chuỗi này, nhưng không nêu level mở khóa:
UI ghi **Chưa xác minh**, số bước không được coi là level. Nhánh khác của Return
được ghi trong chi tiết nhưng chưa dựng đủ thẻ. Cây dùng thẻ nhỏ xếp bậc thang,
đường nối gấp khúc và nền lưới tối; cuộn ngang để xem. Bấm thẻ mở hộp chi tiết
phủ lên cây, đóng bằng nút Đóng hoặc Esc. Có chế độ danh sách và tìm kiếm;
khung chi tiết mục tiêu/phần thưởng/quan hệ trước-sau. Dữ liệu tóm tắt từ Delta
Force Wiki (Fandom), dẫn nguồn từng quest và ghi công CC BY-SA; tên và mục tiêu
Trung/Việt là bản dịch tham khảo, chưa xác nhận theo game/phiên bản. Không cần
API key, không gọi AI, chưa có bản đồ vị trí hoặc cây đầy đủ. Tests/browser QA
cho Wiki Quest: **NOT RUN**. CI: **NOT CHECKED**.

Đợt sắp xếp thanh điều hướng chỉ rà source/diff. Tests/browser QA cho kéo thả,
cảm ứng, cuộn khi kéo, bàn phím và lưu thứ tự: **NOT RUN**. CI: **NOT CHECKED**.
