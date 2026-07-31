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
  }
};

const PLACE_OPTIONS = Object.values(PLACES).filter(
  (place) => !["airport", "weddingHotel"].includes(place.id)
);
