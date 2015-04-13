from os.path import (
    abspath,
    dirname,
    join,
)

from IPython.html.nbextensions import install_nbextension


def nbinstall(overwrite=False,
              symlink=False,
              user=True,
              prefix=None,
              nbextensions_dir=None,
              destination=None,
              verbose=1):
    """
    Install qgrid's static dependencies locally.

    Arguments are forwarded to IPython.html.nbextensions.install_nbextension.
    """
    qgridjs_path = join(dirname(abspath(__file__)), 'qgridjs')

    install_nbextension(
        qgridjs_path,
        overwrite=overwrite,
        user=user,
        symlink=symlink,
        verbose=verbose,
    )
