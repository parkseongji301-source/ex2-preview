/* 히어로 ↔ AICA NOW만 화면 단위로 전환하고, 이후 콘텐츠는 기본 스크롤합니다. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const next = document.querySelector('#now');
  if (!hero || !next) return;
  const closing = document.querySelector('#closing-page');
  const footer = document.querySelector('.site-footer');
  if (closing && footer) {
    const sizeFooter = () => closing.style.setProperty('--closing-footer-height', `${footer.getBoundingClientRect().height}px`);
    sizeFooter();
    window.addEventListener('resize', sizeFooter);
    if ('ResizeObserver' in window) new ResizeObserver(sizeFooter).observe(footer);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(hover: hover) and (pointer: fine)');
  const duration = 950;
  const upwardThreshold = 64;
  let frame = 0, moving = false, settling = false, lastWheel = -Infinity;
  let destination = null;
  let originalAnchor = '', originalAnchorPriority = '';
  const root = document.documentElement;
  const topOf = element => element.getBoundingClientRect().top + window.scrollY;
  const ease = t => t < .5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
  const destinationTop = element => Math.max(0, Math.min(topOf(element), root.scrollHeight - innerHeight));
  function finish() {
    cancelAnimationFrame(frame);
    // 키·포인터·창 크기 변경으로 종료돼도 섹션 사이에 남지 않습니다.
    if (destination) window.scrollTo({top:destinationTop(destination), behavior:'instant'});
    if (moving) {
      if (originalAnchor) root.style.setProperty('overflow-anchor', originalAnchor, originalAnchorPriority);
      else root.style.removeProperty('overflow-anchor');
    }
    destination = null;
    moving = false;
    settling = true;
    lastWheel = performance.now();
  }
  function cancel() { if (moving) finish(); }
  function travel(element) {
    if (moving) return;
    const from = window.scrollY;
    const start = performance.now();
    destination = element;
    originalAnchor = root.style.getPropertyValue('overflow-anchor');
    originalAnchorPriority = root.style.getPropertyPriority('overflow-anchor');
    root.style.setProperty('overflow-anchor', 'none');
    moving = true;
    if (reduced.matches) { finish(); return; }
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const to = destinationTop(element);
      window.scrollTo({top:from + (to - from) * ease(progress), behavior:'instant'});
      if (progress < 1) frame = requestAnimationFrame(tick);
      // sticky 헤더의 스크롤 반응까지 반영한 다음 프레임에 도착점을 확정합니다.
      else frame = requestAnimationFrame(finish);
    }
    frame = requestAnimationFrame(tick);
  }
  function nestedScroll(target) {
    if (!(target instanceof Element)) return false;
    if (target.closest('dialog, [role="dialog"], textarea, select, [contenteditable="true"]')) return true;
    for (let element = target; element && element !== document.body; element = element.parentElement) {
      if (element.scrollHeight > element.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(element).overflowY)) return true;
    }
    return false;
  }
  window.addEventListener('wheel', event => {
    if (!event.cancelable || event.ctrlKey || event.metaKey) return;
    const now = performance.now();
    // 전환 중에는 대상 요소·방향과 무관하게 추가 휠이 화면을 밀지 못하게 합니다.
    if (moving) { event.preventDefault(); lastWheel = now; return; }
    if (!desktop.matches || event.defaultPrevented ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY ||
        root.classList.contains('aica-welcoming') || nestedScroll(event.target)) return;
    const idle = now - lastWheel;
    lastWheel = now;
    // 한 번의 트랙패드 동작에서 남은 관성이 도착한 화면을 밀지 않게 합니다.
    if (settling && idle < 220) { event.preventDefault(); return; }
    settling = false;
    const position = window.scrollY;
    const nextTop = topOf(next);
    // 실제 NOW 시작 좌표의 64px 이내에서는 첫 위쪽 휠을 동기적으로 가로챕니다.
    // 큰 입력으로 경계를 넘는 경우도 NOW에 한 번 정차하지 않고 HERO로 연결합니다.
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    const up = delta < 0 && position > topOf(hero) + 2 &&
      (position <= nextTop + upwardThreshold || position + delta <= nextTop + 2);
    if (up) {
      event.preventDefault();
      travel(hero);
      return;
    }
    const down = event.deltaY > 0 && position >= topOf(hero) - 2 && position < nextTop - 2;
    if (!down) return;
    event.preventDefault();
    travel(next);
  }, {passive:false, capture:true});
  hero.querySelector('a[href="#now"]')?.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    travel(next);
  });
  window.addEventListener('keydown', event => {
    if (['Escape', 'Tab', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancel();
  });
  window.addEventListener('touchstart', cancel, {passive:true});
  window.addEventListener('pointerdown', cancel, {passive:true});
  window.addEventListener('resize', cancel);
  window.addEventListener('pagehide', cancel);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
  reduced.addEventListener('change', cancel);
  desktop.addEventListener('change', cancel);
})();
