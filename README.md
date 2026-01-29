# MarkView-Doc

簡易的前端 Markdown 說明文件網站，支援多文件管理和離線使用。
該專案由AI生成(包含底下README)並人為優化，旨在提供一個輕量且易於使用的Markdown文件瀏覽解決方案。

## 📁 檔案結構

```
.
├── index.html      # 主要 HTML 文件
├── style.css       # CSS 樣式文件
├── app.js          # JavaScript 程式文件
├── config.js       # 文件配置文件 ⭐ 新增
├── document.md     # 預設 Markdown 文件
├── docs/           # 文件資料夾 ⭐ 新增
│   ├── about.md
│   ├── guide.md
│   ├── faq.md
│   └── changelog.md
└── README.md       # 說明文件
```

## ✨ 主要功能

- 📂 **多文件支援** - 側邊欄選單管理多個 Markdown 文件
- 🌙 **主題切換** - 亮色/暗色主題自由切換
- 📱 **響應式設計** - 完美支援桌面和行動裝置
- 💾 **設定保存** - 自動記憶主題和文件選擇
- 🚀 **快速載入** - 高效的文件切換體驗
- 🎨 **優雅介面** - 現代化的使用者介面設計

## 🚀 使用方式

### 方法一：使用本地伺服器（推薦）

1. 安裝 VS Code 擴充套件 "Live Server"
2. 在 VS Code 中開啟專案資料夾
3. 右鍵點擊 `index.html`，選擇 "Open with Live Server"

### 方法二：使用 Python 內建伺服器

```bash
# Python 3
python -m http.server 8000

# 然後在瀏覽器開啟 http://localhost:8000
```

### 方法三：使用 Node.js http-server

```bash
npx http-server
```

## 📝 自訂文件配置

### 1. 編輯 config.js

這是最重要的配置文件，您只需要修改這個文件即可：

```javascript
const MARKDOWN_CONFIG = [
    {
        name: '首頁',           // 側邊欄顯示的名稱
        file: 'document.md',    // Markdown 文件路徑
        icon: '🏠'             // 圖示（選填）
    },
    {
        name: '我的文件',
        file: 'docs/my-doc.md',
        icon: '📖'
    }
];

// 預設顯示的文件
const DEFAULT_FILE = 'document.md';
```

### 2. 添加您的 Markdown 文件

將 `.md` 文件放在專案根目錄或 `docs` 資料夾中。

### 3. 重新整理瀏覽器

配置會自動生效！

## 🎨 主題切換

- 點擊右上角的 🌙/☀️ 按鈕切換主題
- 您的選擇會自動保存
- 亮色主題：清晰明亮
- 暗色主題：護眼舒適

## 📱 側邊欄選單

- **開啟**：點擊左上角的 ☰ 按鈕
- **選擇文件**：點擊任一選單項目
- **關閉**：點擊 ✕ 或點擊遮罩層
- **自動關閉**：手機版選擇文件後自動關閉

## 🔧 進階配置

### 修改側邊欄寬度

編輯 `style.css`：

```css
.sidebar {
    width: 300px;  /* 修改為您想要的寬度 */
}
```

### 修改主題顏色

編輯 `style.css` 中的 CSS 變數：

```css
:root {
    --bg-primary: #f5f5f5;
    --text-primary: #333333;
    --link-color: #667eea;
    /* ... 更多變數 */
}
```

### URL 參數

您可以透過 URL 參數直接開啟特定文件：

```
http://localhost:8000/?file=docs/guide.md
```

## ⚠️ 注意事項

- 由於瀏覽器的 CORS 安全限制，直接開啟 `index.html` 可能無法讀取 Markdown 文件
- 建議使用本地伺服器來執行此專案
- 如需離線使用，請下載 marked.js 到本地並修改 `index.html` 中的引用路徑

## 🛠️ 技術說明

- **HTML/CSS/JavaScript**: 純前端實作，無需後端
- **Marked.js**: 用於解析 Markdown 語法
- **LocalStorage**: 儲存使用者偏好設定
- **History API**: 支援瀏覽器前進/後退

## 📦 離線版本設定

如需完全離線使用：

1. 下載 marked.js: https://cdn.jsdelivr.net/npm/marked/marked.min.js
2. 將檔案儲存為 `marked.min.js` 放在專案根目錄
3. 修改 `index.html` 第 35 行為：
   ```html
   <script src="marked.min.js"></script>
   ```

## 🐛 疑難排解

### 文件無法載入

1. 確認文件路徑正確
2. 檢查 `config.js` 中的設定
3. 使用本地伺服器而非直接開啟 HTML
4. 查看瀏覽器主控台的錯誤訊息

### 側邊欄不顯示

1. 確認 `config.js` 已正確載入
2. 檢查 JavaScript 主控台是否有錯誤
3. 確認 `MARKDOWN_CONFIG` 陣列格式正確

## 📄 授權

此專案為開源專案，可自由使用和修改。

---

**Version 2.0.0** | Made with ❤️
