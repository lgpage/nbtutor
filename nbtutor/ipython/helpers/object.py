from typing import Any


def get_str_id(obj: Any) -> str:
    return str(id(obj))
