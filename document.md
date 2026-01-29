# 歡迎使用 Markdown 檢視器

這是一個簡易的 **Markdown 文件檢視器**，可以在瀏覽器中直接顯示 Markdown 文件。

## 功能特色

- ✅ 純前端解決方案，無需後端
- ✅ 支援離線瀏覽
- ✅ 響應式設計，支援行動裝置
- ✅ 完整的 Markdown 語法支援

## 支援的 Markdown 語法

### 標題

支援 H1 到 H6 的標題層級。

### 文字樣式

可以使用 **粗體**、*斜體*、~~刪除線~~ 等樣式。

### 清單

#### 無序清單

- 項目一
- 項目二
- 項目三

#### 有序清單

1. 第一項
2. 第二項
3. 第三項

### 程式碼

行內程式碼：`console.log('Hello World')`

程式碼區塊：

```javascript
function greeting(name) {
    return `你好，${name}！`;
}

console.log(greeting('世界'));
```

```python
def calculate_sum(a, b):
    """計算兩數之和"""
    return a + b

result = calculate_sum(10, 20)
print(f"結果是：{result}")
```

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>範例頁面</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
```

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.btn-primary {
    background-color: #0ea5e9;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
}
```

### 引用

> 這是一段引用文字。
> 可以用來強調重要內容。

### 連結

這是一個 [範例連結](https://example.com)

### 表格

| 項目 | 說明 | 狀態 |
|------|------|------|
| HTML | 超文本標記語言 | ✅ |
| CSS | 層疊樣式表 | ✅ |
| JavaScript | 程式語言 | ✅ |

### 分隔線

---

## 使用方式

1. 將您的 Markdown 文件命名為 `document.md`
2. 放在與 `index.html` 相同的目錄下
3. 使用瀏覽器開啟 `index.html`

## 注意事項

⚠️ 由於瀏覽器安全限制，建議使用本地伺服器（如 Live Server）來開啟此網頁，否則可能無法讀取 Markdown 文件。

---

**祝您使用愉快！** 🎉
