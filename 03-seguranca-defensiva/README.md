# Fase 3 — Segurança defensiva na prática

- Logs e telemetria (Syslog, Windows Events, firewall, proxy)
- SIEM (Wazuh, Elastic, Splunk): buscas, dashboards, regras
- EDR/XDR: alertas, isolamento, árvore de processos
- Triagem de alertas: verdadeiro/falso positivo, priorização
- Phishing: análise de cabeçalhos, URLs, anexos, sandbox
- Threat Intelligence: IOCs, VirusTotal, AbuseIPDB, MISP
- Resposta a incidentes: preparação → detecção → contenção → erradicação → recuperação → lições
- Detecção como código: Sigma, YARA
- Hardening: CIS Benchmarks

## Entregável
Um relatório de incidente simulado (use `06-portfolio-github/template-relatorio-incidente.md`).

## Checklist "estou pronto?"
- [ ] Li e filtrei logs de pelo menos 3 fontes (Linux, Windows e firewall ou proxy)
- [ ] Montei um SIEM de laboratório (Wazuh ou Elastic) e criei uma busca e um painel
- [ ] Triei 10 alertas ou e-mails suspeitos e justifiquei cada veredicto
- [ ] Analisei um e-mail de phishing (cabeçalhos, URL e anexo)
- [ ] Enriqueci 5 IOCs em fontes de threat intelligence
- [ ] Escrevi uma regra Sigma e mapeei para o MITRE ATT&CK
- [ ] Documentei um incidente simulado de ponta a ponta
