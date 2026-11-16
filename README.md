# GarageFlow — Frontend

Frontend da plataforma **GarageFlow**, um sistema de gerenciamento de oficinas mecânicas desenvolvido para centralizar e organizar operações, clientes, veículos e ordens de serviço.

A aplicação foi desenvolvida utilizando React e TypeScript, com uma arquitetura baseada em componentes e separação de responsabilidades entre páginas, serviços, contextos e layouts.

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| React 19 | Construção da interface |
| TypeScript | Tipagem estática |
| Vite | Servidor de desenvolvimento e build |
| React Router | Gerenciamento de rotas |
| Sass | Estilização |
| Lucide React | Biblioteca de ícones |
| Vitest | Testes automatizados |
| React Testing Library | Testes de componentes |
| MSW | Simulação de requisições HTTP |
| ESLint | Análise estática de código |
| Docker | Ambiente de desenvolvimento |

## Arquitetura

O frontend utiliza uma organização modular, separando componentes reutilizáveis, páginas, serviços de integração e gerenciamento de estado compartilhado.

```text
src/
├── app/
│   └── AppRouter.tsx
├── components/
│   ├── Header/
│   ├── Sidebar/
│   ├── cards/
│   ├── ProtectedRoute/
│   └── PublicRoute/
├── contexts/
│   └── AuthContext/
├── layouts/
│   └── DashboardLayout/
├── pages/
│   ├── HomePage/
│   ├── LoginPage/
│   └── Users/
├── services/
│   ├── apiService.ts
│   ├── authService.ts
│   └── usersService.ts
├── styles/
├── test/
└── types/
```

### Responsabilidades dos módulos

- **app:** configuração e organização das rotas da aplicação.
- **components:** componentes reutilizáveis da interface.
- **contexts:** gerenciamento de estados compartilhados, como autenticação.
- **layouts:** estruturas visuais utilizadas para organizar as páginas.
- **pages:** páginas e funcionalidades da aplicação.
- **services:** comunicação com a API e centralização das operações de integração.
- **styles:** variáveis e estilos globais.
- **test:** configuração e infraestrutura dos testes automatizados.
- **types:** definições de tipos e interfaces compartilhadas.

## Pré-requisitos

Para executar o projeto localmente, é necessário possuir:

- Node.js 22 ou superior.
- npm.
- Docker e Docker Compose (opcional, para execução em container).

## Configuração do ambiente

Crie um arquivo `.env` na raiz do frontend, utilizando `.env.example` como referência.

```env
VITE_API_URL=http://localhost:8001/api
```

O Vite carrega automaticamente as variáveis definidas no arquivo `.env` localizado na raiz do projeto.

No ambiente Docker de desenvolvimento, o diretório do projeto é montado em `/app`, disponibilizando o arquivo `.env` para o Vite dentro do container.

> **Importante:** variáveis com prefixo `VITE_` são disponibilizadas no código executado pelo navegador. Não armazene senhas, tokens secretos ou outras informações sensíveis nesse arquivo.

A variável `VITE_API_URL` define a URL base da API consumida pelo frontend.

Ajuste o endereço conforme o ambiente em que o backend estiver sendo executado.

## Instalação e execução

### Execução local

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

```text
http://localhost:5173
```

### Execução com Docker

O frontend possui configuração Docker independente do backend.

Para construir a imagem e iniciar o container:

```bash
docker compose up --build
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

Para executar em segundo plano:

```bash
docker compose up -d --build
```

Para interromper os containers:

```bash
docker compose down
```

O ambiente Docker está configurado para desenvolvimento, com montagem do código-fonte e volume persistente para as dependências do Node.js.

## Autenticação e gerenciamento de sessão

O gerenciamento de autenticação é centralizado no `AuthContext`, responsável por disponibilizar o estado da sessão e as operações de login e logout para os componentes da aplicação.

A implementação utiliza:

- **Access token:** armazenado em `sessionStorage`.
- **Refresh token:** armazenado em cookie `HttpOnly`.
- **Renovação automática:** realizada quando uma requisição autenticada retorna HTTP 401.
- **Proteção de rotas:** implementada por meio dos componentes `ProtectedRoute` e `PublicRoute`.

Ao iniciar a aplicação, o `AuthProvider` tenta restaurar a sessão utilizando o refresh token.

O serviço de API também possui controle de concorrência para evitar múltiplas tentativas simultâneas de renovação da sessão.

## Comunicação com a API

A comunicação HTTP é centralizada em `apiService.ts`, responsável por padronizar as requisições e tratar a autenticação.

Os serviços específicos, como `authService.ts` e `usersService.ts`, encapsulam as operações relacionadas aos respectivos domínios.

Essa separação reduz o acoplamento entre a interface e a implementação da API.

## Testes automatizados

O projeto utiliza Vitest, React Testing Library e MSW para validar o comportamento dos serviços, contextos e componentes.

Os testes são executados em ambiente `jsdom`, que simula recursos do navegador durante a execução no Node.js.

A configuração dos testes está centralizada em:

```text
src/test/
├── handlers.ts
├── server.ts
└── setup.ts
```

Os testes são organizados próximos aos módulos que validam, facilitando sua manutenção.

### Executar os testes

Modo interativo:

```bash
npm run test
```

Interface visual:

```bash
npm run test:ui
```

Executar todos os testes uma vez:

```bash
npm run test:run
```

### Categorias de testes

Atualmente, existem testes para:

- Serviços de comunicação com a API.
- Serviços de autenticação.
- Gerenciamento de sessão no `AuthProvider`.
- Comportamento da página de login.
- Proteção de rotas autenticadas.
- Controle de acesso às rotas públicas.

O MSW é utilizado para interceptar e simular requisições HTTP durante os testes, permitindo validar diferentes respostas da API sem depender de um backend em execução.

## Qualidade de código e build

### Executar o ESLint

```bash
npm run lint
```

### Gerar build de produção

```bash
npm run build
```

O comando `npm run build` realiza a verificação de tipos do TypeScript e gera os arquivos otimizados para produção no diretório `dist/`.

O projeto possui configuração para geração do build, mas o processo de deploy em produção ainda não está configurado.

Para visualizar localmente o build gerado:

```bash
npm run preview
```

## Integração com o Backend

O frontend e o backend do GarageFlow são projetos independentes, com configurações e ciclos de execução próprios.

A integração entre eles acontece por meio de uma API HTTP, cuja URL base é definida pela variável `VITE_API_URL`.

Para executar a aplicação integrada, certifique-se de que o backend esteja disponível e que a URL configurada corresponda ao endereço acessível a partir do ambiente de execução do frontend.

---

**GarageFlow** — Plataforma de gerenciamento de oficinas mecânicas.