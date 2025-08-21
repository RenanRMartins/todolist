# TodoList Hexagonal

## Descrição
Projeto de ToDo List simples usando **React + TypeScript + Vite + Tailwind** com **arquitetura Hexagonal**, princípios de **Clean Code** e **DIP**.

O objetivo é demonstrar:
- Separação de responsabilidades
- Uso de **Ports & Adapters**
- Injeção de dependência (DI)
- Código limpo e testável

---

## Stacks e Tecnologias
- **React 18**  
- **TypeScript**  
- **Vite** (bundler rápido)  
- **Tailwind CSS** (estilização utilitária)  
- **React Hook Form** (forms)  
- **LocalStorage** (adapter de infra)  
- **Arquitetura Hexagonal** (Ports & Adapters)  
- **Princípios SOLID** (DIP aplicado nos Use Cases e Repositório)

---

## Estrutura de Pastas

src/
domain/ # Entidades, Ports e Use Cases
entities/
ports/
usecases/
infrastructure/ # Implementações concretas (Adapters)
repositories/
di/ # Container de injeção de dependência
ui/ # Componentes React e páginas
components/
pages/
main.tsx # Entrada da aplicação
index.css # Tailwind CSS

---

## Funcionalidades
- Adicionar tarefa  
- Marcar tarefa como concluída  
- Remover tarefa  
- Filtrar tarefas (Todas | Pendentes | Concluídas)  
- Persistência via LocalStorage  
- Arquitetura limpa com Injeção de Dependência  
- Estilização com Tailwind CSS  
- Formulário com React Hook Form  

---

## Como rodar

1. Instale dependências:

```bash
npm install
npm run dev

Abra no navegador:
http://localhost:5173

Estrutura Hexagonal

Camadas:

Domain (Core)

Entidades (Todo) e Interfaces/Ports (TodoRepository)

Não conhece UI ou storage

Use Cases / Application

Contém regras de negócio (ex.: AddTodo, ToggleTodo)

Recebe abstrações via DI

Infrastructure / Adapters

Implementações concretas do repositório (LocalStorageTodoRepository)

Comunicação com storage ou APIs externas

UI / React Components

Consome os Use Cases do container

Nunca acessa storage diretamente

Boas práticas aplicadas

Código modular e testável

DIP (dependência de abstrações, não de implementações)

Entidades puras e desacopladas da UI

Tailwind para estilização sem misturar lógica e apresentação

Observações

Fácil de trocar storage: basta criar outro adapter implementando TodoRepository

Limite mínimo de dependências externas

Foco em Clean Code e arquitetura escalável