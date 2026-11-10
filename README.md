# ComunicA

Inicie com `node server.js` e abra http://127.0.0.1:4173 para abrir a versão adulta, como na entrada original.

- `adulto/`: versão adulta, com seus arquivos HTML, CSS e JavaScript.
- `infantil/`: versão infantil existente, com seus arquivos HTML, CSS e JavaScript.
- `infantil-nao-letrado/`: cópia da versão infantil existente, com os mesmos recursos e a mesma interface, ocultando apenas os textos dos botões e mantendo seus ícones e nomes acessíveis. As legendas curtas do menu acompanham as ilustrações. As ilustrações locais anteriores foram preservadas como `ilustracoes/*-local.png`. Os ajustes específicos ficam em `sem-texto.css` e `sem-texto.js`.
- `assets/` e `img/`: imagens e áudios compartilhados entre as versões.

Cada versão tem seu próprio `index.html`. A raiz abre a versão adulta. O endereço antigo `/infantil.html` encaminha à pasta infantil. Nas configurações infantis, o botão “Acessar versão infantil não letrada” abre a versão sem textos nos botões. A síntese de voz da versão visual depende do suporte e das vozes disponíveis no navegador/dispositivo.

Veja CONFIGURAR-GEMINI.md para configurar os recursos opcionais de IA das versões existentes.

Para verificar as páginas, os recursos locais e as rotas do servidor, execute `node --test tests/smoke.test.js` (Node.js 18 ou mais recente).
