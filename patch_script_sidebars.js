const fs = require('fs');

const scriptPath = 'D:/Imperialismo fiscal/monografia-pagina-web/script.js';
let content = fs.readFileSync(scriptPath, 'utf8');

if (!content.includes('floating-nav-buttons')) {
    
    // 1. Inject HTML after name-modal insertion
    const nameModalTarget = "document.body.insertAdjacentHTML('beforeend', modalHtml);\n    }";
    
    const sidebarsHtmlCode = `
    if (!document.getElementById('floating-nav-buttons')) {
        const sidebarsHtml = \`
            <div id="floating-nav-buttons" class="floating-nav-container">
                <button id="btn-tree-index" class="floating-btn" title="Índice">📑</button>
                <button id="btn-comments-panel" class="floating-btn" title="Comentários">💬</button>
            </div>

            <div id="sidebar-tree-index" class="sidebar-panel hidden">
                <div class="sidebar-header">
                    <h3>Índice</h3>
                    <button class="close-sidebar">✖</button>
                </div>
                <div class="sidebar-content">
                    <ul class="tree-list" id="tree-index-list"></ul>
                </div>
            </div>

            <div id="sidebar-comments" class="sidebar-panel hidden">
                <div class="sidebar-header">
                    <h3>Comentários</h3>
                    <button class="close-sidebar">✖</button>
                </div>
                <div class="sidebar-content">
                    <div class="general-comment-form">
                        <h4>Comentário Geral</h4>
                        <textarea id="general-comment-input" placeholder="Escreva um comentário sobre a obra inteira..."></textarea>
                        <button id="btn-send-general">Enviar</button>
                    </div>
                    <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 15px 0;">
                    <div id="comments-list-content">
                        <p>Carregando comentários...</p>
                    </div>
                </div>
            </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', sidebarsHtml);
    }
    `;
    
    content = content.replace(nameModalTarget, nameModalTarget + "\n" + sidebarsHtmlCode);

    // 2. Append Logic at the end of DOMContentLoaded
    // We look for the end of DOMContentLoaded. Usually it ends with:
    //         if (e.target === modal) {
    //             modal.classList.add('hidden');
    //         }
    //     });
    // });
    
    const endOfDomContentTarget = `if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });`;
    
    const sidebarsLogic = `
    // --- SIDEBARS LOGIC ---
    
    const btnTree = document.getElementById('btn-tree-index');
    const btnComments = document.getElementById('btn-comments-panel');
    const sidebarTree = document.getElementById('sidebar-tree-index');
    const sidebarComments = document.getElementById('sidebar-comments');
    const closeBtns = document.querySelectorAll('.close-sidebar');

    function closeAllSidebars() {
        sidebarTree.classList.add('hidden');
        sidebarComments.classList.add('hidden');
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllSidebars);
    });

    // Toggle Tree Sidebar
    if(btnTree) {
        btnTree.addEventListener('click', () => {
            if (sidebarTree.classList.contains('hidden')) {
                closeAllSidebars();
                sidebarTree.classList.remove('hidden');
            } else {
                sidebarTree.classList.add('hidden');
            }
        });
    }

    // Toggle Comments Sidebar & Fetch
    if(btnComments) {
        btnComments.addEventListener('click', () => {
            if (sidebarComments.classList.contains('hidden')) {
                closeAllSidebars();
                sidebarComments.classList.remove('hidden');
                fetchComments();
            } else {
                sidebarComments.classList.add('hidden');
            }
        });
    }

    // Build Tree Index
    const treeList = document.getElementById('tree-index-list');
    if (treeList) {
        const headings = document.querySelectorAll('h3');
        let hIndex = 1;
        headings.forEach(h => {
            // Assign ID if it doesn't have one
            if (!h.id) {
                h.id = 'capitulo-' + hIndex;
            }
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.innerText = h.innerText;
            
            // Smooth scroll click
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Optional highlight
                h.classList.add('highlighted-section');
                setTimeout(() => h.classList.remove('highlighted-section'), 3000);
            });
            
            li.appendChild(a);
            treeList.appendChild(li);
            hIndex++;
        });
    }

    // Fetch and display comments
    const commentsListContent = document.getElementById('comments-list-content');
    
    function fetchComments() {
        commentsListContent.innerHTML = '<p>Buscando comentários...</p>';
        // Using GET request to the Google Script
        fetch(WEB_APP_URL)
            .then(res => res.json())
            .then(data => {
                renderComments(data);
            })
            .catch(err => {
                console.error(err);
                commentsListContent.innerHTML = '<p>Erro ao carregar comentários. Verifique a conexão ou a URL do script.</p>';
            });
    }

    function renderComments(commentsArray) {
        if (!commentsArray || commentsArray.length === 0) {
            commentsListContent.innerHTML = '<p>Nenhum comentário encontrado.</p>';
            return;
        }

        // Reverse to show newest first
        commentsArray.reverse();

        let html = '';
        commentsArray.forEach(item => {
            // item has: data, paragrafo, comentario
            const isGeral = item.paragrafo === 'GERAL';
            const title = isGeral ? 'Comentário Geral' : \`Parágrafo \${item.paragrafo}\`;
            
            html += \`
                <div class="comment-item">
                    <div class="comment-item-header">
                        \${isGeral ? 
                            \`<span>\${title}</span>\` : 
                            \`<a class="comment-para-link" data-target="\${item.paragrafo}">\${title}</a>\`
                        }
                        <span style="font-weight:normal; color:#888;">\${item.data || ''}</span>
                    </div>
                    <div class="comment-text">\${item.comentario}</div>
                </div>
            \`;
        });

        commentsListContent.innerHTML = html;

        // Attach click listeners to paragraph links
        commentsListContent.querySelectorAll('.comment-para-link').forEach(link => {
            link.addEventListener('click', (ev) => {
                const targetId = link.getAttribute('data-target');
                const targetEl = document.querySelector(\`[data-id="\${targetId}"]\`);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.classList.add('highlighted-section');
                    setTimeout(() => targetEl.classList.remove('highlighted-section'), 3000);
                } else {
                    alert("Parágrafo " + targetId + " não encontrado na página atual.");
                }
            });
        });
    }

    // General Comment Logic
    const btnSendGeneral = document.getElementById('btn-send-general');
    const inputGeneral = document.getElementById('general-comment-input');
    
    if (btnSendGeneral && inputGeneral) {
        btnSendGeneral.addEventListener('click', () => {
            const txt = inputGeneral.value.trim();
            if (!txt) {
                alert("O comentário geral não pode estar vazio.");
                return;
            }

            const sendGeneralLogic = () => {
                const reviewerName = localStorage.getItem('reviewerName');
                const finalComment = txt + " - " + reviewerName;
                const payload = {
                    paragrafo: "GERAL",
                    comentario: finalComment
                };
                
                btnSendGeneral.innerText = "Enviando...";
                btnSendGeneral.disabled = true;

                fetch(WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(() => {
                    alert('Comentário Geral Enviado!');
                    inputGeneral.value = '';
                    btnSendGeneral.innerText = "Enviar";
                    btnSendGeneral.disabled = false;
                    // Refresh comments list
                    fetchComments();
                }).catch(err => {
                    alert('Erro ao enviar comentário.');
                    btnSendGeneral.innerText = "Enviar";
                    btnSendGeneral.disabled = false;
                });
            };

            if (!localStorage.getItem('reviewerName')) {
                pendingCommentAction = sendGeneralLogic;
                document.getElementById('name-modal').classList.remove('hidden');
            } else {
                sendGeneralLogic();
            }
        });
    }
    `;

    content = content.replace(endOfDomContentTarget, endOfDomContentTarget + "\n" + sidebarsLogic);
    
    fs.writeFileSync(scriptPath, content, 'utf8');
    console.log("script.js patched with sidebars logic");
} else {
    console.log("Sidebars logic already injected.");
}
