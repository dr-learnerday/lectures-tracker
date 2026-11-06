const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
function boot({ios=false,standalone=false,secure=true}={}){
 const events={},els={};
 for(const id of ['install-panel','install-app','install-help','install-instructions','install-close'])els[id]={hidden:true,attrs:{},addEventListener(k,f){this[k]=f},setAttribute(k,v){this.attrs[k]=v},focus(){}};
 const media={matches:standalone,addEventListener(k,f){this.change=f}};
 const window={isSecureContext:secure,addEventListener(k,f){events[k]=f}};
 vm.runInNewContext(fs.readFileSync('install.js','utf8'),{document:{getElementById:id=>els[id]},window,matchMedia:()=>media,navigator:{userAgent:ios?'iPhone':'Android',platform:'',maxTouchPoints:0},location:{protocol:'https:'},console});
 return {events,els,media};
}
test('manual iOS guidance works without API or install prompt',async()=>{const {els}=boot({ios:true});assert.equal(els['install-panel'].hidden,false);await els['install-app'].click();assert.match(els['install-instructions'].textContent,/iPhone/);assert.equal(els['install-help'].hidden,false);els['install-close'].click();assert.equal(els['install-help'].hidden,true)});
test('native prompt can be dismissed and retried after a new event',async()=>{const {events,els}=boot();let prompts=0;const event=outcome=>({preventDefault(){},async prompt(){prompts++},userChoice:Promise.resolve({outcome})});events.beforeinstallprompt(event('dismissed'));await els['install-app'].click();assert.equal(els['install-panel'].hidden,false);events.beforeinstallprompt(event('accepted'));await els['install-app'].click();assert.equal(prompts,2);assert.equal(els['install-panel'].hidden,true)});
test('installed, standalone and insecure states hide installation',()=>{assert.equal(boot({standalone:true}).els['install-panel'].hidden,true);assert.equal(boot({secure:false}).els['install-panel'].hidden,true);const {events,els}=boot();events.appinstalled();assert.equal(els['install-panel'].hidden,true)});
test('manifest uses existing correctly sized PNGs and relative paths',()=>{const m=JSON.parse(fs.readFileSync('manifest.webmanifest'));assert.equal(m.display,'standalone');assert.equal(m.scope,'./');for(const icon of m.icons){const b=fs.readFileSync(icon.src);assert.equal(b.readUInt32BE(16),Number(icon.sizes.split('x')[0]));assert.equal(b.readUInt32BE(20),Number(icon.sizes.split('x')[1]));}});
