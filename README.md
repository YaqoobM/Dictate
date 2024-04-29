# Dictate - Video-conferencing for small meetings and groups

## Help

### Dev Build

- #### Docker

  - go to http://localhost/

    ```console
    $ docker compose -f docker-compose.dev.yaml up
    ```

- #### Outside docker (for HMR)

  - create virtual env

    ```console
    $ virtualenv venv
    $ . venv/bin/activate
    $ pip install -r requirements.txt
    ```

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

  - Create security groups (for linking resources later)

    - Postgres security group (e.g. dictate_postgres_backend)

      | Direction | Port(s)     | Destination(s) |
      | --------- | ----------- | -------------- |
      | Inbound   | 5432        | self           |
      | Outbound  | All Traffic | All Addresses  |

    - Redis security group (e.g. dictate_redis_backend)

      | Direction | Port(s)     | Destination(s) |
      | --------- | ----------- | -------------- |
      | Inbound   | 6379        | self           |
      | Outbound  | All Traffic | All Addresses  |

    - Notes:
      - first create an empty security group then edit to be able to select destination=self
      - other methods:
        - create a PostgresPublic group which allows traffic from all addresses
          - when creating ec2 instance then add rule to it's default security group to allow inbound postgres traffic
          - same for RedisPublic group
        - create a PostgresDictate group with allows traffic from ec2 group only
          - when creating ec2 instance then add rule to it's default security group to allow inbound postgres traffic
          - same for RedisPublic group

  - Create an EC2 instance to host app

    - Config:
      - Attach a key-pair for ssh
      - Allow ssh from anywhere
      - Allow https & http
      - Add Postgres and Redis security groups
    - Post creation:
      - Setup Elastic IP
    - Notes:
      - works with t3.small
      - create RSA key pair and save .pem file to ~/.ssh/
        - add following to ~/.ssh/config to automatically use key-pair
          > Host ec2-\*.compute.amazonaws.com ssh.dictate.com  
          > &nbsp;&nbsp;&nbsp;&nbsp;IdentityFile ~/.ssh/my_aws_file.pem
      - ssh using into machine with:
        ```console
        $ ssh ubuntu@<ec2_address>
        ```
      - after setting up DNS (later on)
        ```console
        $ ssh ubuntu@ssh.dictate.com
        ```
    - Commands inside machine:

      ```console
      $ sudo apt update -y && sudo apt upgrade -y
      $ sudo apt install -y apt-transport-https ca-certificates curl software-properties-common git certbot

      $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
      $ echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      $ sudo apt update -y
      $ sudo apt install -y docker-ce docker-ce-cli containerd.io

      $ git clone https://github.com/username/dictate_repo.git
      ```

  - Create a postgres RDS instance for db
    - Config:
      - make sure to create initial table (e.g. dictate_core)
      - don't connect to ec2 instance
      - add Postgres security group
    - Post creation:
      - setup relay server db (from local machine)
        ```console
        $ psql -h database_endpoint -U username -d intial_table -f coturn/coturn_schema.sql -a
        ```
  - Create an Elasticache redis cluster for cache

    - Config:
      - cluster mode disabled
      - create subnet with same vpc as ec2 instance
      - add Redis security group
      - backups not needed (?)
    - Notes:
      - free tier (t3.micro)

  - Create an S3 instance for recording storage

    - Pre-Creation:
      - create IAM user for app to upload to bucket
        - User access not required for AWS console
        - Policies: AmazonS3FullAccess
        - Create Access Key for AWS Compute Services (i.e. EC2)
    - Config:
      - allow all IPs to GET bucket resources
    - Post-Creation:
      - Update Permissions -> CORS
        ```json
        [
          {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
          }
        ]
        ```

  - Setup domain name
    - use cloudflare (if you want)
    - add dns records for <domain_name>, stun.<domain_name> and turn.<domain_name>
    - optionally add ssh.<domain_name> (w/o proxy)
  - Setup TLS

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
          -it \
          -v $(pwd)/certbot/www/:/var/www/certbot/:rw \
          -v $(pwd)/certbot/conf/:/etc/letsencrypt/:rw \
          certbot/certbot:latest certonly --webroot \
          --webroot-path /var/www/certbot/ \
          --dry-run -d <domain_name>
      ```

      - `--dry-run` flag for testing first

  - Fill in .env file
  - Run setup db script
    - runs migrations and creates superuser
    ```console
    $ docker compose run --rm setup python manage.py setup_db
    ```
  - go to http://<domain_name>/

    ```console
    $ docker compose up -d
    ```

### Testing

- Setup

  - Run the project locally

  ```console
  $ docker compose -f docker-compose.dev.yaml up
  ```

- Running tests (in a separate process)

  - open test application for detailed view

    ```console
    $ cd react && npm run test
    ```

  - run end-to-end tests from command line
    ```console
    $ cd react && npm run test:e2e
    ```
