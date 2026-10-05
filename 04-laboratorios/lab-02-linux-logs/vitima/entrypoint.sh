#!/bin/bash
rsyslogd
touch /var/log/auth.log
exec /usr/sbin/sshd -D
