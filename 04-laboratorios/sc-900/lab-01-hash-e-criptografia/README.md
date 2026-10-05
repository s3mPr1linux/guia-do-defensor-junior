# Lab 01 — Hash, criptografia e assinatura digital (100% local)

**Domínio 1** · **Nível:** Iniciante · **Tempo:** ~1 h · **Custo:** zero · **Precisa de:** Linux/macOS/WSL com `openssl` e `python3`

## Objetivo
Ver na prática a diferença entre **hash** (mão única), **criptografia simétrica** (mesma chave), **assimétrica** (par de chaves) e **assinatura digital**.

## Parte 1 — Hash
```bash
echo "contrato v1" > contrato.txt
sha256sum contrato.txt
echo "contrato v2" > contrato.txt
sha256sum contrato.txt
```
1. Os hashes são parecidos? O que isso diz sobre integridade?
2. Dá para recuperar o texto a partir do hash? Por quê?

## Parte 2 — Criptografia simétrica (AES)
```bash
echo "dado sensível" > segredo.txt
openssl enc -aes-256-cbc -pbkdf2 -salt -in segredo.txt -out segredo.enc
# digite uma senha de estudo
openssl enc -d -aes-256-cbc -pbkdf2 -in segredo.enc -out segredo.dec
diff segredo.txt segredo.dec && echo "iguais"
```
3. O que acontece se usar uma senha errada na decifragem?
4. Por que a chave precisa ser compartilhada nesse modelo?

## Parte 3 — Assimétrica e assinatura digital
```bash
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out privada.pem
openssl pkey -in privada.pem -pubout -out publica.pem

# cifrar com a pública, decifrar com a privada
echo "olá" | openssl pkeyutl -encrypt -pubin -inkey publica.pem -out msg.enc
openssl pkeyutl -decrypt -inkey privada.pem -in msg.enc

# assinatura = hash + chave privada
openssl dgst -sha256 -sign privada.pem -out contrato.sig contrato.txt
openssl dgst -sha256 -verify publica.pem -signature contrato.sig contrato.txt
echo "contrato v3 adulterado" > contrato.txt
openssl dgst -sha256 -verify publica.pem -signature contrato.sig contrato.txt
```
5. Qual chave cifra e qual decifra? E na assinatura?
6. O que a verificação mostra depois que o arquivo é alterado?
7. Quais propriedades a assinatura garante (autenticidade, integridade, não repúdio)?

## Parte 4 — Hash de senha (por que "salt")
```bash
python3 - <<'PY'
import hashlib, os
senha = b"Verao2026!"
print("sem salt:", hashlib.sha256(senha).hexdigest())
for _ in range(2):
    salt = os.urandom(8)
    print("com salt:", salt.hex(), hashlib.pbkdf2_hmac("sha256", senha, salt, 200_000).hex())
PY
```
8. Por que dois hashes da mesma senha ficam diferentes com salt?

## O que documentar
Uma tabela com: operação → comando → o que observou → conceito do SC-900 relacionado.

> **Segurança:** use apenas dados de teste. Nunca versione `privada.pem` no GitHub (adicione `*.pem` ao `.gitignore`).

Gabarito: [solucao.md](solucao.md)
