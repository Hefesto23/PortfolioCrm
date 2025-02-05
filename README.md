# Portfolio CRM

Sistema de CRM desenvolvido com Node.js e React, utilizando arquitetura modular e boas práticas de desenvolvimento.

## 🚀 Stack Tecnológica

### Backend

- Node.js 18.20.x
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- RBAC Authorization
- Jest para testes
- Winston para logs

### Frontend (Em Desenvolvimento)

- React
- TypeScript
- Vite
- Tailwind CSS
- React Query
- Shadcn/UI

## 🛠️ Pré-requisitos

- Node.js >= 18.20.0
- npm >= 9.0.0
- PostgreSQL >= 13

## ⚙️ Configuração do Ambiente

1. Clone o repositório

```bash
git clone https://github.com/Hefesto23/PortfolioCrm.git
cd PortfolioCrm
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp backend/.env.example backend/.env
```

4. Configure o arquivo `.env` com suas credenciais:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_crm
JWT_SECRET=seu-jwt-secret
```

5. Execute as migrations do Prisma

```bash
npm run prisma:migrate
```

## 🚀 Iniciando o Desenvolvimento

```bash
# Inicia backend e frontend
npm run dev

# Inicia apenas o backend
npm run dev:backend

# Inicia apenas o frontend
npm run dev:frontend
```

## 📝 Scripts Disponíveis

```bash
# Build
npm run build                 # Compila backend e frontend
npm run build:backend        # Compila apenas o backend
npm run build:frontend      # Compila apenas o frontend

# Testes
npm run test               # Executa todos os testes
npm run test:backend      # Executa testes do backend
npm run test:frontend    # Executa testes do frontend

# Prisma
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate  # Executa migrações
npm run prisma:studio  # Abre interface do Prisma Studio
```

## 📁 Estrutura do Projeto

```
portfolio-crm/
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── modules/         # Módulos do sistema
│   │   │   ├── users/       # Gestão de usuários
│   │   │   ├── clients/     # Gestão de clientes
│   │   │   ├── deals/       # Pipeline de vendas
│   │   │   └── notes/       # Sistema de notas
│   │   └── shared/          # Código compartilhado
│   ├── prisma/              # Schema e migrações
│   └── tests/               # Testes automatizados
└── frontend/                # Interface React
    └── src/                 # (Em desenvolvimento)
```

## 🔐 Funcionalidades Implementadas

### Autenticação e Autorização

- Login/Registro com JWT
- Refresh tokens
- Recuperação de senha
- Verificação de email
- RBAC (Role Based Access Control)

### Gestão de Clientes

- CRUD completo
- Categorização (Lead/Prospect/Client)
- Atribuição de responsáveis
- Filtros avançados

### Pipeline de Vendas

- Gestão de oportunidades
- Estágios personalizáveis
- Métricas e análises
- Valores e datas de fechamento

### Sistema de Notas

- Registro de interações
- Vinculação com clientes/deals
- Histórico completo
- Controle de acesso

## 🧪 Testes

O projeto inclui testes unitários e de integração:

```bash
# Executa todos os testes
npm run test

# Executa testes com coverage
npm run test:coverage

# Executa testes de integração
npm run test:int
```

## 📦 Produção

Para build de produção:

```bash
# Build completo
npm run build

# Start em produção
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Vinícius Raszl

- LinkedIn: [Vinícius Raszl](https://www.linkedin.com/in/raszl/)
