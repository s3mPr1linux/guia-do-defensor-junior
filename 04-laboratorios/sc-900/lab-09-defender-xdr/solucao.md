# Discussão — Lab 09
**Estudo de caso**

| Etapa | Produto | Ação do SOC |
|---|---|---|
| E-mail de phishing entregue | Defender para Office 365 | Remover e-mails, bloquear remetente/URL, ajustar antiphishing |
| Clique e download do malware | Defender para Ponto de Extremidade | Isolar o dispositivo, executar varredura, investigação automatizada |
| Roubo e uso de credenciais | Defender para Identidade | Resetar senha, revogar sessões, investigar movimento lateral |
| Acesso a apps SaaS suspeitos | Defender para Aplicativos de Nuvem | Revisar sessões/apps e revogar consentimentos |
| Correlação | **Defender XDR** | Um incidente com linha do tempo unificada |

**Conceitos**
- **EDR:** detecção e resposta no endpoint. **ASR:** regras que reduzem técnicas de ataque comuns. **Investigação automatizada:** analisa alertas e remedia automaticamente conforme a política.
- **Defender para Identidade:** detecta reconhecimento, pass-the-hash, movimento lateral; os sensores ficam nos controladores de domínio (e servidores relacionados).
- **Shadow IT:** apps de nuvem usados sem aprovação da TI.
- **Gerenciamento de Vulnerabilidades:** descobre vulnerabilidades e configurações inseguras e prioriza por risco e exposição.
- **Defender TI:** contexto sobre infraestrutura e atores de ameaça, útil para enriquecer IOCs.
