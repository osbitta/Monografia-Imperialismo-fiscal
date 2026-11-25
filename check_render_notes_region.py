with open(r'C:\Projetos\Imperialismo fiscal\monografia-pagina-web\script.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx_w = js.find('window.renderParaNotesInPopover = function(')
idx_w_end = js.find('const rect = this.getBoundingClientRect();', idx_w)
print(js[idx_w:idx_w_end])
