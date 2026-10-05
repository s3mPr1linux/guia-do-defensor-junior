FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssh-server rsyslog sudo iproute2 procps net-tools less nano \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /run/sshd \
    && sed -i '/imklog/s/^/#/' /etc/rsyslog.conf \
    && useradd -m -s /bin/bash ana   && echo 'ana:ana2024'   | chpasswd \
    && useradd -m -s /bin/bash bob   && echo 'bob:bob2024'   | chpasswd \
    && useradd -m -s /bin/bash admin && echo 'admin:admin'   | chpasswd \
    && usermod -aG sudo admin
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 22
CMD ["/entrypoint.sh"]
