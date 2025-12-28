// [중요] 페이지 곳곳에서 쓰일 찜하기 버튼
import { useState, useEffect } from 'react';
import { userAPI } from '../api/user';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

const LikeButton = ({ recipeId, initialLiked = false, onToggle }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  // initialLiked가 변경되면 상태 동기화 (API 응답 반영)
  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleToggleLike = async (e) => {
    // 카드 클릭 이벤트 전파 방지
    e?.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await userAPI.removeFavorite(recipeId);
        setIsLiked(false);
        // 부모 컴포넌트에 상태 변경 알림
        onToggle?.(false);
      } else {
        await userAPI.addFavorite(recipeId);
        setIsLiked(true);
        // 부모 컴포넌트에 상태 변경 알림
        onToggle?.(true);
      }
    } catch (error) {
      console.error('찜하기 처리 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        isLiked
          ? 'text-red-500 scale-110'
          : 'text-white hover:text-red-400 hover:scale-105'
      }`}
      aria-label={isLiked ? '찜하기 취소' : '찜하기'}
    >
      {isLiked ? (
        <HiHeart size={24} className="drop-shadow-md fill-current" />
      ) : (
        <HiOutlineHeart size={24} className="drop-shadow-lg stroke-current" />
      )}
    </button>
  );
};

export default LikeButton;

