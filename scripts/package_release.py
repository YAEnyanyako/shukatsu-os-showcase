#!/usr/bin/env python3
"""Make a reproducible public archive from the release allowlist."""
import hashlib
import sys
import zipfile
from pathlib import Path

sys.dont_write_bytecode = True
from check_public import ROOT, check


def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/package_release.py <output.zip>')
    destination = Path(sys.argv[1]).expanduser().resolve()
    if destination == ROOT or ROOT in destination.parents:
        raise SystemExit('Write the archive outside the public source directory.')
    if destination.suffix != '.zip':
        raise SystemExit('Output must have the .zip extension.')
    if destination.exists():
        raise SystemExit('Output already exists; choose a new name or remove the previous archive.')
    names, findings = check()
    if findings:
        raise SystemExit('Public-file check failed:\n' + '\n'.join(findings))
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destination, 'x', compression=zipfile.ZIP_DEFLATED) as archive:
        for name in sorted(names):
            info = zipfile.ZipInfo('shukatsu-os-showcase/' + name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, (ROOT / name).read_bytes())
    with zipfile.ZipFile(destination) as archive:
        if archive.testzip() is not None or len(archive.namelist()) != len(names):
            raise SystemExit('Archive verification failed.')
    print(f'Packaged {len(names)} public files into {destination.name} ({destination.stat().st_size:,} bytes).')
    print('SHA256 ' + hashlib.sha256(destination.read_bytes()).hexdigest())


if __name__ == '__main__':
    main()
