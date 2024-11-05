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
   ```bash
   npm install
   npm install express cors dotenv mysql2 jsonwebtoken bcrypt path
   ```
4. Configure o banco de dados MySQL e crie as tabelas necessárias conforme descrito na documentação.
5. Inicie o servidor:
   ```bash
   node src/server.js
   ```
6. Abra o navegador e acesse `http://localhost:3000`(Não temos ainda site 😔).

## Uso
- Acesse a página de login para entrar no sistema.
- Se você não tiver uma conta, use a opção de registro para criar uma.
- Após o login, você pode agendar laboratórios e consultar seus agendamentos.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

Este projeto foi desenvolvido pelo Grupo 1
(Thalles, Isabela, Raul e Philipi) para a Disciplina de 2CAW da FAETERJ-RIO como parte do trabalho acadêmico para o professor Hamilcar Silva/UNIG. O sistema tem como objetivo facilitar a reserva de laboratórios e computadores, permitindo que estudantes e professores realizem reservas de forma prática e eficiente, com funcionalidades de consulta em tempo real, notificações de notificação, e uma interface amigável e responsiva.


## Contato
Para mais informações, entre em contato com [thalles.24104708360068@faeterj-rio.edu.br](mailto:thalles.24104708360068@faeterj-rio.edu.br).
