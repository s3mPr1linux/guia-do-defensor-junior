# Trilha SC-900 — Microsoft Security, Compliance and Identity Fundamentals

> Baseado no [guia de estudo oficial do SC-900](https://learn.microsoft.com/pt-br/credentials/certifications/resources/study-guides/sc-900) (página atualizada em 26/06/2026; habilidades medidas **a partir de 28/07/2026**). Os exames mudam: **confira o guia oficial antes de agendar**.

## Para quem é
Quem quer entender, em nível de fundamentos, como a Microsoft trata **segurança, conformidade e identidade** em Azure e Microsoft 365. Não exige experiência técnica prévia, mas ajuda conhecer o básico de nuvem. É uma boa porta de entrada antes do **SC-200** (Security Operations Analyst), a certificação mais próxima do trabalho de SOC.

## Por que isso importa para um Defensor Júnior
Muitas empresas usam Microsoft 365, Entra ID, Defender e Sentinel. Saber o que cada produto faz (e de onde vem cada alerta) acelera a triagem e a conversa com times de TI e de conformidade.

> **Certificar ou não:** o SC-900 é de fundamentos e **não é requisito** para vaga de júnior. Vale como vocabulário e estrutura de estudo. Portfólio e prática pesam mais (veja a [pasta 06](../../06-portfolio-github/)).

## Formato e nota
- Nota para aprovação: **700 ou mais**.
- Há uma [avaliação simulada gratuita](https://learn.microsoft.com/pt-br/credentials/certifications/exams/sc-900/practice/assessment?assessment-type=practice&assessmentId=11) e uma [área restrita do exame](https://aka.ms/examdemo).
- O guia oficial não lista duração nem número de questões; consulte a página do exame ao agendar.
- Se o exame não estiver no seu idioma, é possível pedir 30 minutos adicionais.

## Domínios e pesos (versão a partir de 28/07/2026)
| # | Domínio | Peso | Estudo | Labs |
|---|---|---|---|---|
| 1 | Conceitos de segurança, conformidade e identidade | 10–15% | [Módulo 01](01-conceitos-seguranca-conformidade-identidade.md) | [Lab 01](../../04-laboratorios/sc-900/lab-01-hash-e-criptografia/), [Lab 02](../../04-laboratorios/sc-900/lab-02-responsabilidade-defesa-zero-trust/) |
| 2 | Recursos do Microsoft Entra | 25–30% | [Módulo 02](02-microsoft-entra.md) | [Lab 03](../../04-laboratorios/sc-900/lab-03-entra-identidades-mfa-rbac/), [04](../../04-laboratorios/sc-900/lab-04-acesso-condicional/), [05](../../04-laboratorios/sc-900/lab-05-pim-revisoes-id-protection/) |
| 3 | Soluções de segurança da Microsoft | 35–40% | [Módulo 03](03-solucoes-de-seguranca.md) | [Lab 06](../../04-laboratorios/sc-900/lab-06-rede-azure-nsg-key-vault/), [07](../../04-laboratorios/sc-900/lab-07-defender-for-cloud-cspm/), [08](../../04-laboratorios/sc-900/lab-08-kql-sentinel/), [09](../../04-laboratorios/sc-900/lab-09-defender-xdr/) |
| 4 | Soluções de conformidade da Microsoft | 20–25% | [Módulo 04](04-solucoes-de-conformidade.md) | [Lab 10](../../04-laboratorios/sc-900/lab-10-service-trust-compliance-manager/), [11](../../04-laboratorios/sc-900/lab-11-purview-rotulos-dlp-retencao/), [12](../../04-laboratorios/sc-900/lab-12-risco-interno-ediscovery-auditoria/) |

O domínio 3 é o maior: dedique a ele cerca de 40% do tempo.

## Novidades da versão de julho/2026
O log de alterações da Microsoft marca mudanças **secundárias** em tipos de identidade, acesso condicional/RBAC, serviços de infraestrutura do Azure, Sentinel e Portal de Confiança do Serviço. O guia agora cita a **ID do agente** (identidades de agentes de IA), o **Gerenciamento de Vulnerabilidades do Defender**, o **Defender Threat Intelligence** e o **portal do Defender**. Revise esses pontos.

## Como usar esta trilha
1. Veja o [cronograma de 4 semanas](cronograma-4-semanas.md).
2. Por domínio: leia o módulo → faça os labs → responda as perguntas de revisão.
3. Nas últimas semanas, use o [cheatsheet "cenário → solução"](cheatsheet-cenario-solucao.md).
4. Faça a [autoavaliação](autoavaliacao.md) (gabarito em [arquivo separado](autoavaliacao-gabarito.md)) e o simulado oficial.
5. Documente os labs no seu GitHub. **Nunca publique IDs de tenant, e-mails reais, chaves ou prints com dados pessoais.**

## Recursos oficiais (gratuitos)
- Módulos e roteiros do Microsoft Learn para o SC-900 (a página do exame mostra as duas formas de preparação)
- Documentação de Segurança da Microsoft, Segurança do Azure, Microsoft Entra, Microsoft Sentinel, Microsoft Defender XDR, Microsoft Purview e Portal de Confiança do Serviço
- Vídeos: *Exam Readiness Zone* e programas do Microsoft Learn

## Aviso sobre labs, licenças e custos
Vários recursos exigem licenças pagas ou período de avaliação (por exemplo Acesso Condicional, PIM, ID Protection e partes do Purview e do Defender). Cada lab indica o que precisa e, quando possível, traz uma alternativa sem custo. **Confirme preços e requisitos na documentação atual**, use um tenant só de estudo, configure alertas de orçamento no Azure e apague os recursos ao terminar.
