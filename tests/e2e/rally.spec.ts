import { test, expect, type Page } from '@playwright/test';
import { stations } from '../../src/data/stations';
import { solutions, fallbackCode } from '../solutions';

const storageKey = 'mnstrstdtrlly:progress:v3';
async function answer(page: Page, value: string, label = 'Eure Antwort') {
  await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
}
async function next(page: Page) {
  await page.getByRole('button', { name: 'Weiter zur nächsten Station →' }).click();
}

test.beforeEach(async ({ page }) => {
  // External photos and tiles are unrelated to answer, storage and GPS behavior.
  await page.route('https://commons.wikimedia.org/**', route => route.abort());
  await page.route('https://**.tile.openstreetmap.org/**', route => route.abort());
});

test('whole rally: persisted cooldown, scored hints, GPS fallback, coded finale and result', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 51.9570094, longitude: 7.6182738 });
  await page.clock.setFixedTime(new Date('2026-09-29T12:00:00Z'));
  await page.goto('./');
  await page.getByRole('button', { name: 'Die Spur aufnehmen' }).click();
  await expect(page.locator('.score')).toHaveText('1000 Punkte');
  await expect(page.getByRole('heading', { level: 2 })).toContainText('Aasee');
  await page.getByRole('button', { name: /Hinweis 1 von 3/ }).click();
  for (const wrong of ['99991', '99992', '99993']) {
    await answer(page, wrong);
    await expect(page.getByRole('alert')).toContainText('nicht die richtige Antwort');
  }
  await expect(page.getByRole('button', { name: 'Prüfen', exact: true })).toBeDisabled();
  await expect(page.locator('.score')).toHaveText('945 Punkte');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Prüfen', exact: true })).toBeDisabled();
  await expect(page.locator('.score')).toHaveText('945 Punkte');
  await page.clock.setFixedTime(new Date('2026-09-29T12:00:31Z'));
  await expect(page.getByLabel('Eure Antwort')).toBeEnabled();
  await answer(page, solutions.aasee[0]);
  await next(page);

  await page.getByRole('button', { name: 'Ortung starten' }).click();
  await expect(page.locator('.geo-distance')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Weiter zur nächsten Station →' })).toHaveCount(0);
  await page.getByRole('button', { name: 'GPS funktioniert nicht?' }).click();
  await answer(page, fallbackCode, 'Codewort');
  await next(page);
  await expect(page.locator('.score')).toHaveText('845 Punkte');

  for (const station of stations.slice(2)) {
    await expect(page.locator('.station-head h2')).toHaveText(station.name);
    await answer(page, solutions[station.id][0]);
    if (station.id !== 'finale') await next(page);
  }
  await expect(page.getByRole('heading', { name: 'Eure Wertung' })).toBeVisible();
  await expect(page.locator('.final-score')).toHaveText('845 Punkte');
  await expect(page.locator('.scorecard')).toContainText('31 Sek.');
  await expect(page.locator('.scorecard li')).toHaveText(stations[1].name);
  await page.reload();
  await expect(page.locator('.final-score')).toHaveText('845 Punkte');
  await expect(page.locator('.fragments')).not.toContainText('PAX');
  await page.getByRole('button', { name: '🗺️ Karte', exact: true }).click();
  await expect(page.locator('.map-marker')).toHaveCount(stations.length);
  await expect(page.locator('.leaflet-overlay-pane path')).toHaveCount(1);
  await page.getByRole('button', { name: '📜 Rätsel', exact: true }).click();
  await expect(page.locator('.final-score')).toHaveText('845 Punkte');
});

test('real browser geolocation reaches relocated GPS point without emergency cost', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  const gps = stations.find(s => s.task.kind === 'geo')!;
  await context.setGeolocation({ latitude: gps.coords.lat, longitude: gps.coords.lng });
  await page.goto('./');
  await page.getByRole('button', { name: 'Die Spur aufnehmen' }).click();
  await answer(page, solutions.aasee[0]);
  await next(page);
  await page.getByRole('button', { name: 'Ortung starten' }).click();
  await expect(page.getByRole('button', { name: 'Weiter zur nächsten Station →' })).toBeVisible();
  await expect(page.locator('.score')).toHaveText('1000 Punkte');
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).emergencySolved, storageKey)).toEqual([]);
});

test('closed location emergency is explicit, charged once, persisted and reported', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Die Spur aufnehmen' }).click();
  await page.getByRole('button', { name: 'Notfall-Auflösen (−100 Punkte)' }).click();
  await expect(page.getByRole('group', { name: 'Notfall-Auflösen bestätigen' })).toBeVisible();
  await page.getByRole('button', { name: 'Abbrechen', exact: true }).click();
  await expect(page.locator('.score')).toHaveText('1000 Punkte');
  await page.getByRole('button', { name: 'Notfall-Auflösen (−100 Punkte)' }).click();
  await page.getByRole('button', { name: 'Für 100 Punkte auflösen' }).click();
  await expect(page.locator('.score')).toHaveText('900 Punkte');
  await page.reload();
  await expect(page.locator('.score')).toHaveText('900 Punkte');
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).emergencySolved, storageKey)).toEqual(['aasee']);
});

test('old route progress and malformed storage cannot unlock the new rally', async ({ page }) => {
  await page.addInitScript(({ key }) => {
    localStorage.setItem('mnstrstdtrlly:progress:v2', JSON.stringify({ current: 11, solved: ['finale'], startedAt: 1 }));
    localStorage.setItem(key, '{broken-json');
  }, { key: storageKey });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Die Spur aufnehmen' })).toBeVisible();
  await page.getByRole('button', { name: 'Die Spur aufnehmen' }).click();
  await expect(page.locator('.station-head h2')).toContainText('Aasee');
  await expect(page.locator('.score')).toHaveText('1000 Punkte');
});

test('switching to the map cannot discard a pending wrong answer or allow overlapping checks', async ({ page }) => {
  await page.addInitScript(() => {
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    Object.defineProperty(crypto.subtle, 'digest', {
      value: async (algorithm: AlgorithmIdentifier, data: BufferSource) => {
        const result = await digest(algorithm, data);
        await new Promise<void>(resolve => window.addEventListener('release-answer', () => resolve(), { once: true }));
        return result;
      },
    });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Die Spur aufnehmen' }).click();
  await answer(page, '99999');
  await page.getByRole('button', { name: '🗺️ Karte', exact: true }).click();
  await page.getByRole('button', { name: '📜 Rätsel', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Wird geprüft …', exact: true })).toBeDisabled();
  await page.evaluate(() => window.dispatchEvent(new Event('release-answer')));
  await expect(page.locator('.score')).toHaveText('990 Punkte');
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).wrongAttempts.aasee, storageKey)).toBe(1);
});
