# Delta Tools

Web hỗ trợ dịch nhiệm vụ Delta Force từ ảnh bằng Gemini và quản lý code súng.
Project dùng HTML/CSS/JavaScript thuần, không có backend, database hoặc bước build.

## Chạy local trên Windows

Yêu cầu Python 3 có lệnh `python` (đã có trên máy tại thời điểm setup).
Mở PowerShell trong thư mục project rồi chạy:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start-local.ps1
```

Mở <http://127.0.0.1:8765>. Giữ cửa sổ PowerShell mở; nhấn `Ctrl+C` để dừng.
Nếu cổng đang được sử dụng, có thể chọn cổng khác:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start-local.ps1 -Port 8766
```

Server chỉ lắng nghe trên máy local. Chỉ dùng server này cho phát triển local.

## Dữ liệu và AI

- Nhiệm vụ, code súng và Gemini API key được lưu trong `localStorage` của trình duyệt.
  Dùng cùng trình duyệt, địa chỉ và cổng để thấy lại dữ liệu. `localhost` và
  `127.0.0.1` có vùng lưu trữ riêng. Xóa dữ liệu trang web có thể làm mất dữ liệu.
- Dùng **Xuất Data** để sao lưu nhiệm vụ, cache dịch và code súng cùng thùng rác.
  File xuất không chứa API key. **Nhập Data** ghi đè các phần dữ liệu có trong file.
- Nhập Gemini API key ở tab **Dịch Nhiệm Vụ**, rồi dán ảnh bằng `Ctrl+V`.
  Ảnh được gửi từ trình duyệt tới Gemini khi dùng chức năng này.
- Giao diện tải Tailwind từ CDN; dịch AI cũng cần Internet và API key hợp lệ.
  Không cần API key để quản lý code súng hoặc thêm ghi chú.
- Không đưa API key vào source code hay commit. Không dùng key nhạy cảm trên
  trình duyệt/máy dùng chung vì key được lưu tại trình duyệt.

## Cấu trúc và hạn chế hiện tại

- `index.html`: giao diện và các tab.
- `app.js`: API key, chuyển tab, dán ảnh và sao lưu/khôi phục.
- `quest.js`: gọi Gemini, quản lý nhiệm vụ, ghi chú và thùng rác.
- `gun.js`: quản lý code súng; dữ liệu khởi tạo là ví dụ.
- `style.css`: CSS bổ sung.
- `item.js`: hiện là bản sao của `quest.js`, trùng khai báo biến toàn cục khi
  trang tải. Chưa có hàm `processItemImage`, nên tab **Từ Điển Item** chưa hoạt động.

Đã bổ sung xử lý ký tự HTML và đối số trong nút bấm cho dữ liệu nhiệm vụ/code
súng, bao gồm thùng rác và ô chỉnh sửa. Màu nhóm chỉ nhận mã hex sáu ký tự.
File backup được kiểm tra cấu trúc trước khi ghi đè dữ liệu; file chỉ chứa một
phần dữ liệu vẫn được hỗ trợ. Nút copy API key nhận trực tiếp nút được bấm;
copy API key/code súng có thông báo khi trình duyệt không cho sao chép.
Các thay đổi này đã được rà diff, chưa được kiểm chứng bằng browser QA.

Chưa chạy test, browser QA hoặc gọi Gemini để xác minh bản dịch/model/quota.
