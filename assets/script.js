/* Lightbox: click any .lightbox-trigger image on a case study page to expand it. */
(function(){
  var overlay = document.getElementById('lightboxOverlay');
  var overlayImg = document.getElementById('lightboxImg');
  var closeBtn = document.getElementById('lightboxClose');
  if(!overlay || !overlayImg) return;
  function openLightbox(src, alt){
    overlayImg.src = src; overlayImg.alt = alt || '';
    overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.lightbox-trigger').forEach(function(img){
    img.addEventListener('click', function(){ openLightbox(img.currentSrc || img.src, img.alt); });
  });
  if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('show')) closeLightbox();
  });
})();

/* Case study "jump to solution" link */
document.querySelectorAll('a[href="#solution"]').forEach(function(link){
  link.addEventListener('click', function(e){
    e.preventDefault();
    var t = document.getElementById('solution');
    if(t) t.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

/* Homepage: highlight the sidebar item for the section currently in view. */
(function(){
  var nav = document.getElementById('sideNav');
  if(!nav || !('IntersectionObserver' in window)) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var map = {};
  links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && map[e.target.id]){
        links.forEach(function(a){ a.classList.remove('active'); });
        map[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin:'-30% 0px -60% 0px' });
  Object.keys(map).forEach(function(id){
    var el = document.getElementById(id);
    if(el) io.observe(el);
  });
})();


/* Clickable process stepper: click an icon to show that step's image and notes. */
document.querySelectorAll('.cs-flow[role="tablist"]').forEach(function(flow){
  var steps = Array.prototype.slice.call(flow.querySelectorAll('.cs-flow-step'));
  var wrap = flow.nextElementSibling;
  var panels = wrap ? Array.prototype.slice.call(wrap.querySelectorAll('.cs-step-panel')) : [];
  function select(i, focus){
    steps.forEach(function(s, j){
      var on = j === i;
      s.classList.toggle('active', on);
      s.setAttribute('aria-selected', on ? 'true' : 'false');
      s.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function(p, j){
      p.classList.toggle('active', j === i);
      if(j !== i) p.querySelectorAll('video').forEach(function(v){ v.pause(); });
    });
    if(focus) steps[i].focus();
  }
  steps.forEach(function(s, i){
    s.addEventListener('click', function(){ select(i); });
    s.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ e.preventDefault(); select((i+1) % steps.length, true); }
      if(e.key === 'ArrowLeft'){ e.preventDefault(); select((i-1+steps.length) % steps.length, true); }
    });
  });
  select(0);
});


/* Case study side contents: highlight the section being read. */
(function(){
  var toc = document.querySelector('.cs-toc');
  if(!toc) return;
  var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
  var targets = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  var ticking = false;
  function update(){
    ticking = false;
    var idx = 0;
    targets.forEach(function(t, i){ if(t && t.getBoundingClientRect().top <= 140) idx = i; });
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) idx = links.length - 1;
    links.forEach(function(a, i){
      a.classList.toggle('active', i === idx);
      if(i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
  window.addEventListener('resize', update);
  update();
})();


/* "View the other flow" buttons: switch the prototype flow tabs from inside a panel. */
document.querySelectorAll('[data-goto-flow]').forEach(function(btn){
  btn.addEventListener('click', function(){
    var box = btn.closest('.cs-highlight');
    var steps = box ? box.querySelectorAll('.cs-flow-step') : [];
    var target = steps[parseInt(btn.getAttribute('data-goto-flow'), 10)];
    if(target){
      target.click();
      var tabs = box.querySelector('.cs-flow');
      if(tabs && tabs.getBoundingClientRect().top < 0){ tabs.scrollIntoView({ behavior:'smooth', block:'start' }); }
    }
  });
});


/* Stop the attention cue once the flagged flow tab has been opened. */
document.querySelectorAll('.cs-flow-step.nudge').forEach(function(b){
  b.addEventListener('click', function(){ b.classList.remove('nudge'); });
});
