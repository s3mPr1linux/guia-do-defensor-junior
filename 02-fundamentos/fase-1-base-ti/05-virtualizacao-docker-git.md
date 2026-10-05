# Módulo 5 — Virtualização, Docker e Git (transversal)

## Virtualização
- VirtualBox, VMware Workstation Player ou Proxmox
- Snapshots, redes (NAT, host-only, bridge) e isolamento do lab
- **Regra:** laboratório isolado, sem expor máquinas vulneráveis à internet

## Docker
- Imagem vs container, `docker run`, volumes, redes
- `docker compose` para subir ambientes com um comando
- Onde usar: labs de SIEM, honeypots, aplicações vulneráveis

## Git e GitHub
- `clone add commit push pull branch merge`
- README bem escrito, `.gitignore`, commits pequenos e claros
- **Nunca** versione senhas, chaves ou logs reais

## Prática
- [ ] Criar 3 VMs em rede host-only (Linux, Windows, atacante)
- [ ] Subir um container e um `docker-compose.yml` simples
- [ ] Criar o repositório `fundamentos-lab` e fazer commits semanais

## Materiais
- Docker Get Started (documentação oficial) 🆓
- Curso em Vídeo — Git e GitHub 🆓 🇧🇷
- Pro Git (livro) 🆓
