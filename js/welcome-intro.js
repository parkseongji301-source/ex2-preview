/* 새로운 환영 장면: AICA의 브랜드 로고에서 실제 히어로로 이어지는 하나의 창.
   세션 첫 홈 진입과 히어로에서 새로고침할 때 재생합니다. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (document.documentElement.classList.contains('space-arrival')) return;
  const seenKey = 'aica:welcome:2026-09';
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  const isReload = navigationType === 'reload';
  if (reduced.matches || document.visibilityState === 'hidden' ||
      (location.hash && location.hash !== '#top') ||
      navigationType === 'back_forward') return;
  try { if (!isReload && sessionStorage.getItem(seenKey)) return; } catch { /* 저장이 막혀도 진입 가능 */ }

  const root = document.documentElement;
  const entry = document.createElement('div');
  entry.className = 'aica-welcome';
  entry.setAttribute('role', 'dialog');
  entry.setAttribute('aria-modal', 'true');
  entry.setAttribute('aria-label', 'AICA 인공지능사관학교에 오신 것을 환영합니다');
  entry.innerHTML = `
    <svg class="aica-welcome__curtain" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs><mask id="aica-welcome-window" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" style="mask-type:luminance">
        <rect width="100%" height="100%" fill="white" />
        <circle class="aica-welcome__opening" cx="0" cy="0" r="0" fill="black" />
      </mask></defs>
      <rect width="100%" height="100%" fill="#102638" mask="url(#aica-welcome-window)" />
    </svg>
    <div class="aica-welcome__brand" role="progressbar" aria-label="브랜드 로고 완성" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="aica-welcome__word"><span>AICA</span><svg class="aica-welcome__logo" viewBox="0 0 175 139" aria-hidden="true" focusable="false"><path d="M14 43L83 15L153 43L125 54V47L137 42L83 21L29 42L40 47V54Z"/><path d="M44 44H122V110H104V62H62V110H44Z"/><path d="M77 74H89V85H77Z"/><path d="M77 92H89V111L97 131H69L77 111Z"/><path d="M140 46H144V70H140Z"/><circle cx="142" cy="74" r="5"/></svg></div>
      <p class="aica-welcome__name">인공지능사관학교</p>
    </div>
    <button class="aica-welcome__skip" type="button">건너뛰기 ↗</button>`;
  document.body.append(entry);
  // 스타일이 로드되지 않았다면 본문을 가리지 않습니다.
  if (getComputedStyle(entry).position !== 'fixed') { entry.remove(); return; }

  let finished = false;
  let frame = 0;
  let watchdog = 0;
  let start = null;
  let openingStarted = false;
  let centerX = 0, centerY = 0, radius = 0, seed = 0;
  const siblings = new Map();
  const previousFocus = document.activeElement;
  const brand = entry.querySelector('.aica-welcome__brand');
  const word = entry.querySelector('.aica-welcome__word > span');
  const name = entry.querySelector('.aica-welcome__name');
  const logo = entry.querySelector('.aica-welcome__logo');
  const strokes = [...logo.children];
  const opening = entry.querySelector('.aica-welcome__opening');
  const skip = entry.querySelector('button');
  const hold = 2100;
  const duration = 850;
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => value * value * (3 - 2 * value);

  function finish() {
    if (finished) return;
    finished = true;
    const hadFocus = entry.contains(document.activeElement);
    cancelAnimationFrame(frame);
    clearTimeout(watchdog);
    document.removeEventListener('DOMContentLoaded', prepare);
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', finish);
    window.removeEventListener('pagehide', finish);
    reduced.removeEventListener('change', finish);
    siblings.forEach((inert, element) => { element.inert = inert; });
    root.classList.remove('aica-welcoming');
    entry.remove();
    if (hadFocus) {
      const target = previousFocus !== document.body && previousFocus?.isConnected
        ? previousFocus : document.querySelector('.site-header .brand');
      target?.focus({preventScroll: true});
    }
  }
  function onKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); finish(); }
    else if (event.key === 'Tab') { event.preventDefault(); skip.focus({preventScroll: true}); }
    else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key) && event.target !== skip) event.preventDefault();
  }
  function onVisibility() { if (document.visibilityState === 'hidden') finish(); }
  function prepare() {
    if (finished) return;
    const hero = document.querySelector('.hero');
    const heroVisible = hero && hero.getBoundingClientRect().bottom > (document.querySelector('.site-header')?.offsetHeight || 0);
    if (window.scrollY > 4 && (!isReload || !heroVisible)) { finish(); return; }
    for (const child of document.body.children) {
      if (child === entry || ['SCRIPT', 'LINK', 'STYLE'].includes(child.tagName)) continue;
      siblings.set(child, child.inert);
      child.inert = true;
    }
    frame = requestAnimationFrame(tick);
  }
  function measureOpening() {
    // 서체 교체 이후, 열리는 순간의 완성된 로고 중심을 한 번만 측정합니다.
    const rect = logo.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    seed = rect.width / 2;
    radius = Math.hypot(Math.max(centerX, innerWidth - centerX), Math.max(centerY, innerHeight - centerY)) + 4;
    opening.setAttribute('cx', centerX);
    opening.setAttribute('cy', centerY);
  }
  function tick(now) {
    if (finished) return;
    if (start === null) start = now;
    const elapsed = now - start;
    const progress = clamp((elapsed - hold) / duration);
    word.style.opacity = ease(clamp(elapsed / 260));
    name.style.opacity = ease(clamp((elapsed - 160) / 280));
    const drawn = clamp((elapsed - 200) / 1600);
    strokes.forEach((stroke, index) => {
      const part = clamp(drawn * strokes.length - index);
      stroke.style.strokeDashoffset = String(100 * (1 - part));
      stroke.style.fillOpacity = String(clamp((drawn - .78) / .22));
    });
    const value = Math.round(drawn * 100);
    brand.setAttribute('aria-valuenow', String(value));
    // 브랜드가 먼저 물러나고, 하나의 원이 화면 모서리까지 열립니다.
    brand.style.opacity = 1 - ease(clamp((elapsed - hold) / 300));
    skip.style.opacity = 1 - ease(clamp((elapsed - hold - 650) / 350));
    if (elapsed >= hold) {
      if (!openingStarted) { measureOpening(); openingStarted = true; }
      opening.setAttribute('r', seed + (radius - seed) * ease(progress));
    }
    if (progress >= 1) finish();
    else frame = requestAnimationFrame(tick);
  }

  try {
    root.classList.add('aica-welcoming');
    word.style.opacity = '0';
    name.style.opacity = '0';
    strokes.forEach(stroke => { stroke.setAttribute('pathLength', '100'); stroke.style.strokeDasharray = '100'; stroke.style.strokeDashoffset = '100'; stroke.style.fillOpacity = '0'; });
    skip.addEventListener('click', finish);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', finish, {once: true});
    window.addEventListener('pagehide', finish, {once: true});
    reduced.addEventListener('change', finish, {once: true});
    // 어떤 예외에서도 가림막과 입력 잠금이 남지 않게 합니다.
    watchdog = setTimeout(finish, 4500);
    try { sessionStorage.setItem(seenKey, '1'); } catch { /* 저장 없이도 정상 종료 */ }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, {once: true});
    else prepare();
  } catch { finish(); }
})();
