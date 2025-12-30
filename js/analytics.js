/**
 * 나이스 피크닉 통합 분석 및 외부 SDK 관리 스크립트
 */

// --- 1. GA4 초기화 ---
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CBHR5FWN6Q'); // GA4 측정 ID

// --- 2. 카카오 SDK 초기화 (HTML에서 삭제한 로직을 여기로 이동) ---
function initKakao() {
  // Kakao 객체가 존재하는지 먼저 확인하는 로직 강화
  if (typeof Kakao === 'undefined') {
    console.warn("Kakao SDK가 아직 로드되지 않았습니다. 0.5초 후 재시도합니다.");
    setTimeout(initKakao, 500);
    return;
  }
  
  try {
    if (!Kakao.isInitialized()) {
      Kakao.init('81d8707b9a0ada5ee49bed63af66b86d');
    }
  } catch (e) {
    console.error("Kakao SDK 초기화 실패:", e);
  }
}

// SDK가 로드된 후 실행되도록 약간의 지연 또는 체크 수행
window.addEventListener('load', initKakao);

/**
 * [공통] GA4 이벤트 전송 함수
 */
function logEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

/**
 * [공통] 카톡 상담 열기 + GA4 추적
 * HTML 내부의 openChat()을 이 함수가 대체합니다.
 */
function openChat() {
  // GA4 이벤트 기록
  logEvent('click_contact', {
    'method': 'kakao',
    'page_title': document.title
  });

  // 카카오 채널 연결
  if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
    Kakao.Channel.chat({
      channelPublicId: '_Vimxln' 
    });
  } else {
    // SDK가 미처 로드되지 않았을 경우 재시도
    initKakao();
    alert('상담창을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
  }
}

/**
 * [공통] 전화 걸기 추적
 */
function trackCall(location) {
  logEvent('click_contact', {
    'method': 'phone',
    'location': location
  });
}

/**
 * [공통] 예약 버튼 클릭 추적 (전환 포인트)
 */
function trackReservation(type) {
  logEvent('conversion_click_reserve', {
    'service_type': type,
    'page': window.location.pathname
  });
}