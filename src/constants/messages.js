// 에러 메시지 등 상수 정의

export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  FAVORITE_ADDED: '찜 목록에 추가되었습니다.',
  FAVORITE_REMOVED: '찜 목록에서 제거되었습니다.',
  PROFILE_UPDATED: '프로필이 업데이트되었습니다.',
};

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: '이메일을 입력해주세요.',
  EMAIL_INVALID: '올바른 이메일 형식이 아닙니다.',
  PASSWORD_REQUIRED: '비밀번호를 입력해주세요.',
  PASSWORD_MIN_LENGTH: '비밀번호는 최소 8자 이상이어야 합니다.',
};

