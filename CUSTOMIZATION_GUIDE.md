# 광저우 웨딩 일정 플래너 - 커스터마이제이션 가이드

이 문서는 관리자가 추천 일정, 장소, 이미지를 변경하는 방법을 설명합니다.

---

## 📋 목차
1. [추천 일정(템플릿) 변경](#1-추천-일정템플릿-변경)
2. [장소별 이미지 변경](#2-장소별-이미지-변경)  
3. [추천 일정에 새로운 장소 추가](#3-추천-일정에-새로운-장소-추가)
4. [파일 구조 개요](#파일-구조-개요)

---

## 1. 추천 일정(템플릿) 변경

### 📍 수정 파일
- **주 파일**: `js/modules/planner.js`
- **관련 설정**: `data/scheduleRules.json` (선택사항)

### 🔧 방법

#### Step 1. 템플릿 위치 찾기
`js/modules/planner.js` 파일에서 `buildManagedSchedule()` 함수를 찾으세요 (약 157번째 줄).

```javascript
function buildManagedSchedule(context) {
  const templates = [
    // DAY 1 (도착일)
    [ /* 아이템들 */ ],
    // DAY 2 (결혼식)
    [ /* 아이템들 */ ],
    // DAY 3 (관광)
    [ /* 아이템들 */ ],
    // DAY 4 (귀국일)
    [ /* 아이템들 */ ]
  ];
  // ...
}
```

#### Step 2. 각 DAY의 구성 이해하기

**DAY 템플릿의 구조:**
```javascript
[
  // 교통편 (선택사항)
  createManagedTransportItem({
    start: 14 * 60,        // 시작 시간 (분 단위)
    end: 15 * 60,          // 종료 시간 (분 단위)
    title: "광저우 도착",
    detail: "공항 도착 후 호텔로 이동합니다.",
    tag: "도착",
    from: "공항",
    to: "호텔"
  }),
  
  // 관광지/음식점
  createManagedSourceItem("placeName", "place", 15 * 60 + 30),
  // place: 관광지, restaurant: 음식점
  // 마지막 숫자: 시작 시간 (분 단위)
]
```

#### Step 3. 시간 형식 (24시간제)
- `14 * 60` = 14:00 (2:00 PM)
- `15 * 60 + 30` = 15:30 (3:30 PM)
- `18 * 60` = 18:00 (6:00 PM)
- `21 * 60 + 30` = 21:30 (9:30 PM)

#### Step 4. 예제: DAY 1 변경하기

**현재 DAY 1:**
```javascript
[
  createManagedTransportItem({ /* 도착 */ }),
  createManagedSourceItem("chenClan", "place", 15 * 60 + 30),
  createManagedSourceItem("dimsumLiwan", "restaurant", 17 * 60 + 30),
  createManagedSourceItem("shamian", "place", 19 * 60 + 30)
]
```

**변경하기:**
```javascript
[
  createManagedTransportItem({ /* 도착 */ }),
  createManagedSourceItem("k11", "place", 16 * 60),        // 새로운 장소
  createManagedSourceItem("beijingRoadFood", "restaurant", 18 * 60),  // 새로운 음식점
  // 마지막 항목 제거 또는 변경 가능
]
```

### ⏰ 현재 기본 템플릿 구성

| DAY | 시간대 | 포함 항목 | 특징 |
|-----|--------|---------|------|
| DAY 1 | 도착~밤 | 도착 교통, 3개 장소/음식점 | 도착일 |
| DAY 2 | 오후 | 결혼식, 저녁 식당 | 결혼식 당일 (고정) |
| DAY 3 | 오전~저녁 | 3개 관광지 | 관광일 |
| DAY 4 | 저녁~야간 | 저녁 활동, 귀국 교통 | 귀국일 |

---

## 2. 장소별 이미지 변경

### 📍 이미지 관련 파일들
- **이미지 저장소**: 
  - `images/thumb/` - 썸네일 (160x160px)
  - `images/full/` - 상세보기용 (1000px 이상)
  - `images/places/` - 지역/카테고리별 분류
  
- **이미지 메타데이터**: `data/imageManifest.json`

### 🔧 방법

#### Step 1. 새 이미지 준비
1. **thumbnail** (160x160px): `images/thumb/placeName.jpg`
2. **full image** (1000px 이상): `images/full/placeName_1.jpg`, `placeName_2.jpg` 등

✅ **파일명 규칙:** `placeName.jpg` 형식 (장소 ID와 동일)

#### Step 2. imageManifest.json 업데이트

`data/imageManifest.json`을 열고 해당 장소를 찾으세요:

```json
{
  "items": {
    "chenClan": {
      "id": "chenClan",
      "thumbnail": "images/thumb/chenClan.jpg",
      "fullImages": [
        "images/full/chenClan_1.jpg",
        "images/full/chenClan_2.jpg",
        "images/full/chenClan_3.jpg"
      ]
    },
    // ... 다른 장소들
  }
}
```

**변경 예시:**
```json
{
  "id": "chenClan",
  "thumbnail": "images/thumb/chenClan_new.jpg",  // 새 이미지 경로
  "fullImages": [
    "images/full/chenClan_new_1.jpg",
    "images/full/chenClan_new_2.jpg"
  ]
}
```

#### Step 3. 장소 정보 페이지 업데이트 (선택사항)

`data/places.json`에서 해당 장소를 찾아 설명을 업데이트할 수 있습니다:

```json
{
  "id": "chenClan",
  "name": "진해루 (陳家祠)",
  "chineseName": "陳家祠",
  "note": "변경된 설명 텍스트..."  // 여기서 변경
}
```

---

## 3. 추천 일정에 새로운 장소 추가

### 📍 단계별 진행 과정

#### Step 1. 장소 정보 등록 (`data/places.json`)

`data/places.json` 파일을 열고 새로운 장소를 추가하세요:

```json
{
  "items": {
    // ... 기존 장소들 ...
    
    "myNewPlace": {
      "id": "myNewPlace",
      "name": "새로운 장소",
      "chineseName": "新地点",
      "addressZh": "广东省广州市...",
      "category": "관광지",
      "district": "liwan",  // 지역 코드
      "duration": 120,      // 권장 체류 시간 (분)
      "openTime": "09:00",  // 오픈 시간
      "closeTime": "18:00", // 마감 시간
      "recommendedTime": ["afternoon", "evening"],  // 추천 방문 시간
      "priority": 8,        // 우선순위 (1-10)
      "tags": ["관광", "산책"],
      "hours": "09:00~18:00",
      "price": "무료",
      "bestTime": "오후",
      "tips": "편한 신발을 권장합니다.",
      "note": "새로운 장소의 설명입니다."
    }
  }
}
```

**필수 필드:**
- `id`: 영문 ID (자동으로 코드에서 참조됨)
- `name`: 한글명
- `chineseName`: 중국어명
- `category`: 장소 카테고리
- `duration`: 권장 체류 시간
- `district`: 지역 코드

**지역 코드 옵션:**
- `liwan` - 리완
- `yuexiu` - 월수
- `zhujiang` - 주강신청
- `baiyun` - 백운
- `panyu` - 번우

#### Step 2. 음식점 추가하는 경우 (`data/restaurants.json`)

비슷하게 `data/restaurants.json`에도 추가:

```json
{
  "items": {
    "myNewRestaurant": {
      "id": "myNewRestaurant",
      "name": "새로운 맛집",
      "chineseName": "新餐厅",
      "addressZh": "...",
      "category": "중식",
      "district": "liwan",
      "duration": 90,
      "openTime": "11:00",
      "closeTime": "21:00",
      "recommendedTime": ["lunch", "dinner"],
      "priority": 8,
      "tags": ["음식", "식사"],
      "hours": "11:00~21:00",
      "price": "1인 약 150위안",
      "bestTime": "점심, 저녁",
      "tips": "주말 예약 권장",
      "note": "신선한 재료로 만든...",
      "mealTypes": ["lunch", "dinner"],
      "reservation": "휴무일 확인 후 예약",
      "averageCostCny": 150
    }
  }
}
```

#### Step 3. 이미지 준비

위의 **"2. 장소별 이미지 변경"** 섹션을 참고하여:
- 이미지 파일 저장 (`images/thumb/`, `images/full/`)
- `data/imageManifest.json` 업데이트

#### Step 4. 추천 일정 템플릿에 추가

`js/modules/planner.js`의 `buildManagedSchedule()` 함수에서 해당 DAY에 추가:

```javascript
function buildManagedSchedule(context) {
  const templates = [
    [
      // DAY 1 기존 항목들...
      createManagedSourceItem("myNewPlace", "place", 16 * 60)  // ← 새 장소 추가
    ],
    // ...
  ];
}
```

#### Step 5. 캐시 버전 업데이트

`index.html`에서 `planner.js` 스크립트 태그의 버전을 증가시키세요:

```html
<!-- 변경 전 -->
<script src="js/modules/planner.js?v=45"></script>

<!-- 변경 후 -->
<script src="js/modules/planner.js?v=46"></script>
```

---

## 파일 구조 개요

```
Wedding_Schedule/
├── data/
│   ├── places.json              ← 모든 관광지 정보
│   ├── restaurants.json         ← 모든 음식점 정보
│   ├── imageManifest.json       ← 이미지 경로 매핑
│   └── scheduleRules.json       ← 일정 유효성 규칙
│
├── images/
│   ├── thumb/                   ← 썸네일 이미지 (160x160)
│   ├── full/                    ← 상세보기 이미지 (1000px+)
│   └── places/                  ← 지역별 분류
│
├── js/modules/
│   ├── planner.js              ← 📌 추천 일정 템플릿 정의
│   ├── data.js                 ← 데이터 로드
│   ├── detail.js               ← 상세보기 모달
│   └── travel.js               ← travel 탭 UI
│
└── index.html                   ← 캐시 버전 업데이트
```

---

## 💡 팁 및 주의사항

### ✅ 추천 사항
1. **백업 먼저**: 파일 수정 전 항상 백업하세요
2. **테스트**: 수정 후 브라우저에서 실제로 잘 보이는지 확인
3. **일정 체크**: DAY별로 총 시간이 과도하지 않은지 확인 (하루 ~8시간 추천)
4. **이미지 최적화**: full 이미지는 최소 1000px 너비, 파일 크기는 300KB 이하로 유지

### ⚠️ 주의사항
- JSON 파일 수정 시 **쉼표(,)와 괄호**를 정확히 입력하세요
- `id` 값은 **영문 소문자**로 통일하세요 (예: `myPlace`, `my_place`)
- 시간 형식은 **24시간제**를 사용하세요 (13:00 형식)
- 캐시 버전을 업데이트하지 않으면 브라우저가 이전 버전을 캐시할 수 있습니다

### 🔍 장소 ID 확인
현재 일정에 포함된 장소:
- **DAY 1**: chenClan, dimsumLiwan, shamian
- **DAY 2**: weddingHotel, cantoneseZhujiang
- **DAY 3**: k11, haixinBridge, beijingRoadFood
- **DAY 4**: partyPier

다른 사용 가능한 장소는 `data/places.json`에서 확인할 수 있습니다.

---

## 📞 문제 해결

### Q. 변경 후 여전히 이전 내용이 보여요
**A.** 브라우저 캐시를 삭제하거나:
1. `index.html`에서 `planner.js?v=45`의 숫자를 변경 (45 → 46)
2. 브라우저 새로고침 (Ctrl+Shift+Delete → 캐시 삭제)

### Q. 이미지가 로드되지 않습니다
**A.** 다음을 확인하세요:
1. 파일이 올바른 폴더에 있는지 (`images/thumb/`, `images/full/`)
2. `imageManifest.json`의 경로가 정확한지
3. 파일명이 정확하고 확장자(.jpg, .png 등)가 일치하는지

### Q. JSON 파일에 오류가 있습니다
**A.** 온라인 JSON 검증 도구 사용:
- https://jsonlint.com/
- 또는 VS Code의 JSON 검증 기능 활용

---

마지막으로 수정 후 **Git 커밋** 권장:
```bash
git add -A
git commit -m "Update schedule templates and images"
git push origin main
```
