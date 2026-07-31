const PLACES = {
  airport: {
    id: "airport",
    name: "광저우 바이윈 국제공항",
    chineseName: "广州白云国际机场",
    addressZh: "广东省广州市白云区机场大道东888号",
    category: "교통",
    district: "airport",
    duration: 0,
    latitude: 23.3924,
    longitude: 113.2988,
    note: "입국 수속과 수하물 수령 후 시내로 이동합니다."
    hours: "24시간",
    price: "무료",
    bestTime: "항공편 도착 2시간 전후 여유",
    tips: "입국 심사와 수하물 수령 시간을 고려하세요.",
    images: [
      "images/places/airport-1.svg",
      "images/places/airport-2.svg",
      "images/places/airport-3.svg"
    ],
  },

  weddingHotel: {
    id: "weddingHotel",
    name: "W Guangzhou",
    chineseName: "广州W酒店",
    addressZh: "广东省广州市天河区珠江新城冼村路26号",
    category: "Wedding",
    district: "zhujiang",
    duration: 180,
    latitude: 23.1202,
    longitude: 113.3236,
    openTime: "00:00",
    closeTime: "24:00",
    recommendedTime: ["afternoon", "evening"],
    priority: 100,
    note: "광저우 W 호텔에서 결혼식이 진행됩니다."
    hours: "24시간",
    price: "예식 참석",
    bestTime: "예식 안내 시간에 맞춰 방문",
    tips: "정확한 홀과 예식 시간은 추후 안내됩니다.",
    images: [
      "images/places/weddingHotel-1.svg",
      "images/places/weddingHotel-2.svg",
      "images/places/weddingHotel-3.svg"
    ],
  },

  shamian: {
    id: "shamian",
    name: "샤미엔",
    chineseName: "沙面岛",
    addressZh: "广东省广州市荔湾区沙面南街",
    category: "산책",
    district: "liwan",
    duration: 120,
    latitude: 23.1083,
    longitude: 113.2392,
    openTime: "08:00",
    closeTime: "22:00",
    recommendedTime: ["morning", "afternoon"],
    priority: 9,
    tags: ["역사", "산책", "사진"],
    note: "유럽풍 건축과 가로수가 이어지는 광저우 대표 산책 지역입니다."
    hours: "상시 개방",
    price: "무료",
    bestTime: "오전 또는 늦은 오후",
    tips: "편한 신발을 준비하고 강변 산책까지 함께 즐기세요.",
    images: [
      "images/places/shamian-1.svg",
      "images/places/shamian-2.svg",
      "images/places/shamian-3.svg"
    ],
  },

  yongqingfang: {
    id: "yongqingfang",
    name: "영경방",
    chineseName: "永庆坊",
    addressZh: "广东省广州市荔湾区恩宁路99号",
    category: "문화거리",
    district: "liwan",
    duration: 120,
    latitude: 23.1169,
    longitude: 113.2446,
    openTime: "09:00",
    closeTime: "22:00",
    recommendedTime: ["afternoon", "evening"],
    priority: 9,
    tags: ["전통", "쇼핑", "카페"],
    note: "전통 골목과 현대적인 상점이 함께 있는 리완의 문화거리입니다."
    hours: "09:00~22:00",
    price: "무료",
    bestTime: "오후~저녁",
    tips: "주말에는 혼잡할 수 있어 평일 오후가 편합니다.",
    images: [
      "images/places/yongqingfang-1.svg",
      "images/places/yongqingfang-2.svg",
      "images/places/yongqingfang-3.svg"
    ],
  },

  chenClan: {
    id: "chenClan",
    name: "천가사",
    chineseName: "陈家祠",
    addressZh: "广东省广州市荔湾区中山七路恩龙里34号",
    category: "문화유산",
    district: "liwan",
    duration: 90,
    latitude: 23.1295,
    longitude: 113.2465,
    openTime: "09:00",
    closeTime: "17:30",
    recommendedTime: ["morning", "afternoon"],
    priority: 8,
    tags: ["건축", "역사"],
    note: "정교한 전통 장식과 건축을 볼 수 있는 광저우 대표 문화유산입니다."
    hours: "09:00~17:30",
    price: "약 10위안",
    bestTime: "오전",
    tips: "마감 1시간 전에는 입장하는 것을 권장합니다.",
    images: [
      "images/places/chenClan-1.svg",
      "images/places/chenClan-2.svg",
      "images/places/chenClan-3.svg"
    ],
  },

  beijingRoad: {
    id: "beijingRoad",
    name: "베이징루",
    chineseName: "北京路步行街",
    addressZh: "广东省广州市越秀区北京路",
    category: "쇼핑",
    district: "yuexiu",
    duration: 150,
    latitude: 23.1257,
    longitude: 113.2708,
    openTime: "10:00",
    closeTime: "23:00",
    recommendedTime: ["afternoon", "evening"],
    priority: 9,
    tags: ["쇼핑", "도심", "야식"],
    note: "쇼핑과 길거리 음식, 도심 산책을 함께 즐길 수 있습니다."
    hours: "10:00~23:00",
    price: "무료",
    bestTime: "오후~저녁",
    tips: "저녁 식사와 쇼핑을 한 번에 묶기 좋습니다.",
    images: [
      "images/places/beijingRoad-1.svg",
      "images/places/beijingRoad-2.svg",
      "images/places/beijingRoad-3.svg"
    ],
  },

  sacredHeart: {
    id: "sacredHeart",
    name: "성심대성당",
    chineseName: "石室圣心大教堂",
    addressZh: "广东省广州市越秀区一德路旧部前56号",
    category: "건축",
    district: "yuexiu",
    duration: 60,
    latitude: 23.1141,
    longitude: 113.2607,
    openTime: "08:30",
    closeTime: "17:30",
    recommendedTime: ["morning", "afternoon"],
    priority: 7,
    tags: ["건축", "사진"],
    note: "광저우를 대표하는 고딕 양식 성당입니다."
    hours: "08:30~17:30",
    price: "무료",
    bestTime: "오전",
    tips: "예배 시간에는 내부 관람이 제한될 수 있습니다.",
    images: [
      "images/places/sacredHeart-1.svg",
      "images/places/sacredHeart-2.svg",
      "images/places/sacredHeart-3.svg"
    ],
  },

  cantonTower: {
    id: "cantonTower",
    name: "광저우타워",
    chineseName: "广州塔",
    addressZh: "广东省广州市海珠区阅江西路222号",
    category: "랜드마크",
    district: "zhujiang",
    duration: 120,
    latitude: 23.1065,
    longitude: 113.3249,
    openTime: "09:30",
    closeTime: "22:30",
    recommendedTime: ["evening", "night"],
    priority: 10,
    tags: ["야경", "랜드마크", "사진"],
    note: "광저우의 야경을 대표하는 랜드마크입니다."
    hours: "09:30~22:30",
    price: "전망대 상품별 상이",
    bestTime: "일몰 1시간 전",
    tips: "야경 관람은 사전 예매를 권장합니다.",
    images: [
      "images/places/cantonTower-1.svg",
      "images/places/cantonTower-2.svg",
      "images/places/cantonTower-3.svg"
    ],
  },

  huachengSquare: {
    id: "huachengSquare",
    name: "화청광장",
    chineseName: "花城广场",
    addressZh: "广东省广州市天河区珠江新城",
    category: "도심산책",
    district: "zhujiang",
    duration: 90,
    latitude: 23.1195,
    longitude: 113.3247,
    openTime: "08:00",
    closeTime: "24:00",
    recommendedTime: ["afternoon", "evening"],
    priority: 9,
    tags: ["야경", "산책", "도심"],
    note: "주장신청의 고층 빌딩과 야경을 함께 볼 수 있는 광장입니다."
    hours: "상시 개방",
    price: "무료",
    bestTime: "일몰 이후",
    tips: "광저우타워와 함께 묶으면 동선이 좋습니다.",
    images: [
      "images/places/huachengSquare-1.svg",
      "images/places/huachengSquare-2.svg",
      "images/places/huachengSquare-3.svg"
    ],
  },

  k11: {
    id: "k11",
    name: "광저우 K11",
    chineseName: "广州K11购物艺术中心",
    addressZh: "广东省广州市天河区珠江东路6号",
    category: "쇼핑",
    district: "zhujiang",
    duration: 120,
    latitude: 23.1185,
    longitude: 113.3268,
    openTime: "10:00",
    closeTime: "22:00",
    recommendedTime: ["afternoon", "evening"],
    priority: 7,
    tags: ["쇼핑", "전시", "카페"],
    note: "쇼핑과 전시, 카페를 함께 즐길 수 있는 복합 공간입니다."
    hours: "10:00~22:00",
    price: "무료",
    bestTime: "오후",
    tips: "카페 휴식과 쇼핑을 함께 넣기 좋습니다.",
    images: [
      "images/places/k11-1.svg",
      "images/places/k11-2.svg",
      "images/places/k11-3.svg"
    ],
  },

  changlong: {
    id: "changlong",
    name: "창롱 관광리조트",
    chineseName: "广州长隆旅游度假区",
    addressZh: "广东省广州市番禺区汉溪大道东299号",
    category: "근교여행",
    district: "panyu",
    duration: 480,
    latitude: 22.9984,
    longitude: 113.3270,
    openTime: "09:30",
    closeTime: "18:00",
    recommendedTime: ["morning"],
    priority: 8,
    tags: ["가족", "테마파크", "종일"],
    note: "하루 전체를 사용하는 광저우 대표 근교 관광지입니다."
    hours: "09:30~18:00",
    price: "시설별 상이",
    bestTime: "개장 시간",
    tips: "하루 전체가 필요하므로 짧은 일정에는 추천하지 않습니다.",
    images: [
      "images/places/changlong-1.svg",
      "images/places/changlong-2.svg",
      "images/places/changlong-3.svg"
    ],
  }
};

const PLACE_OPTIONS = Object.values(PLACES).filter(
  (place) => !["airport", "weddingHotel"].includes(place.id)
);
