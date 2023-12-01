# Using official node image built on top of alpine (linux distro)
#   as opposed to the regular image which is built on debian
# Alpine is smaller (45mb vs 380mb) but has less functionality
# - node version: 21
# - alpine version: 3.18
FROM node:21-alpine3.18

# Install python (apk packgage manager)
#   each alpine version comes with a specifc version of python
#   alpine3.18 -> python3.11
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

# Setup pip
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Set the working directory in the container
#   opt is where we store projects
WORKDIR /opt/dictate

# Prevents python writing .pyc files
#   used for repeat process not having to repeat compiling the same py script
#   in docker this is not needed because a process only runs once then the
#     container is shutdown
ENV PYTHONDONTWRITEBYTECODE 1

# Pushes python stdout and stderr straight to terminal w/o bufferring
#   output (e.g. django logs) is seen in realtime and not lost if python
#   process crashes
ENV PYTHONUNBUFFERED 1

# Copy project files (excluding .dockerignore)
COPY . .

# Installing dependencies
RUN pip install -r requirements.txt
RUN pip install pytz
RUN pip install tzdata

RUN cd frontend/react && npm install

# building react project to static files
RUN python manage.py build

# make migrations
RUN python manage.py makemigrations
RUN python manage.py migrate

# make superuser
ARG DJANGO_SUPERUSER_USERNAME="admin"
ARG DJANGO_SUPERUSER_EMAIL="no_reply@gmail.com"
ARG DJANGO_SUPERUSER_PASSWORD=123456789
RUN python manage.py createsuperuser --no-input

# Expose the django development server port
#   This is a type of documentation, you still need to publish the port when running
#     the container
EXPOSE 8000

# Default command run if no command specified
#   we bind it to 0.0.0.0:8000 meaning ALL interfaces
#     we need to do this as we don't know what ip docker will assign
#   python by defaults assumes 127.0.0.1 (localhost)
#   when we run a container in docker it is assigned an ip address
#     which is custom to the docker network it is also attached to
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# bash for alpine
# CMD [ "/bin/ash" ]
