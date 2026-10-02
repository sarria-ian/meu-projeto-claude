import re, json, pathlib
h = pathlib.Path(__file__).parent
chess = (h/'chess.esm.js').read_text()
chess = re.sub(r'^export \{[^}]*\};\s*$', '', chess, flags=re.M)
chess = re.sub(r'^//# sourceMappingURL=.*$', '', chess, flags=re.M)
chess = '/* chess.js 1.4.0 — (c) Jeff Hlywa, licença BSD-2-Clause */\n' + chess
assert '</script' not in chess
page = (h/'page.html').read_text()
puz = json.dumps(json.loads((h/'puzzles.json').read_text()), ensure_ascii=False)
page = (page.replace('/*CHESSJS*/', chess).replace('/*ENGINE*/', (h/'engine.js').read_text())
            .replace('/*PUZZLES*/', puz).replace('/*APP*/', (h/'app.js').read_text()))
out = h.parent/'dist'; out.mkdir(exist_ok=True)
(out/'xadrez-treino.artifact.html').write_text(page)
# versão para baixar: head com title/fontes/estilo, body com o resto
i = page.index('</style>') + len('</style>')
full = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + page[:i] + '\n</head>\n<body>\n' + page[i:] + '\n</body>\n</html>\n')
(out/'xadrez-treino.html').write_text(full)
print('ok', len(full)//1024, 'KB')
