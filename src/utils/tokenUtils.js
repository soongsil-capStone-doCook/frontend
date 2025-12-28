// 토큰 관련 유틸리티 함수

/**
 * JWT 토큰 디코딩 (payload 추출)
 * @param {string} token - JWT 토큰
 * @returns {object|null} 디코딩된 payload 또는 null
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return null;
  }
};

/**
 * 토큰이 만료되었는지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} 만료 여부
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp는 초 단위이므로 밀리초로 변환하여 비교
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  // 만료 5분 전부터 만료로 간주 (여유 시간)
  return currentTime >= expirationTime - 5 * 60 * 1000;
};

/**
 * 토큰 만료까지 남은 시간 (밀리초)
 * @param {string} token - JWT 토큰
 * @returns {number} 남은 시간 (밀리초), 만료되었으면 0
 */
export const getTokenExpirationTime = (token) => {
  if (!token) return 0;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  return Math.max(0, expirationTime - currentTime);
};

