const fs = require('fs');

const scriptPath = 'D:/Imperialismo fiscal/monografia-pagina-web/script.js';
let content = fs.readFileSync(scriptPath, 'utf8');

// 1. Update referencesData pdf/link values
const pdfMap = {
    "ref-1": "pdfs/AMIN - Unequal Development (A Lei do Valor Mundializada) - ref01.pdf",
    "ref-2": "pdfs/AVI-YONAH - Globalization Tax Competition and the Fiscal Crisis of the Welfare State - ref02.pdf",
    "ref-3": "pdfs/12280 - ref03.pdf",
    "ref-4": "pdfs/EconomicFreedomoftheWorld2002Ch3 - ref04.pdf",
    "ref-5": "pdfs/david-harvey-o-novo-imperialismo - ref05.pdf",
    "ref-6": "web-only",
    "ref-7": "pdfs/KEEN_LOCKWOOD_2010 - ref07.pdf",
    "ref-8": "pdfs/1-s2.0-S0305750X02000438-main - ref08.pdf",
    "ref-9": "pdfs/imperialism - ref09.pdf",
    "ref-10": "pdfs/accumulation - ref10.pdf",
    "ref-11": "pdfs/A_RES_78_230-EN - ref11.pdf",
    "ref-12": "pdfs/5kg3h0vmd4kj-en - ref12.pdf",
    "ref-13": "pdfs/constructing-the-global-revenue-statistics-database - ref13.pdf",
    "ref-14": "pdfs/782bac33-en - ref14.pdf",
    "ref-15": "pdfs/9789264224520-en - ref15.pdf",
    "ref-16": "pdfs/Allocative Justice as a Constraint on Fiscal Imperialism in Inter - ref16.pdf",
    "ref-17": "web-only",
    "ref-18": "pdfs/English - Davos Full Report 2025 - ref18.pdf",
    "ref-19": "pdfs/PETER_BUTTRICK_DUNCAN_2010 - ref19.pdf",
    "ref-20": "copyright",
    "ref-21": "copyright",
    "ref-22": "pdfs/State-of-Tax-Justice-2024-Portuguese-Tax-Justice-Network - ref22.pdf",
    "ref-23": "pdfs/wir2015_en - ref23.pdf",
    "ref-24": "pdfs/YU_MAGALHAES_BENIN_2015 - ref24.pdf",
    "ref-25": "pdfs/ZhangYLJForumEssay_id98771d - ref25.pdf",
    "ref-26": "copyright",
    // Special named ones if they exist
    "ref-avi-yonah": "pdfs/AVI-YONAH - Globalization Tax Competition and the Fiscal Crisis of the Welfare State - ref02.pdf",
    "ref-amin": "pdfs/AMIN - Unequal Development (A Lei do Valor Mundializada) - ref01.pdf",
    "ref-harvey": "pdfs/david-harvey-o-novo-imperialismo - ref05.pdf",
    "ref-tjn": "pdfs/State-of-Tax-Justice-2024-Portuguese-Tax-Justice-Network - ref22.pdf",
    "ref-piketty": "copyright"
};

// Replace values in referencesData
for (const [key, val] of Object.entries(pdfMap)) {
    const regexPdf = new RegExp(`("${key}":\\s*\\{[\\s\\S]*?"pdf":\\s*")[^"]*(")`);
    content = content.replace(regexPdf, `$1${val}$2`);
    
    // If it's copyright, we might also want to set link to "copyright" but we can just handle it in the UI based on pdf === 'copyright'
}

// 2. Replace the HTML generation in script.js
const oldHtmlGeneration = /let html = `[\s\S]*?<a href="\$\{data\.link\}"[^>]*>🌐 Link Direto<\/a>[\s\S]*?<button class="popover-btn btn-pdf" data-pdf="\$\{data\.pdf\}"[^>]*>📄 Arquivo PDF<\/button>[\s\S]*?<\/div>[\s\S]*?<\/div>\s*`;/g;

const newHtmlGeneration = `let isCopyright = data.pdf === "copyright";
                        let isWebOnly = data.pdf === "web-only";
                        
                        let linkAttr = isCopyright 
                            ? 'href="#" class="popover-btn btn-link disabled-btn" style="font-size: 0.8em; padding: 0.4rem; opacity: 0.5; cursor: not-allowed;"' 
                            : \`href="\${data.link}" target="_blank" class="popover-btn btn-link" style="font-size: 0.8em; padding: 0.4rem;"\`;
                        
                        let pdfAttr = isCopyright 
                            ? 'data-pdf="copyright" class="popover-btn btn-pdf disabled-btn" style="font-size: 0.8em; padding: 0.4rem; opacity: 0.5; cursor: not-allowed;"' 
                            : isWebOnly 
                            ? 'data-pdf="web-only" class="popover-btn btn-pdf" style="font-size: 0.8em; padding: 0.4rem;"' 
                            : \`data-pdf="\${data.pdf}" class="popover-btn btn-pdf" style="font-size: 0.8em; padding: 0.4rem;"\`;

                        let html = \`
                            <div class="ref-header-toggle">
                                <div class="ref-title" style="font-size: 0.9em; margin:0;">\${data.title}</div>
                                <div class="ref-author" style="font-size: 0.8em; color: var(--text-muted);">\${data.author}</div>
                            </div>
                            <div class="ref-actions-collapse">
                                <div class="popover-actions" style="margin-top: 0; border-top: none; padding-top: 0;">
                                    <a \${linkAttr}>🌐 Link Direto</a>
                                    <button \${pdfAttr}>📄 Arquivo PDF</button>
                                </div>
                            </div>
                        \`;`;

content = content.replace(oldHtmlGeneration, newHtmlGeneration);

// 3. Replace the alert logic
const oldAlertLogic = /popover\.querySelectorAll\('\.btn-pdf'\)\.forEach\(btn => \{[\s\S]*?\}\);\s*\}\);/g;

const newAlertLogic = `popover.querySelectorAll('.btn-link.disabled-btn').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    alert("Livro com direito autoral, PDF ou conteudo online não disponibilizado");
                });
            });

            popover.querySelectorAll('.btn-pdf').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    const pdfVal = btn.getAttribute('data-pdf');
                    if (pdfVal === 'copyright') {
                        alert("Livro com direito autoral, PDF ou conteudo online não disponibilizado");
                    } else if (pdfVal === 'web-only') {
                        alert("Publicação Web, não tem PDF, acessar o conteudo pelo link");
                    } else if (pdfVal) {
                        window.open(pdfVal, '_blank');
                    } else {
                        alert("PDF não disponível");
                    }
                });
            });`;

content = content.replace(oldAlertLogic, newAlertLogic);

fs.writeFileSync(scriptPath, content, 'utf8');
console.log("script.js updated successfully.");
