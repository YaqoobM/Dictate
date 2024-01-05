"""gunicorn WSGI server configuration"""
import os
from multiprocessing import cpu_count

# from dotenv import load_dotenv

# load_dotenv()


def get_workers(max_workers: int = 10) -> int:
    workers: int = (2 * cpu_count()) + 1

    if workers > max_workers:
        return max_workers

    return workers


bind = "0.0.0.0:8000"
workers = get_workers(5)

# setup logging
# if os.getenv("DEBUG"):
# if os.getenv("ENVIRONMENT"):
# if os.getenv("DOCKER_COMPOSE"):
