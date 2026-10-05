# Gabarito — Lab 01
1. Totalmente diferentes (efeito avalanche): qualquer mudança altera o hash, então ele detecta adulteração.
2. Não: hash é função de mão única; a entrada original não é recuperável (só por tentativa e erro).
3. A decifragem falha ("bad decrypt") ou gera lixo.
4. Quem cifra e quem decifra usam a **mesma** chave; o problema é trocar essa chave com segurança.
5. Cifrar: chave **pública**; decifrar: **privada**. Assinar: **privada**; verificar: **pública**.
6. Falha ("Verification Failure"): o conteúdo mudou desde a assinatura.
7. Integridade, autenticidade (quem detém a chave privada assinou) e não repúdio.
8. O salt aleatório faz cada hash ser único, impedindo tabelas pré-calculadas (rainbow tables) e revelando menos sobre senhas repetidas.
