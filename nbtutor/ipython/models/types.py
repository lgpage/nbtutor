import sys

if sys.version_info >= (3, 8):
    from typing import Literal
else:
    from typing_extensions import Literal

EventType = Literal['call', 'line', 'return']
