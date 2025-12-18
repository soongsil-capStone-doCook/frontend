import LikeButton from './LikeButton';
import { useState } from 'react';
import { HiClock } from 'react-icons/hi';
import { MdLocalFireDepartment } from 'react-icons/md';
import { HiCheckCircle } from 'react-icons/hi';

const RecipeCard = ({ recipe, size = 'normal' }) => {
  const isLarge = size === 'large';
  const [imageError, setImageError] = useState(false);

  // 이미지 URL 유효성 검사
  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // 기본 이미지 (SVG data URI)
  const defaultImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e5e7eb' width='300' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E이미지 없음%3C/text%3E%3C/svg%3E";

  const imageUrl =
    !imageError && isValidImageUrl(recipe?.thumbnail)
      ? recipe.thumbnail
      : defaultImage;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer ${
        isLarge
          ? 'shadow-lg'
          : 'hover:shadow-md hover:-translate-y-0.5 group'
      }`}
    >
      {/* 이미지 */}
      <div
        className={`relative ${
          isLarge ? 'h-52' : 'h-36'
        } bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden`}
      >
        <img
          src={imageUrl}
          alt={recipe?.title || '레시피 이미지'}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLarge ? '' : 'group-hover:scale-105'
          }`}
          onError={() => {
            setImageError(true);
          }}
        />
        
        {/* 스와이퍼용 상단 정보 배지 (large일 때만) */}
        {isLarge && (
          <>
            {/* 상단 왼쪽: 적합도 (북마크/배너 디자인) */}
            {recipe.matchRate && (() => {
              const matchRate = Math.floor(recipe.matchRate);
              // 적합도에 따른 색상 결정
              let gradientClass = '';
              let textColorClass = '';
              
              if (matchRate >= 90) {
                // 매우 높음: 밝은 슬레이트 그레이
                gradientClass = 'from-slate-500 via-slate-600 to-slate-700';
                textColorClass = 'text-slate-100';
              } else if (matchRate >= 70) {
                // 높음: 중간 슬레이트 그레이
                gradientClass = 'from-slate-600 via-slate-700 to-slate-800';
                textColorClass = 'text-slate-100';
              } else if (matchRate >= 50) {
                // 보통: 어두운 슬레이트 그레이
                gradientClass = 'from-slate-700 via-slate-800 to-slate-900';
                textColorClass = 'text-slate-200';
              } else {
                // 낮음: 가장 어두운 슬레이트 그레이
                gradientClass = 'from-slate-800 via-slate-900 to-slate-950';
                textColorClass = 'text-slate-200';
              }
              
              return (
                <div className="absolute top-0 left-3 z-10">
                  <div className="relative">
                    {/* 북마크/배너 모양 (하단 중앙에 V자 컷아웃) */}
                    <div 
                      className={`relative bg-gradient-to-br ${gradientClass} shadow-lg`}
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), 50% 100%, 0 calc(100% - 12px))',
                        width: '55px',
                        height: '50px',
                      }}
                    >
                      {/* 숫자 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                        <span className="text-xl font-black text-white leading-none">
                          {matchRate}
                        </span>
                        <span className={`text-[9px] font-bold ${textColorClass} uppercase tracking-wider mt-0.5`}>
                          %
                        </span>
                      </div>
                    </div>
                    
                    {/* 그림자 효과 */}
                    <div 
                      className="absolute inset-0 bg-black/20 blur-sm -z-10"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), 50% 100%, 0 calc(100% - 12px))',
                        width: '55px',
                        height: '50px',
                        transform: 'translate(2px, 2px)',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })()}
            
            {/* 상단 우측: 조리시간, 난이도 */}
            <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                <HiClock className="text-white" size={16} />
                <span className="text-sm font-bold text-white">
                  {recipe.cookTime || '30분'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                <MdLocalFireDepartment className="text-orange-300" size={16} />
                <span className="text-sm font-bold text-white">
                  {recipe.difficulty || '중급'}
                </span>
              </div>
            </div>
            
            {/* 그라데이션 오버레이 (상단) */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-0"></div>
          </>
        )}
        
        {/* 일반 카드용 찜하기 버튼 (normal일 때만) */}
        {!isLarge && (
          <div className="absolute top-3 right-3 z-10">
            <LikeButton recipeId={recipe.recipeId} initialLiked={false} />
          </div>
        )}
        
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent"></div>
      </div>

      {/* 내용 */}
      <div className={`p-4 ${isLarge ? 'p-5' : 'p-3'}`}>
        {/* 제목 */}
        <h3
          className={`font-bold text-gray-900 mb-3 line-clamp-2 leading-tight ${
            isLarge ? 'text-lg' : 'text-sm'
          }`}
        >
          {recipe.title}
        </h3>

        {/* 조리시간, 난이도 (일반 카드용) */}
        {!isLarge && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <HiClock className="text-gray-400" size={14} />
              <span className="text-xs font-medium text-gray-600">
                {recipe.cookTime || '30분'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MdLocalFireDepartment className="text-orange-400" size={14} />
              <span className="text-xs font-medium text-gray-600">
                {recipe.difficulty || '중급'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;

