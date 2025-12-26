// 천재민: 마이페이지 메인
import { useState, useEffect } from 'react';
import { userAPI } from '../../api/user';
import RecipeCard from '../../components/RecipeCard';
import { HiExclamationCircle, HiXCircle } from 'react-icons/hi';

const MyPage = () => {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [error, setError] = useState(null);

  // 내 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await userAPI.getMyProfile();
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('프로필 로드 실패:', err);
        // 500 에러인 경우 더미 데이터 사용 (개발용)
        if (err.response?.status === 500) {
          setProfile({
            userId: 1,
            nickname: '사용자',
            email: 'user@example.com',
            allergies: [],
            dislikedIngredients: [],
            profileImage: null,
          });
          setError(null);
        } else {
          setError('프로필을 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // 찜한 레시피 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoadingFavorites(true);
        const response = await userAPI.getFavoriteRecipes();
        // 실제 응답 형식: { isSuccess, code, message, result: [...] }
        const favoritesData = response.data?.result || response.data || [];
        setFavorites(favoritesData);
      } catch (err) {
        console.error('찜한 레시피 로드 실패:', err);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>

        {/* 내 정보 섹션 */}
        <section className="mb-8">
          {isLoadingProfile ? (
            <div className="bg-gray-50 rounded-xl p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              {error}
            </div>
          ) : profile ? (
            <div className="bg-gray-50 rounded-xl p-6">
              {/* 프로필 이미지 및 닉네임 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.nickname?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {profile.nickname || '사용자'}
                  </h3>
                  {profile.email && (
                    <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
                  )}
                </div>
              </div>

              {/* 알레르기 정보 */}
              {profile.allergies && profile.allergies.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HiExclamationCircle className="text-red-500" size={18} />
                    <span className="text-sm font-semibold text-gray-700">알레르기</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 싫어하는 재료 */}
              {profile.dislikedIngredients && profile.dislikedIngredients.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiXCircle className="text-gray-600" size={18} />
                    <span className="text-sm font-semibold text-gray-700">기피 재료</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.dislikedIngredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>

        {/* 찜한 레시피 섹션 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">찜한 레시피</h2>
          
          {isLoadingFavorites ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-2xl animate-pulse h-48"
                ></div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-500">찜한 레시피가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favorites.map((favorite) => (
                <RecipeCard
                  key={favorite.recipeId}
                  recipe={{
                    recipeId: favorite.recipeId,
                    title: favorite.title,
                    mainImage: favorite.mainImage || favorite.thumbnail, // mainImage 우선 사용
                    cookTime: favorite.cookTime,
                    difficulty: favorite.difficulty,
                    isFavorite: true,
                  }}
                  size="normal"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyPage;
