import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto(process.argv[2] || 'http://127.0.0.1:4178/portfolio/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '종이 정리하기' }).click();
  await page.getByText('7건 중 2건의 알림 준비', { exact: false }).waitFor();
  assert.equal(await page.locator('.paper-selected').count(), 2);
  await page.getByRole('button', { name: '다시 펼치기' }).press('Enter');
  assert.equal(await page.locator('.paper-selected').count(), 0);

  const input = page.getByLabel('선별 키워드', { exact: false });
  const run = page.getByRole('button', { name: '흐름 실행' });
  await run.click();
  await page.getByText('2건의 신규 알림 준비 완료', { exact: true }).waitFor();
  assert.match(await page.locator('.result-note').textContent(), /중복 2건/);
  await input.fill('소프트웨어');
  await run.click();
  await page.getByText('1건의 신규 알림 준비 완료', { exact: true }).waitFor();
  await input.fill('없는키워드');
  await run.click();
  await page.getByText('0건의 신규 알림 준비 완료', { exact: true }).waitFor();
  await input.fill('');
  await run.click();
  assert.match(await page.getByRole('alert').textContent(), /하나 이상/);
  await page.getByRole('button', { name: '초기화', exact: true }).click();
  assert.equal(await input.inputValue(), '동작분석, 카메라');

  const screenshot = page.getByRole('button', { name: '인플루언서 후보 검토 화면 크게 보기', exact: true });
  await screenshot.click();
  assert.equal(await page.getByRole('dialog').isVisible(), true);
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  assert.equal(await screenshot.evaluate(node => node === document.activeElement), true);

  await page.getByRole('button', { name: '다크 모드로 전환' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.getByRole('button', { name: '시스템', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.getByRole('link', { name: '경력 보기', exact: true }).click();
  assert.equal(new URL(page.url()).hash, '#experience');
  console.log('PASS: paper sorter, deduplication, alternate/empty/invalid keywords, reset, dialog Escape/focus, theme persistence/system, navigation');
} finally { await browser.close(); }
