# 광저우 웨딩 여행 일정 - 설정 가이드

이 문서는 광저우 웨딩 여행 플래너의 추천 일정과 여행지 정보를 설정하는 방법을 안내합니다.

## 📋 목차

1. [시스템 구조](#시스템-구조)
2. [추천 일정 설정](#추천-일정-설정)
3. [여행지/맛집 추가 및 수정](#여행지맛집-추가-및-수정)
4. [주요 파일 설명](#주요-파일-설명)
5. [예제](#예제)

---

## 🏗️ 시스템 구조

### 데이터 계층 (Data Layer)

```
data/
├── places.json              # 모든 여행지 정보 (JSON)
├── restaurants.json         # 모든 맛집 정보 (JSON)
├── recommendedScheduleConfig.js  # 4개 추천일정 설정 (JavaScript)
├── scheduleRules.json       # 일정 규칙 (JSON)
└── imageManifest.json       # 이미지 메타데이터 (JSON)
```

### 로직 계층 (Logic Layer)

```
js/modules/
├── planner.js       # 일정 생성 로직 (buildManagedSchedule)
├── data.js          # 데이터 로드
├── travel.js        # 여행지 라이브러리 표시
└── storage.js       # 일정 저장/복원
```

---

## 📅 추천 일정 설정

### 위치: `data/recommendedScheduleConfig.js`

### 구조 이해하기

```javascript
const RECOMMENDED_SCHEDULE_CONFIG = {
  // 추천일정 #1: 도착일
  day1: {
    label: "추천일정 #1",
    date: "2026-11-13",
    title: "광저우 도착",
    description: "공항 도착 후 리완 지역 탐방",
    items: [
      // 여기에 일정 항목 추가
    ]
  },
  
  // 추천일정 #2: 결혼식 당일
  day2: { ... },
  
  // 추천일정 #3
  day3: { ... },
  
  // 추천일정 #4: 출국일
  day4: { ... }
};
```

### 항목(Item) 추가하기

#### 1️⃣ 여행지 추가

```javascript
{
  type: "place",           // 타입: "place"
  id: "shamian",           // places.json의 ID
  time: "15:30"            // 방문 시간 (24시간 형식)
}
```

**예시:** 샤미엔을 오후 3시 30분에 방문

```javascript
day1: {
  items: [
    { type: "place", id: "shamian", time: "15:30" },
    // 이 항목은 places.json의 shamian 항목 정보를 자동으로 사용합니다.
    // - 이름: 샤미엔
    // - 설명: 유럽풍 건축과 가로수가 이어지는 광저우 대표 산책 지역입니다.
    // - 카테고리: 산책
    // - 확인 시간: places.json에 정의된 duration 메뉴(기본 120분)
  ]
}
```

#### 2️⃣ 맛집 추가

```javascript
{
  type: "restaurant",      // 타입: "restaurant"
  id: "dimsumLiwan",       // restaurants.json의 ID
  time: "17:30"            // 방문 시간 (24시간 형식)
}
```

**예시:** 리완 딤섬을 오후 5시 30분에 방문

```javascript
day1: {
  items: [
    { type: "restaurant", id: "dimsumLiwan", time: "17:30" }
    // restaurants.json의 dimsumLiwan 항목을 사용합니다.
  ]
}
```

#### 3️⃣ 결혼식 추가 (day2에만 사용)

```javascript
{
  type: "wedding",
  time: "15:30",           // 결혼식 시작 시간
  duration: 180,           // 소요 시간 (분): 180분 = 3시간
  title: "W Guangzhou 결혼식",
  detail: "결혼식이 진행되는 시간입니다.",
  tag: "Wedding"
}
```

**참고:** `duration`을 수정하면 일정 시간을 조정할 수 있습니다.

#### 4️⃣ 이동(Transport) 추가

```javascript
{
  type: "transport",
  time: "14:00",           // 출발 시간
  duration: 60,            // 소요 시간 (분)
  title: "광저우 도착",
  detail: "공항 도착 후 호텔로 이동합니다.",
  tag: "도착",
  from: "공항",            // 출발지
  to: "호텔"               // 목적지
}
```

---

## 🗺️ 여행지/맛집 추가 및 수정

### 위치: `data/places.json`, `data/restaurants.json`

### 새로운 여행지 추가 방법

#### Step 1: places.json에 항목 추가

```json
{
  "items": {
    "newPlaceId": {
      "id": "newPlaceId",
      "name": "새로운 장소",
      "chineseName": "新景点",
      "addressZh": "地址",
      "category": "카테고리",
      "district": "liwan",  // liwan, yuexiu, zhujiang, panyu 중 선택
      "duration": 120,      // 관광 소요 시간 (분)
      "latitude": 23.1234,
      "longitude": 113.4567,
      "openTime": "09:00",
      "closeTime": "18:00",
      "hours": "09:00 - 18:00",
      "price": "입장료",
      "bestTime": "방문 추천 시간",
      "tips": "유용한 팁",
      "note": "설명",
      "images": [
        "images/places/newPlaceId-1.svg",
        "images/places/newPlaceId-2.svg"
      ]
    }
    // ... 기존 항목들
  }
}
```

### 새로운 맛집 추가 방법

#### Step 1: restaurants.json에 항목 추가

```json
{
  "items": {
    "newRestaurantId": {
      "id": "newRestaurantId",
      "name": "새로운 식당",
      "chineseName": "新餐厅",
      "addressZh": "地址",
      "category": "음식 카테고리",
      "district": "yuexiu",
      "duration": 90,       // 식사 소요 시간 (분)
      "mealTypes": ["lunch", "dinner"],  // "breakfast", "lunch", "dinner"
      "openTime": "11:00",
      "closeTime": "21:30",
      "hours": "11:00 - 21:30",
      "price": "1인 예산",
      "bestTime": "방문 추천 시간",
      "tips": "유용한 팁",
      "note": "설명",
      "images": [
        "images/places/newRestaurantId-1.svg",
        "images/places/newRestaurantId-2.svg"
      ]
    }
    // ... 기존 항목들
  }
}
```

#### Step 2: recommendedScheduleConfig.js에서 참조

새로 추가한 여행지/맛집의 ID를 사용하여 추천일정에 추가합니다.

```javascript
day1: {
  items: [
    { type: "place", id: "newPlaceId", time: "10:30" },
    { type: "restaurant", id: "newRestaurantId", time: "12:00" }
  ]
}
```

---

## 📁 주요 파일 설명

### 1. `data/recommendedScheduleConfig.js`

**역할:** 4개의 추천 일정을 정의하고, 각 일정의 항목들을 places.json, restaurants.json의 ID로 참조

**수정 빈도:** 자주 (일정 변경 시)

**주요 변수:**
- `RECOMMENDED_SCHEDULE_CONFIG`: 4개 일정 정의
- `TRAVEL_LIBRARY_CONFIG`: 여행지/맛집 분류 및 우선순위

**예시 수정:**
```javascript
// 원래
day1: {
  items: [
    { type: "place", id: "shamian", time: "15:30" }
  ]
}

// 변경 (시간 조정)
day1: {
  items: [
    { type: "place", id: "shamian", time: "14:00" }  // 15:30 → 14:00
  ]
}

// 변경 (장소 변경)
day1: {
  items: [
    { type: "place", id: "yongqingfang", time: "15:30" }  // shamian → yongqingfang
  ]
}
```

### 2. `data/places.json`

**역할:** 모든 여행지의 상세 정보 (이름, 설명, 사진, 위치, 운영시간 등)

**수정 빈도:** 필요할 때 (새 여행지 추가, 정보 수정)

**필수 필드:**
- `id`: 유니크한 식별자
- `name`: 한글 이름
- `chineseName`: 중국어 이름
- `category`: 카테고리
- `district`: 지역 (liwan, yuexiu, zhujiang, panyu)
- `duration`: 소요 시간 (분)
- `images`: 사진 경로 배열

### 3. `data/restaurants.json`

**역할:** 모든 맛집의 상세 정보

**수정 빈도:** 필요할 때 (새 맛집 추가, 정보 수정)

**필수 필드:**
- `id`: 유니크한 식별자
- `name`: 한글 이름
- `chineseName`: 중국어 이름
- `category`: 음식 카테고리
- `district`: 지역
- `duration`: 소요 시간 (분)
- `mealTypes`: 제공 식사 타입 배열 (breakfast, lunch, dinner)
- `images`: 사진 경로 배열

---

## 🎯 예제

### 예제 1: 일정에 새로운 여행지 추가

**목표:** 추천일정 #1에 "영경방"을 오후 4시에 추가

#### Step 1: places.json에서 영경방의 ID 확인
```json
"yongqingfang": {
  "id": "yongqingfang",
  "name": "영경방",
  ...
}
```

#### Step 2: recommendedScheduleConfig.js의 day1에 추가
```javascript
day1: {
  label: "추천일정 #1",
  items: [
    { type: "transport", time: "14:00", duration: 60, /* ... */ },
    { type: "place", id: "shamian", time: "15:30" },
    { type: "restaurant", id: "dimsumLiwan", time: "17:30" },
    { type: "place", id: "yongqingfang", time: "16:00" }  // 새로 추가!
  ]
}
```

#### Step 3: 페이지 새로고침하여 확인

---

### 예제 2: 결혼식 시간 변경

**목표:** 결혼식 시간을 15:30~18:30에서 16:00~19:00으로 변경

#### Step 1: recommendedScheduleConfig.js의 day2에서 wedding 항목 수정

```javascript
// 원래
day2: {
  items: [
    {
      type: "wedding",
      time: "15:30",      // ← 15:30
      duration: 180,
      ...
    }
  ]
}

// 변경 후
day2: {
  items: [
    {
      type: "wedding",
      time: "16:00",      // ← 16:00으로 변경
      duration: 180,
      ...
    }
  ]
}
```

#### Step 2: 페이지 새로고침하여 확인

---

### 예제 3: 새로운 맛집 추가 및 일정에 포함

**목표:** "신각 자장면"을 새로 추가하고 추천일정 #3에 포함

#### Step 1: restaurants.json에 새 항목 추가

```json
"sinjakJjajangmyeon": {
  "id": "sinjakJjajangmyeon",
  "name": "신각 자장면",
  "chineseName": "新阁炸酱面",
  "addressZh": "广州市...",
  "category": "중식",
  "district": "yuexiu",
  "duration": 60,
  "mealTypes": ["lunch", "dinner"],
  "openTime": "11:00",
  "closeTime": "21:00",
  "hours": "11:00 - 21:00",
  "price": "50-80 RMB",
  "bestTime": "점심 또는 저녁",
  "tips": "맛있는 자장면으로 유명합니다.",
  "note": "지역 주민들이 자주 찾는 식당입니다.",
  "images": ["images/places/sinjakJjajangmyeon-1.svg"]
}
```

#### Step 2: recommendedScheduleConfig.js의 day3에 추가

```javascript
day3: {
  items: [
    { type: "place", id: "k11", time: "10:30" },
    { type: "restaurant", id: "sinjakJjajangmyeon", time: "12:30" },  // 새로 추가!
    { type: "place", id: "haixinBridge", time: "14:00" },
    { type: "restaurant", id: "beijingRoadFood", time: "16:00" }
  ]
}
```

#### Step 3: 페이지 새로고침하여 확인

---

## 🚀 빠른 참조

### 지역 코드 (District Code)

| 코드 | 한글명 | 영문명 |
|------|--------|--------|
| `liwan` | 리완 | Liwan |
| `yuexiu` | 웨슈 | Yuexiu |
| `zhujiang` | 주장신청 | Zhujiang New Town |
| `panyu` | 판위 | Panyu |

### 식사 타입 (Meal Type)

- `breakfast`: 아침
- `lunch`: 점심
- `dinner`: 저녁

### 일정 항목 타입 (Item Type)

| 타입 | 설명 | 필수 필드 |
|------|------|---------|
| `place` | 여행지 | type, id, time |
| `restaurant` | 맛집 | type, id, time |
| `wedding` | 결혼식 | type, time, duration |
| `transport` | 이동 | type, time, duration, title, from, to |

---

## 💡 팁

1. **시간 형식:** 항상 24시간 형식 사용 (예: 14:30, 09:00)

2. **Duration:** 분 단위로 입력 (예: 60분, 90분, 180분)

3. **ID 검증:** places.json 또는 restaurants.json에 존재하지 않는 ID를 사용하면 해당 항목은 무시됩니다.

4. **사진 경로:** `images/places/` 폴더에 SVG 또는 PNG 형식의 사진을 저장하세요.

5. **중국어 이름:** Google Maps 등에서 정확한 중국어 이름을 확인하고 사용하세요.

---

## 🔍 트러블슈팅

### Q: 추가한 여행지가 화면에 표시되지 않습니다.

**A:** 다음을 확인하세요:
1. places.json에 올바르게 추가되었는지 확인
2. recommendedScheduleConfig.js에서 사용한 ID가 places.json의 ID와 정확히 일치하는지 확인
3. 브라우저 캐시를 삭제하고 새로고침 (Ctrl+Shift+Delete)

### Q: 일정 시간이 겹칩니다.

**A:** 항목의 `time` 필드를 조정하세요. 시스템은 자동으로 이전 항목의 종료 시간을 고려합니다.

### Q: 이미지가 표시되지 않습니다.

**A:** 
1. 이미지 파일이 `images/places/` 폴더에 존재하는지 확인
2. places.json 또는 restaurants.json의 `images` 배열에서 경로가 정확한지 확인
3. 파일 이름의 대소문자를 확인하세요.

---

## �️ 이미지 최적화 (중요!)

### 문제

- 원본 이미지가 1.6~1.7MB로 매우 크면 로딩이 지연됩니다
- 새 이미지를 추가할 때마다 같은 문제가 발생합니다
- 수동 압축은 비효율적입니다

### 해결책

**`optimize_images.py` 스크립트를 사용하여 자동 압축합니다.**

#### 설정 (최초 1회)

```bash
# 1. Pillow 라이브러리 설치
pip install Pillow

# 2. 기존 이미지 모두 압축 (선택사항)
python optimize_images.py
```

#### 새 이미지 추가 워크플로우

```bash
# 1. 새 JPG 이미지를 images/places/ 폴더에 복사
#    예: partyVenue-1.jpg, dimSumRestaurant-1.jpg

# 2. 스크립트 실행하여 압축
python optimize_images.py

# 3. 변경사항 커밋
git add .
git commit -m "Add: 새 이미지 추가 및 최적화"
git push
```

#### 압축 옵션

```bash
# 특정 폴더의 이미지만 압축
python optimize_images.py images/subfolder

# Git staging area의 이미지만 압축 (커밋 전에 자동 실행 권장)
python optimize_images.py --staged
```

#### 압축 설정 변경

`optimize_images.py` 파일의 상수를 수정하세요:

```python
QUALITY = 65  # 압축 품질 (1-95, 낮을수록 파일 작음)
MAX_DIMENSION = 1200  # 최대 이미지 너비/높이
```

### 압축 결과 예상

| 원본 크기 | 압축 후 | 예상 로딩 시간 |
|---------|--------|-------------|
| 1.7MB | 200-300KB | 0.5-1초 |
| 1.6MB | 180-280KB | 0.3-1초 |
| 400KB | 50-80KB | 0.1초 |

### 자동화 (선택사항)

Git pre-commit hook으로 자동 압축을 설정할 수 있습니다:

```bash
# Linux/Mac: 이미 설정됨 (.git/hooks/pre-commit)
# Windows: 아래 명령어로 수동 설정
git config core.hooksPath .git/hooks
```

이제 `git commit` 실행 시 자동으로 이미지가 압축됩니다.

---

## �📞 지원

문제가 발생하거나 추가 기능이 필요한 경우, 관련 파일과 에러 메시지를 함께 보고해주세요.

**마지막 수정:** 2026년 8월 2일
