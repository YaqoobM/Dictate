# Dictate - Video-conferencing for small meetings and groups

## Help

### Dev Build

- #### Docker

  - go to http://localhost/

    ```console
    $ docker compose -f docker-compose.dev.yaml up
    ```

- #### Outside docker (for HMR)

  - build project

    ```console
    $ python manage.py setup_db
    $ python manage.py seed
    ```

  - go to http://localhost:8000/api/ (api)

    ```console
    $ python manage.py runserver
    ```

  - go to http://localhost:5137/ (web)

    ```console
    $ python manage.py build
    $ npm run --prefix frontend/react dev
    ```

### Prod Build

- #### Setup

  - Create an EC2 instance to host app
    - Attach a key-pair for ssh
    - Install git and docker
  - Create a postgres RDS instance for db
    - setup relay server db (run coturn_schema.sql script)
    - allow inbound EC2 IP (or any IPs)
    - run migrations from EC2 instance
  - Create an S3 instance for recording storage
    - allow all IPs to GET bucket resources
  - Create an Elasticache redis cluster for cache
    - allow inbound EC2 IP (or any IPs)
  - Setup Elastic IP for EC2
  - Setup domain name
    - use cloudflare (if you want)
    - add dns records for <domain_name>, stun.<domain_name> and turn.<domain_name>
    - optionally add ssh.<domain_name> w/o proxy
  - Setup tsl

    - create certs inside ec2 instance (run nginx then certbot in separate process):

      ```console
      $ docker run -p 80:80 -p 443:443 \
          -v $(pwd)/nginx/nginx.certbot.conf:/etc/nginx/nginx.conf:ro \
          -v $(pwd)/certbot/www/:/var/www/certbot/:ro \
          -v $(pwd)/certbot/conf/:/etc/nginx/ssl/:ro \
          nginx:1.25.3-alpine3.18
      ```

      ```console
      $ docker run --rm \
          -v $(pwd)/certbot/www/:/var/www/certbot/:rw \
          -v $(pwd)/certbot/conf/:/etc/letsencrypt/:rw \
          certbot certonly --webroot \
          --webroot-path /var/www/certbot/ \
          --dry-run -d <domain_name>
      ```

      - `--dry-run` flag to test first

  - Update .env file
  - go to http://<domain_name>/

    ```console
    $ docker compose up
    ```

### Testing

- Create 2 test users beforehand

  - tester@dictate.com
    - password: 12345678
  - tester2@dictate.com

    - password: 12345678

  - open test application for detailed view

    ```console
    $ npm run test
    ```

  - run end-to-end tests from command line
    ```console
    $ npm run test:e2e
    ```
