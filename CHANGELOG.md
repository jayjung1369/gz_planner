# Sprint 2-3 — Travel UX and compatibility files

## Travel

- added recommended, name, district and duration sorting
- added visible active-filter summary
- added one-click filter reset
- improved empty-search state with reset action
- added `all places viewed` completion status
- improved remaining-count text on the load-more button
- retained progressive batches of six cards

## Compatibility

- restored root `style.css`
- restored root `script.js`
- included legacy `scripts.js` alias
- kept `index.html` on the modular CSS and JavaScript structure
- verified compatibility files are not double-loaded
- documented that compatibility files should not be referenced together with
  the modular files


# Sprint 3-1 — Mobile UX refactor (기능 유지 / 데이터 유지)

## 수정한 파일 목록

- index.html
- js/state.js
- js/modules/planner.js
- js/modules/events.js
- js/modules/travel.js
- css/planner-cards.css
- css/mobile.css
- css/travel.css
- css/drag.css (삭제)

## 변경 이유

- 모바일에서 일정 카드가 크고 정보가 과다해 터치 동선이 길었던 문제를 개선
- DAY별 고정 탭 + 스와이프로 한 번에 한 날짜만 보여 집중도 향상
- 드래그 정렬(오작동/학습비용 높음)을 제거하고 위/아래 버튼 정렬로 단순화
- 일정 카드 높이를 축소하고 설명 텍스트를 제거해 한 화면 노출 밀도 개선
- 일정 추가를 현재 위치 기반(아이템 뒤 삽입 / 날짜 끝 삽입)으로 변경
- Travel 탐색을 추천/관광/맛집/쇼핑/카페/야경/지역/검색 순서 탭으로 재구성

## 삭제한 코드

- 드래그/포인터 드래그 전체 로직 삭제
  - bindScheduleDragEvents
  - handleScheduleDragStart
  - handleScheduleDragOver
  - handleScheduleDrop
  - clearScheduleDragState
  - handlePointerDragStart
  - handlePointerDragMove
  - handlePointerDragEnd
  - commitDomScheduleOrder
- 드래그 상태 전역 변수 삭제
  - dragState
  - pointerDragState
- 드래그 전용 스타일시트 삭제
  - css/drag.css
- 모바일의 드래그 핸들/더보기(점3개) 관련 스타일 제거

## 추가한 코드

- DAY 탭/스와이프/단일 DAY 렌더
  - createScheduleDayTabs
  - applyActiveScheduleDay
  - moveScheduleDayByStep
  - scheduleSwipeState 기반 터치 스와이프
- 일정 자동 압축 보정
  - compactDayItems
- 현재 위치 삽입형 일정 추가
  - data-add-after-item 버튼
  - insertAfterIndex 기반 삽입 + reflowOrderedDayItems 적용
- 일정 추가 모달 내 빠른 탐색 UX
  - 추천/관광/맛집/쇼핑 탭
  - 검색 입력
  - 필터된 select 옵션 자동 갱신
- Travel 탭 탐색 UX
  - TRAVEL_FACETS (추천/관광/맛집/쇼핑/카페/야경/지역/검색)
  - facet 기반 필터(matchesActiveFacet)
  - 검색 입력 시 facet 자동 전환(search)
- 모바일 컴팩트 카드 스타일
  - 56px 썸네일, 메타 중심 정보, 버튼형 순서 변경 UI
