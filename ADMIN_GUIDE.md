# 관리자 데이터 수정 가이드

이 버전부터 화면 코드와 콘텐츠 데이터가 분리되어 있습니다.
관광지나 식당 정보를 수정할 때 `script.js` 또는 `index.html`을 수정할 필요가 없습니다.

## 관광지 정보

파일: `data/places.json`

주요 필드:

- `name`: 한국어 이름
- `chineseName`: 중국어 이름
- `addressZh`: 중국어 주소
- `duration`: 추천 소요시간(분)
- `openTime`, `closeTime`: 일정 자동 생성에 사용하는 시간
- `hours`: 상세화면에 표시할 운영시간 문구
- `price`: 입장료 또는 예상비용
- `bestTime`: 추천 방문시간
- `tips`: 방문 팁
- `note`: 장소 설명
- `district`: 동선 계산용 지역 코드
- `priority`: 추천 일정 우선순위

## 식당 정보

파일: `data/restaurants.json`

관광지와 거의 동일하며 `mealTypes`에 식사 종류를 입력합니다.

예: `breakfast`, `lunch`, `dinner`, `cafe`, `late`

## 사진

파일: `data/photos.json`

```json
"cantonTower": [
  "images/places/cantonTower-1.jpg",
  "images/places/cantonTower-2.jpg"
]
```

사진 파일은 `images/places/` 폴더에 넣습니다.
파일명과 JSON 경로의 대소문자가 정확히 같아야 합니다.

## 추천 일정 규칙

파일: `data/scheduleRules.json`

- `weddingDate`: 결혼식 날짜
- `rules`: 기본 운영시간, 공항 이동시간, 지역 간 이동시간
- `recommendedPlaceIds`: 지역별 추천 관광지 순서
- `recommendedRestaurantIds`: 지역별 추천 식사 순서

## 주의사항

JSON에서는 마지막 항목 뒤에 쉼표를 넣으면 안 됩니다.
수정 후 VS Code에서 JSON 오류 표시가 없는지 확인하고 배포하세요.

```powershell
git add .
git commit -m "Update travel data"
git push
```


## 추가된 일정 편집 규칙

- 소요시간은 5~960분 사이에서 5분 단위로 직접 입력합니다.
- 서로 다른 지역을 반복 이동하면 일정은 저장되지만 동선 경고가 표시됩니다.
- 자동 일정에 포함되지 못한 직접 선택 항목은 결과 하단에 사유와 함께 표시됩니다.

## 사진 상태 표시

`data/photos.json`에서 SVG 파일을 사용하는 항목은 `사진 준비 중`으로 표시됩니다.
실제 JPG 또는 WebP 파일로 교체하면 해당 문구가 자동으로 사라집니다.


## 주변 장소 연결

`data/places.json` 또는 `data/restaurants.json`에서 ID 배열로 연결합니다.

```json
"nearbyPlaces": ["haixinBridge", "partyPier"],
"nearbyRestaurants": ["guangzhouRestaurantLiwan"]
```

존재하지 않는 ID는 화면에 표시되지 않습니다.

## 식당 상세정보

식당 데이터에 아래 항목을 넣으면 상세창에 표시됩니다.

```json
"reservation": "주말 예약 권장",
"averageCostCny": 130,
"recommendedMenu": ["하가우", "차슈바오"]
```


## 카카오톡 일정 공유

일정을 생성한 뒤 `카카오톡으로 일정 공유`를 누릅니다.

- 모바일의 시스템 공유창이 열리면 카카오톡을 선택합니다.
- 공유창을 지원하지 않는 브라우저에서는 링크가 자동 복사됩니다.
- 받은 사람은 미리보기 또는 내 일정 저장을 선택할 수 있습니다.
- 서버 없이 `?plan=` URL 파라미터로 일정이 전달됩니다.

## PDF 저장

`PDF 저장`을 누르면 일정 영역만 인쇄됩니다.
브라우저 인쇄창에서 `PDF로 저장`을 선택합니다.


## 일정 순서 변경

- 데스크톱: 일정 카드 오른쪽의 손잡이를 드래그합니다.
- 모바일: 손잡이를 누른 상태로 위·아래로 이동합니다.
- 위/아래 화살표 버튼으로도 순서를 변경할 수 있습니다.
- 순서를 바꾸면 각 일정의 기존 소요시간을 유지한 채 시간이 자동 재계산됩니다.
- 결혼식 일정은 고정되어 이동할 수 없습니다.
- 결혼식 시간과 충돌하거나 24시를 넘으면 변경이 취소됩니다.


## 중국 여행 가이드 관리

가이드 내용은 아래 파일에서 수정합니다.

```text
data/travelGuide.json
```

각 가이드는 다음 형태입니다.

```json
{
  "id": "alipay",
  "category": "결제",
  "title": "Alipay 설치와 해외카드 등록",
  "summary": "요약",
  "steps": [
    {
      "title": "앱 설치",
      "description": "설명"
    }
  ],
  "warnings": ["주의사항"],
  "tips": ["팁"]
}
```

앱 화면과 정책은 변경될 수 있으므로 출국 전 공식 안내를 다시 확인하고
`updatedAt` 날짜를 갱신하세요.


## V22 상세보기 수정

- 상세보기 버튼은 일정 카드 하단 액션 영역에 표시됩니다.
- 상세창은 열릴 때마다 맨 위 대표 사진부터 표시됩니다.
- 상세창의 일정 추가 기능은 장소 정보를 보존한 뒤 일정 편집창을 엽니다.


## V23 Travel 장소 목록

`Travel` 탭은 `data/places.json`, `data/restaurants.json`,
`data/photos.json`에 등록된 항목을 자동으로 표시합니다.

새 장소를 JSON에 추가하면 별도의 HTML 수정 없이 목록에 나타납니다.

일정 등록창에서는 선택한 장소의 대표 사진, 중국어명, 지역, 설명,
주소, 운영시간과 기본 소요시간을 확인할 수 있습니다.


## V24 모바일 레이아웃

- 모바일에서는 관광지 선택 카드가 한 열로 표시됩니다.
- Travel 목록은 사진이 왼쪽에 있는 압축 카드로 표시됩니다.
- 상세보기는 화면 하단에서 열리는 전체 폭 패널이며,
  상단의 `닫기 ×` 버튼이 스크롤 중에도 유지됩니다.
- 모바일 화면이 가로로 늘어나면 브라우저 캐시를 삭제하거나
  강력 새로고침 후 다시 확인하세요.
