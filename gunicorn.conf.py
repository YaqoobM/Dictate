"""gunicorn WSGI server configuration"""
import os
from multiprocessing import cpu_count

# from dotenv import load_dotenv

# load_dotenv()


def max_workers() -> int:
    return (2 * cpu_count()) + 1


bind = "0.0.0.0:8000"
workers = max_workers()

# setup logging
# if os.getenv("DEBUG"):
# if os.getenv("ENVIRONMENT"):
# if os.getenv("DOCKER_COMPOSE"):
