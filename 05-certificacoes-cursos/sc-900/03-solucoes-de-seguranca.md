# Domínio 3 — Soluções de segurança da Microsoft (35–40%)

O maior domínio. Foque em **o que cada serviço faz** e **qual escolher para cada cenário**.

## 3.1 Segurança de infraestrutura no Azure
| Serviço | Função | Camada |
|---|---|---|
| **Proteção contra DDoS** | Mitiga ataques volumétricos e de protocolo | L3/L4 |
| **Firewall do Azure** | Firewall gerenciado e com estado; regras de rede/aplicativo, filtro por FQDN, inteligência de ameaças | L3–L7 |
| **WAF** | Protege apps web (XSS, SQLi, OWASP Top 10); roda no Application Gateway ou Front Door | L7 |
| **Redes virtuais (VNet)** | Isolamento e **segmentação** de rede | — |
| **NSG** | Regras permitir/negar por IP, porta e protocolo, em sub-redes ou NICs | L3/L4 |
| **Azure Bastion** | RDP/SSH seguro pelo navegador (TLS), sem IP público na VM | — |
| **Key Vault** | Guarda segredos, chaves e certificados, com controle de acesso e auditoria | — |

## 3.2 Gerenciamento de segurança no Azure
**Microsoft Defender para Nuvem**
- **CSPM:** *secure score*, recomendações, conformidade regulatória.
- **Proteção de cargas de trabalho:** planos de Defender para servidores, armazenamento, bancos, contêineres etc.
- Funciona em multinuvem. Políticas e padrões de segurança orientam as recomendações.

## 3.3 Microsoft Sentinel
- **SIEM** (coleta, correlaciona e alerta) + **SOAR** (resposta automatizada com *playbooks*).
- Componentes: conectores de dados, regras de análise, incidentes, *workbooks*, *hunting* (KQL), *watchlists*, UEBA, playbooks (Logic Apps).
- A Microsoft vem integrando a experiência do Sentinel ao portal do Defender; confira o estado atual.

## 3.4 Microsoft Defender XDR
**XDR** = detecção e resposta estendidas, correlacionando sinais de várias fontes em **incidentes**.

| Produto | Protege | Exemplos |
|---|---|---|
| **Defender para Office 365** | E-mail e colaboração | Links/Anexos Seguros, antiphishing |
| **Defender para Ponto de Extremidade** | Dispositivos | EDR, redução de superfície de ataque, investigação automatizada |
| **Defender para Aplicativos de Nuvem** | Apps SaaS (CASB) | Descoberta de shadow IT |
| **Defender para Identidade** | AD local | Reconhecimento, movimento lateral, pass-the-hash |
| **Gerenciamento de Vulnerabilidades** | Vulnerabilidades e configurações | Descoberta e priorização contínuas |
| **Defender Threat Intelligence** | Contexto de ameaças | Atores, infraestrutura, IOCs |
| **Portal do Defender** | Console unificado | Incidentes, caça avançada |

## Perguntas de revisão
1. Qual a diferença entre NSG e Firewall do Azure?
2. Quando usar WAF em vez de Firewall do Azure?
3. O que é CSPM e como aparece no Defender para Nuvem?
4. Explique SIEM e SOAR com um exemplo de cada.
5. Qual produto do Defender detecta ataques a controladores de domínio?

## Pegadinhas de prova
- **NSG** é filtro básico L3/L4; **Firewall** é serviço gerenciado e central; **WAF** é L7 para web.
- **Bastion** elimina IP público para administração, mas não filtra tráfego.
- **Sentinel** é SIEM/SOAR; **Defender XDR** correlaciona sinais dos produtos Defender. Eles se complementam.
