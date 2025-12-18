// Recipe, User 등 공통 인터페이스 (JSDoc으로 타입 정의)

/**
 * @typedef {Object} Recipe
 * @property {number} id - 레시피 ID
 * @property {string} title - 레시피 제목
 * @property {string} description - 레시피 설명
 * @property {string} image - 레시피 이미지 URL
 * @property {number} cookingTime - 조리 시간 (분)
 * @property {number} servings - 인분
 * @property {string[]} ingredients - 재료 목록
 * @property {string[]} steps - 조리 단계
 */

/**
 * @typedef {Object} User
 * @property {number} id - 사용자 ID
 * @property {string} email - 이메일
 * @property {string} nickname - 닉네임
 * @property {string} profileImage - 프로필 이미지 URL
 */

/**
 * @typedef {Object} DietaryPreferences
 * @property {boolean} vegetarian - 채식주의 여부
 * @property {boolean} vegan - 비건 여부
 * @property {string[]} allergies - 알레르기 목록
 * @property {string[]} dislikedIngredients - 싫어하는 재료 목록
 */

export {};

