# Delta Tools

Web HTML/CSS/JavaScript thuần cho Delta Force, không có backend, database hay bước build.

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

Lần truy cập đầu có khung bắt đầu, có thể bỏ qua. **Hướng dẫn** luôn mở được
qua thanh trên; **Cài đặt AI** chứa liên kết lấy key Gemini/Groq.

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

Code súng có số thứ tự theo danh sách đầy đủ và nút ↑/↓ để hoán đổi với mục
liền kề trong kết quả đang hiện. Thứ tự lưu cùng danh sách, không thêm trường
`order`. Khi đang chỉnh sửa, nút đổi thứ tự tạm khóa để giữ nội dung đang nhập.
Ghi chú có thể sửa/xóa trong ô chỉnh sửa và đi theo mã vào thùng rác/backup.
Tìm kiếm code súng cũng tìm trong ghi chú.

Danh sách đã lưu, kể cả danh sách rỗng, không bị thay bằng mặc định mới. Bấm
**Thêm mã mặc định** để bổ sung các mã còn thiếu vào cuối danh sách; không
thay thứ tự cũ và không tự lấy lại mã đang có trong thùng rác. Người chưa lưu
danh sách sẽ thấy 8 mã mặc định ngay khi mở tab. Backup cũ không có ghi chú
vẫn nhập được; trường `note` mới là tùy chọn và phải là chuỗi nếu có.

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
