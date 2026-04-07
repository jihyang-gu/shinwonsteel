/**
 * common.js — 신원스틸(주) 홈페이지 공통 JavaScript
 *
 * 포함 기능:
 * 1. GNB 스크롤 동작 (투명 → 흰색 배경 전환)
 * 2. 메가메뉴 (데스크탑 드롭다운)
 * 3. 모바일 햄버거 메뉴 (풀스크린 + 아코디언)
 * 4. 스크롤 fade-up 애니메이션 (IntersectionObserver)
 * 5. 현재 페이지 서브메뉴 활성화
 */

(function () {
  'use strict';

  /* ========================================================================
     상수 정의
     ======================================================================== */

  /** 스크롤 임계값 (px) — 이 값 이상 스크롤 시 GNB 배경 전환 */
  const SCROLL_THRESHOLD = 80;

  /** 유틸리티 바 높이 (px) — 스크롤 시 GNB가 최상단으로 이동 */
  const UTIL_BAR_HEIGHT = 36;

  /** 모바일 브레이크포인트 (px) */
  const MOBILE_BREAKPOINT = 1023;

  /* ========================================================================
     DOM 유틸리티
     ======================================================================== */

  /**
   * querySelector 단축 함수
   * @param {string} selector
   * @param {Element} [context=document]
   * @returns {Element|null}
   */
  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  /**
   * querySelectorAll 단축 함수 (배열 반환)
   * @param {string} selector
   * @param {Element} [context=document]
   * @returns {Element[]}
   */
  function qsa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* ========================================================================
     1. GNB 스크롤 동작
     ======================================================================== */

  /**
   * GNB 스크롤 핸들러 초기화
   * - scrollY > SCROLL_THRESHOLD → gnb에 'scrolled' 클래스 추가
   * - 서브 페이지(.page-header 존재)에서는 항상 scrolled 상태 유지
   * - 유틸리티 바를 스크롤 시 숨김 처리
   */
  function initGnbScroll() {
    const gnb = qs('.gnb');
    const utilBar = qs('.util-bar');

    if (!gnb) return;

    // 서브 페이지 여부 판별 (.page-header 존재 시)
    const isSubPage = !!qs('.page-header');

    /** 현재 스크롤 위치에 따라 클래스 갱신 */
    function updateGnbState() {
      // 서브 페이지는 항상 scrolled 상태(흰색 배경) 유지
      const scrolled = isSubPage ? true : (window.scrollY > SCROLL_THRESHOLD);

      gnb.classList.toggle('scrolled', scrolled);

      // 유틸리티 바: 스크롤 시 숨김 (서브 페이지에서는 스크롤 임계값 기준)
      if (utilBar) {
        utilBar.classList.toggle('hidden', window.scrollY > SCROLL_THRESHOLD);
      }
    }

    // 초기 상태 적용 (새로고침 시 스크롤 위치 반영)
    updateGnbState();

    // passive 리스너로 스크롤 성능 최적화
    window.addEventListener('scroll', updateGnbState, { passive: true });
  }

  /* ========================================================================
     2. 메가메뉴 (데스크탑)
     ======================================================================== */

  /**
   * 메가메뉴 초기화
   * - mouseenter / mouseleave 이벤트로 드롭다운 토글
   * - 모바일에서는 비활성화
   */
  function initMegaMenu() {
    const menuItems = qsa('.gnb__menu-item');

    menuItems.forEach(function (item) {
      const megaMenu = qs('.mega-menu', item);

      if (!megaMenu) return;

      // 데스크탑: hover 이벤트
      item.addEventListener('mouseenter', function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          openMegaMenu(item, megaMenu);
        }
      });

      item.addEventListener('mouseleave', function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          closeMegaMenu(item, megaMenu);
        }
      });

      // 키보드 접근성: 포커스 진입 시 열기
      item.addEventListener('focusin', function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          openMegaMenu(item, megaMenu);
        }
      });

      // 키보드 접근성: 포커스 이탈 시 닫기
      item.addEventListener('focusout', function (e) {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          // 포커스가 메뉴 아이템 외부로 이동할 때만 닫기
          if (!item.contains(e.relatedTarget)) {
            closeMegaMenu(item, megaMenu);
          }
        }
      });
    });

    // 문서 클릭 시 모든 메뉴 닫기
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.gnb__menu-item')) {
        menuItems.forEach(function (item) {
          const megaMenu = qs('.mega-menu', item);
          if (megaMenu) closeMegaMenu(item, megaMenu);
        });
      }
    });
  }

  /**
   * 메가메뉴 열기
   * @param {Element} item - 메뉴 아이템 엘리먼트
   * @param {Element} megaMenu - 메가메뉴 엘리먼트
   */
  function openMegaMenu(item, megaMenu) {
    item.classList.add('menu-open');
    megaMenu.setAttribute('aria-hidden', 'false');
  }

  /**
   * 메가메뉴 닫기
   * @param {Element} item - 메뉴 아이템 엘리먼트
   * @param {Element} megaMenu - 메가메뉴 엘리먼트
   */
  function closeMegaMenu(item, megaMenu) {
    item.classList.remove('menu-open');
    megaMenu.setAttribute('aria-hidden', 'true');
  }

  /* ========================================================================
     3. 모바일 햄버거 메뉴
     ======================================================================== */

  /**
   * 모바일 메뉴 초기화
   * - 햄버거 버튼 클릭 → 풀스크린 메뉴 토글
   * - 바디 스크롤 잠금
   * - 아코디언 서브메뉴
   */
  function initMobileMenu() {
    const hamburger = qs('.gnb__hamburger');
    const mobileMenu = qs('.mobile-menu');

    if (!hamburger || !mobileMenu) return;

    // 햄버거 버튼 클릭
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');

      if (isOpen) {
        closeMobileMenu(hamburger, mobileMenu);
      } else {
        openMobileMenu(hamburger, mobileMenu);
      }
    });

    // 뒤로가기 / ESC 키로 메뉴 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu(hamburger, mobileMenu);
        hamburger.focus();
      }
    });

    // 아코디언 서브메뉴 초기화
    initMobileAccordion(mobileMenu);
  }

  /**
   * 모바일 메뉴 열기
   * @param {Element} hamburger
   * @param {Element} mobileMenu
   */
  function openMobileMenu(hamburger, mobileMenu) {
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', '메뉴 닫기');
    // 바디 스크롤 잠금
    document.body.style.overflow = 'hidden';
  }

  /**
   * 모바일 메뉴 닫기
   * @param {Element} hamburger
   * @param {Element} mobileMenu
   */
  function closeMobileMenu(hamburger, mobileMenu) {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', '메뉴 열기');
    // 바디 스크롤 복원
    document.body.style.overflow = '';
  }

  /**
   * 모바일 아코디언 서브메뉴 초기화
   * @param {Element} mobileMenu
   */
  function initMobileAccordion(mobileMenu) {
    const toggles = qsa('.mobile-menu__toggle', mobileMenu);

    toggles.forEach(function (toggle) {
      const parentItem = toggle.closest('.mobile-menu__item');
      const submenu = qs('.mobile-submenu', parentItem);

      if (!submenu) return;

      // 초기 aria 설정
      const submenuId = 'mobile-submenu-' + Math.random().toString(36).slice(2, 8);
      submenu.id = submenuId;
      toggle.setAttribute('aria-controls', submenuId);
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', function () {
        const isOpen = parentItem.classList.contains('open');

        // 다른 열린 메뉴 닫기 (선택적 — 한 번에 하나만 열리게)
        qsa('.mobile-menu__item.open', mobileMenu).forEach(function (openItem) {
          if (openItem !== parentItem) {
            closeAccordionItem(openItem);
          }
        });

        if (isOpen) {
          closeAccordionItem(parentItem);
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          openAccordionItem(parentItem);
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * 아코디언 아이템 열기
   * @param {Element} item
   */
  function openAccordionItem(item) {
    item.classList.add('open');
    const toggle = qs('.mobile-menu__toggle', item);
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  /**
   * 아코디언 아이템 닫기
   * @param {Element} item
   */
  function closeAccordionItem(item) {
    item.classList.remove('open');
    const toggle = qs('.mobile-menu__toggle', item);
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  /* ========================================================================
     4. 스크롤 fade-up 애니메이션
     ======================================================================== */

  /**
   * IntersectionObserver를 사용한 fade-up 애니메이션 초기화
   * - .fade-up 요소가 뷰포트에 진입하면 .visible 클래스 추가
   * - threshold: 0.1 (10% 이상 보일 때 트리거)
   */
  function initScrollAnimation() {
    // IntersectionObserver 미지원 브라우저 폴백
    if (!('IntersectionObserver' in window)) {
      qsa('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 한 번 표시된 후에는 관찰 해제 (성능 최적화)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    // 페이지 내 모든 .fade-up 요소 관찰 시작
    qsa('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ========================================================================
     5. 현재 페이지 서브메뉴 활성화
     ======================================================================== */

  /**
   * URL 기반으로 현재 페이지에 해당하는 메뉴 링크에 active 클래스 추가
   * - GNB 메가메뉴 링크
   * - 모바일 서브메뉴 링크
   * - 서브 네비게이션 링크
   */
  function initActiveMenu() {
    const currentPath = window.location.pathname;

    // GNB 메가메뉴 링크 활성화
    activateLinks('.mega-menu__link', currentPath);

    // 모바일 서브메뉴 링크 활성화
    activateLinks('.mobile-submenu__link', currentPath);

    // 서브 네비게이션 링크 활성화
    activateLinks('.sub-nav__link', currentPath);

    // GNB 1단계 메뉴 활성화 (현재 경로가 포함된 섹션 강조)
    activateGnbParent(currentPath);
  }

  /**
   * 지정 셀렉터 링크 중 현재 경로와 일치하는 링크에 active 클래스 추가
   * @param {string} selector
   * @param {string} currentPath
   */
  function activateLinks(selector, currentPath) {
    qsa(selector).forEach(function (link) {
      const href = link.getAttribute('href');

      if (!href) return;

      // 외부 링크는 활성화 제외
      if (href.startsWith('http')) return;

      // 경로 정규화 후 비교
      const linkPath = new URL(href, window.location.origin).pathname;

      if (linkPath === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * GNB 1단계 메뉴 아이템 활성화
   * 현재 경로의 첫 번째 세그먼트로 상위 메뉴 그룹 판별
   * @param {string} currentPath
   */
  function activateGnbParent(currentPath) {
    const menuItems = qsa('.gnb__menu-item');

    menuItems.forEach(function (item) {
      const subLinks = qsa('.mega-menu__link', item);
      const hasActiveChild = subLinks.some(function (link) {
        return link.classList.contains('active');
      });

      if (hasActiveChild) {
        item.classList.add('active');
      }
    });
  }

  /* ========================================================================
     6. 창 크기 변경 대응
     ======================================================================== */

  /**
   * 데스크탑으로 전환 시 모바일 메뉴 초기화
   */
  function initResizeHandler() {
    let resizeTimer;

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
          const hamburger = qs('.gnb__hamburger');
          const mobileMenu = qs('.mobile-menu');

          if (mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu(hamburger, mobileMenu);
          }
        }
      }, 150);
    });
  }

  /* ========================================================================
     초기화 진입점
     ======================================================================== */

  /**
   * DOM 준비 완료 후 모든 기능 초기화
   */
  function init() {
    initGnbScroll();      // GNB 스크롤 동작
    initMegaMenu();       // 메가메뉴 (데스크탑)
    initMobileMenu();     // 모바일 햄버거 메뉴
    initScrollAnimation(); // fade-up 애니메이션
    initActiveMenu();     // 현재 페이지 메뉴 활성화
    initResizeHandler();  // 창 크기 변경 대응
  }

  // DOM 로드 완료 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // 이미 로드된 경우 즉시 실행
    init();
  }
})();
