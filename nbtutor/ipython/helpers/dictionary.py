from typing import Any, Dict, Iterable


def filter_dict(d: Dict[str, Any], exclude: Iterable[str]) -> Dict[str, Any]:
    """Return a new dict with specified keys excluded from the original dict

    Args:
        d (dict): original dict
        exclude (list): The keys that are excluded
    """
    result: Dict[str, Any] = {}
    for key, value in d.items():
        if key not in exclude:
            result.update({key: value})

    return result
