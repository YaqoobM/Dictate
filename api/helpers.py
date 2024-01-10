from django.conf import settings


def get_hashed_alphabet(
    hash: str = settings.SECRET_KEY,
    alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
) -> str:
    def _reorder(string, salt) -> str:
        """Reorders `string` according to `salt`."""
        len_salt = len(salt)

        if len_salt != 0:
            string = list(string)
            index, integer_sum = 0, 0
            for i in range(len(string) - 1, 0, -1):
                integer = ord(salt[index])
                integer_sum += integer
                j = (integer + index + integer_sum) % i
                string[i], string[j] = string[j], string[i]
                index = (index + 1) % len_salt
            string = "".join(string)

        return string

    return _reorder(alphabet, hash)


def idToUrl(resource_name: str, id: str) -> str:
    return f"/api/{resource_name}/{id}"
