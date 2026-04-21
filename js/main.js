/**
 * main.js — 신원스틸(주) 메인 페이지 전용 JavaScript
 */
(function () {
  'use strict';

  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }
  function qsa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* 숫자 카운팅 애니메이션 */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el, target, duration, suffix) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.round(easeOutCubic(progress) * target);
      el.innerHTML = suffix ? current + '<span>' + suffix + '</span>' : current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initStatsCounter() {
    var statsSection = qs('.stats');
    if (!statsSection) return;
    var counters = [
      { selector: '.stats__item:nth-child(1) strong', target: 35, suffix: '+', duration: 1800 },
      { selector: '.stats__item:nth-child(2) strong', target: 12, suffix: '종+', duration: 1200 },
      { selector: '.stats__item:nth-child(4) strong', target: 2, suffix: '건', duration: 1200 },
    ];
    var animated = false;
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (c) {
        var el = qs(c.selector);
        if (el) animateCount(el, c.target, c.duration, c.suffix);
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          observer.disconnect();
          counters.forEach(function (c) {
            var el = qs(c.selector);
            if (el) animateCount(el, c.target, c.duration, c.suffix);
          });
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  /* 히어로 스크롤 화살표 */
  function initHeroScrollArrow() {
    var arrow = qs('.hero__scroll-arrow');
    if (!arrow) return;
    arrow.addEventListener('click', function () {
      var next = qs('.stats');
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function init() {
    initStatsCounter();
    initHeroScrollArrow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
