# Configurar o Gemini para desenvolvimento

O front-end não guarda nem envia a chave do Gemini. As chamadas passam pelo servidor local em `server.js`, que lê a chave de `GEMINI_API_KEY` e a encaminha ao Google.

## Cada pessoa do grupo

1. Instale o Node.js 18 ou mais recente.
2. Crie uma chave pessoal no [Google AI Studio](https://aistudio.google.com/apikey).
3. Copie `.env.example` para `.env` e preencha `GEMINI_API_KEY` com a sua chave.
4. Inicie o projeto na raiz do repositório:

   ```powershell
   node server.js
   ```

5. Abra `http://127.0.0.1:4173` no navegador. Para usar a versão infantil, abra `http://127.0.0.1:4173/infantil.html`.

O `.env` está no `.gitignore`; cada colaborador mantém o próprio segredo no computador. O `.env.example` sem chave pode ser versionado para documentar a configuração.

## GitHub e publicação

Compartilhe o código pelo GitHub, nunca a chave. Não coloque a chave em HTML, JavaScript, commits, issues, capturas de tela ou logs. As chaves do GitHub Actions servem para workflows e não ficam disponíveis com segurança para o JavaScript que roda no navegador.

O servidor incluído escuta apenas em `127.0.0.1`, para testes locais do grupo. Não o exponha diretamente à internet: um proxy público precisa de autenticação e limites de uso. Para publicar uma demonstração, hospede o backend e configure a chave como segredo no ambiente do provedor; o site deve chamar esse backend, nunca o Google diretamente.

Se o site e o backend forem hospedados em domínios diferentes, configure o backend para aceitar chamadas apenas do domínio do site e use autenticação e limites de uso. CORS sozinho não impede abuso de uma API pública.

Se uma chave real já foi publicada ou compartilhada, revogue-a no Google AI Studio e gere outra.
