import sys

from typing import Dict, List, Optional, Union

if sys.version_info >= (3, 8):
    from typing import Literal
else:
    from typing_extensions import Literal

from ..models.serializable import Serializable
from .unique_identifier import UniqueIdentifier

RenderType = Literal['basic', 'sequence', 'kvp']


class RenderOptions(Serializable):
    def __init__(self, concat: Optional[bool] = False) -> None:
        self.concat = concat


class HeapObject(UniqueIdentifier):
    def __init__(
            self,
            id: str,
            type: str,
            value: str,
            render_type: RenderType,
            render_options: Optional[RenderOptions] = None) -> None:
        super().__init__(id)
        self.type = type
        self.value = value

        self.render_type = render_type
        self.render_options = render_options

        self.immutable: bool = False
        self.references: Union[None, List[UniqueIdentifier], Dict[str, UniqueIdentifier]] = None
