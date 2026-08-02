/**
 * 추천 일정 설정 파일 (Recommended Schedule Configuration)
 * 
 * 이 파일은 4개의 추천 일정(추천일정 #1~#4)을 정의합니다.
 * 각 일정은 places.js와 restaurants.js의 ID를 참조합니다.
 * 
 * ⚠️ 주의: 이 파일의 구조를 변경하면 전체 시스템이 영향받습니다.
 * 안내서를 참조하여 올바르게 수정해주세요: README_SETUP.md
 * 
 * 설정 방법:
 * 1. 각 일정(day1~day4)의 items 배열에 항목을 추가/수정합니다.
 * 2. type이 "place"인 경우: { type: "place", id: "placeId", time: "HH:MM" }
 * 3. type이 "restaurant"인 경우: { type: "restaurant", id: "restaurantId", time: "HH:MM" }
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
    title: "광저우 도착",
    description: "공항 도착 후 리완 지역 탐방",
    items: [
      {
        type: "transport",
        time: "14:00",
        duration: 60,
        title: "광저우 도착",
        detail: "공항 도착 후 호텔로 이동합니다.",
        tag: "도착",
        from: "공항",
        to: "호텔"
      },
      {
        type: "place",
        id: "chenClan",
        time: "15:30"
      },
      {
        type: "restaurant",
        id: "dimsumLiwan",
        time: "17:30"
      },
      {
        type: "place",
        id: "shamian",
        time: "19:30"
      }
    ]
  },

  // 추천일정 #2: 결혼식 당일 (11월 14일, 토)
  day2: {
    label: "추천일정 #2",
    date: "",
    title: "Wedding Day",
    description: "결혼식 당일 (15:30 ~ 18:30)",
    items: [
      {
        type: "wedding",
        time: "15:30",
        duration: 180,
        title: "W Guangzhou 결혼식",
        detail: "결혼식이 진행되는 시간입니다.",
        tag: "Wedding"
      },
      {
        type: "restaurant",
        id: "cantoneseZhujiang",
        time: "19:30"
      }
    ]
  },

  // 추천일정 #3: 일정 3 (11월 15일, 일)
  day3: {
    label: "추천일정 #3",
    date: "",
    title: "광저우 여행",
    description: "웨슈(越秀) 지역 중심 관광",
    items: [
      {
        type: "place",
        id: "k11",
        time: "10:30"
      },
      {
        type: "place",
        id: "haixinBridge",
        time: "13:00"
      },
      {
        type: "restaurant",
        id: "beijingRoadFood",
        time: "15:00"
      }
    ]
  },

  // 추천일정 #4: 출국일 (11월 16일, 월)
  day4: {
    label: "추천일정 #4",
    date: "",
    title: "귀국하는 날",
    description: "주장신청 야경 감상 후 출국",
    items: [
      {
        type: "place",
        id: "partyPier",
        time: "17:00"
      },
      {
        type: "transport",
        time: "21:30",
        duration: 60,
        title: "광저우 출발",
        detail: "호텔 체크아웃 후 공항으로 이동합니다.",
        tag: "출발",
        from: "호텔",
        to: "공항"
      }
    ]
  }
};

/**
 * 여행지/맛집 정보 통합 설정 (TravelLibrary Configuration)
 * Travel 섹션에 표시될 모든 여행지와 맛집을 정의합니다.
 * places.js와 restaurants.js의 별칭으로 사용됩니다.
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
 * 헬퍼 함수: 여행지/맛집 정보를 itemId와 type으로 가져오기
 */
function getTravelItemInfo(itemId, type) {
  if (type === "place") {
    return PLACES[itemId];
  } else if (type === "restaurant") {
    return RESTAURANTS[itemId];
  }
  return null;
}
