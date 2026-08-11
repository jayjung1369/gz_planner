/**
 * 추천 일정 설정 파일 (Recommended Schedule Configuration)
 * 
 * 이 파일은 4개의 추천 일정(추천일정 #1~#4)을 정의합니다.
 * 각 일정은 places.json의 ID를 참조합니다 (식당과 장소가 통합됨).
 * 
 * ⚠️ 주의: 이 파일의 구조를 변경하면 전체 시스템이 영향받습니다.
 * 안내서를 참조하여 올바르게 수정해주세요: README_SETUP.md
 * 
 * 설정 방법:
 * 1. 각 일정(day1~day4)의 items 배열에 항목을 추가/수정합니다.
 * 2. type이 "place"인 경우: { type: "place", id: "placeId", time: "HH:MM" }
 * 3. 모든 항목이 places.json에서 참조됩니다 (식당도 places.json에 통합됨).
 * 4. 시간은 24시간 형식 (예: "09:30", "15:45")
 * 
 * 예제:
 * {
 *   type: "place",
 *   id: "shamian",        // places.json의 항목 ID
 *   time: "15:30"         // 방문 시간 (24시간 형식)
 * }
 */

const RECOMMENDED_SCHEDULE_CONFIG = {
  // 추천일정 #1: 도착일 (11월 13일, 금)
  day1: {
    label: "추천일정 #1",
    date: "",
    title: "추천 일정 #1",
    description: "공항 도착 후 리완 지역 탐방",
    "items": [
      {
        "type": "place",
        "id": "yongqingfang",
        "time": "10:00"
      },
      {
        "type": "place",
        "id": "shamian",
        "time": "13:45"
      },
      {
        "type": "place",
        "id": "huachengSquare",
        "time": "16:10"
      },
      {
        "type": "place",
        "id": "k11",
        "time": "17:05"
      },
      {
        "type": "place",
        "id": "haixinsha",
        "time": "19:30"
      },
      {
        "type": "place",
        "id": "cantonTower",
        "time": "20:10"
      },
      {
        "type": "place",
        "id": "partyPier",
        "time": "21:30"
      }
    ]
  },

  day2: {
    label: "추천일정 #2",
    date: "",
    title: "추천 일정 #2",
    description: "광저우 역사와 감성거리, 쇼핑을 함께 즐기는 코스",
    items: [
      {
        type: "place",
        id: "chenClanAcademy",
        time: "09:30"
      },
      {
        type: "place",
        id: "dongshankou",
        time: "13:00"
      },
      {
        type: "place",
        id: "sacredHeartCathedral",
        time: "15:30"
      },
      {
        type: "place",
        id: "wanlingPlaza",
        time: "16:20"
      },
      {
        type: "place",
        id: "beijingRoad",
        time: "17:30"
      },
      {
        type: "place",
        id: "dafoTemple",
        time: "20:20"
      }
    ]
  },
  day3: {
  label: "추천일정 #3",
  date: "",
  title: "추천 일정 #3 (창롱 투어)",
  description: "사파리, 놀이공원, 워터파크(여름), 국제서커스를 즐기는 창롱 리조트 코스",
  items: [
    {
      type: "place",
      id: "chimelongSafariPark",
      time: "09:30"
    },
    {
      type: "place",
      id: "chimelongParadise",
      time: "10:00"
    },
    {
      type: "place",
      id: "chimelongWaterPark",
      time: "10:00"
    },
    {
      type: "place",
      id: "chimelongInternationalCircus",
      time: "19:30"
    }
  ]
},


};

/**
 * 여행지/맛집 정보 통합 설정 (TravelLibrary Configuration)
 * Travel 섹션에 표시될 모든 여행지와 맛집을 정의합니다.
 * places.json의 항목으로 모두 통합되어 사용됩니다.
 */

const TRAVEL_LIBRARY_CONFIG = {
  // places.js의 각 항목은 여기서 추가 설정 가능
  // 예: 추천도 설정, 카테고리 그룹핑 등
  categorization: {
    places: {
      "산책": ["shamian", "yongqingfang", "haixinBridge"],
      "문화": ["sacredHeart", "zhanxiMarket"],
      "쇼핑": ["beijingRoad", "k11"],
      "자연": ["cantonTower", "changlong"],
      "생활": ["partyPier"],
      "행사": ["weddingHotel"]
    },
    restaurants: {
      "딤섬": ["dimsumLiwan"],
      "광둥요리": ["cantoneseLiwan", "cantoneseZhujiang"],
      "로컬음식": ["beijingRoadFood"],
      "훠궈": ["hotpotZhujiang"],
      "카페": ["cafeZhujiang"],
      "야식": ["nightSnackZhujiang"]
    }
  },

  // 사진 조회 우선순위 (있으면 기본값, 없으면 placeholder)
  photoQuality: {
    high: ["weddingHotel", "cantonTower", "changlongDisneyland"],
    medium: ["shamian", "yongqingfang", "k11"],
    lowOrPlaceholder: ["airport"]
  }
};

/**
 * 헬퍼 함수: 추천일정 config에서 day config 가져오기
 */
function getRecommendedScheduleDay(dayIndex) {
  const dayKeys = ["day1", "day2", "day3", "day4"];
  return RECOMMENDED_SCHEDULE_CONFIG[dayKeys[dayIndex]] || null;
}

/**
 * 헬퍼 함수: 여행지/맛집 정보를 itemId로 가져오기 (모두 PLACES로 통합됨)
 */
function getTravelItemInfo(itemId) {
  return PLACES[itemId] || null;
}
