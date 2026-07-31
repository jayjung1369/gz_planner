const RESTAURANTS = {
  dimsumLiwan: {
    id: "dimsumLiwan",
    name: "리완 딤섬",
    chineseName: "荔湾早茶",
    addressZh: "广州市荔湾区（具体餐厅待更新）",
    category: "딤섬",
    district: "liwan",
    duration: 90,
    mealTypes: ["breakfast", "lunch"],
    openTime: "08:00",
    closeTime: "14:30",
    priority: 10,
    note: "리완 여행 전후에 즐기기 좋은 광저우식 딤섬입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/dimsumLiwan-1.svg",
      "images/places/dimsumLiwan-2.svg"
    ],
  },

  cantoneseLiwan: {
    id: "cantoneseLiwan",
    name: "리완 광둥요리",
    chineseName: "荔湾粤菜",
    addressZh: "广州市荔湾区（具体餐厅待更新）",
    category: "광둥요리",
    district: "liwan",
    duration: 90,
    mealTypes: ["lunch", "dinner"],
    openTime: "11:00",
    closeTime: "21:30",
    priority: 9,
    note: "샤미엔과 영경방 일정에 자연스럽게 연결되는 광둥요리 식사입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/cantoneseLiwan-1.svg",
      "images/places/cantoneseLiwan-2.svg"
    ],
  },

  beijingRoadFood: {
    id: "beijingRoadFood",
    name: "베이징루 로컬식",
    chineseName: "北京路地道美食",
    addressZh: "广州市越秀区北京路（具体餐厅待更新）",
    category: "로컬음식",
    district: "yuexiu",
    duration: 75,
    mealTypes: ["lunch", "dinner"],
    openTime: "11:00",
    closeTime: "22:00",
    priority: 8,
    note: "베이징루 도심 산책과 함께 즐기기 좋은 로컬 식사입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/beijingRoadFood-1.svg",
      "images/places/beijingRoadFood-2.svg"
    ],
  },

  hotpotZhujiang: {
    id: "hotpotZhujiang",
    name: "주장신청 훠궈",
    chineseName: "珠江新城火锅",
    addressZh: "广州市天河区珠江新城（具体餐厅待更新）",
    category: "훠궈",
    district: "zhujiang",
    duration: 120,
    mealTypes: ["dinner"],
    openTime: "17:00",
    closeTime: "24:00",
    priority: 9,
    note: "광저우타워와 화청광장 야경 전후에 즐기기 좋은 저녁 식사입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/hotpotZhujiang-1.svg",
      "images/places/hotpotZhujiang-2.svg"
    ],
  },

  cantoneseZhujiang: {
    id: "cantoneseZhujiang",
    name: "주장신청 광둥요리",
    chineseName: "珠江新城粤菜",
    addressZh: "广州市天河区珠江新城（具体餐厅待更新）",
    category: "광둥요리",
    district: "zhujiang",
    duration: 90,
    mealTypes: ["lunch", "dinner"],
    openTime: "11:00",
    closeTime: "22:00",
    priority: 9,
    note: "W Guangzhou와 가까운 지역에서 즐기는 광둥요리입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/cantoneseZhujiang-1.svg",
      "images/places/cantoneseZhujiang-2.svg"
    ],
  },

  cafeZhujiang: {
    id: "cafeZhujiang",
    name: "주장신청 카페",
    chineseName: "珠江新城咖啡馆",
    addressZh: "广州市天河区珠江新城（具体店铺待更新）",
    category: "카페",
    district: "zhujiang",
    duration: 60,
    mealTypes: ["cafe"],
    openTime: "10:00",
    closeTime: "22:00",
    priority: 7,
    note: "도심 일정 사이 잠시 쉬어가기 좋은 카페입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/cafeZhujiang-1.svg",
      "images/places/cafeZhujiang-2.svg"
    ],
  },

  lateNight: {
    id: "lateNight",
    name: "광저우 야식",
    chineseName: "广州夜宵",
    addressZh: "广州市天河区珠江新城（具体店铺待更新）",
    category: "야식",
    district: "zhujiang",
    duration: 75,
    mealTypes: ["late"],
    openTime: "20:00",
    closeTime: "24:00",
    priority: 7,
    note: "늦은 도착일이나 야경 일정 후 가볍게 즐기는 야식입니다."
    hours: "영업시간 추후 업데이트",
    price: "1인 예산 추후 업데이트",
    bestTime: "일정 시간대에 맞춰 방문",
    tips: "실제 식당이 확정되면 메뉴와 예약 정보를 업데이트합니다.",
    images: [
      "images/places/lateNight-1.svg",
      "images/places/lateNight-2.svg"
    ],
  }
};

const RESTAURANT_OPTIONS = Object.values(RESTAURANTS);
