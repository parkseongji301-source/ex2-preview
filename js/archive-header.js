/* 동일한 질문 필터를 상단에 유지하고, 선택한 결과로 이동합니다. */
(() => {
  'use strict';
  const header = document.querySelector('.archive-page .site-header');
  const filters = document.querySelector('#question-filters');
  const questions = document.querySelector('#questions');
  if (!header || !filters || !questions) return;
  const measure = () => document.body.style.setProperty('--archive-header-height', `${header.getBoundingClientRect().height}px`);
  measure();
  window.addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  document.fonts?.ready.then(measure);
  filters.addEventListener('click', event => {
    if (!event.target.closest('button[data-filter]')) return;
    questions.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
})();
