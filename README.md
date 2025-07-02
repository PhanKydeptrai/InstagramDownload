# Instagram Downloader

Tiện ích mở rộng Chrome mạnh mẽ để tải xuống hình ảnh và video từ Instagram với nhiều phương pháp bypass khác nhau.

![Version](https://img.shields.io/badge/version-3.4-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-red.svg)

## ✨ Tính năng

- 🚀 **Tải xuống siêu tốc**: Nhiều phương pháp bypass để đảm bảo tải xuống thành công
- 🎯 **Tự động phát hiện**: Thêm nút download vào mọi hình ảnh và video Instagram tự động
- 📹 **Hỗ trợ video**: Tải xuống video, Reels và Stories với chất lượng cao nhất
- 🔍 **Tải trực tiếp**: Nhập URL để tải xuống bất kỳ media nào từ Instagram
- 🎞️ **Phân tích DASH**: Tìm và tải xuống luồng video và âm thanh chất lượng cao
- ⌨️ **Phím tắt**: `Ctrl+Shift+D` để tải tất cả hình ảnh đang hiển thị
- 🔄 **Theo dõi thay đổi**: Tự động cập nhật khi Instagram thay đổi giao diện
- 💾 **Hỗ trợ nhiều định dạng**: JPG, PNG, WebP, MP4 và các định dạng khác
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
2. **Tìm nút Download**: 
   - Nút download màu cam (💾) xuất hiện ở góc trên bên phải của mỗi hình ảnh
   - Nút download màu đỏ (📹) xuất hiện ở góc trên bên phải của mỗi video
3. **Click để tải**: Click vào nút để tải xuống hình ảnh hoặc video với độ phân giải cao nhất
4. **Tính năng đặc biệt**: 
   - Nút download toàn cục (📥) ở góc dưới bên phải màn hình để quét và tải video từ Stories và Reels
   - Nút tải trực tiếp (🔍) để nhập URL và tải xuống bất kỳ media nào từ Instagram
5. **Phím tắt**: Sử dụng `Ctrl+Shift+D` để tải tất cả hình ảnh đang hiển thị

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

Extension sử dụng nhiều phương pháp bypass khác nhau để đảm bảo tải xuống thành công:

### Cho hình ảnh:
1. **Canvas Method**: Vẽ ảnh lên canvas và export
2. **Blob Method**: Tải trực tiếp với headers tùy chỉnh
3. **DataURL Method**: Chuyển đổi qua DataURL
4. **Copy Method**: Sao chép trực tiếp từ src của ảnh

### Cho video:
1. **Direct Download**: Tải trực tiếp từ nguồn video
2. **Metadata Extraction**: Trích xuất URL từ metadata của trang
3. **Script Scanning**: Tìm URL video trong mã JavaScript
4. **Open in New Tab**: Mở video trong tab mới khi không thể tải trực tiếp

## ⚡ Tính năng nâng cao

- **Auto-retry**: Tự động thử lại nếu phương pháp đầu tiên thất bại
- **Progress indication**: Hiển thị trạng thái download
- **Error handling**: Xử lý lỗi và thông báo cho người dùng
- **Batch download**: Tải nhiều ảnh cùng lúc
- **High resolution**: Luôn tải ảnh và video với độ phân giải cao nhất có thể
- **Video detection**: Tự động phát hiện và tải xuống video từ Stories và Reels
- **Quality selection**: Chọn chất lượng video khi có nhiều nguồn

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

## �� Changelog

### v3.4 (Current)
- ✅ Thêm tính năng phân tích DASH manifest
- ✅ Hỗ trợ tách luồng video và âm thanh chất lượng cao
- ✅ Cải thiện phát hiện và tải xuống video từ bài đăng
- ✅ Thêm tùy chọn nâng cao cho tải xuống video
- ✅ Sửa lỗi và tối ưu hiệu suất

### v3.3
- ✅ Cải thiện đáng kể khả năng tải xuống video
- ✅ Thêm tính năng tải trực tiếp từ URL
- ✅ Hỗ trợ tốt hơn cho Instagram Reels
- ✅ Thêm nhiều phương pháp phát hiện video
- ✅ Cải thiện xử lý lỗi và khả năng tương thích

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## ⚠️ Disclaimer

Extension này chỉ dành cho mục đích giáo dục và sử dụng cá nhân. Vui lòng tôn trọng bản quyền và điều khoản sử dụng của Instagram.

---


## 🚀 Cài đặt

1. Mở Chrome → `chrome://extensions/`
2. Bật "Developer mode" 
3. Click "Load unpacked" → Chọn thư mục này
4. Extension sẽ được cài đặt

## 📖 Sử dụng

1. Truy cập Instagram.com
2. Nút **💾 màu đỏ gradient** xuất hiện trên ảnh
3. Nút **📹 màu đỏ cam** xuất hiện trên video
4. Nút **📥 toàn cục** ở góc dưới bên phải để quét video
5. Nút **🔍 tải trực tiếp** để nhập URL và tải xuống media
6. Click để download với auto-fallback methods
7. **Ctrl+Shift+D** để download all visible images

## 🔧 How it works

Extension tự động thử nhiều methods theo thứ tự:

### Cho ảnh:
1. **Canvas Method** - Best quality
2. **Blob Fetch** - With proper headers  
3. **DataURL** - Conversion method
4. **Smart Copy** - Copy URL + auto-open (100% works)

### Cho video:
1. **DASH Manifest** - Tìm và phân tích manifest để lấy luồng chất lượng cao
2. **Direct Download** - Tải trực tiếp từ nguồn
3. **Iframe Method** - Bypass CORS restrictions
4. **Metadata Extraction** - Tìm URL trong metadata
5. **Script Scanning** - Tìm URL trong JavaScript
6. **Open in Tab** - Mở trong tab mới (fallback)

### Phân tích DASH:
1. Tìm kiếm tệp manifest (.mpd) trong mã nguồn trang
2. Phân tích manifest để tách luồng video và âm thanh
3. Cung cấp tùy chọn tải xuống từng luồng riêng biệt
4. Hướng dẫn cách ghép nối để có video hoàn chỉnh

### Direct Media URL:
1. Nhập URL Instagram post hoặc URL trực tiếp
2. Tự động phát hiện và tải xuống media
3. Hỗ trợ cả video và hình ảnh

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

**v3.4 Ultimate** - All bypass methods, video download enhanced

---
*Extension sẵn sàng sử dụng - Load vào Chrome và test ngay!* 🎉
