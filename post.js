/**
 * 매일 실행되는 파일임
 */

import { scrapNewBooks } from './scrap/Scraper.js';

(async () => {
  try {
    await scrapNewBooks();
  } catch (err) {
    console.error(err);
  } finally {
    console.log('======프로그램 종료^0^=========');
    return;
  }
})();
