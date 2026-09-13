/* 시안의 목록 탐색과 읽기. 원고와 분류는 data 파일에서 관리합니다. */
(() => {
  'use strict';
  const data = window.AICA_EXPERIENCE;
  if (!data) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lines = value => esc(value).replace(/\n/g, '<br>');
  const safeUrl = value => {
    try { const url = new URL(value, location.href); return ['http:','https:','file:'].includes(url.protocol) ? esc(value) : '#'; } catch { return '#'; }
  };
  const photo = item => item.image ? '<figure><img src="'+safeUrl(item.image)+'" alt="'+esc(item.alt)+'" loading="lazy"><figcaption>'+esc(item.caption)+'</figcaption></figure>' : '';
  function filters(container, items, onChange) {
    container.innerHTML = items.map((item,i) => '<button type="button" data-filter="'+esc(item.id)+'" aria-pressed="'+(i === 0)+'">'+esc(item.label)+'</button>').join('');
    const select = id => {
      const selected = items.find(item => item.id === id) || items[0];
      container.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected.id)));
      onChange(selected.id, selected.label);
    };
    container.addEventListener('click', event => { const button = event.target.closest('button[data-filter]'); if (button) select(button.dataset.filter); });
    return select;
  }
  const nowFeed = document.querySelector('#now-feed');
  if (nowFeed) {
    const more = document.querySelector('#now-more');
    const moreNote = document.querySelector('#now-more-note');
    let limit = 7, currentId = 'all', currentLabel = '전체';
    function renderNow(id, label) {
      const items = data.now.filter(item => id === 'all' || item.category === id);
      nowFeed.innerHTML = items.slice(0, limit).map(item => {
        const title = esc(item.title.replace(/\n/g, ' '));
        const date = item.date
          ? '<time class="now-row-date" datetime="'+esc(item.date.replace(/\./g, '-'))+'" title="아카이브 등록일">'+esc(item.date.slice(0,7))+'</time>'
          : '<span class="now-row-date">등록일 미확인</span>';
        const thumbnail = item.image
          ? '<figure class="now-row-thumbnail"><img src="'+safeUrl(item.image)+'" alt="'+esc(item.alt)+'" width="192" height="128" loading="lazy"></figure>' : '';
        const action = item.href
          ? '<a class="now-row-link" href="'+safeUrl(item.href)+'">질문별 이야기 보기 <span aria-hidden="true">↗</span></a>'
          : '<details><summary>기록 자세히 보기</summary><p class="detail-copy">'+esc(item.detail)+'</p>'+(item.caption ? '<p class="detail-source">사진: '+esc(item.caption)+'</p>' : '')+'<p class="detail-source">출처: '+esc(item.source)+(item.date ? ' · '+esc(item.date)+' 등록' : '')+' · <a href="https://ai-school-archive.pages.dev/" target="_blank" rel="noopener noreferrer">공개 아카이브 ↗</a></p></details>';
        return '<article class="now-row"><div class="now-row-copy"><p class="now-row-meta">'+esc(item.label.replace(/^RESULT/, 'PROJECT'))+'</p><h3>'+title+'</h3><p class="now-row-description">'+esc(item.description)+'</p>'+date+'<div class="now-row-action">'+action+'</div></div>'+thumbnail+'</article>';
      }).join('');
      document.querySelector('#now-status').textContent = label+' 기록 '+Math.min(limit, items.length)+' / '+items.length+'건';
      const hasMore = items.length > limit;
      more?.setAttribute('aria-disabled', String(!hasMore));
      if (moreNote) moreNote.textContent = hasMore ? '' : '현재 공개된 기록을 모두 확인했어요.';
    }
    const select = filters(document.querySelector('#now-filters'), data.nowCategories, (id,label) => {
      currentId = id; currentLabel = label; limit = 7; renderNow(id, label);
    });
    more?.addEventListener('click', () => {
      if (more.getAttribute('aria-disabled') === 'true') return;
      limit += 7; renderNow(currentId, currentLabel);
    });
    select('all');
  }
  const questionFeed = document.querySelector('#question-feed');
  if (!questionFeed) return;
  const source = window.AICA_STORIES;
  const featured = source.articles['live-22'];
  const blocks = {
    h: block => '<h3>'+esc(block.text)+'</h3>',
    p: block => '<p>'+esc(block.text)+'</p>',
    figure: block => photo(block),
    summary: block => '<div class="reading-summary"><h3>'+esc(block.title)+'</h3><ul>'+block.items.map(item => '<li>'+esc(item)+'</li>').join('')+'</ul></div>'
  };
  document.querySelector('#featured-body').innerHTML = featured.body.map(block => blocks[block.t] ? blocks[block.t](block) : '').join('');
  const record = id => id === 'live-22' ? featured : source.cards.find(item => item.id === id);
  const meta = item => item.cohort ? item.cohort+'기 · '+item.date+' 등록' : item.date+' 등록 후기 · 기수 미확인';
  const select = filters(document.querySelector('#question-filters'), data.questions, (id,label) => {
    const items = data.stories.filter(item => id === 'all' || item.questions.includes(id));
    questionFeed.innerHTML = items.map(item => '<article class="question-card"><p class="question-person">'+esc(item.person)+'<span>'+esc(meta(record(item.id)))+'</span></p><div class="question-content"><h3>'+esc(item.title)+'</h3><p>'+esc(item.summary)+'</p></div><span class="question-arrow" aria-hidden="true">↗</span><button type="button" data-story="'+esc(item.id)+'" aria-label="'+esc(item.person)+'의 이야기 읽기">이야기 읽기 →</button></article>').join('');
    document.querySelector('#question-status').textContent = label+' · 이야기 '+items.length+'편';
    document.querySelector('#question-empty').hidden = items.length > 0;
  });
  document.querySelector('#questions-reset').addEventListener('click', () => { select('all'); document.querySelector('#question-filters button').focus(); });
  select(new URLSearchParams(location.search).get('topic') || 'all');
  const dialog = document.querySelector('#story-reader');
  let opener = null;
  function openStory(id, trigger) {
    if (id === 'live-22') { document.querySelector('#featured-story').scrollIntoView(); document.querySelector('#reading-title').setAttribute('tabindex','-1'); document.querySelector('#reading-title').focus({preventScroll:true}); return; }
    const item = data.stories.find(story => story.id === id);
    const original = record(id);
    if (!item || !original) return;
    opener = trigger;
    document.querySelector('#reader-content').innerHTML = '<p class="reader-meta">'+esc(item.person)+' · '+esc(meta(original))+'</p><h2 id="dialog-title">'+esc(item.title)+'</h2><p>'+esc(original.summary)+'</p>'+(item.extra ? '<p>'+esc(item.extra)+'</p>' : '')+'<p class="reader-note">공개 수료 후기의 요약본입니다. 전체 경험담은 원문에서 확인할 수 있습니다. 날짜는 아카이브 등록일입니다.</p><a href="https://ai-school-archive.pages.dev/" target="_blank" rel="noopener noreferrer">공개 아카이브에서 원문 찾기 ↗</a><p class="reader-note">수료 후기 게시판 · 작성자 '+esc(item.person)+' · '+esc(original.date)+'</p>';
    dialog.showModal();
  }
  questionFeed.addEventListener('click', event => { const button = event.target.closest('[data-story]'); if (button) openStory(button.dataset.story, button); });
  document.querySelector('#reader-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus(); });
  // 기존 대표 글·후기 주소도 동일한 아카이브 공간으로 연결합니다.
  const requestedId = new URLSearchParams(location.search).get('id');
  if (requestedId && data.stories.some(item => item.id === requestedId)) openStory(requestedId);
})();

