import pw from '/opt/node-tools/node_modules/playwright/index.js';
const { chromium } = pw;
import { mkdirSync, rmSync } from 'fs';
import path from 'path';

const DIR = path.dirname(new URL(import.meta.url).pathname);
const FPS = Number(process.env.FPS || 30);
const OUT = process.env.OUT || path.join(DIR, '..', '.frames');
const ONLY = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;

const browser = await chromium.launch({ args:[
  '--force-color-profile=srgb','--font-render-hinting=none','--disable-lcd-text',
  '--hide-scrollbars','--disable-gpu-vsync','--enable-gpu-rasterization'
]});
const page = await browser.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor:1 });
await page.goto('file://' + path.join(DIR,'cena.html'));
await page.waitForFunction(() => window.seek && [...document.images].every(i=>i.complete && i.naturalWidth>0));
await page.waitForTimeout(400);
const DUR = await page.evaluate(() => window.DUR);

if (ONLY) {
  mkdirSync(path.join(DIR,'..','previews'), {recursive:true});
  for (const t of ONLY) {
    await page.evaluate(tt => window.seek(tt), t);
    await page.screenshot({ path: path.join(DIR,'..','previews',`t${String(t).replace('.','_')}.jpg`), quality:92, type:'jpeg' });
  }
  console.log('previews ok');
} else {
  const N = Math.round(DUR*FPS);
  const FROM = Number(process.env.FROM || 0), TO = Number(process.env.TO || N);
  if (!FROM) rmSync(OUT,{recursive:true,force:true});
  mkdirSync(OUT,{recursive:true});
  for (let i=FROM;i<TO;i++){
    await page.evaluate(t => window.seek(t), i/FPS);
    await page.screenshot({ path: path.join(OUT, String(i).padStart(5,'0')+'.png'), type:'png' });
    if (i%60===0) console.log(`${i}/${N}`);
  }
  console.log('frames: '+N);
}
await browser.close();
