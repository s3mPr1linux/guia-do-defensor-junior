# Lab 09 — Microsoft Defender XDR: e-mail, endpoint, identidade e portal

**Domínio 3** · **Nível:** Intermediário · **Tempo:** ~2 h · **Licença:** exige produtos Defender (avaliação/trial de Microsoft 365 E5 ou tenant de demonstração). **Sem licença, faça a Parte 5 (estudo de caso) e leia a documentação.**

> ⚠️ Execute apenas em tenant de estudo. **Não** teste phishing real contra pessoas, e **não** use o tenant da empresa.

## Parte 1 — Portal do Defender
1. Abra o portal do Defender e descreva as seções principais (incidentes, caça avançada, inteligência de ameaças, vulnerabilidades, relatórios).
2. Em **Incidentes**, veja como alertas de fontes diferentes são agrupados.

## Parte 2 — Defender para Office 365
3. Veja as políticas **antiphishing**, **Links Seguros** e **Anexos Seguros** e liste o que cada uma faz.
4. Use o **treinamento de simulação de ataque** (se disponível) para enviar uma simulação **apenas a contas de teste**.
5. Em **Explorador de ameaças** (ou equivalente), localize e-mails de teste.

## Parte 3 — Defender para Ponto de Extremidade
6. Se tiver um dispositivo de teste integrado, veja a linha do tempo do dispositivo. Caso contrário, leia os requisitos de integração.
7. Explique a diferença entre **EDR**, **redução de superfície de ataque** e **investigação automatizada**.

## Parte 4 — Identidade, aplicativos e vulnerabilidades
8. Defender para Identidade: que ataques ele detecta e onde ficam os sensores?
9. Defender para Aplicativos de Nuvem: o que é **descoberta de shadow IT**?
10. Gerenciamento de Vulnerabilidades: o que significa **exposição** e como as recomendações são priorizadas?
11. Defender Threat Intelligence: dê um exemplo de uso numa investigação.

## Parte 5 — Estudo de caso (sem licença)
Um usuário clicou em um link de phishing, a máquina baixou um malware que roubou credenciais e o atacante tentou acessar o AD. Para cada etapa, indique **qual produto do Defender detecta** e **qual ação de resposta** o SOC tomaria. Mostre como o **XDR** une tudo em um único incidente.

## O que documentar
Mapa "etapa do ataque → produto → ação", em tabela.

Gabarito: [solucao.md](solucao.md)
