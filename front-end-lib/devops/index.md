## 根据ctrip hub 构建node镜像

1. docker login  docker login hub.cloud.ctripcorp.com

   账号: jian_chen

   密码: cli密码

2. npmrc, 执行npm私服

   ```bash
   disturl = http://mirrors.sh.ctriptravel.com/nodejs.org/dist
   registry = http://registry.npm.release.ctripcorp.com
   cache = ${HOME}/.npm/.cache/cnpm
   ```

   

3. Dockfile

```dockerfile
# 基础镜像
FROM hub.cloud.ctripcorp.com/devops/centos7.2:0.0.1

# 维护者
LABEL MAINTAINER="jian_chen@ctrip.com"

#镜像的操作命令
RUN echo "install ifconfig"
RUN yum install net-tools -y
RUN ifconfig

RUN echo "start install node14.16.0"
RUN yum install -y http://git.dev.sh.ctripcorp.com/baseimage/components/raw/master/nodejs-14.16.0-1-1.x86_64.rpm && \
       yum clean all && \
       ln -s /opt/app/node14.16.0 /usr/local/node && \
       ln -s /opt/app/node14.16.0 /usr/local/node14.16.0

ENV PATH=/usr/local/node/bin:$PATH

COPY npmrc /usr/local/node14.16.0/etc/npmrc

ARG NODE_PATH=/usr/local/node14.16.0

RUN echo "npm install @ctrip/node-vampire-checkpkg@1.0.13 -g"
RUN npm install @ctrip/node-vampire-checkpkg@1.0.13 -g

RUN echo "download and install sonar scanner"
RUN yum install unzip wget -y && \
       cd /usr/local && \
       wget -q http://git.dev.sh.ctripcorp.com/devops/tools/raw/master/sonar-scanner-cli-3.3.0.1492-linux.zip -O sonar-scanner.zip && \
       unzip -q sonar-scanner.zip && \
       rm sonar-scanner.zip && \
       mv sonar-scanner-3.3.0.1492-linux sonar-scanner && \
       yum clean all

ENV PATH=/usr/local/sonar-scanner/bin:$PATH

RUN echo "npm install -g @ctrip/tripcore@1.7.0-beta.1 --unsafe-perm"
RUN npm install -g @ctrip/tripcore@1.7.0-beta.1 --unsafe-perm

ADD project /usr/local/app
```



4. docker-compose.yml

```yml
version: "3.7"
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
     - "8090:8090"
    command: bash -c "cd /usr/local/app && npm install && npm run dev"
    extra_hosts:
     - ebooking.ctrip.fat8888.qa.nt.ctripcorp.com:10.32.243.19
```



5. docker build -t ebk-node14 . 或者 docker-compose

