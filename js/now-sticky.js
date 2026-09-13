/* 같은 제목과 필터를 재배치합니다. 펼친 높이는 초기 화면에서만 확보하고 접힐 때 함께 줄입니다. */
(() => {
  'use strict';
  const section = document.querySelector('#now');
  const header = section?.querySelector('.now-sticky-header');
  if (!header) return;
  const content = header.querySelector('.now-header-content');
  const title = header.querySelector('h2');
  const filters = header.querySelector('.filter-bar');
  const eyebrow = header.querySelector('.eyebrow');
  const description = header.querySelector('.section-heading > p');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let threshold = 0;
  let compact = false;
  let frame = 0;
  let animations = [];
  const siteHeader = document.querySelector('.home-page .site-header');
  const hero = document.querySelector('.hero');
  function syncHomeHeader() {
    siteHeader?.classList.toggle('is-content-header', !!hero && hero.getBoundingClientRect().bottom <= 96);
    document.body.classList.toggle('has-now-bar', compact && section.getBoundingClientRect().bottom > header.getBoundingClientRect().height);
  }

  function change(next, animate = true) {
    if (compact === next) return;
    animations.forEach(animation => animation.cancel());
    const elements = [title, filters];
    const before = elements.map(element => element.getBoundingClientRect());
    if (next) {
      const top = content.getBoundingClientRect().top;
      header.style.setProperty('--now-eyebrow-top', (eyebrow.getBoundingClientRect().top - top) + 'px');
      header.style.setProperty('--now-description-top', (description.getBoundingClientRect().top - top) + 'px');
    }
    compact = next;
    header.classList.toggle('is-compact', next);
    [eyebrow, description].forEach(element => element.setAttribute('aria-hidden', String(next)));
    if (!animate || reduced.matches || !title.animate) return;
    animations = elements.map((element, index) => {
      const after = element.getBoundingClientRect();
      const from = before[index];
      return element.animate([
        {transform: `translate(${from.left - after.left}px, ${from.top - after.top}px) scale(${from.width / after.width}, ${from.height / after.height})`},
        {transform: 'none'}
      ], {duration: 300, easing: 'cubic-bezier(.22, .7, .25, 1)', composite: 'replace'});
    });
  }
  function update() {
    frame = 0;
    // 역방향에 작은 여유를 둬 경계에서 상태가 떨리지 않게 합니다.
    change(window.scrollY >= threshold - (compact ? 12 : 0));
    syncHomeHeader();
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  function measure() {
    animations.forEach(animation => animation.cancel());
    header.classList.remove('is-compact', 'is-ready');
    compact = false;
    [eyebrow, description].forEach(element => element.setAttribute('aria-hidden', 'false'));
    const height = content.getBoundingClientRect().height;
    threshold = section.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(section).paddingTop);
    const barHeight = parseFloat(getComputedStyle(header).getPropertyValue('--now-bar-height'));
    header.style.setProperty('--now-header-gap', Math.max(0, height - barHeight) + 'px');
    header.classList.add('is-ready');
    change(window.scrollY >= threshold, false);
    syncHomeHeader();
  }
  measure();
  window.addEventListener('scroll', queue, {passive: true});
  window.addEventListener('resize', measure);
  window.addEventListener('pageshow', measure);
  reduced.addEventListener('change', () => animations.forEach(animation => animation.cancel()));
  document.fonts?.ready.then(measure);
})();
