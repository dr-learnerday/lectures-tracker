const fs=require('node:fs'),zlib=require('node:zlib');
fs.mkdirSync('icons',{recursive:true});
function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(t,b){const type=Buffer.from(t),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(b.length);c.writeUInt32BE(crc(Buffer.concat([type,b])));return Buffer.concat([n,type,b,c]);}
for(const [name,n] of [['icon-192',192],['icon-512',512],['icon-maskable-512',512],['apple-touch-icon',180]]){
 const raw=Buffer.alloc((n*3+1)*n);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const u=x/n,v=y/n;
  // White open book and spine, within the maskable safe zone.
  const book=v>.34&&v<.67&&u>.25&&u<.75;
  const spine=Math.abs(u-.5)<.015&&v>.36&&v<.67;
  const line=(Math.abs(v-.44)<.01||Math.abs(v-.51)<.01||Math.abs(v-.58)<.01)&&((u>.29&&u<.45)||(u>.55&&u<.71));
  const color=book&&!spine&&!line?[255,255,255]:[5,150,105];
  const at=y*(n*3+1)+1+x*3;raw.set(color,at);
 }
 const h=Buffer.alloc(13);h.writeUInt32BE(n);h.writeUInt32BE(n,4);h[8]=8;h[9]=2;
 fs.writeFileSync('icons/'+name+'.png',Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));
}
