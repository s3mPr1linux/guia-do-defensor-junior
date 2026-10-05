# Domínio 1 — Conceitos de segurança, conformidade e identidade (10–15%)

## Objetivo
Dominar o vocabulário que sustenta todo o resto do exame.

## 1.1 Segurança e conformidade

### Modelo de responsabilidade compartilhada
| Responsabilidade | Local | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Dados e informações | Cliente | Cliente | Cliente | Cliente |
| Contas e identidades | Cliente | Cliente | Cliente | Cliente |
| Dispositivos (endpoints) | Cliente | Cliente | Cliente | Cliente |
| Aplicativos | Cliente | Cliente | Compartilhada | Provedor |
| Controles de rede | Cliente | Compartilhada | Compartilhada | Provedor |
| Sistema operacional | Cliente | Cliente | Provedor | Provedor |
| Hosts físicos, rede física, datacenter | Cliente | Provedor | Provedor | Provedor |

**Regra de ouro:** dados, identidades e dispositivos são **sempre** do cliente. (A divisão exata de aplicativos e rede varia por serviço; confira a documentação do provedor.)

### Defesa em profundidade
Camadas independentes, para que a falha de uma não exponha tudo: física → identidade e acesso → perímetro → rede → computação → aplicativo → dados.

### Modelo de Confiança Zero (Zero Trust)
Princípios: **verificar explicitamente**, **usar acesso com privilégio mínimo** e **presumir violação**. Pilares: identidades, dispositivos, aplicativos, dados, infraestrutura e rede.

### Criptografia e hash
| Conceito | Ideia | Exemplos |
|---|---|---|
| Simétrica | Mesma chave cifra e decifra; rápida | AES |
| Assimétrica | Par de chaves (pública/privada); troca de chaves e assinaturas | RSA, ECC |
| Hash | Resumo de mão única; verifica integridade; não é reversível | SHA-256 |
| Em repouso | Dados armazenados cifrados | BitLocker, criptografia do Armazenamento do Azure |
| Em trânsito | Dados protegidos na rede | TLS/HTTPS, VPN |

Assinatura digital = hash + chave privada; quem tem a chave pública verifica autenticidade e integridade.

### GRC (Governança, Risco e Conformidade)
- **Governança:** políticas, papéis e processos que direcionam a organização.
- **Risco:** identificar, avaliar e tratar (mitigar, transferir, aceitar, evitar).
- **Conformidade:** cumprir leis, regulamentos e padrões (ex.: LGPD, ISO 27001).

## 1.2 Conceitos de identidade
- **Identidade como novo perímetro:** com nuvem e trabalho remoto, quem acessa importa mais que de onde acessa.
- **Autenticação (AuthN):** provar quem você é. **Autorização (AuthZ):** o que você pode fazer.
- **Provedor de identidade (IdP):** cria, mantém e autentica identidades (ex.: Microsoft Entra ID).
- **Serviço de diretório / Active Directory:** repositório central de identidades e recursos (AD DS no local).
- **Federação:** relação de confiança entre domínios/IdPs que permite SSO entre organizações. Protocolos: **SAML**, **WS-Federation**, **OpenID Connect** (autenticação) e **OAuth 2.0** (autorização).

## Perguntas de revisão
1. Em SaaS, o que continua sendo responsabilidade do cliente?
2. Qual a diferença entre hash e criptografia?
3. Dê um exemplo de cada princípio do Zero Trust.
4. Por que a identidade é chamada de novo perímetro?
5. Qual a diferença entre OAuth 2.0 e OpenID Connect?

## Pegadinhas de prova
- Hash **não** é criptografia (não se reverte).
- Autenticação vem **antes** de autorização.
- Responsabilidade por **dados** nunca passa ao provedor.
