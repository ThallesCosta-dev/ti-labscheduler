# TI LabScheduler

## Descrição
O TI LabScheduler é um aplicativo web desenvolvido para gerenciar agendamentos de laboratórios de informática. Ele permite que usuários se registrem, façam login, agendem horários em laboratórios e consultem agendamentos existentes. O aplicativo também possui um painel administrativo para gerenciar usuários e agendamentos.

## Funcionalidades
- **Registro de Usuário**: Usuários podem se registrar no sistema.
- **Login de Usuário**: Usuários podem fazer login com suas credenciais.
- **Agendamento de Laboratórios**: Usuários podem selecionar um laboratório, escolher a data, hora e duração do agendamento.
- **Consulta de Agendamentos**: Usuários podem consultar seus agendamentos existentes.
- **Painel Administrativo**: Administradores podem gerenciar usuários e agendamentos.
- **Modo Noturno**: O aplicativo oferece um modo noturno para melhor visualização em ambientes com pouca luz.

## Tecnologias Utilizadas
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express
- **Banco de Dados**: MySQL
- **Controle de Versão**: Git e GitHub

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/ThallesCosta-Dev/ti-labscheduler.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd ti-labscheduler
   ```
3. Instale as dependências do backend:
   Instale o Node.js
   ```bash
   npm install
   npm install express cors dotenv mysql2 jsonwebtoken bcrypt path
   ```
4. Configure o banco de dados MySQL e crie as tabelas necessárias conforme descrito na documentação.
```bash
   -- Criar o banco de dados
CREATE DATABASE ti_labscheduler;
USE ti_labscheduler;

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    matricula VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'professor', 'aluno') NOT NULL DEFAULT 'aluno',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE schedulings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    laboratory VARCHAR(50) NOT NULL,
    computer_number VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME NOT NULL,
    supervisor VARCHAR(100) NOT NULL,
    responsible VARCHAR(100) NOT NULL,
    student_count INT NOT NULL,
    required_programs TEXT,
    status ENUM('pendente', 'confirmado', 'cancelado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para otimização
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_scheduling_date ON schedulings(date);
CREATE INDEX idx_scheduling_laboratory ON schedulings(laboratory);
CREATE INDEX idx_scheduling_user ON schedulings(user_id);

-- Inserir usuário admin padrão (senha: Admin@123)
INSERT INTO users (name, email, password, matricula, birth_date, phone, role)
VALUES (
    'Administrador',
    'admin@admin.edu.br',
    '$2b$10$YourHashedPasswordHere',
    '00000',
    '2000-01-01',
    '(00) 00000-0000',
    'admin'
);
```
6. Inicie o servidor:
   ```bash
   node src/server.js
   ```
7. Abra o navegador e acesse `http://localhost:3000`(Não temos ainda site 😔).

## Uso
- Acesse a página de login para entrar no sistema.
- Se você não tiver uma conta, use a opção de registro para criar uma.
- Após o login, você pode agendar laboratórios e consultar seus agendamentos.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

Este projeto foi desenvolvido pelo Grupo 1 (Thalles, Isabela, Raul e Philipi) para a Disciplina de 2CAW da FAETERJ-RIO como parte do trabalho acadêmico para o professor Hamilcar Silva/UNIG. O sistema tem como objetivo facilitar a reserva de laboratórios e computadores, permitindo que estudantes e professores realizem reservas de forma prática e eficiente, com funcionalidades de consulta em tempo real, notificações de notificação, e uma interface amigável e responsiva.


## Contato
Para mais informações, entre em contato com esse [Email](mailto:thalles.24104708360068@faeterj-rio.edu.br).
