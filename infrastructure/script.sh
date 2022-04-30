#!/usr/bin/env bash

# sleep until instance is ready
until [[ -f /var/lib/cloud/instance/boot-finished ]]; do
  sleep 1
done

apt update
apt install apt-transport-https ca-certificates curl software-properties-common -y

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

apt update
apt install docker.io -y
systemctl enable --now docker

wget -O  /usr/local/bin/docker-compose https://github.com/docker/compose/releases/download/1.25.0/docker-compose-Linux-x86_64
chmod +x /usr/local/bin/docker-compose

useradd -m -G docker nexpws -s /bin/bash
mkdir /home/nexpws/.ssh
chown nexpws:nexpws /home/nexpws/.ssh
cp ~/.ssh/authorized_keys /home/nexpws/.ssh/authorized_keys


cp /tmp/id_rsa /home/nexpws/.ssh/id_rsa
cp /tmp/id_rsa.pub /home/nexpws/.ssh/id_rsa.pub
cp /tmp/config /home/nexpws/.ssh/config

chmod 600 /home/nexpws/.ssh/id_rsa
chown -R nexpws:nexpws /home/nexpws/.ssh

