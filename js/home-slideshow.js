/* 네 장의 현장 사진을 순서대로 끊김 없이 반복합니다. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scenes = [...hero.querySelectorAll('.hero-scenes .hero-photo')];
  const buttons = [...hero.querySelectorAll('[data-scene]')];
  const controls = hero.querySelector('.hero-scene-controls');
  const description = hero.querySelector('.hero-description');
  const ctaGroup = hero.querySelector('.hero-cta-group');
  // 설명문 끝과 진행 UI 시작 사이에 CTA 묶음을 중앙 배치합니다.
  // 원래 자리의 높이는 유지해 제목과 하단 UI가 이동하지 않게 합니다.
  if (description && ctaGroup && controls) {
    let offset = 0;
    function balanceCta() {
      const descriptionBottom = description.getBoundingClientRect().bottom;
      const controlsTop = controls.getBoundingClientRect().top;
      const ctaRect = ctaGroup.getBoundingClientRect();
      const originalTop = ctaRect.top - offset;
      const targetTop = (descriptionBottom + controlsTop - ctaRect.height) / 2;
      offset = targetTop - originalTop;
      ctaGroup.style.setProperty('--cta-balance-offset', `${offset}px`);
    }
    balanceCta();
    window.addEventListener('resize', balanceCta);
    window.addEventListener('pageshow', balanceCta);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(balanceCta);
      [hero, description, ctaGroup, controls].forEach(element => observer.observe(element));
    }
    if (document.fonts) document.fonts.ready.then(balanceCta);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 4000;
  const clamp = value => Math.min(1, Math.max(0, value));
  let active = 0, frame, elapsed = 0, lastTime = 0;
  let inView = true, focused = false, pageAway = false;
  function paintProgress() {
    buttons.forEach((button, i) => button.style.setProperty('--scene-progress',
      String(i < active ? 1 : i === active ? (reduced.matches ? 1 : clamp(elapsed / duration)) : 0)));
  }
  function select(index) {
    active = index;
    scenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === index);
      scene.setAttribute('aria-hidden', String(i !== index));
    });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    paintProgress();
  }
  function tick(now) {
    // 인트로가 끝나 실제 장면이 보이는 순간부터 진행합니다.
    if (!document.documentElement.classList.contains('aica-welcoming')) {
      elapsed += now - lastTime;
      if (elapsed >= duration) {
        const steps = Math.floor(elapsed / duration);
        elapsed %= duration;
        select((active + steps) % buttons.length);
      }
      paintProgress();
    }
    lastTime = now;
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    paintProgress();
    if (!reduced.matches && inView && !focused && !document.hidden && !pageAway) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function choose(index) {
    elapsed = 0;
    select(index);
    sync();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => choose(index));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % buttons.length : event.key === 'ArrowLeft' ? (index + buttons.length - 1) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      buttons[next].focus();
      choose(next);
    });
  });
  controls.addEventListener('pointerdown', () => { focused = false; sync(); });
  controls.addEventListener('focusin', () => { focused = document.activeElement.matches(':focus-visible'); sync(); });
  controls.addEventListener('focusout', () => queueMicrotask(() => { focused = controls.contains(document.activeElement) && document.activeElement.matches(':focus-visible'); sync(); }));
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { pageAway = true; sync(); });
  window.addEventListener('pageshow', () => { pageAway = false; sync(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }).observe(hero);
  select(0);
  sync();
})();
