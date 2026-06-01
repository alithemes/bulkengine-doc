// Mobile drawer
var sidebar=document.getElementById('sidebar'),
    scrim=document.getElementById('scrim'),
    btn=document.getElementById('menuBtn');
function closeDrawer(){sidebar.classList.remove('open');scrim.classList.remove('show');}
if(btn){btn.addEventListener('click',function(){sidebar.classList.add('open');scrim.classList.add('show');});}
scrim.addEventListener('click',closeDrawer);
document.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',closeDrawer);});

// Scroll-spy
var links=[].slice.call(document.querySelectorAll('nav a'));
var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      links.forEach(function(l){l.classList.remove('active');});
      var act=map[e.target.id];
      if(act){act.classList.add('active');
        // keep active item in view within sidebar
        var r=act.getBoundingClientRect(),sr=sidebar.getBoundingClientRect();
        if(r.top<sr.top+70||r.bottom>sr.bottom-20){act.scrollIntoView({block:'nearest'});}
      }
    }
  });
},{rootMargin:'-10% 0px -75% 0px',threshold:0});
document.querySelectorAll('section[id]').forEach(function(s){obs.observe(s);});

// ---- Screenshots image lightbox.
// Click a `.gallery__item` thumbnail → open the native <dialog> with the
// full-size image. ESC + backdrop click close (native), arrow keys + side
// buttons navigate prev/next with wraparound.
(function () {
  var lb       = document.getElementById('lightbox');
  var items    = document.querySelectorAll('.gallery__item');
  if (!lb || !items.length) return;

  var imgEl     = document.getElementById('lightboxImg');
  var captionEl = document.getElementById('lightboxCaption');
  var closeBtn  = document.getElementById('lightboxClose');
  var prevBtn   = document.getElementById('lightboxPrev');
  var nextBtn   = document.getElementById('lightboxNext');
  var dialogSupported = typeof lb.showModal === 'function';
  var currentIndex = 0;

  function setImage(idx) {
    var item = items[idx];
    if (!item) return;
    var thumb = item.querySelector('img');
    var cap   = item.querySelector('.gallery__caption');
    if (!thumb) return;
    currentIndex = idx;
    imgEl.src = thumb.src;
    imgEl.alt = thumb.alt || '';
    captionEl.textContent = cap ? cap.textContent : '';
  }
  function openLb(idx) {
    setImage(idx);
    if (dialogSupported) lb.showModal();
    else lb.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    if (dialogSupported && lb.open) lb.close();
    else lb.removeAttribute('open');
    document.body.style.overflow = '';
    imgEl.src = '';
  }
  function showPrev() {
    var n = currentIndex - 1;
    if (n < 0) n = items.length - 1;
    setImage(n);
  }
  function showNext() {
    var n = currentIndex + 1;
    if (n >= items.length) n = 0;
    setImage(n);
  }

  items.forEach(function (item, idx) {
    item.addEventListener('click', function () { openLb(idx); });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeLb);
  if (prevBtn)  prevBtn.addEventListener('click', showPrev);
  if (nextBtn)  nextBtn.addEventListener('click', showNext);

  // Click on backdrop closes.
  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLb();
  });

  // Arrow keys when open.
  document.addEventListener('keydown', function (e) {
    if (!lb.open) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); showPrev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); showNext(); }
  });

  // Native close (ESC / programmatic) — restore scroll + free image.
  lb.addEventListener('close', function () {
    document.body.style.overflow = '';
    imgEl.src = '';
  });
})();

// ---- Hero video lightbox.
// Click "Watch demo" → open <dialog> with the demo video and start
// playback. Close (X / ESC / backdrop) pauses + rewinds so re-opening
// always feels like a fresh play.
(function () {
  var trigger = document.getElementById('videoTrigger');
  var box     = document.getElementById('videoLightbox');
  var xBtn    = document.getElementById('videoLightboxClose');
  var video   = document.getElementById('demoVideo');
  if (!trigger || !box || !video) return;

  var dialogSupported = typeof box.showModal === 'function';

  function open() {
    if (dialogSupported) box.showModal();
    else box.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    var p = video.play();
    if (p && p.catch) p.catch(function(){ /* browser blocked autoplay */ });
  }
  function close() {
    if (dialogSupported && box.open) box.close();
    else box.removeAttribute('open');
    document.body.style.overflow = '';
    video.pause();
    try { video.currentTime = 0; } catch (e) {}
  }

  trigger.addEventListener('click', open);
  if (xBtn) xBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) {
    if (e.target === box) close();
  });
  box.addEventListener('close', function () {
    document.body.style.overflow = '';
    video.pause();
    try { video.currentTime = 0; } catch (e) {}
  });
})();
