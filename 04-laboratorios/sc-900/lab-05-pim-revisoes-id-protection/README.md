# Lab 05 — PIM, revisões de acesso, ID Governance e ID Protection

**Domínio 2** · **Nível:** Intermediário · **Tempo:** ~2 h · **Licença:** normalmente exige P2/ID Governance (confirme na documentação atual). **Sem licença, faça apenas as questões de estudo no fim.**

## Parte 1 — PIM (acesso just-in-time)
1. Em *Privileged Identity Management*, torne `bruno.teste` **elegível** (não ativo) para a função Leitor de Segurança.
2. Configure: duração máxima 2 h, exigir MFA e justificativa na ativação.
3. Faça o login como `bruno.teste`, **ative** a função e anote o que muda.
4. Veja o histórico de auditoria da ativação.

## Parte 2 — Revisão de acesso
5. Crie uma **revisão de acesso** para o grupo `SOC-Analistas` com revisor = gerente (ou você) e recorrência trimestral.
6. Defina o que acontece se o revisor não responder.
7. Qual a diferença entre acesso **elegível** e **ativo**?

## Parte 3 — ID Governance (leitura)
8. Descubra o que são **pacotes de acesso** e **fluxos de trabalho de ciclo de vida** e dê um exemplo de uso (entrada/saída de funcionário).

## Parte 4 — ID Protection (leitura e relatórios)
9. Abra os relatórios de **usuários de risco** e **entradas de risco**. Quais níveis de risco existem?
10. Descreva como uma política baseada em risco poderia ser definida no Acesso Condicional (ex.: exigir troca de senha para risco alto de usuário).

## Se não tiver licença
Responda por escrito: (a) que problema o PIM resolve? (b) por que revisar acessos periodicamente? (c) qual a diferença entre Acesso Condicional e ID Protection?

## Limpeza
Remova atribuições elegíveis e revisões de teste.

Gabarito: [solucao.md](solucao.md)
