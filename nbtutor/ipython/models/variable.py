from .unique_identifier import UniqueIdentifier


class Variable(UniqueIdentifier):
    def __init__(self, id: str, name: str) -> None:
        super().__init__(id)
        self.name = name
