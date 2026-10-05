# Discussão — Lab 06
1. Segmentação limita o movimento lateral e permite regras específicas por camada.
2. A de **menor número de prioridade** (100 vence 4000).
3. Passa: TCP 1433 vindo da sub-rede web. Não passa: tráfego vindo da internet. (Regras padrão do NSG ainda se aplicam abaixo das suas.)
4. Segredos em código vazam em repositórios e logs; o Key Vault centraliza, controla acesso por identidade e audita.
5. Com RBAC, algo como *Key Vault Secrets User* (leitura) ou *Officer* (gestão). Ser dono da assinatura não implica poder ler segredos.
6. O Bastion acessa a VM por IP privado via TLS pelo portal; a VM não precisa de IP público nem de RDP/SSH expostos.
7. NSG: L3/L4, regras simples por IP/porta. Firewall do Azure: serviço central, com estado, FQDN, inteligência de ameaças. WAF: L7, protege apps web (SQLi/XSS).
8. DDoS: ataques volumétricos e de protocolo (L3/L4) a IPs públicos.
