# 토스 카페

토스 카페는 Next.js로 개발된 모바일 최적화 카페 주문 웹 애플리케이션입니다. 사용자는 음료와 디저트를 탐색하고, 장바구니에 담고, 토스페이먼츠를 통해 결제할 수 있습니다.

## 주요 기능

- **홈**: 카페 소개 및 주요 메뉴 표시
- **메뉴**: 카테고리별로 필터링 가능한 카페 메뉴 목록
- **장바구니**: 선택한 상품 관리 및 결제 기능
- **PWA 지원**: 모바일에서 앱처럼 설치하고 사용 가능

## 기술 스택

- **프론트엔드**: Next.js, TypeScript, React
- **스타일링**: CSS
- **결제**: 토스페이먼츠 API
- **상태 관리**: React Hooks, LocalStorage

## 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/toss-cafe.git
cd toss-cafe

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버는 기본적으로 http://localhost:3000 에서 실행됩니다.

## 모바일 최적화

이 애플리케이션은 모바일 환경에 최적화되어 있습니다:

- 반응형 디자인 (320px ~ 430px)
- 고정된 헤더와 탭 바
- 터치 친화적인 UI 컴포넌트
- PWA(Progressive Web App) 지원

## 프로젝트 구조

```
src/
├── app/                  # Next.js 앱 라우터
│   ├── cart/            # 장바구니 페이지
│   ├── menu/            # 메뉴 페이지
│   ├── payment/         # 결제 관련 페이지
│   └── globals.css      # 전역 스타일
├── components/           # 재사용 가능한 컴포넌트
└── public/               # 정적 파일 (이미지, 아이콘 등)
```

## 배포

Next.js 애플리케이션을 배포하는 여러 방법이 있습니다:

1. Vercel (권장)
2. Netlify
3. AWS Amplify
4. Docker 컨테이너로 자체 서버에 배포

## 라이센스

MIT
