import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const url = process.argv[2] || 'http://127.0.0.1:4173/portfolio/';
const output = new URL('../qa-results/', import.meta.url).pathname;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const report = [];
try {
  for (const mode of [
    { name: 'desktop', width: 1440, height: 1000, colorScheme: 'light', reducedMotion: 'no-preference' },
    { name: 'mobile', width: 390, height: 844, colorScheme: 'light', reducedMotion: 'reduce' },
    { name: 'dark', width: 1440, height: 1000, colorScheme: 'dark', reducedMotion: 'reduce' },
  ]) {
    const context = await browser.newContext({
      viewport: { width: mode.width, height: mode.height },
      colorScheme: mode.colorScheme,
      reducedMotion: mode.reducedMotion,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator('section').all()) await section.scrollIntoViewIfNeeded();
    for (const asset of await page.locator('img').all()) {
      await asset.scrollIntoViewIfNeeded();
      await asset.evaluate(image => image.complete ? undefined : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; }));
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      images: [...document.images].map(image => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })),
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(href.slice(1))),
    }));
    await page.screenshot({ path: `${output}${mode.name}.png`, fullPage: true });
    await page.screenshot({ path: `${output}${mode.name}-hero.png` });
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    report.push({ mode: mode.name, errors, ...layout, violations: accessibility.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, failureSummary: n.failureSummary })) })) });
    await context.close();
  }
  await writeFile(`${output}smoke.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.some(r => r.errors.length || r.overflow || r.brokenAnchors.length || r.images.some(i => !i.loaded) || r.violations.length)) process.exitCode = 1;
} finally {
  await browser.close();
}
