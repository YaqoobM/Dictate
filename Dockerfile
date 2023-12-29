# Using official node image built on top of alpine (linux distro)
#   as opposed to the regular image which is built on debian
# Alpine is smaller (45mb vs 380mb) but has less functionality
# - node version: 21
# - alpine version: 3.18
# Used as a build stage to build react project into html, js and css files
FROM node:21-alpine3.18 AS build

# Set the working directory in the container
WORKDIR /opt/build

# Copy only dependency list so docker can use cache when rebuilding
#   (if we rebuild the container but the pacakge.json stays the same then
#    docker can use the cache and skip redownloading packages)
COPY react/package.json package.json

# Installing node dependencies
RUN npm install

# Copy project files (excluding .dockerignore)
COPY react .

# Create build files: html, css and js
RUN npm run build

# Using official python alpine image as final base image
FROM python:3.10-alpine3.18 AS main

# Pushes python stdout and stderr straight to terminal w/o bufferring
#   output (e.g. django logs) is seen in realtime and not lost if python
#   process crashes
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /opt/dictate

# Copy dependency list first for cache optimisation
COPY requirements.txt requirements.txt

# Installing python dependencies
#   no cache stops pip from saving packages in cache for reuse
#   since it is a container we don't need to install again
#   also reduces image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files (excluding .dockerignore)
COPY . .

# Remove unneeded react dir
RUN rm -rf react

COPY --from=build /opt/build/dist frontend/static/frontend/react
RUN mv frontend/static/frontend/react/index.html frontend/templates/frontend/react/index.html

# Setup build files
RUN python manage.py collectstatic --no-input

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
CMD python manage.py runserver 0.0.0.0:8000

# bash for alpine
# CMD [ "/bin/ash" ]
