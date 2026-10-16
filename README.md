# Veritas Condomínio

Aplicação web para apoiar a comunicação e a organização de um condomínio. O projeto tem fluxos para moradores e síndico, com foco em chamados, assembleias e análise de propostas.

> **Estado do projeto:** protótipo frontend. Os dados ficam em memória no serviço Angular e não são persistidos em um backend. A autenticação também é simulada; não use dados reais nem credenciais reais neste protótipo.

## Funcionalidades

- **Chamados:** registro e acompanhamento de solicitações do condomínio.
- **Assembleias:** o síndico agenda reuniões com data, horário, local ou link e pauta.
- **Propostas e votação:** moradores enviam projetos com descrição e estimativa de preço; os demais moradores podem votar a favor ou contra.
- **Análise do síndico:** aprovação ou recusa de propostas e acompanhamento de denúncias enviadas pelos moradores.
- **Projetos aprovados:** síndico atualiza o progresso e moradores acompanham a execução.
- **Cadastro:** formatação de CPF e telefone durante a digitação.
- **Layout responsivo:** telas adaptadas para uso em computadores e celulares.

## Tecnologias

- Angular 22
- TypeScript
- HTML e CSS
- Angular Material Icons
- RxJS

## Requisitos

- Node.js compatível com a versão do Angular CLI instalada no projeto.
- npm 10 ou superior.

## Como executar

No terminal, entre na pasta da aplicação e instale as dependências:

```bash
cd condiminio-master
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Abra [http://localhost:4200](http://localhost:4200). O Angular atualiza a aplicação quando os arquivos são alterados.

## Build e testes

Para gerar a versão de build:

```bash
npm run build
```

Para executar os testes configurados no projeto:

```bash
npm test
```

## Organização do código

O código da aplicação está na pasta `condiminio-master/src/app`:

- `assembleia/`: telas e regras de assembleias, votações, denúncias e análise de projetos.
- `chamados/`: interface de chamados.
- `moradores/`: gestão de convites e unidades.
- `cadastro-morador/`: formulário de cadastro.
- `condominio.store.ts`: serviço em memória que centraliza os dados e as operações do protótipo.
- `cpf-mask.ts`: formatação de CPF e telefone.

## Limitações do protótipo

As operações mostradas na interface não fazem requisições HTTP. Propostas, votos, denúncias, assembleias e progresso são mantidos em memória e podem desaparecer ao recarregar a página. Para uso real, é necessário integrar uma API e implementar no servidor autenticação, autorização, validação dos dados e persistência.
