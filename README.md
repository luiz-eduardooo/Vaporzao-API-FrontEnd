# 🎮 Vaporzão — Frontend

Loja de jogos web inspirada na Steam, desenvolvida como trabalho da disciplina
de Front-End. O projeto consome a **Vaporzão API** (paródia didática da Steam)
e implementa uma plataforma completa de descoberta, biblioteca e publicação de
jogos.

> ⚠️ Projeto acadêmico. A Vaporzão API é uma API didática e os dados são
> fictícios.

---

## ✨ Funcionalidades

- **Loja (Home):** carrossel de destaques, lançamentos recentes, mais bem
  avaliados, populares na comunidade e navegação por gênero.
- **Página do jogo:** mídia (screenshots e vídeos), descrição, conquistas e
  reviews da comunidade.
- **Biblioteca:** jogos que o usuário possui, com horas jogadas.
- **Wishlist:** lista de desejos do usuário.
- **Meus Jogos:** criação, edição e exclusão de jogos publicados pelo usuário
  (limite de 3 por usuário, conforme a API).
- **Login / Primeiro acesso:** autenticação por matrícula e senha.
- **Busca e filtros:** pesquisa por título e filtro por gênero.

---

## 🛠️ Tecnologias

- **[Vite](https://vitejs.dev/)** — build tool e dev server
- **[React](https://react.dev/)** — biblioteca de UI (JavaScript)
- **[React Router](https://reactrouter.com/)** — roteamento entre páginas
- **[Tailwind CSS](https://tailwindcss.com/)** — estilização
- **[Axios](https://axios-http.com/)** — requisições HTTP à API

---

## 🎨 Identidade visual

Tema dark com vibe *cyberpunk* leve — fugindo do azul característico da Steam.

| Token              | Cor       | Uso                          |
| ------------------ | --------- | ---------------------------- |
| Fundo primário     | `#0B0014` | Background geral             |
| Fundo secundário   | `#150826` | Cards                        |
| Fundo terciário    | `#1F0F38` | Hover / elementos elevados   |
| Roxo neon          | `#B026FF` | Primária / ações             |
| Verde-ácido        | `#9FFF3D` | Destaques / preços / sucesso |
| Texto primário     | `#F2EAFF` | Textos principais            |
| Texto secundário   | `#9B8FB0` | Textos de apoio              |
| Erro               | `#FF3D6E` | Mensagens de erro            |

---

## 📁 Estrutura de pastas

```
vaporzao-frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── assets/             # Imagens, ícones, fontes
│   ├── components/         # Componentes reutilizáveis
│   │   ├── layout/         # Header, Footer
│   │   ├── game/           # Cards de jogo, badges
│   │   └── ui/             # Botões, inputs, modais
│   ├── pages/              # Telas (Home, Jogo, Biblioteca, etc.)
│   ├── services/           # Conexão com a API (axios)
│   ├── context/            # Estado global (auth, biblioteca, wishlist)
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Funções auxiliares
│   ├── routes/             # Configuração de rotas
│   ├── App.jsx
│   └── main.jsx
├── .env.example            # Exemplo de variáveis de ambiente
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── CRONOGRAMA.md           # Cronograma de entregas
└── README.md
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (vem com o Node.js)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/<usuario>/vaporzao-frontend.git
cd vaporzao-frontend

# 2. Instalar as dependências
npm install

# 3. Configurar as variáveis de ambiente
cp .env.example .env
# edite o .env com a URL da API

# 4. Rodar o projeto em modo desenvolvimento
npm run dev
```

O projeto ficará disponível em `http://localhost:5173`.

### Scripts disponíveis

| Comando           | Descrição                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento   |
| `npm run build`   | Gera a build de produção               |
| `npm run preview` | Visualiza a build de produção          |
| `npm run lint`    | Executa o linter                       |

---

## 🔌 API

O projeto consome a **Vaporzão API**. A URL base é configurada via variável
de ambiente `VITE_API_URL` no arquivo `.env`.

A autenticação é feita por **matrícula + senha** (`POST /auth/login`), e o
token JWT retornado deve ser enviado no header `token` das requisições
autenticadas.

---

## 👥 Autores

Trabalho desenvolvido em grupo para a disciplina de Front-End:

- **Luiz Eduardo**
- **Kauã**
- **Liandra**
- **Karol**

---

## 📄 Licença

Projeto de uso exclusivamente acadêmico.