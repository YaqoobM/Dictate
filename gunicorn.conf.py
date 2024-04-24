"""gunicorn WSGI server configuration"""

from multiprocessing import cpu_count


def get_workers(max_workers: int = 10) -> int:
    workers: int = (2 * cpu_count()) + 1

    if workers > max_workers:
        return max_workers

    return workers


bind = "0.0.0.0:80"
workers = get_workers(5)

# setup logging
# if os.getenv("DEBUG"):
# if os.getenv("ENVIRONMENT"):
# if os.getenv("DOCKER_COMPOSE"):
