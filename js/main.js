/**
 * main.js — 신원스틸(주) 메인 페이지 전용 JavaScript
 *
 * 포함 기능:
 * 1. 수치(stats) 섹션 숫자 카운팅 애니메이션
 * 2. 히어로 스크롤 화살표 클릭 시 부드럽게 다음 섹션으로 이동
 */

(function () {
  'use strict';

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
     1. 숫자 카운팅 애니메이션
     ======================================================================== */

  /**
   * easeOutCubic 이징 함수
   * @param {number} t - 0~1 범위의 진행값
   * @returns {number}
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * 단일 숫자 요소에 카운팅 애니메이션 적용
   * @param {Element} el - 카운팅 대상 strong 엘리먼트
   * @param {number} target - 목표 숫자
   * @param {number} duration - 애니메이션 지속 시간 (ms)
   * @param {string} suffix - 숫자 뒤 단위 텍스트 (예: '+', '건')
   */
  function animateCount(el, target, duration, suffix) {
    var startTime = null;
    var startValue = 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = Math.round(startValue + (target - startValue) * easedProgress);

      /* 단위 span 태그를 유지하면서 숫자만 업데이트 */
      if (suffix) {
        el.innerHTML = current + '<span>' + suffix + '</span>';
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * stats 섹션 카운팅 애니메이션 초기화
   * IntersectionObserver로 섹션 진입 시 1회 실행
   */
  function initStatsCounter() {
    var statsSection = qs('.stats');
    if (!statsSection) return;

    /* 카운팅 대상 정의 — HTML의 strong 요소별 목표값 */
    var counters = [
      { selector: '.stats__item:nth-child(1) strong', target: 35, suffix: '+', duration: 1800 },
      { selector: '.stats__item:nth-child(2) strong', target: 3,  suffix: '',  duration: 1200 },
      { selector: '.stats__item:nth-child(4) strong', target: 2,  suffix: '건', duration: 1200 },
    ];

    /* ISO 9001 항목은 숫자가 아니므로 카운팅 제외 (3번 항목) */

    var animated = false;

    /* IntersectionObserver 미지원 폴백 */
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (item) {
        var el = qs(item.selector);
        if (el) animateCount(el, item.target, item.duration, item.suffix);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            observer.disconnect();

            /* 각 카운터 애니메이션 시작 */
            counters.forEach(function (item) {
              var el = qs(item.selector);
              if (el) animateCount(el, item.target, item.duration, item.suffix);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);
  }

  /* ========================================================================
     2. 히어로 스크롤 화살표
     ======================================================================== */

  /**
   * 히어로 스크롤 화살표 클릭 시 다음 섹션(stats)으로 부드럽게 스크롤
   */
  function initHeroScrollArrow() {
    var arrow = qs('.hero__scroll-arrow');
    if (!arrow) return;

    arrow.addEventListener('click', function () {
      var nextSection = qs('.stats');
      if (!nextSection) return;

      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ========================================================================
     초기화 진입점
     ======================================================================== */

  /**
   * DOM 준비 완료 후 메인 페이지 기능 초기화
   */
  function init() {
    initStatsCounter();     /* 숫자 카운팅 애니메이션 */
    initHeroScrollArrow();  /* 히어로 스크롤 화살표 */
  }

  /* DOM 로드 완료 시 실행 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    /* 이미 로드된 경우 즉시 실행 */
    init();
  }
})();
