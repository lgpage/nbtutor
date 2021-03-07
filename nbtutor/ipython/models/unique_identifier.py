from ..models.serializable import Serializable


class UniqueIdentifier(Serializable):
    def __init__(self, id: str) -> None:
        self.id = id
