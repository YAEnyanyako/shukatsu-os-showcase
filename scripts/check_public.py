#!/usr/bin/env python3
"""Check a deliberately small public release; never read a production workspace."""
import json
import hashlib
import re
import struct
import sys
import zlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
IGNORED_DIRS = {'.git', '__pycache__', 'node_modules'}
PATTERNS = {
    'absolute user path': re.compile(r'/(?:Users|home)/[A-Za-z0-9_.-]+'),
    'Windows user path': re.compile(r'[A-Za-z]:\\Users\\[A-Za-z0-9_.-]+'),
    'local file URL': re.compile(r'file:' + r'/{2,}'),
    'mail account URL': re.compile(r'https?://(?:mail\.google\.com|outlook\.live\.com|outlook\.office\.com)/', re.I),
    'private key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'common secret token': re.compile(r'(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{24,}|AKIA[A-Z0-9]{16})'),
}
EMAIL = re.compile(r'\b[A-Za-z0-9.!#$%&*+/=?^_`{|}~-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b')
# Fresh-context screenshot, visually reviewed with authored fictional data only.
# A replacement needs a new visual/privacy review before its digest is changed.
REVIEWED_PNGS = {
    'assets/screenshot-overview.png': 'dfb8f329e48969d059e967474e4bcc63479f78d160f36981c1701aa313637687',
}


def check_png(name, data):
    findings = []
    if REVIEWED_PNGS.get(name) != hashlib.sha256(data).hexdigest():
        findings.append(f'{name}: PNG has not received explicit content review')
    if not data.startswith(b'\x89PNG\r\n\x1a\n'):
        return findings + [f'{name}: malformed PNG signature']
    position, chunks = 8, []
    while position < len(data):
        if position + 12 > len(data):
            return findings + [f'{name}: truncated PNG chunk']
        length = struct.unpack('>I', data[position:position + 4])[0]
        end = position + 12 + length
        if end > len(data):
            return findings + [f'{name}: truncated PNG chunk']
        kind = data[position + 4:position + 8]
        payload = data[position + 8:position + 8 + length]
        crc = struct.unpack('>I', data[end - 4:end])[0]
        if zlib.crc32(kind + payload) & 0xffffffff != crc:
            findings.append(f'{name}: malformed PNG checksum')
        if kind not in {b'IHDR', b'IDAT', b'IEND'}:
            findings.append(f'{name}: PNG metadata or unsupported chunk is not allowed')
        if kind == b'IHDR' and (chunks or length != 13 or struct.unpack('>II', payload[:8]) != (1440, 620)):
            findings.append(f'{name}: unexpected screenshot dimensions or header')
        chunks.append(kind)
        position = end
        if kind == b'IEND':
            if length or position != len(data):
                findings.append(f'{name}: PNG has trailing data')
            break
    if not chunks or chunks[0] != b'IHDR' or chunks[-1] != b'IEND' or chunks.count(b'IHDR') != 1 or b'IDAT' not in chunks:
        findings.append(f'{name}: malformed PNG structure')
    return findings


def public_files():
    names = json.loads((ROOT / 'release-files.json').read_text(encoding='utf-8'))
    if not isinstance(names, list) or len(names) != len(set(names)):
        raise ValueError('Release file list must contain unique relative paths')
    for name in names:
        p = Path(name)
        if p.is_absolute() or '..' in p.parts or not p.parts:
            raise ValueError('Unsafe release path')
    return names


def check():
    names = public_files()
    allowed = set(names)
    findings = []
    for p in ROOT.rglob('*'):
        rel = p.relative_to(ROOT)
        if any(part in IGNORED_DIRS for part in rel.parts):
            continue
        if p.is_symlink():
            findings.append(f'{rel}: symbolic link is not allowed')
        elif p.is_file() and rel.as_posix() not in allowed:
            findings.append(f'{rel}: not on the public-file allowlist')
    for name in names:
        path = ROOT / name
        if not path.is_file() or path.is_symlink():
            findings.append(f'{name}: missing regular file')
            continue
        if path.suffix.lower() in {'.db', '.sqlite', '.sqlite3', '.zip', '.log', '.csv', '.xlsx', '.pdf', '.docx'} or path.name.startswith('.env'):
            findings.append(f'{name}: forbidden release file type')
            continue
        if path.suffix.lower() == '.png':
            findings.extend(check_png(name, path.read_bytes()))
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            findings.append(f'{name}: binary file requires explicit review')
            continue
        for label, pattern in PATTERNS.items():
            if pattern.search(text):
                findings.append(f'{name}: {label}')
        for address in EMAIL.finditer(text):
            domain = address.group(1).lower()
            if domain != 'example.com' and not domain.endswith('.example.com'):
                findings.append(f'{name}: email domain outside reserved examples')
        if path.suffix == '.svg':
            try:
                ET.fromstring(text)
            except ET.ParseError:
                findings.append(f'{name}: malformed SVG')
        if path.suffix == '.md':
            for target in re.findall(r'\]\(([^\s)]+)\)', text):
                if urlsplit(target).scheme or target.startswith('#'):
                    continue
                if not (path.parent / unquote(target.split('#')[0])).exists():
                    findings.append(f'{name}: broken local documentation link')
    class AssetParser(HTMLParser):
        def handle_starttag(self, tag, attrs):
            attrs = dict(attrs)
            for key in ('href', 'src'):
                value = attrs.get(key, '')
                if not value or value.startswith('#'):
                    continue
                if urlsplit(value).scheme:
                    findings.append(f'index.html: unexpected external {key}')
                elif not (ROOT / value).is_file():
                    findings.append('index.html: missing local asset')
    AssetParser().feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    return names, findings


if __name__ == '__main__':
    names, findings = check()
    if findings:
        print('PUBLIC CHECK FAILED')
        for finding in findings:
            print('- ' + finding)
        sys.exit(1)
    print(f'PASS: {len(names)} allowlisted text/SVG/reviewed PNG files; no flagged paths, non-example emails, credentials or account links.')
    print('PASS: local entry-point assets, documentation links and SVG syntax.')
    print('Scope: static safeguards, not a guarantee about arbitrary future additions.')
