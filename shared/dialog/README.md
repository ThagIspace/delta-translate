# Hộp thoại dùng chung

Sao chép `dialog.js` và `dialog.css` sang site khác. Không cần Tailwind, thư viện,
API key hay code Delta Tools. Chạy trong trình duyệt hỗ trợ `<dialog>.showModal()`.
File `example.html` là trang minh họa độc lập, có thể mở bằng server static.

## Gắn vào site

```html
<link rel="stylesheet" href="/shared/dialog/dialog.css">
<script src="/shared/dialog/dialog.js"></script>
<script>
  const dialogs = SiteDialog.create({
    theme: 'dark', // hoặc 'light'
    labels: {
      alertTitle: 'Thông báo', confirmTitle: 'Xác nhận', promptTitle: 'Nhập nội dung',
      ok: 'Đã hiểu', confirm: 'Xác nhận', cancel: 'Hủy', save: 'Lưu',
      inputLabel: 'Nội dung', requiredMessage: 'Vui lòng nhập nội dung.'
    }
  });
</script>
```

Nên dùng một instance `dialogs` cho cả site để các lời gọi được xếp hàng chung.
Nhãn mặc định là tiếng Anh, giao diện mặc định là tối. Cấu hình nhãn theo ngôn
ngữ của site; nội dung không chứa tên app hoặc quy tắc dữ liệu của Delta Tools.

## Thông báo

```js
await dialogs.alert({ title: 'Đã lưu', message: 'Thay đổi đã được lưu.' });
// Có thể viết ngắn: await dialogs.alert('Thay đổi đã được lưu.');
```

Promise hoàn tất khi đóng hộp. Dùng `confirmText` nếu cần đổi nhãn nút duy nhất.

## Xác nhận trước khi thay đổi dữ liệu

```js
async function deleteRecord(id) {
  const confirmed = await dialogs.confirm({
    title: 'Xóa vĩnh viễn?',
    message: 'Bản ghi này sẽ bị xóa.',
    detail: 'Thao tác không thể hoàn tác.',
    confirmText: 'Xóa vĩnh viễn', cancelText: 'Hủy', danger: true
  });
  if (!confirmed) return;
  // Tìm lại bản ghi theo id rồi thực hiện logic của site tại đây.
}
```

Trả `true` khi bấm nút hành động, `false` khi Hủy/Esc. Mặc định đặt focus ở
Hủy; chỉ bấm nút hành động mới xác nhận. `danger` đổi màu nút hành động, không
thêm quyền hay tự thực hiện bất kỳ thay đổi dữ liệu nào.

## Nhập nội dung

```js
const text = await dialogs.prompt({
  title: 'Sửa ghi chú', message: 'Cập nhật ghi chú của bạn.',
  inputLabel: 'Ghi chú', value: 'Nội dung cũ', placeholder: 'Nhập ghi chú…',
  multiline: true, required: true, confirmText: 'Lưu'
});
if (text !== null) {
  // Tự chuẩn hóa/lưu theo quy tắc của site, ví dụ text.trim().
}
```

Trả chuỗi nguyên văn hoặc `null` nếu Hủy/Esc. `multiline` mặc định `false`.
`required` mặc định `false`; khi bật, nội dung chỉ gồm khoảng trắng bị từ chối
với thông báo ngay trong hộp. Có thể đổi thông báo bằng `requiredMessage`.
Enter trong ô nhiều dòng xuống dòng; dùng nút Lưu để chấp nhận.

## Hành vi và tích hợp

- Hiện giữa màn hình, có backdrop, nội dung dài cuộn trong thân hộp.
- Chỉ hiện một hộp tại một thời điểm trên mỗi instance. Lời gọi tiếp theo chờ
  hộp trước đóng, không ghi đè câu hỏi đang hiển thị.
- Không đóng khi bấm bên ngoài. Esc tương đương Hủy; với thông báo, Esc chỉ đóng.
- Dùng native modal để giữ focus trong hộp; khi đóng, trả focus về phần tử đã mở
  nếu phần tử đó vẫn còn trong DOM. Có tiêu đề, mô tả và nhãn ô nhập cho trình đọc màn hình.
- Nội dung dùng `textContent`, không nhận HTML. Các tùy chọn chuỗi không thực thi mã.
- `dialogs.destroy()` đóng hộp hiện tại và hủy các yêu cầu đang chờ; instance
  đã hủy sẽ trả kết quả hủy cho lời gọi mới. Tạo instance mới nếu cần dùng lại.
- Không thay thế `window.alert/confirm/prompt`. Đây là API bất đồng bộ: luôn
  dùng `await` khi kết quả quyết định hành động. Không viết `if (dialogs.confirm(...))`.
- Trong lúc chờ, code khác của site vẫn có thể chạy. Tìm lại bản ghi theo id hoặc
  giữ rõ tập bản ghi đã hỏi trước khi xóa/ghi đè; đừng dùng chỉ số mảng cũ sau `await`.
- Không lưu dữ liệu, không truy cập storage, không gọi mạng, không gửi telemetry.

Đổi màu bằng CSS tải sau `dialog.css`, ví dụ:

```css
.sd-dialog[data-sd-theme] {
  --sd-primary: #0f766e;
  --sd-danger: #b91c1c;
}
```

Các biến có sẵn: `--sd-bg`, `--sd-text`, `--sd-muted`, `--sd-border`,
`--sd-button`, `--sd-primary`, `--sd-danger`, `--sd-input`.
Selector và animation dùng tiền tố `sd-` để hạn chế ảnh hưởng qua lại với CSS của site.

## Trạng thái kiểm chứng

Component, trang minh họa và các luồng Delta Tools mới chỉ được rà source/diff.
Tests/browser QA: **NOT RUN**. Việc có trang minh họa không phải bằng chứng đã
kiểm thử trên site khác hoặc trên mọi trình duyệt.
