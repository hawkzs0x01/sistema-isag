# 📦 Sistema de Gestão e Controle de Estoque — ISAG


## 🎯 Sobre o Projeto
Este sistema web foi desenvolvido como um Mínimo Produto Viável (MVP) para o Instituto Solidário (ISAG). 

O principal objetivo é digitalizar e automatizar os processos logísticos da organização, substituindo a gestão analógica baseada em papéis e cadernos por uma infraestrutura em nuvem segura, organizada e escalável. O projeto foi desenvolvido como parte da disciplina de Extensão Curricularizada em Tecnologia, unindo engenharia de software e impacto social por meio dos Objetivos de Desenvolvimento Sustentável (ODS) da ONU.


### 🌱 ODS relacionados
* **ODS 2 — Fome Zero e Agricultura Sustentável:** otimização da gestão e distribuição de mantimentos.
* **ODS 9 — Indústria, Inovação e Infraestrutura:** utilização da tecnologia para modernizar processos do terceiro setor.


## ✨ Funcionalidades
* **🔐 Autenticação segura:** acesso restrito a gestores e voluntários autorizados.
* **📊 Dashboard interativo:** painel com métricas e informações relevantes para acompanhamento da operação.
* **👥 Gestão de cadastros:** registro centralizado de famílias atendidas e parceiros/doadores.
* **📦 Controle de estoque:** gerenciamento de entradas e saídas de mantimentos.
* **📱 Interface responsiva:** sistema adaptado para utilização em computadores, tablets e smartphones.
* **☁️ Histórico de movimentações:** armazenamento estruturado dos dados para facilitar consultas e relatórios.
* **🔥 Banco de dados em nuvem:** utilização do Firebase para armazenamento e gerenciamento das informações.


## 🛠️ Tecnologias Utilizadas

**Front-end**
* **React.js** — desenvolvimento da interface e componentização.
* **Vite** — ferramenta de build e servidor de desenvolvimento.

**Back-end e Banco de Dados**
* **Firebase Authentication** — autenticação dos usuários.
* **Cloud Firestore** — banco de dados NoSQL para armazenamento das informações.

**Hospedagem e Deploy**
* **Vercel** — hospedagem da aplicação e gerenciamento do deploy.


## 🚀 Como Executar o Projeto Localmente

**1. Clone o repositório**
Substitua a URL abaixo pelo endereço real do seu repositório:
```bash
git clone https://github.com/hawkzs0x01/sistema-isag.git
```

**2. Acesse a pasta do projeto**
```bash
cd sistema-isag
```

**3. Instale as dependências**
```bash
npm install
```

**4. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto e adicione as configurações do seu projeto Firebase seguindo o padrão utilizado pela aplicação.

*Exemplo:*
```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```
> **Importante:** não compartilhe chaves, credenciais ou informações sensíveis do seu projeto em repositórios públicos.

**5. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```
Após iniciar o servidor, acesse no navegador o endereço informado pelo Vite, normalmente: `http://localhost:5173`


## 📁 Estrutura do Projeto
Uma estrutura típica da aplicação pode ser organizada da seguinte maneira:

```text
controle-estoque-isag/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── firebase/
│   └── App.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```


## ☁️ Deploy
O projeto pode ser publicado em produção utilizando a **Vercel**. Após conectar o repositório à plataforma, configure as mesmas variáveis de ambiente utilizadas localmente no projeto e realize o deploy.


## 🔒 Segurança
O sistema utiliza recursos do Firebase para controle de acesso e armazenamento dos dados. Recomenda-se configurar corretamente as *Firebase Security Rules*, garantindo que cada usuário tenha apenas as permissões necessárias para executar suas funções dentro do sistema. Também é importante manter o arquivo `.env` fora do controle de versão quando ele contiver informações que não devem ser compartilhadas.


## 🎓 Contexto Acadêmico
Este projeto foi desenvolvido no contexto da disciplina de Extensão Curricularizada em Tecnologia, com o propósito de aplicar conhecimentos de desenvolvimento de software na resolução de problemas reais enfrentados por uma organização do terceiro setor. A proposta busca demonstrar como a tecnologia pode contribuir para:
* Melhorar a organização dos processos;
* Reduzir tarefas manuais;
* Facilitar o acompanhamento do estoque;
* Aumentar a confiabilidade das informações;
* Apoiar a tomada de decisões;
* Potencializar o impacto social da instituição.


## ❤️ Impacto Social
A digitalização dos processos do ISAG busca proporcionar uma gestão mais eficiente dos recursos destinados às famílias atendidas. Ao centralizar informações de estoque, movimentações, famílias e parceiros, o sistema contribui para uma operação mais organizada e para uma melhor utilização dos recursos disponíveis.


---
**👨‍💻 Desenvolvimento**
*Desenvolvido com dedicação para apoiar a gestão do terceiro setor e contribuir para a geração de impacto social por meio da tecnologia.*


## 📌 Próximos Passos
Algumas funcionalidades que podem ser incorporadas em futuras versões:
- [ ] 📈 Relatórios avançados de estoque.
- [ ] 📊 Gráficos históricos de movimentações.
- [ ] 📄 Exportação de relatórios em PDF/Excel.
- [ ] 🔔 Alertas de estoque baixo.
- [ ] 👤 Gerenciamento avançado de permissões.
- [ ] 📱 Melhorias contínuas na experiência mobile.
- [ ] 🔎 Filtros e pesquisas avançadas.
- [ ] 📋 Registro detalhado das distribuições realizadas.