from abc import ABC
from typing import Any, Dict


def snake_to_camel(key: str) -> str:
    words = key.split('_')
    words[0] = words[0].lower()
    if len(words) > 1:
        words[1:] = [u.title() for u in words[1:]]

    return ''.join(words)


class Serializable(ABC):
    def to_dict(self) -> Dict[str, Any]:
        result: Dict[str, Any] = dict()
        for key, value in self.__dict__.items():
            if isinstance(value, Serializable):
                result[snake_to_camel(key)] = value.to_dict()

            elif isinstance(value, (dict,)):
                result[snake_to_camel(key)] = {
                    k: v.to_dict() if isinstance(v, Serializable) else v for k, v in value.items()}

            elif isinstance(value, (tuple, list)):
                result[snake_to_camel(key)] = [
                    v.to_dict() if isinstance(v, Serializable) else v for v in value]

            else:
                result[snake_to_camel(key)] = value

        return result
