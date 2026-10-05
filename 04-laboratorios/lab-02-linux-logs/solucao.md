# Gabarito — Lab 02

> Os números exatos variam (as tentativas são aleatórias); o padrão é o que importa.

- **Passo 2/4:** o IP do `atacante1` deve concentrar ~40 falhas; o do `atacante2`, ~6.
- **Passo 3:** nomes como `oracle`, `test`, `ubuntu` aparecem como `invalid user`. Atacantes testam contas comuns.
- **Passo 5:** existe `Accepted password for ana from <IP do atacante1>` **depois** das falhas.
- **Passo 6:** sim, é o mesmo IP. Falhas seguidas de sucesso é o padrão clássico de **comprometimento por força bruta**; deve ser tratado como incidente, não como ruído.
- **Passo 9:** sem senha, o atacante precisaria de uma chave privada. Root desativado remove o alvo mais atacado. Ainda é preciso **trocar a senha da `ana`** e investigar o que foi feito na sessão.
- **Passo 10:** bloquear o IP é contenção (paliativo); a correção é a causa raiz (autenticação por chave, senha forte, MFA, fail2ban).

**Regex útil:** `Failed password for (invalid user )?(\S+) from (\S+) port`
