/* 실제 링크와 브라우저 뒤로가기를 유지하는 공통 공간 전환. */
(() => {
  'use strict';
  const key = 'aica:space-arrival';
  const root = document.documentElement;
  try {
    const arrival = JSON.parse(sessionStorage.getItem(key) || 'null');
    sessionStorage.removeItem(key);
    if (arrival && arrival.path === location.pathname && Date.now() - arrival.time < 15000) {
      root.classList.add('space-arrival');
      setTimeout(() => root.classList.remove('space-arrival'), 1800);
    }
  } catch { /* 저장소 없이도 기본 링크로 이동합니다. */ }
  let pending = false;
  const reset = () => { pending = false; root.classList.remove('space-opening'); document.querySelectorAll('[data-space-pending]').forEach(link => { link.removeAttribute('aria-busy'); link.removeAttribute('data-space-pending'); }); };
  window.addEventListener('pageshow', reset);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const target = new URL(link.href, location.href);
    const current = new URL(location.href);
    const valid = ['index.html','story.html'];
    const file = url => url.pathname.split('/').pop() || 'index.html';
    if (target.origin !== current.origin || target.pathname.slice(0,target.pathname.lastIndexOf('/')) !== current.pathname.slice(0,current.pathname.lastIndexOf('/')) || !valid.includes(file(target)) || !valid.includes(file(current)) || file(target) === file(current)) return;
    event.preventDefault();
    if (pending) return;
    pending = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const go = () => {
      try { sessionStorage.setItem(key, JSON.stringify({path:target.pathname,time:Date.now()})); } catch {}
      location.assign(target.href);
      setTimeout(reset, 2000);
    };
    if (reduced) { go(); return; }
    root.classList.add('space-opening');
    link.setAttribute('aria-busy','true');
    link.setAttribute('data-space-pending','');
    // 짧은 원형 피드백 뒤 브라우저의 공통 로고 전환으로 이어집니다.
    setTimeout(go, link.classList.contains('hero-cta') ? 280 : 80);
  });
})();
