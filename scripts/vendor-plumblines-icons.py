"""Regenerate compatible icon adapters from the pinned Lucide source checkout.

Usage: python3 scripts/vendor-plumblines-icons.py /path/to/lucide
Source revision: f06ac67e33d645c40b8ce19a0419c85c5d7dd751
The source checkout must contain icons/*.svg and LICENSE.
"""
import json
from pathlib import Path
import re
import shutil
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(sys.argv[1])
# Explicit semantic mapping. No catch-all fallback: unmapped exports fail closed.
GROUPS = {
'accessibility': 'Accessibility', 'ghost': 'Alien', 'apple': 'Apple',
'arrow-up-right': 'ArrowTopRight', 'arrow-up': 'ArrowTop', 'arrow-left': 'ArrowLeft', 'arrow-right': 'ArrowRight', 'arrow-down': 'ArrowBottom',
'log-out': 'ArrowBoxLeft ArrowBoxRight', 'corner-down-right': 'ArrowCornerDownRight', 'share': 'ArrowOutOfBox ArrowOutOfBoxModified',
'rotate-ccw': 'ArrowRotateCounterClockwise', 'rotate-cw': 'ArrowRotateClockwise', 'share-2': 'ArrowShareRight', 'circle-arrow-up': 'ArrowTopCircle', 'chevron-down': 'ArrowTriangleBottom ChevronBottom TinyChevronBottom',
'maximize-2': 'ArrowsDiagonalOut', 'minimize-2': 'ArrowsDiagonalIn', 'square': 'AspectRatio11', 'rectangle-horizontal': 'AspectRatio43', 'rectangle-vertical': 'AspectRatio34',
'at-sign': 'At', 'atom': 'Atom', 'menu': 'Bars3', 'beaker': 'Beaker', 'bell': 'Bell Bell2', 'bell-off': 'Bell2Off', 'bell-plus': 'BellPlus', 'bell-ring': 'BellRinging',
'cake': 'BirthdayCake', 'bookmark': 'Bookmark BookmarkFilled', 'bookmark-x': 'BookmarkDeleteLarge', 'bot': 'Bot', 'brush-cleaning': 'BroomSparkle',
'message-circle-question-mark': 'BubbleQuestion', 'message-circle': 'Bubble', 'messages-square': 'Bubbles', 'message-circle-heart': 'BubbleSmile', 'message-square-more': 'BubbleInfo',
'list': 'BulletList', 'captions': 'CC', 'calendar': 'Calendar', 'calendar-clock': 'CalendarClock', 'calendar-days': 'CalendarDays', 'camera': 'Camera', 'car': 'Car', 'party-popper': 'Celebrate',
'link': 'ChainLink', 'unlink': 'ChainLinkBroken', 'check': 'Check CheckThick', 'chevron-left': 'ChevronLeft', 'chevron-right': 'ChevronRight', 'chevron-up': 'ChevronTop', 'chevrons-up-down': 'ChevronTopBottom',
'circle': 'Circle', 'shapes': 'CircleAndSquare Shapes', 'ban': 'CircleBanSign', 'circle-check': 'CircleCheck', 'info': 'CircleInfo', 'circle-plus': 'CirclePlus', 'circle-question-mark': 'CircleQuestion', 'circle-x': 'CircleX',
'clipboard': 'Clipboard', 'clock': 'Clock', 'code': 'CodeBrackets', 'file-code': 'CodeLines', 'palette': 'ColorPalette', 'contact': 'Contacts', 'crop': 'Crop', 'ellipsis': 'DotGrid3x1 Menu', 'grip-vertical': 'DotGrid2x3',
'download': 'Download', 'square-pen': 'EditBig', 'face-slightly-frowning': 'EmojiSad', 'face-slightly-smiling': 'EmojiSmile EmojiArc', 'heart': 'EmojiHeartEyes Heart2', 'mail': 'Envelope', 'mail-open': 'EnvelopeOpen',
'circle-alert': 'ExclamationCircle', 'boom-box': 'Explosion', 'eye': 'Eye', 'eye-off': 'EyeSlash', 'funnel': 'Filter', 'list-filter': 'FilterTimeline', 'flag': 'Flag', 'flame': 'Flame',
'fold-vertical': 'FlipVertical', 'fold-horizontal': 'FlipHorizontal', 'save': 'FloppyDisk', 'snowflake': 'Freeze', 'gamepad-2': 'GameController', 'file-image': 'Gif GifSquare', 'gift': 'Gift1',
'globe': 'Globe', 'earth': 'Earth', 'users': 'Group3 PersonGroup', 'chart-no-axes-combined': 'Growth', 'vibrate': 'Haptic PhoneHaptic', 'hash': 'HashtagWide Hashtag', 'heart-handshake': 'LikeRepost',
'house': 'Home HomeOpen', 'image': 'Image', 'inbox': 'Inbox', 'key-round': 'Key', 'flask-conical': 'Lab', 'languages': 'Language', 'leaf': 'Leaf', 'text-search': 'ListMagnifyingGlass', 'list-plus': 'ListPlus', 'list-checks': 'ListSparkle',
'radio': 'Live StreamingLive', 'loader-circle': 'Loader', 'lock-keyhole': 'Lock', 'lock-keyhole-open': 'Unlock', 'monitor': 'Macintosh', 'search': 'MagnifyingGlass', 'search-x': 'MagnifyingGlassX',
'message-square': 'Message Reply ReplyFilled', 'message-square-plus': 'MessagePlus', 'moon': 'Moon', 'music': 'MusicNote', 'volume-x': 'Mute', 'newspaper': 'News2 Newskie Newspaper', 'file-text': 'PageText', 'file-x': 'PageX',
'paint-roller': 'PaintRoller', 'send': 'PaperPlane PaperPlaneVertical', 'pause': 'Pause', 'pencil': 'Pencil', 'pencil-line': 'PencilLine', 'user-round-minus': 'PeopleRemove2', 'user-round': 'Person', 'user-round-check': 'PersonCheck', 'user-round-x': 'PersonX', 'user-round-plus': 'PersonPlus',
'smartphone': 'Phone', 'pin': 'Pin', 'map-pin': 'PinLocation PinLocationFilled', 'pizza': 'Pizza', 'play': 'Play', 'plus': 'PlusLarge PlusSmall', 'qr-code': 'QrCode', 'quote': 'OpenQuote CloseQuote',
'hand': 'RaisingHand4Finger Shaka', 'repeat-2': 'Repost RepostRepost', 'repeat-1': 'RepostStrike', 'flower-2': 'Rose', 'settings': 'SettingsGear2', 'sliders-vertical': 'SettingsSliderVertical',
'shield': 'Shield', 'shield-check': 'ShieldCheck Verified VerifiedCheck', 'badge-check': 'VerifierCheck', 'sparkles': 'Sparkle', 'volume-2': 'SpeakerVolumeFull', 'square-arrow-out-up-right': 'SquareArrowTopRight', 'copy': 'SquareBehindSquare4 SquareBehindSquare',
'star': 'Star', 'package-open': 'StarterPackMultiPathLarge StarterPack', 'type': 'TextSize TitleCase', 'thumbs-up': 'ThumbUp', 'ticket': 'Ticket', 'x': 'TimesLarge', 'trash': 'Trash', 'tree-deciduous': 'Tree', 'trending-up': 'Trending2 Trending3', 'orbit': 'UFO', 'circle-user-round': 'UserCircle', 'video': 'VideoClip', 'triangle-alert': 'Warning', 'app-window': 'Window', 'wrench': 'Wrench', 'zap': 'Zap',
}
MAPPING = {alias: name for name, aliases in GROUPS.items() for alias in aliases.split()}

def paths(svg):
    result = []
    for e in ET.fromstring(svg):
        tag = e.tag.rsplit('}', 1)[-1]
        a = e.attrib
        if tag == 'path': result.append(a['d'])
        elif tag in ('circle', 'ellipse'):
            x,y=float(a.get('cx',0)),float(a.get('cy',0)); rx=float(a.get('r',a.get('rx',0))); ry=float(a.get('r',a.get('ry',0)))
            result.append(f'M{x-rx} {y}a{rx} {ry} 0 1 0 {2*rx} 0a{rx} {ry} 0 1 0 {-2*rx} 0')
        elif tag == 'line': result.append(f"M{a['x1']} {a['y1']}L{a['x2']} {a['y2']}")
        elif tag in ('polyline','polygon'): result.append('M'+a['points']+('Z' if tag=='polygon' else ''))
        elif tag == 'rect':
            x,y,w,h=[float(a.get(k,0)) for k in ('x','y','width','height')]; r=float(a.get('rx',0))
            result.append(f'M{x+r} {y}H{x+w-r}Q{x+w} {y} {x+w} {y+r}V{y+h-r}Q{x+w} {y+h} {x+w-r} {y+h}H{x+r}Q{x} {y+h} {x} {y+h-r}V{y+r}Q{x} {y} {x+r} {y}Z')
        else: raise ValueError(f'Unsupported SVG primitive {tag}')
    return ' '.join(result)

manifest = {}
outputs = {}
for file in sorted((ROOT/'src/components/icons').glob('*.tsx')):
    if file.stem in ('TEMPLATE','common','Logo','AppleLogo','AndroidLogo'): continue
    names = re.findall(r'export (?:const|function) (\w+)', file.read_text())
    out = ["/* Lucide icon adapters. See licenses/LUCIDE.txt and assets/plumblines/icon-map.json. */", "import {createSinglePathSVG} from './TEMPLATE'", '']
    for name in names:
        key = name.split('_')[0]
        if name.startswith('Envelope_Open'): key='EnvelopeOpen'
        if name.startswith('Circle_And_Square'): key='CircleAndSquare'
        icon = MAPPING[key]
        svg = (SOURCE/'icons'/f'{icon}.svg').read_text()
        manifest[name] = icon
        out += [f'export const {name} = createSinglePathSVG({{', f'  path: {json.dumps(paths(svg))},', '  strokeWidth: 2,', "  strokeLinecap: 'round',", "  strokeLinejoin: 'round',", '})', '']
    outputs[file] = '\n'.join(out)
# Resolve every mapping before writing, avoiding partial regeneration on errors.
for file, out in outputs.items(): file.write_text(out)
assets = ROOT/'assets/plumblines/lucide'; assets.mkdir(parents=True,exist_ok=True)
for icon in sorted(set(manifest.values())): shutil.copyfile(SOURCE/'icons'/f'{icon}.svg', assets/f'{icon}.svg')
(ROOT/'assets/plumblines/icon-map.json').write_text(json.dumps({'revision':'f06ac67e33d645c40b8ce19a0419c85c5d7dd751','exports':manifest},indent=2)+'\n')
shutil.copyfile(SOURCE/'LICENSE', ROOT/'licenses/LUCIDE.txt')
print(f'Replaced {len(manifest)} exports in {len(outputs)} modules with {len(set(manifest.values()))} Lucide icons')
