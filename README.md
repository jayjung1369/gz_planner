# Wedding Schedule V3

광저우 결혼식 + 여행 가이드의 데이터 분리 버전입니다.

## 변경 사항

- 날짜별 실제 일정 자동 생성
- 결혼식 전날 / 당일 / 다음 날 일정 구분
- 입국일 / 출국일 일정 자동 배치
- 장기 체류 시 근교 일정 자동 배치
- 관광지, 맛집, 일정 템플릿을 data 폴더로 분리

## 폴더 구조

- index.html
- style.css
- script.js
- data/
  - places.js
  - restaurants.js
  - scheduleTemplates.js
- images/

## 수정 방법

관광지를 바꾸려면:
- `data/places.js`

맛집을 바꾸려면:
- `data/restaurants.js`

날짜별 일정 구성을 바꾸려면:
- `data/scheduleTemplates.js`

## 실행

압축을 풀어 기존 `E:\dev\Wedding_Schedule` 폴더에 덮어쓴 뒤
Live Server로 `index.html`을 실행합니다.
