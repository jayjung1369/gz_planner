const SCHEDULE_RULES = {
  dayStart: "08:00",
  dayEnd: "24:00",
  airportToHotelMinutes: 90,
  hotelToAirportMinutes: 90,
  airportBufferMinutes: 120,
  defaultTravelMinutes: 25,
  districtTravelMinutes: {
    "liwan-liwan": 15,
    "yuexiu-yuexiu": 15,
    "zhujiang-zhujiang": 15,
    "liwan-yuexiu": 25,
    "yuexiu-liwan": 25,
    "yuexiu-zhujiang": 35,
    "zhujiang-yuexiu": 35,
    "liwan-zhujiang": 45,
    "zhujiang-liwan": 45,
    "panyu-zhujiang": 55,
    "zhujiang-panyu": 55
  }
};

const RECOMMENDED_DISTRICT_ORDER = [
  "liwan",
  "yuexiu",
  "zhujiang",
  "panyu"
];

const RECOMMENDED_PLACE_IDS = {
  liwan: ["chenClan", "yongqingfang", "shamian"],
  yuexiu: ["sacredHeart", "beijingRoad"],
  zhujiang: ["k11", "huachengSquare", "cantonTower"],
  panyu: ["changlong"]
};

const RECOMMENDED_RESTAURANT_IDS = {
  liwan: ["dimsumLiwan", "cantoneseLiwan"],
  yuexiu: ["beijingRoadFood"],
  zhujiang: ["cantoneseZhujiang", "cafeZhujiang", "hotpotZhujiang"],
  panyu: []
};
