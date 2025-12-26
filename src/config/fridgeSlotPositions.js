// 냉장고 선반 위치 좌표 설정
// 각 fridgeSlot에 대한 top, left 위치를 퍼센트(%)로 정의
// 조정이 필요하면 이 파일의 값만 수정하면 됩니다

export const fridgeSlotPositions = {
  // 냉장실 선반들 9개
  MAIN_SHELF_1: {
    // 완료
    top: "68%",
    left: "20%",
  },
  MAIN_SHELF_2: {
    // 완료
    top: "61%", // 냉장실 가운데 선반
    left: "20%",
  },
  MAIN_SHELF_3: {
    // 완료
    top: "52%", // 냉장실 아랫 선반
    left: "20%",
  },

  // 맨 아래 서랍 (야채/과일 서랍)
  CRISPER_DRAWER: {
    // 완료
    top: "80%",
    left: "20%",
  },

  // 냉동칸 (상단 냉동)
  FREEZER_TOP: {
    // 완료
    top: "19%",
    left: "20%",
  },

  // 문쪽 선반들
  DOOR_SHELF_1: {
    // 완료
    top: "84%",
    left: "60%",
  },
  DOOR_SHELF_2: {
    // 완료
    top: "71%",
    left: "60%",
  },
  DOOR_SHELF_3: {
    // 완료
    top: "58%",
    left: "60%",
  },
  DOOR_SHELF_4: {
    // 완료
    top: "44%",
    left: "60%",
  },
};

// 기본 위치 (fridgeSlot이 없거나 매핑되지 않은 경우)
export const defaultPosition = {
  top: "50%",
  left: "50%",
};
