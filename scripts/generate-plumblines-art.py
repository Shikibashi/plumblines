from pathlib import Path
from PIL import Image
import subprocess,json
root=Path(__file__).resolve().parent.parent
paths=set()
for folder in ['assets/app-icons','assets/images','assets/illustrations','assets/splash','modules/BlueskyClip/Images.xcassets/AppIcon.appiconset']:
 paths.update(p for p in (root/folder).rglob('*') if p.suffix.lower() in ['.png','.jpg','.webp'])
for name in ['favicon.png','logo.png','default-avatar.png','icon-android-foreground.png','icon-android-monochrome.png','icon-android-notification.png','kawaii.png','kawaii_smol.png']:
 p=root/'assets'/name
 if p.exists():paths.add(p)
for folder in ['bskyweb/static','bskyweb/embedr-static']:
 for pattern in ['favicon*.png','apple-touch-icon.png','social-card-default*.png']:
  paths.update((root/folder).glob(pattern))
manifest=[]
for p in sorted(paths):
 with Image.open(p) as im:w,h=im.size
 rel=str(p.relative_to(root)); dark=any(t in p.name for t in ['dark','dim','midnight','black'])
 bg='#28221c' if dark else '#f2ead7'; ink='#f2ead7' if dark else '#812b24'
 artwork='assets/images/' in rel or 'assets/illustrations/' in rel
 if artwork:
  svg=(root/'assets/plumblines/editorial.svg').read_text()
  if dark:svg=svg.replace('#f2ead7','#28221c').replace('#2d2923','#e7ddc6').replace('#812b24','#d99b86')
 else:
  transparent=any(t in p.name for t in ['foreground','monochrome','notification','transparent'])
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="{"none" if transparent else bg}"/><path transform="translate(20 18) scale(2.5)" fill="{ink}" d="M3 2h18v2h-8v9l4 3-5 7-5-7 4-3V4H3Z"/></svg>'
 temp=Path('/tmp/plumblines-art-current.svg');temp.write_text(svg)
 subprocess.run(['magick','-background','none',str(temp),'-resize',f'{w}x{h}','-gravity','center','-background',bg,'-extent',f'{w}x{h}',str(p)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 manifest.append({'path':rel,'width':w,'height':h,'source':'editorial.svg' if artwork else 'mark.svg'})
(root/'assets/plumblines/raster-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Generated original artwork for',len(paths),'raster paths')
