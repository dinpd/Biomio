FROM       ubuntu:14.04


#install git & nginx
#
RUN echo "1"
RUN apt-get update
RUN apt-get install -y git \
    nginx \
    mysql-client \
    php5-fpm \
    php5-mysql \
    php5-curl \
    curl \
    php5-cli

RUN sed 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/g' /etc/php5/fpm/php.ini > /etc/php5/fpm/php.ini_tmp
RUN mv /etc/php5/fpm/php.ini_tmp /etc/php5/fpm/php.ini
RUN mkdir /opt/composer
RUN cd /opt/composer && curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
RUN rm -rf /opt/composer

RUN apt-get update && apt-get install -y supervisor
RUN mkdir /var/log/supervisord/
RUN touch /var/log/supervisord/supervisord.log

RUN mkdir /root/.ssh
COPY runscript.sh /opt/runscript.sh
#COPY conf/default /etc/nginx/sites-available/default
COPY supervisord.conf /opt/supervisord.conf

#BIOMIO Gate get code
#
#git access ssh key
#
COPY id_rsa /root/.ssh

#set gut url and branch/tag
#
ENV GITBRANCH master
ENV GITURL "git@bitbucket.org:biomio/biomioai.git"

#disable caching
#
ARG CACHE_DATE=2016-01-01
RUN ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts


#disable caching
#
ARG CACHE_DATE=2016-01-01

RUN cd /opt/ && git clone -b $GITBRANCH $GITURL

RUN cd /opt/biomioai && composer install

#############import vakoms key
#RUN mkdir -p /opt/cert        
#COPY vakoms.crt /opt/cert
#COPY vakoms.key /opt/cert
##############################

RUN mkdir -p /opt/biomioai/storage/log && \
    touch /opt/biomioai/storage/log/server.log && \
    chmod a+w /opt/biomioai/storage/log/server.log

COPY /opt/biomioai/nginx.conf /etc/nginx/sites-available/default
#COPY conf/config.js /opt/biomioai/public/js/config.js
#COPY conf/setting.php /opt/biomioai/config/setting.php

