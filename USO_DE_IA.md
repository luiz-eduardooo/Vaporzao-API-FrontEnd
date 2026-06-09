# 🤖 Explicação de uso de IA — Vaporzão Frontend

Documento exigido na entrega final, descrevendo de forma transparente como
ferramentas de Inteligência Artificial foram utilizadas no desenvolvimento
do projeto.

---

## Onde a IA foi usada

Durante o desenvolvimento, usamos assistentes de IA como **apoio**, sempre com
revisão humana do grupo. Os principais usos foram:

- **Estruturação inicial do projeto** — sugestões de organização de pastas
  (`components`, `pages`, `services`, `hooks`, `context`, `utils`) seguindo
  boas práticas de projetos React.
- **Componentização da UI** — apoio na escrita de componentes reutilizáveis
  (cards de jogo, cabeçalho, rodapé, carrossel, filtros de gênero) e no uso
  das classes do Tailwind CSS dentro da paleta cyberpunk definida pelo grupo.
- **Integração com a API** — apoio na configuração do Axios (`services/api.js`),
  no interceptor que envia o token no header `token` e nos hooks de busca de
  dados (`useDestaques`, `useTodosJogos`, etc.).
- **Tratamento de estados** — padrões de carregamento, erro e estados vazios
  nas telas (Biblioteca, Wishlist, Resultado de Busca, Meus Jogos).
- **Revisão e correção de código** — identificação e correção de:
  - código morto e componentes duplicados;
  - erros apontados pelo ESLint (componentes declarados dentro do render,
    `setState` síncrono em efeitos, atribuições inúteis);
  - logs de depuração esquecidos no código;
  - inconsistências entre o README e o que o projeto realmente faz.
- **Documentação** — apoio na escrita do README, do `.env.example` e deste
  próprio documento.

---

## O que foi decidido e revisado pelo grupo (sem IA)

- A **identidade visual** (paleta de cores, tema cyberpunk, logo) foi uma
  decisão do grupo.
- A **definição de funcionalidades** e a leitura do cronograma do professor.
- As **adaptações de escopo** — por exemplo, tratar carrinho e notificações
  como elementos decorativos, já que a Vaporzão API não possui esses
  endpoints (ver `Cronograma.md`).
- Todo o **código gerado com apoio de IA foi lido, testado e ajustado** pelo
  grupo antes de entrar no projeto.

---

## Limitações conhecidas

- **Login real:** a autenticação usa a Vaporzão API de verdade
  (`POST /auth/login` e `POST /auth/primeiro-acesso`), com o token enviado no
  header `token`.
- Todos os serviços foram alinhados à documentação oficial da API (coleção do
  Postman): jogos, gêneros, biblioteca, wishlist, reviews e conquistas usam os
  endpoints e os formatos de payload reais.
- A API não fornece uma **média de avaliação** pronta; a página do jogo calcula
  a média a partir das reviews retornadas, e os cards mostram a contagem de
  reviews.

---

## Ferramentas utilizadas

- Assistente de IA conversacional (para as tarefas descritas acima).
- ESLint para verificação automática de qualidade de código.
- Vite para build e servidor de desenvolvimento.
