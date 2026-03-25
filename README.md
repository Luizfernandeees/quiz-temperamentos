# Quiz dos Temperamentos — Deploy no Vercel

## Estrutura do projeto
```
quiz-temperamentos/
├── public/
│   └── index.html          ← Site completo
├── api/
│   └── verificar-pagamento.js  ← Função serverless (verifica o pagamento no MP)
├── vercel.json             ← Configuração de rotas
└── README.md
```

---

## Passo a passo para hospedar (15 minutos)

### 1. Criar conta no Vercel
Acesse https://vercel.com e crie uma conta gratuita (pode entrar com Google).

### 2. Criar conta no Mercado Pago Developers
Acesse https://developers.mercadopago.com e faça login com sua conta do MP.

### 3. Obter o Access Token do Mercado Pago
1. No painel do MP Developers, vá em **Suas integrações**
2. Crie uma aplicação (pode chamar de "Quiz Temperamentos")
3. Vá em **Credenciais de produção**
4. Copie o **Access Token** (começa com `APP_USR-...`)

### 4. Instalar o Vercel CLI (opcional — pode fazer pelo site também)
```bash
npm install -g vercel
```

### 5. Fazer deploy
**Opção A — pelo terminal:**
```bash
cd quiz-temperamentos
vercel --prod
```

**Opção B — pelo site (mais fácil):**
1. Acesse https://vercel.com/new
2. Escolha "Import Git Repository" ou "Upload"
3. Faça upload da pasta `quiz-temperamentos`

### 6. Adicionar variável de ambiente no Vercel
1. No painel do seu projeto no Vercel, vá em **Settings → Environment Variables**
2. Adicione:
   - **Nome:** `MP_ACCESS_TOKEN`
   - **Valor:** `APP_USR-seu-token-aqui` (o token que você copiou no passo 3)
3. Clique em **Save** e faça um novo deploy

---

## Como funciona a verificação

1. O usuário paga R$ 9,00 via Pix (código já configurado no site)
2. O banco gera um comprovante com um **ID de pagamento** (número)
3. O usuário cola esse ID no campo do site
4. O site envia para `/api/verificar-pagamento`
5. A função consulta a API do Mercado Pago com seu token privado
6. Se o pagamento estiver `approved` e o valor ≥ R$ 9,00, retorna um token assinado
7. O frontend valida o token e libera o resultado

## Segurança
- O `MP_ACCESS_TOKEN` fica **apenas no servidor** (variável de ambiente do Vercel), nunca no HTML
- O resultado só é exibido após receber um token válido do servidor
- A variável `pagamentoVerificado` é em memória e resetada ao recarregar a página
- Qualquer tentativa de chamar `showResult()` diretamente pelo console será bloqueada

---

## Código Pix configurado
`bfee0499-9fa0-4d25-9955-057a55c45b5a`
