const fs = require('fs');

const cssPath = 'D:/Imperialismo fiscal/monografia-pagina-web/style.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const newCSS = `

/* =========================================
   Floating Navigation & Sidebars (Index/Comments)
   ========================================= */

.floating-nav-container {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
}

.floating-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background-color 0.2s;
}

.floating-btn:hover {
    transform: scale(1.1);
    background-color: #2c3e50;
}

.sidebar-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    max-width: 90vw;
    height: 100vh;
    background-color: var(--surface-color, #ffffff);
    box-shadow: 2px 0 10px rgba(0,0,0,0.5);
    z-index: 2000;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
}

body.dark-theme .sidebar-panel {
    background-color: var(--bg-color);
    border-right: 1px solid var(--border-color);
}

.sidebar-panel.hidden {
    transform: translateX(-100%);
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color, #ccc);
}

.sidebar-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--text-color);
}

.close-sidebar {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-color);
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    color: var(--text-color);
}

/* Tree Index */
.tree-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tree-list li {
    margin-bottom: 10px;
}

.tree-list a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.2s;
    display: block;
    padding: 5px;
    border-radius: 4px;
}

.tree-list a:hover {
    color: var(--primary-color);
    background-color: rgba(0,0,0,0.05);
}

body.dark-theme .tree-list a:hover {
    background-color: rgba(255,255,255,0.05);
}

/* Comments Form & List */
.general-comment-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.general-comment-form h4 {
    margin: 0;
    color: var(--text-color);
}

.general-comment-form textarea {
    min-height: 80px;
    resize: vertical;
    padding: 8px;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 4px;
    font-family: inherit;
    background-color: var(--bg-color, #fff);
    color: var(--text-color, #333);
}

.general-comment-form button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.general-comment-form button:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}

.comment-item {
    padding: 10px;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: rgba(0,0,0,0.02);
}

body.dark-theme .comment-item {
    background-color: rgba(255,255,255,0.02);
}

.comment-item-header {
    font-size: 0.85em;
    font-weight: bold;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
}

.comment-para-link {
    color: var(--primary-color);
    text-decoration: none;
    cursor: pointer;
}

.comment-para-link:hover {
    text-decoration: underline;
}

.comment-text {
    font-size: 0.9em;
    white-space: pre-wrap;
    word-break: break-word;
}

@keyframes highlight-para {
    0% { background-color: rgba(241, 196, 15, 0.5); }
    100% { background-color: transparent; }
}

.highlighted-section {
    animation: highlight-para 3s ease-out;
}
`;

if (!cssContent.includes('.floating-nav-container')) {
    fs.writeFileSync(cssPath, cssContent + newCSS, 'utf8');
    console.log("style.css updated");
} else {
    console.log("style.css already has new features");
}
