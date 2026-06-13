// Screenshots the live site: homepage header (desktop + mobile) for the logo
// doodle, and a slice of the select-artwork gallery for the new thumbnails.
import { chromium } from '@playwright/test';

const browser = await chromium.launch();

// Desktop header
const desktop = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(800);
await desktop.screenshot({ path: '/tmp/site-header-desktop.png', clip: { x: 0, y: 0, width: 1280, height: 90 } });

// Mobile header
const mobile = await browser.newPage({ viewport: { width: 390, height: 664 } });
await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(800);
await mobile.screenshot({ path: '/tmp/site-header-mobile.png', clip: { x: 0, y: 0, width: 390, height: 80 } });

// Gallery page: scroll a bit so a batch-3 row mounts, then capture.
const gallery = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await gallery.goto('http://localhost:3000/select-artwork', { waitUntil: 'networkidle' });
await gallery.waitForTimeout(1000);
// New designs sort after the originals; jump near the bottom where batch 3 lives.
await gallery.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72));
await gallery.waitForTimeout(2500);
await gallery.screenshot({ path: '/tmp/site-gallery.png' });

const counts = await gallery.evaluate(() => ({
  thumbs: document.querySelectorAll('css-doodle').length,
}));
console.log('mounted gallery doodles near viewport:', counts.thumbs);
await browser.close();
console.log('saved /tmp/site-header-desktop.png /tmp/site-header-mobile.png /tmp/site-gallery.png');
