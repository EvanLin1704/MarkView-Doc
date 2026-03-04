// Markdown 文件配置
// 預設主題：'light' 或 'dark'（使用者手動切換後會以其選擇為準）
const DEFAULT_THEME = 'light';

// 是否啟用側邊欄 (左側文件選單)
const ENABLE_SIDEBAR = true;

// 在這裡定義您的 Markdown 文件清單
const MARKDOWN_CONFIG = [
    {
        name: '首頁',
        file: 'document.md',
        icon: '🏠'
    },
    {
        name: '關於我們',
        file: 'docs/about.md',
        icon: '📖'
    },
    {
        name: '使用指南',
        file: 'docs/guide.md',
        icon: '📚'
    }
];

// 預設顯示的文件（如果沒有從 URL 指定）
const DEFAULT_FILE = 'document.md';
