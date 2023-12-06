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
RUN pip3 install --no-cache-dir --upgrade pip setuptools

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

# Copy only dependency list so docker can use cache when rebuilding
#   when we want to rebuild an image because we changed a file's contents
#     docker can cache the image steps until COPY . .
COPY requirements.txt requirements.txt
COPY react/package.json react/package.json

# Installing python dependencies
#   no cache stops pip from saving packages in cache for reuse
#   since it is a container we don't need to install again
#   also reduces image size
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir pytz
RUN pip install --no-cache-dir tzdata

# Installing npm dependencies
RUN cd react && npm install

# Copy project files (excluding .dockerignore)
COPY . .

# Expose the django development server port
#   you still need to publish the port when running the container
#   simply a type of documentation
EXPOSE 8000

# Default command run if no command specified
#   first command is needed to set up container after postgres container if using docker compose
#     i.e. we put the commands inside a script and use CMD so the commands run when container starts
#     otherwise defaults to sqlite
#   python by defaults assumes 127.0.0.1 (localhost)
#   we bind it to 0.0.0.0:8000 meaning all ips associated to the container
#     the container has: ($ ip addr show)
#       - 127.0.0.1 (lo) (localhost)
#       - x.x.x.x (eth0) (ip associated with docker network) (~random)
#   when we run a container in docker it is assigned an ip address attached to
#     the docker network it is assigned to
#       - default bridge (if no network is assigned and not docker-compose)
#       - named bridge (if network specified or docker-compose)
#   same as 0:8000
CMD python manage.py build-docker; python manage.py runserver 0.0.0.0:8000

# bash for alpine
# CMD [ "/bin/ash" ]
