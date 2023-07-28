FROM icr.io/ibmz/uwsgi-nginx-flask@sha256:a2a4ddb4a10e4b1ac16e9da41ce715177ca3ac26866d73e420190462907cc907
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY ./app /app