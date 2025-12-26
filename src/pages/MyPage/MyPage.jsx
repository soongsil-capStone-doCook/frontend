// 천재민: 마이페이지 메인
import { useState, useEffect } from 'react';
import { userAPI } from '../../api/user';
import RecipeCard from '../../components/RecipeCard';
import { HiExclamationCircle, HiXCircle, HiPencil } from 'react-icons/hi';

const MyPage = () => {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [error, setError] = useState(null);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 내 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await userAPI.getMyProfile();
        // 실제 응답 형식: { isSuccess, code, message, result: {...} }
        const profileData = response.data?.result || response.data;
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error('프로필 로드 실패:', err);
        // 500 에러인 경우 더미 데이터 사용 (개발용)
        if (err.response?.status === 500) {
          setProfile({
            memberId: 1,
            nickname: '사용자',
            email: 'user@example.com',
            profileImageUrl: null,
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
        // 실제 응답 형식: { isSuccess, code, message, result: { scrapList: [...] } }
        let favoritesData = [];
        
        if (Array.isArray(response.data)) {
          // 배열 직접 반환
          favoritesData = response.data;
        } else if (response.data?.result) {
          if (Array.isArray(response.data.result)) {
            // result가 배열인 경우
            favoritesData = response.data.result;
          } else if (Array.isArray(response.data.result.scrapList)) {
            // result.scrapList가 배열인 경우
            favoritesData = response.data.result.scrapList;
          }
        }
        
        setFavorites(favoritesData);
      } catch (err) {
        console.error('찜한 레시피 로드 실패:', err);
        setFavorites([]);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);

  // 알레르기 및 기피 재료 수정
  const handleUpdatePreferences = async (formData) => {
    try {
      setIsSaving(true);
      const parseArray = (str) => {
        if (!str || str.trim() === '') return [];
        return str
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      };

      const transformedData = {
        allergies: parseArray(formData.allergies),
        dislikedIngredients: parseArray(formData.dislikedIngredients),
      };

      await userAPI.updatePreferences(transformedData);
      
      // 프로필 다시 불러오기
      const response = await userAPI.getMyProfile();
      const profileData = response.data?.result || response.data;
      setProfile(profileData);
      
      setIsPreferencesModalOpen(false);
      alert('설정이 저장되었습니다.');
    } catch (err) {
      console.error('설정 저장 실패:', err);
      alert('설정 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

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
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {profile.nickname || '사용자'}
                  </h3>
                  {profile.email && (
                    <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
                  )}
                </div>
                <button
                  onClick={() => setIsPreferencesModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <HiPencil size={16} />
                  <span>수정</span>
                </button>
              </div>

              {/* 알레르기 정보 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <HiExclamationCircle className="text-red-500" size={18} />
                  <span className="text-sm font-semibold text-gray-700">알레르기</span>
                </div>
                {profile.allergies && profile.allergies.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">등록된 알레르기 정보가 없습니다.</p>
                )}
              </div>

              {/* 싫어하는 재료 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <HiXCircle className="text-gray-600" size={18} />
                  <span className="text-sm font-semibold text-gray-700">기피 재료</span>
                </div>
                {profile.dislikedIngredients && profile.dislikedIngredients.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">등록된 기피 재료가 없습니다.</p>
                )}
              </div>
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
          ) : !favorites || !Array.isArray(favorites) || favorites.length === 0 ? (
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
                    mainImage: favorite.mainImage || favorite.thumbnailUrl || favorite.thumbnail,
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

      {/* 알레르기 및 기피 재료 수정 모달 */}
      {isPreferencesModalOpen && (
        <PreferencesModal
          profile={profile}
          onClose={() => setIsPreferencesModalOpen(false)}
          onSave={handleUpdatePreferences}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

// 알레르기 및 기피 재료 수정 모달 컴포넌트
const PreferencesModal = ({ profile, onClose, onSave, isSaving }) => {
  const [allergies, setAllergies] = useState(
    profile?.allergies?.join(', ') || ''
  );
  const [dislikedIngredients, setDislikedIngredients] = useState(
    profile?.dislikedIngredients?.join(', ') || ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      allergies,
      dislikedIngredients,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">알레르기 및 기피 재료 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiXCircle size={24} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 알레르기 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              알레르기 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="예: 새우, 땅콩, 우유"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              여러 개의 알레르기를 쉼표(,)로 구분하여 입력하세요.
            </p>
          </div>

          {/* 기피 재료 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              기피 재료 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={dislikedIngredients}
              onChange={(e) => setDislikedIngredients(e.target.value)}
              placeholder="예: 오이, 고수, 파인애플"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              여러 개의 기피 재료를 쉼표(,)로 구분하여 입력하세요.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;
