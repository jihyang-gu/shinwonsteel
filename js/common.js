/**
 * common.js — 신원스틸(주) 홈페이지 공통 JavaScript
 */
(function () {
  'use strict';

  const SCROLL_THRESHOLD = 80;
  const MOBILE_BREAKPOINT = 1023;

  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }
  function qsa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* GNB 스크롤 */
  function initGnbScroll() {
    const gnb = qs('.gnb');
    if (!gnb) return;
    const isSubPage = !!qs('.page-header');
    function update() {
      const scrolled = isSubPage ? true : (window.scrollY > SCROLL_THRESHOLD);
      gnb.classList.toggle('scrolled', scrolled);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* 메가메뉴 */
  function initMegaMenu() {
    const items = qsa('.gnb__menu-item');
    items.forEach(function (item) {
      const mega = qs('.mega-menu', item);
      if (!mega) return;
      item.addEventListener('mouseenter', function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          item.classList.add('menu-open');
          mega.setAttribute('aria-hidden', 'false');
        }
      });
      item.addEventListener('mouseleave', function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          item.classList.remove('menu-open');
          mega.setAttribute('aria-hidden', 'true');
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.gnb__menu-item')) {
        items.forEach(function (item) {
          item.classList.remove('menu-open');
          const mega = qs('.mega-menu', item);
          if (mega) mega.setAttribute('aria-hidden', 'true');
        });
      }
    });
  }

  /* 모바일 메뉴 */
  function initMobileMenu() {
    const hamburger = qs('.gnb__hamburger');
    const mobileMenu = qs('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      const gnb = qs('.gnb');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (gnb) gnb.classList.remove('menu-open');
      } else {
        mobileMenu.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (gnb) gnb.classList.add('menu-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    /* 아코디언 */
    qsa('.mobile-menu__toggle', mobileMenu).forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        const item = toggle.closest('.mobile-menu__item');
        const isOpen = item.classList.contains('open');
        qsa('.mobile-menu__item.open', mobileMenu).forEach(function (el) {
          el.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* fade-up: 즉시 표시 (GitHub Pages 환경 대응) */
  function initScrollAnimation() {
    qsa('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* -----------------------------------------------------------------------
   * 현재 페이지 메뉴 자동 활성화
   * 전체 pathname 대신 파일명(마지막 세그먼트)만 비교해서
   * 상대경로 href="about.html"도 /shinwonsteel/company/about.html에 매칭됨
   * --------------------------------------------------------------------- */
  function initActiveMenu() {
    // 현재 페이지 파일명 추출 (예: "about.html")
    const currentFile = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';

    // sub-nav 링크 활성화
    qsa('.sub-nav__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      // href에서 파일명만 추출 (예: "../company/about.html" → "about.html")
      const linkFile = href.split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        // 혹시 이전에 하드코딩된 active가 있으면 제거
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // GNB 메가메뉴 링크 활성화
    qsa('.mega-menu__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('active');
      }
    });

    // 모바일 서브메뉴 링크 활성화
    qsa('.mobile-submenu__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === currentFile) {
        link.classList.add('active');
        // 해당 아코디언 자동 오픈
        const item = link.closest('.mobile-menu__item');
        if (item) item.classList.add('open');
      }
    });

    // GNB 상위 메뉴 아이템 활성화 (메가메뉴 안에 active 링크가 있으면)
    qsa('.gnb__menu-item').forEach(function (item) {
      const hasActive = qsa('.mega-menu__link.active', item).length > 0;
      if (hasActive) item.classList.add('active');
    });
  }

  /* 창 크기 변경 대응 */
  function initResizeHandler() {
    let timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          const hamburger = qs('.gnb__hamburger');
          const mobileMenu = qs('.mobile-menu');
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        }
      }, 150);
    });
  }

  function init() {
    initGnbScroll();
    initMegaMenu();
    initMobileMenu();
    initScrollAnimation();
    initActiveMenu();
    initResizeHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
