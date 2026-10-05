# Lab 06 — Azure: VNet, NSG, Bastion, Key Vault (e visão de DDoS, Firewall e WAF)

**Domínio 3** · **Nível:** Intermediário · **Tempo:** ~2,5 h · **Custo:** baixo, mas **pode gerar cobrança** (Bastion e Firewall são cobrados por hora). Siga a limpeza.

## Pré-requisitos
Assinatura de estudo com **orçamento e alerta de custo**. Instale a Azure CLI (`az login`).

## Parte 1 — VNet e segmentação
```bash
RG=rg-sc900-lab06
LOC=brazilsouth
az group create -n $RG -l $LOC
az network vnet create -g $RG -n vnet-lab --address-prefix 10.10.0.0/16 \
  --subnet-name sn-web --subnet-prefix 10.10.1.0/24
az network vnet subnet create -g $RG --vnet-name vnet-lab -n sn-dados --address-prefixes 10.10.2.0/24
```
1. Por que separar web e dados em sub-redes diferentes?

## Parte 2 — NSG
```bash
az network nsg create -g $RG -n nsg-dados
az network nsg rule create -g $RG --nsg-name nsg-dados -n permitir-web-para-dados \
  --priority 100 --access Allow --protocol Tcp --direction Inbound \
  --source-address-prefixes 10.10.1.0/24 --destination-port-ranges 1433
az network nsg rule create -g $RG --nsg-name nsg-dados -n negar-resto \
  --priority 4000 --access Deny --protocol '*' --direction Inbound \
  --source-address-prefixes Internet --destination-port-ranges '*'
az network vnet subnet update -g $RG --vnet-name vnet-lab -n sn-dados --network-security-group nsg-dados
```
2. Qual regra vence quando duas combinam? (pense na **prioridade**)
3. Que tipo de tráfego esse NSG deixa passar? Qual não passa?

## Parte 3 — Key Vault
```bash
KV=kv-sc900-$RANDOM
az keyvault create -g $RG -n $KV -l $LOC --enable-rbac-authorization true
az keyvault secret set --vault-name $KV -n senha-banco --value "ValorDeTeste123"
az keyvault secret show --vault-name $KV -n senha-banco --query value -o tsv
```
4. Por que guardar segredos no Key Vault e não no código?
5. Que função RBAC é preciso ter para ler segredos? (Se der erro de permissão, atribua a si mesmo a função adequada e explique o erro.)

## Parte 4 — Bastion, Firewall, WAF e DDoS (leitura)
6. Abra a página de preços/documentação do **Azure Bastion** e explique, em 3 linhas, como ele evita IP público na VM.
7. Compare **NSG × Firewall do Azure × WAF** em uma tabela (camada, o que filtra, quando usar).
8. Descreva o que a **Proteção contra DDoS** mitiga e em qual camada.

## Limpeza (obrigatória)
```bash
az group delete -n $RG --yes --no-wait
```
Se o Key Vault tiver proteção contra exclusão, ele ficará em estado "excluído"; remova também o *purge* se o tenant permitir.

## O que documentar
Os comandos, a topologia (diagrama) e a tabela do item 7.

Gabarito: [solucao.md](solucao.md)
