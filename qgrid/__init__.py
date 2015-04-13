from .grid import SlickGrid
from .installer import nbinstall


def show_grid(data_frame, remote_js=False):
    return SlickGrid(data_frame, remote_js)


__all__ = [
    'SlickGrid',
    'nbinstall',
    'show_grid',
]
