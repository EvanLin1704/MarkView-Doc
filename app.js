// 當前載入的文件
let currentFile = null;

// 當頁面載入完成時執行
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    setupThemeToggle();
    
    // 檢查是否啟用側邊欄
    const isSidebarEnabled = typeof ENABLE_SIDEBAR !== 'undefined' ? ENABLE_SIDEBAR : true;
    
    if (isSidebarEnabled) {
        setupSidebar();
    } else {
        // 如果禁用側邊欄，移除相關元素並調整樣式
        removeSidebar();
    }
    
    initMarkdownViewer();
});

/**
 * 移除側邊欄相關功能與樣式
 */
function removeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('overlay');
    const container = document.querySelector('.container');
    
    if (sidebar) sidebar.remove();
    if (sidebarToggle) sidebarToggle.remove();
    if (overlay) overlay.remove();
    
    // 調整容器樣式，移除側邊欄留白
    if (container) {
        container.style.marginLeft = '0';
        container.style.width = '100%';
    }
}

/**
 * 初始化主題
 */
function initTheme() {
    // 從 localStorage 讀取儲存的主題設定，fallback 到 config.js 的 DEFAULT_THEME
    const defaultTheme = typeof DEFAULT_THEME !== 'undefined' ? DEFAULT_THEME : 'light';
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

/**
 * 設定主題切換按鈕
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // 更新主題
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

/**
 * 更新主題圖示
 */
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

/**
 * 設定側邊欄
 */
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    function isDesktop() {
        return window.innerWidth > 1400;
    }

    // 初始化：從 localStorage 還原桌面版收合狀態
    if (isDesktop() && localStorage.getItem('sidebarCollapsed') === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }

    // 切換側邊欄（漢堡按鈕）
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            if (isDesktop()) {
                // 桌面版：切換收合/展開
                const collapsed = document.body.classList.toggle('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', collapsed);
            } else {
                // 手機版：開啟 off-canvas 側邊欄
                sidebar.classList.add('active');
                overlay.classList.add('active');
            }
        });
    }

    // 關閉側邊欄（關閉按鈕 / 遮罩點擊）
    function closeSidebar() {
        if (isDesktop()) {
            document.body.classList.add('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // 生成側邊欄選單
    generateSidebarMenu();
}

/**
 * 生成側邊欄選單
 */
function generateSidebarMenu() {
    const sidebarNav = document.getElementById('sidebar-nav');
    
    if (!sidebarNav || typeof MARKDOWN_CONFIG === 'undefined') {
        console.error('無法生成側邊欄選單：缺少配置或元素');
        return;
    }
    
    // 清空現有選單
    sidebarNav.innerHTML = '';
    
    // 為每個文件創建選單項目
    MARKDOWN_CONFIG.forEach((item) => {
        const navItem = document.createElement('div');
        navItem.className = 'sidebar-nav-item';
        navItem.dataset.file = item.file;
        
        navItem.innerHTML = `
            <span class="sidebar-nav-item-icon">${item.icon || '📄'}</span>
            <span class="sidebar-nav-item-text">${item.name}</span>
        `;
        
        // 點擊載入對應文件
        navItem.addEventListener('click', function() {
            loadMarkdownFile(item.file);
            
            // 更新選中狀態
            document.querySelectorAll('.sidebar-nav-item').forEach(el => {
                el.classList.remove('active');
            });
            navItem.classList.add('active');
            
            // 只在手機版時關閉側邊欄
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
        
        sidebarNav.appendChild(navItem);
    });
}

/**
 * 初始化 Markdown 檢視器
 */
function initMarkdownViewer() {
    // 從 URL 參數獲取文件名，或使用預設文件
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    const initialFile = fileParam || (typeof DEFAULT_FILE !== 'undefined' ? DEFAULT_FILE : 'document.md');
    
    // 載入初始文件
    loadMarkdownFile(initialFile);
    
    // 設定初始選中狀態
    const firstNavItem = document.querySelector(`[data-file="${initialFile}"]`);
    if (firstNavItem) {
        firstNavItem.classList.add('active');
    }
}

/**
 * 載入並顯示 Markdown 文件
 */
async function loadMarkdownFile(filePath) {
    const contentDiv = document.getElementById('content');
    
    // 防止重複載入
    if (currentFile === filePath) {
        return;
    }
    
    currentFile = filePath;
    
    // 顯示載入中
    contentDiv.innerHTML = '<div class="loading">載入中...</div>';
    
    try {
        // 檢查 marked.js 是否已載入
        if (typeof marked === 'undefined') {
            throw new Error('Marked.js 未能正確載入，請檢查網路連線或使用離線版本');
        }
        
        // 讀取 Markdown 文件
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`找不到文件: ${filePath}`);
        }
        
        const markdownText = await response.text();
        
        // 將 Markdown 轉換為 HTML
        const htmlContent = marked.parse(markdownText);
        
        // 顯示內容
        contentDiv.innerHTML = htmlContent;
        
        // 增強程式碼區塊
        enhanceCodeBlocks();

        // 生成目錄
        generateTableOfContents();
        
        // 更新 URL 參數（不重新載入頁面）
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('file', filePath);
        window.history.pushState({file: filePath}, '', newUrl);
        
        // 滾動到頂部
        window.scrollTo(0, 0);
        
    } catch (error) {
        // 顯示錯誤訊息
        contentDiv.innerHTML = `
            <div class="error">
                <h2>⚠️ 載入失敗</h2>
                <p><strong>錯誤訊息：</strong>${error.message}</p>
                <p><strong>檔案路徑：</strong><code>${filePath}</code></p>
                <p>請確認：</p>
                <ul>
                    <li>Markdown 文件存在於指定路徑</li>
                    <li>檔案路徑在 <code>config.js</code> 中正確設定</li>
                    <li>瀏覽器允許讀取本地文件（建議使用本地伺服器）</li>
                </ul>
                <p><small>提示：如果在本地開啟，某些瀏覽器可能會阻止讀取文件。建議使用 Live Server 或其他本地伺服器。</small></p>
            </div>
        `;
        console.error('載入 Markdown 文件時發生錯誤:', error);
    }
}

// 處理瀏覽器的前進/後退按鈕
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.file) {
        loadMarkdownFile(event.state.file);
        
        // 更新側邊欄選中狀態
        document.querySelectorAll('.sidebar-nav-item').forEach(el => {
            el.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-file="${event.state.file}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }
});

/**
 * 增強程式碼區塊功能
 * - 添加語言標籤
 * - 添加複製按鈕
 */
function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('#content pre code');
    
    codeBlocks.forEach((codeElement) => {
        const preElement = codeElement.parentElement;
        
        // 避免重複處理
        if (preElement.parentElement.classList.contains('code-block-wrapper')) {
            return;
        }
        
        // 獲取語言類型
        let language = 'text';
        const classNames = codeElement.className;
        const languageMatch = classNames.match(/language-(\w+)/);
        if (languageMatch) {
            language = languageMatch[1];
        }
        
        // 創建包裝容器
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        preElement.parentNode.insertBefore(wrapper, preElement);
        wrapper.appendChild(preElement);
        
        // 添加語言標籤
        const languageLabel = document.createElement('div');
        languageLabel.className = 'code-language';
        languageLabel.textContent = language;
        wrapper.insertBefore(languageLabel, preElement);
        
        // 添加複製按鈕
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = '<span class="code-copy-btn-icon">📋</span><span>複製</span>';
        copyButton.setAttribute('aria-label', '複製程式碼');
        
        // 複製功能
        copyButton.addEventListener('click', async function() {
            const code = codeElement.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // 更新按鈕狀態
                copyButton.innerHTML = '<span class="code-copy-btn-icon">✓</span><span>已複製</span>';
                copyButton.classList.add('copied');
                
                // 2秒後恢復
                setTimeout(() => {
                    copyButton.innerHTML = '<span class="code-copy-btn-icon">📋</span><span>複製</span>';
                    copyButton.classList.remove('copied');
                }, 2000);
                
            } catch (err) {
                console.error('複製失敗:', err);
                copyButton.innerHTML = '<span class="code-copy-btn-icon">✗</span><span>失敗</span>';
                setTimeout(() => {
                    copyButton.innerHTML = '<span class="code-copy-btn-icon">📋</span><span>複製</span>';
                }, 2000);
            }
        });
        
        wrapper.insertBefore(copyButton, preElement);
    });
    
    // 執行 Prism 語法高亮
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

/**
 * 生成目錄 (TOC)
 */
function generateTableOfContents() {
    const content = document.getElementById('content');
    const tocNav = document.getElementById('toc-nav');
    
    if (!content || !tocNav) return;
    
    // 清空現有目錄
    tocNav.innerHTML = '';
    
    // 尋找標題
    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
        tocNav.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem; padding: 0.5rem 0;">無目錄內容</p>';
        return;
    }
    
    const ul = document.createElement('ul');
    
    // 觀察者：用於滾動時高亮目錄
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -80% 0px', // 調整觸發區域
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 移除所有 active 類
                document.querySelectorAll('#toc-nav a').forEach(link => link.classList.remove('active'));
                
                // 添加 active 到當前標題對應的連結
                const activeLink = document.querySelector(`#toc-nav a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    // 確保 active 項目在視圖中
                    activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        });
    }, observerOptions);
    
    headings.forEach((heading, index) => {
        // 確保標題有 ID
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 觀察此標題
        observer.observe(heading);
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.className = `toc-${heading.tagName.toLowerCase()}`;
        
        // 平滑滾動
        a.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
            // 更新 URL hash
            history.pushState(null, null, `#${heading.id}`);
            
            // 手動設置 active
            document.querySelectorAll('#toc-nav a').forEach(link => link.classList.remove('active'));
            a.classList.add('active');
        });
        
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    tocNav.appendChild(ul);
}
