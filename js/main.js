document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     Ticker distance
     - measures one track's real pixel width and drives the
       loop animation with that exact value, instead of relying
       on translateX(-50%) (which some browsers can resolve
       against the wrong reference box and overshoot, leaving a
       visible gap before the loop resets)
  ---------------------------------------------------------- */
  var ticker = document.querySelector('.ticker');
  var tickerTrack = document.querySelector('.ticker-track');

  function setTickerDistance() {
    if (!ticker || !tickerTrack) return;
    var width = tickerTrack.getBoundingClientRect().width;
    ticker.style.setProperty('--ticker-distance', -width + 'px');
  }

  setTickerDistance();
  window.addEventListener('resize', setTickerDistance);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setTickerDistance);
  }

  /* ----------------------------------------------------------
     Mobile nav toggle
  ---------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var tabsNav = document.getElementById('tabsNav');

  function closeMobileNav() {
    if (tabsNav) tabsNav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && tabsNav) {
    toggle.addEventListener('click', function () {
      var isOpen = tabsNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ----------------------------------------------------------
     Tabs
  ---------------------------------------------------------- */
  var tabLinks = document.querySelectorAll('[data-tab]');
  var tabPanels = document.querySelectorAll('[data-tab-panel]');
  var validTabs = [];
  tabPanels.forEach(function (panel) { validTabs.push(panel.id); });

  function revealPanel(panel) {
    var items = panel.querySelectorAll('.reveal');
    items.forEach(function (el, index) {
      el.classList.remove('visible');
      setTimeout(function () {
        el.classList.add('visible');
      }, (index % 6) * 70);
    });
  }

  function activateTab(id, skipScroll) {
    if (validTabs.indexOf(id) === -1) id = 'home';

    tabPanels.forEach(function (panel) {
      panel.classList.toggle('active', panel.id === id);
    });

    tabLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-tab') === id);
    });

    var activePanel = document.getElementById(id);
    if (activePanel) revealPanel(activePanel);

    if (!skipScroll) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    closeMobileNav();
  }

  tabLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var id = link.getAttribute('data-tab');
      if (history.pushState) {
        history.pushState(null, '', '#' + id);
      } else {
        window.location.hash = id;
      }
      activateTab(id);
    });
  });

  window.addEventListener('popstate', function () {
    var id = window.location.hash.replace('#', '');
    activateTab(id, true);
  });

  var initialId = window.location.hash.replace('#', '') || 'home';
  activateTab(initialId, true);

  /* ----------------------------------------------------------
     Lightbox
     - click any photo-grid image to open
     - close with the button, clicking the dark overlay, or Escape
  ---------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.photo-card img').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.src, img.alt);
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ----------------------------------------------------------
     Music widget
     - lives outside the tab panels, so switching tabs never
       pauses or resets it
  ---------------------------------------------------------- */
  var bgAudio = document.getElementById('bgAudio');
  var musicToggle = document.getElementById('musicToggle');
  var iconPlay = musicToggle ? musicToggle.querySelector('.icon-play') : null;
  var iconPause = musicToggle ? musicToggle.querySelector('.icon-pause') : null;

  if (bgAudio && musicToggle) {
    musicToggle.addEventListener('click', function () {
      if (bgAudio.paused) {
        bgAudio.play();
      } else {
        bgAudio.pause();
      }
    });

    bgAudio.addEventListener('play', function () {
      musicToggle.classList.add('playing');
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Pause lofi beats');
      if (iconPlay) iconPlay.hidden = true;
      if (iconPause) iconPause.hidden = false;
    });

    bgAudio.addEventListener('pause', function () {
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Play lofi beats');
      if (iconPlay) iconPlay.hidden = false;
      if (iconPause) iconPause.hidden = true;
    });
  }

});
