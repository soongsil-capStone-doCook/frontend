import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import RecipeCard from './RecipeCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const RecipeSwiper = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>추천 레시피가 없습니다.</p>
      </div>
    );
  }

  // 최대 5개만 표시
  const displayedRecipes = recipes.slice(0, 5);
  
  // 중앙에 위치하도록 initialSlide 설정 (5개 중 2번째 인덱스 = 중앙)
  const initialSlide = Math.floor(displayedRecipes.length / 2);

  return (
    <div className="py-4 -mx-4">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={displayedRecipes.length > 1}
        initialSlide={initialSlide}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1.5,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination]}
        className="recipe-swiper"
        style={{
          paddingBottom: '40px',
        }}
      >
        {displayedRecipes.map((recipe) => (
          <SwiperSlide key={recipe.recipeId} className="!w-[280px]">
            <RecipeCard recipe={recipe} size="large" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecipeSwiper;

