// 한국어 음식 이름 → 영어 이미지 파일명 매핑
export const foodNameToEnglish = {
  // 과일
  사과: "apple",
  바나나: "banana",
  오렌지: "orange",
  포도: "grape",
  딸기: "strawberry",
  수박: "watermelon",
  복숭아: "peach",
  배: "pear",
  키위: "kiwi",
  망고: "mango",

  // 채소
  당근: "carrot",
  양파: "onion",
  감자: "potato",
  토마토: "tomato",
  오이: "cucumber",
  배추: "cabbage",
  브로콜리: "broccoli",
  양상추: "lettuce",
  파: "greenonion",
  마늘: "garlic",
  아스파라거스: "asparagus",

  // 육류/생선
  돼지고기: "pork",
  소고기: "beef",
  닭고기: "chicken",
  생선: "fish",
  삼겹살: "pork",

  // 유제품
  우유: "milk",
  치즈: "cheese",
  요거트: "yogurt",
  버터: "butter",

  // 기타
  계란: "egg",
  빵: "bread",
  쌀: "rice",
  라면: "ramen",
  두부: "tofu",
  김치: "kimchi",
  맥주: "beer",
  소주: "soju",
  콜라: "coke",
  사이다: "sprite",
  물: "water",
  생수: "water",
  음료: "drink",
  소금: "salt",
  허브소금: "salt",
  소스: "source",
};

// S3 이미지 URL 생성 함수
export const getFoodImageUrl = (foodName, backendImageUrl = null) => {
  // 1. 백엔드에서 imageUrl을 제공하면 그것을 사용
  if (backendImageUrl) return backendImageUrl;

  // 2. 한국어 이름을 영어로 변환 후 S3 URL 생성
  const englishName = foodNameToEnglish[foodName];
  if (englishName) {
    return `https://capstone-ocr-images.s3.ap-northeast-2.amazonaws.com/${englishName}.png`;
  }

  // 3. 기본 이미지 (apple.png)
  return "https://capstone-ocr-images.s3.ap-northeast-2.amazonaws.com/apple.png";
};
