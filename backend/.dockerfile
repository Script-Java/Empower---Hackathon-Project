FROM tiangolo/uwsgi-nginx:python3.11

LABEL maintainer="Sebastian Ramirez <tiangolo@gmail.com>"

COPY requirements.txt /tmp/requirements.txt


#get sudo on the container
RUN apt-get update && \
      apt-get -y install sudo

#install sqlite3 to be able to 
#docker exec -it empower---hackathon-project-backend-1 /bin/bash
#into the machine and navigate to the /app/instance folder to run
#sqlite3 db.sqlite
#and run queries against the db directly for debuggin purposes 
RUN sudo apt install sqlite3

RUN pip install --no-cache-dir -r /tmp/requirements.txt

ENV STATIC_URL /static

ENV STATIC_PATH /app/static

ENV STATIC_INDEX 0

COPY ./app /app

WORKDIR /app

ENV PYTHONPATH=/app

RUN mv /entrypoint.sh /uwsgi-nginx-entrypoint.sh

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/start.sh"]