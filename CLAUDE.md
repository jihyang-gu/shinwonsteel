# 신원스틸(주) 홈페이지 리뉴얼

## 프로젝트 개요
후판 모형 절단 전문 기업 신원스틸(주)의 홈페이지 전면 리뉴얼

## 기술 스택
HTML5 + CSS3 + Vanilla JS (프레임워크 없음)
폰트: Pretendard (CDN)

## 디자인 방향
- 레이아웃: SK하이닉스(skhynix.com) 참조
- 디자인: 토스(toss.im) 스타일 — 화이트 베이스, 깔끔하고 모던
- Primary Color: #1B64DA
- 폰트 컬러: #191F28 (제목) / #6B7684 (보조)
- BG: #FFFFFF / #F2F4F6 (섹션 구분)

## 색상 팔레트
- Primary Blue  : #1B64DA
- Dark Text     : #191F28
- Gray Text     : #6B7684
- Light Gray BG : #F2F4F6
- Border        : #E5E8EB
- White         : #FFFFFF

## 타이포그래피
- H1: 52px / weight 700 / line-height 1.2
- H2: 36px / weight 700 / line-height 1.3
- 섹션타이틀: 28px / weight 600
- 본문: 16px / weight 400 / line-height 1.7
- 소제목: 13px / weight 500 / letter-spacing 2px / 대문자 / color: #1B64DA

## 파일 구조
```
shinwonsteel/
├── index.html
├── company/
│   ├── about.html
│   ├── ideology.html
│   ├── history.html
│   ├── grades.html
│   └── facility.html
├── job/
│   ├── guide.html
│   └── system.html
├── contact/
│   ├── quote.html
│   ├── cheonan.html
│   └── busan.html
├── css/
│   ├── reset.css
│   ├── common.css
│   └── pages/
│       ├── main.css
│       └── sub.css
└── js/
    ├── common.js
    └── main.js
```

## 개발 지침
- 실제 이미지 없으면 회색 placeholder (#E5E8EB 배경)로 처리
- 모든 페이지 모바일 반응형 (Mobile: ~767px / Tablet: 768~1023px / Desktop: 1024px~)
- 스크롤 fade-up 애니메이션: IntersectionObserver 사용
- 섹션 상하 padding: 100px 이상
- 주석은 한국어로

## 진행 상태
- [ ] 공통 CSS / JS
- [ ] index.html 메인
- [ ] company/ 5개 페이지
- [ ] job/ 2개 페이지
- [ ] contact/ 3개 페이지
- [ ] 반응형 점검
- [ ] 브라우저 크로스체크
