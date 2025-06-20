# Instagram Downloader

Tiện ích mở rộng Chrome mạnh mẽ để tải xuống hình ảnh từ Instagram với nhiều phương pháp bypass khác nhau.

![Version](https://img.shields.io/badge/version-3.1-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-red.svg)

## ✨ Tính năng

- 🚀 **Tải xuống siêu tốc**: Nhiều phương pháp bypass để đảm bảo tải xuống thành công
- 🎯 **Tự động phát hiện**: Thêm nút download vào mọi hình ảnh Instagram tự động
- ⌨️ **Phím tắt**: `Ctrl+Shift+D` để tải tất cả hình ảnh đang hiển thị
- 🔄 **Theo dõi thay đổi**: Tự động cập nhật khi Instagram thay đổi giao diện
- 💾 **Hỗ trợ nhiều định dạng**: JPG, PNG, WebP và các định dạng khác
- 🎨 **Giao diện đẹp**: Nút download với hiệu ứng hover và animation

## 🛠️ Cài đặt

### Phương pháp 1: Cài đặt từ source code

1. **Clone repository**:
   ```bash
   git clone https://github.com/yourusername/instagram-ultimate-downloader.git
   cd instagram-ultimate-downloader
   ```

2. **Mở Chrome và truy cập**:
   ```
   chrome://extensions/
   ```

3. **Bật Developer Mode** ở góc trên bên phải

4. **Click "Load unpacked"** và chọn thư mục dự án

5. **Extension sẽ được cài đặt** và xuất hiện trong thanh công cụ

### Phương pháp 2: Cài đặt file .crx (sắp có)

*Coming soon...*

## 🚀 Cách sử dụng

1. **Truy cập Instagram**: Mở [instagram.com](https://instagram.com) và đăng nhập
2. **Tìm nút Download**: Nút download màu cam sẽ xuất hiện ở góc trên bên phải của mỗi hình ảnh
3. **Click để tải**: Click vào nút để tải xuống hình ảnh với độ phân giải cao nhất
4. **Phím tắt**: Sử dụng `Ctrl+Shift+D` để tải tất cả hình ảnh đang hiển thị

## 📁 Cấu trúc dự án

```
InstagramDownload/
├── 📄 manifest.json          # Cấu hình chính của extension
├── 🔧 content-ultimate.js    # Script chính - xử lý logic tải xuống
├── 🎨 styles-bypass.css      # CSS cho giao diện nút download
├── 📋 INSTALL.md            # Hướng dẫn cài đặt chi tiết
├── 📋 CLEANUP-FINAL.md      # Tài liệu dọn dẹp và tối ưu
├── 📋 README.md             # Tài liệu chính (file này)
└── 📁 icons/                # Thư mục chứa icon
    └── 🖼️ icon.svg          # Icon của extension
```

### Chi tiết các file chính:

#### `manifest.json`
- **Chức năng**: Cấu hình chính của Chrome Extension
- **Version**: Manifest V3 (phiên bản mới nhất)
- **Permissions**: Chỉ yêu cầu quyền truy cập Instagram domains

#### `content-ultimate.js`
- **Chức năng**: Logic chính xử lý tải xuống
- **Features**:
  - Tự động thêm nút download
  - 4 phương pháp bypass: Canvas, Iframe, Proxy, Copy
  - Observer theo dõi thay đổi DOM
  - Xử lý keyboard shortcuts
  - Download batch cho nhiều ảnh

#### `styles-bypass.css`
- **Chức năng**: Styling cho UI components
- **Features**:
  - Nút download với hiệu ứng hover
  - Responsive design
  - Dark/Light theme support
  - Animation và transitions

## 🔧 Phương pháp Bypass

Extension sử dụng 4 phương pháp bypass khác nhau để đảm bảo tải xuống thành công:

1. **Canvas Method**: Vẽ ảnh lên canvas và export
2. **Iframe Method**: Sử dụng iframe để bypass CORS
3. **Proxy Method**: Qua proxy server để lấy ảnh gốc
4. **Copy Method**: Sao chép trực tiếp từ src của ảnh

## ⚡ Tính năng nâng cao

- **Auto-retry**: Tự động thử lại nếu phương pháp đầu tiên thất bại
- **Progress indication**: Hiển thị trạng thái download
- **Error handling**: Xử lý lỗi và thông báo cho người dùng
- **Batch download**: Tải nhiều ảnh cùng lúc
- **High resolution**: Luôn tải ảnh với độ phân giải cao nhất có thể

## 🐛 Troubleshooting

### Extension không hoạt động
- Kiểm tra console: `F12 → Console`
- Refresh trang Instagram
- Kiểm tra extension đã được bật trong `chrome://extensions/`

### Không thấy nút download
- Đảm bảo đã đăng nhập Instagram
- Scroll để load thêm nội dung
- Kiểm tra kích thước ảnh (chỉ hiển thị với ảnh > 120x120px)

### Lỗi tải xuống
- Thử refresh trang và tải lại
- Kiểm tra kết nối internet
- Extension sẽ tự động thử các phương pháp backup

## 🔒 Bảo mật và Quyền riêng tư

- ✅ **Không thu thập dữ liệu**: Extension không lưu trữ hay gửi dữ liệu cá nhân
- ✅ **Permissions tối thiểu**: Chỉ yêu cầu quyền truy cập Instagram
- ✅ **Open source**: Code hoàn toàn mở để kiểm tra
- ✅ **Local processing**: Tất cả xử lý diễn ra trên máy người dùng

## 📋 Yêu cầu hệ thống

- **Browser**: Google Chrome 88+ hoặc Chromium-based browsers
- **OS**: Windows, macOS, Linux
- **RAM**: Tối thiểu 2GB
- **Network**: Kết nối internet ổn định

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

## 📝 Changelog

### v3.1 (Current)
- ✅ Cải thiện stability và performance
- ✅ Thêm keyboard shortcuts
- ✅ Tối ưu UI/UX
- ✅ Sửa lỗi với Instagram updates

### v3.0
- ✅ Migration to Manifest V3
- ✅ Thêm multiple bypass methods
- ✅ Cải thiện error handling

## 📞 Hỗ trợ

- **Issues**: [GitHub Issues](https://github.com/yourusername/instagram-ultimate-downloader/issues)
- **Email**: your.email@example.com
- **Documentation**: Xem file `INSTALL.md` để hướng dẫn chi tiết

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## ⚠️ Disclaimer

Extension này chỉ dành cho mục đích giáo dục và sử dụng cá nhân. Vui lòng tôn trọng bản quyền và điều khoản sử dụng của Instagram.

---

Made with ❤️ by [Your Name]
- 🚫 **Zero complex permissions** - chỉ cần activeTab

## 🚀 Cài đặt

1. Mở Chrome → `chrome://extensions/`
2. Bật "Developer mode" 
3. Click "Load unpacked" → Chọn thư mục này
4. Extension sẽ được cài đặt

## 📖 Sử dụng

1. Truy cập Instagram.com
2. Nút **💾 màu đỏ gradient** xuất hiện trên ảnh
3. Click để download với auto-fallback methods
4. **Ctrl+Shift+D** để download all visible images

## 🔧 How it works

Extension tự động thử 4 methods theo thứ tự:
1. **Canvas Method** - Best quality
2. **Blob Fetch** - With proper headers  
3. **DataURL** - Conversion method
4. **Smart Copy** - Copy URL + auto-open (100% works)

## 📋 Files

```
manifest.json            # Extension manifest
content-ultimate.js      # Main content script  
styles-bypass.css        # Button styles
FINAL-SOLUTION.md       # Detailed user guide
INSTALL.md              # Installation guide
icons/icon.svg          # Extension icon
```

## 🎯 Version

**v3.1 Ultimate** - All bypass methods, signature mismatch fixed

---
*Extension sẵn sàng sử dụng - Load vào Chrome và test ngay!* 🎉
