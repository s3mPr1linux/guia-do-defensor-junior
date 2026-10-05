# Discussão — Lab 03
- **Tipos de dispositivo:** registrado (BYOD), ingressado no Entra (corporativo, nuvem), ingressado híbrido (AD local + nuvem).
- **Passwordless:** FIDO2/passkeys, Windows Hello para Empresas e Authenticator (modo sem senha).
- **Security defaults:** exige MFA para administradores e usuários e bloqueia protocolos legados. Não combina com políticas de Acesso Condicional.
- **Proteção de senha:** senhas previsíveis ligadas ao nome da empresa tendem a ser rejeitadas.
- **Função de leitura:** o usuário vê informações de segurança, mas não altera configurações.
- **Poucos Administradores Globais:** reduz a superfície de ataque (privilégio mínimo) e o impacto de uma conta comprometida.
- **RBAC do Azure:** Leitor só visualiza; Colaborador cria/edita recursos, mas **não** gerencia atribuições de acesso (isso é de Proprietário ou Administrador de Acesso do Usuário).
