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
