# OvertimeOS — Sistema de Gestão de Horas Extras

Sistema interno da **Fermazon** para registro e controle de solicitações de horas extras, com autenticação por departamento, painel administrativo e integração via webhook com o Sólides.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Java 17, Spring Boot 3.2.5, Spring Security, Flyway |
| Banco de Dados | PostgreSQL 14+ |
| Frontend | Angular 17, Angular Material |
| Servidor Web | Nginx |
| Serviços Windows | NSSM |

---

## Estrutura do Repositório

```
Solicitacao_Recursos/
├── overtime-backend/     ← API REST (Spring Boot)
│   ├── src/
│   └── pom.xml
└── overtime-frontend/    ← SPA (Angular)
    ├── src/
    └── package.json
```

---

## Requisitos do Sistema

Consulte o arquivo [requirements.txt](requirements.txt) para a lista completa de dependências e versões necessárias.

---

## 1. Banco de Dados (PostgreSQL)

```sql
CREATE DATABASE overtimeos;
```

As migrations Flyway criam e populam todas as tabelas automaticamente na primeira inicialização do backend.

### Credenciais padrão dos departamentos

| Departamento | Senha |
|---|---|
| TI, Financeiro, RH, Comercial, PCP | `1234` |
| Serviços Gerais | `admin@2025` |

---

## 2. Backend (Spring Boot)

### Variáveis de ambiente (`.env` ou variáveis do sistema)

| Variável | Descrição |
|---|---|
| `DB_URL` | URL JDBC do PostgreSQL |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Chave secreta JWT (mín. 32 chars) |
| `JWT_EXPIRATION` | Tempo de expiração em ms |
| `SOLIDES_TOKEN` | Token de autenticação do webhook Sólides |

### Build e execução

```bash
cd overtime-backend
mvn clean package -DskipTests
java -jar target/overtime-backend-1.0.0.jar
```

A API estará disponível em `http://localhost:8080`

### Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login por departamento |
| GET | `/api/departments` | Listar departamentos |
| GET | `/api/employees` | Listar colaboradores ativos |
| GET | `/api/requests` | Listar solicitações |
| POST | `/api/requests` | Criar solicitação |
| PATCH | `/api/requests/{id}/confirm` | Confirmar solicitação (Admin) |
| PATCH | `/api/requests/{id}/cancel` | Cancelar solicitação (Admin) |
| GET | `/api/dashboard` | Dados do dashboard (Admin) |
| POST | `/api/webhook/solides` | Receber eventos do Sólides |

### Webhook Sólides

O endpoint `/api/webhook/solides` aceita os eventos:

- `edicao_colaborador` — Atualiza dados do colaborador
- `novo_colaborador` — Cadastra novo colaborador
- `demissao_colaborador` — Marca colaborador como inativo

---

## 3. Frontend (Angular)

### Instalar dependências

```bash
cd overtime-frontend
npm install
```

### Desenvolvimento local

```bash
ng serve
# Disponível em http://localhost:30001
```

### Build para produção

```bash
ng build
# Saída em: C:/Sistemas/sistema_recursos/frontend
```

---

## 4. Deploy em Produção (Windows)

### Portas utilizadas

| Serviço | Porta |
|---|---|
| Nginx (Frontend + Proxy) | 4200 |
| Backend (API) | 8080 |
| PostgreSQL | 5432 |

### Serviços Windows (NSSM)

```
sistema_recursos_back   ← Backend Spring Boot
Nginx                   ← Servidor web / proxy reverso
```

Execute `instalar_servicos.bat` como Administrador para registrar os serviços.

### Nginx

O Nginx serve o build Angular na porta 4200 e faz proxy de `/api/` para o backend na porta 8080. Configuração em `C:/nginx/conf/nginx.conf`.

---

## Fluxo de Autenticação

1. Frontend envia `POST /api/auth/login` com `{ department, password }`
2. Backend valida e retorna JWT
3. Frontend armazena o token e o envia como `Authorization: Bearer <token>` em todas as chamadas
4. Backend valida o JWT a cada requisição via `JwtAuthFilter`
