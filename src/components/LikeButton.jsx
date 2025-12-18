// [중요] 페이지 곳곳에서 쓰일 찜하기 버튼
import { useState } from 'react';
import { userAPI } from '../api/user';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

const LikeButton = ({ recipeId, initialLiked = false }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await userAPI.removeFavorite(recipeId);
        setIsLiked(false);
      } else {
        await userAPI.addFavorite(recipeId);
        setIsLiked(true);
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
          : 'text-white hover:text-red-300 hover:scale-105'
      }`}
      aria-label={isLiked ? '찜하기 취소' : '찜하기'}
    >
      {isLiked ? (
        <HiHeart size={24} className="drop-shadow-md" />
      ) : (
        <HiOutlineHeart size={24} className="drop-shadow-lg" />
      )}
    </button>
  );
};

export default LikeButton;

