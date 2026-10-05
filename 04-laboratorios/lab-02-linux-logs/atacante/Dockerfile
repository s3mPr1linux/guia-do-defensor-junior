FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssh-client sshpass ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY ataque.sh /ataque.sh
RUN chmod +x /ataque.sh
CMD ["/ataque.sh"]
