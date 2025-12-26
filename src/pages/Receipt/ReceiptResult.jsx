// 천재민: OCR 영수증 인식 결과 페이지
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaBoxOpen, FaSearchPlus } from "react-icons/fa";
import { HiCheckCircle, HiX } from "react-icons/hi";
import { fridgeAPI } from "../../api/fridge";

const ReceiptResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ocrResults, imagePreview } = location.state || {};
  const [showImageModal, setShowImageModal] = useState(false);
  const [deletedItems, setDeletedItems] = useState(new Set());
  const [deletingItems, setDeletingItems] = useState(new Set());

  // 데이터가 없으면 영수증 페이지로 리다이렉트
  if (!ocrResults) {
    navigate("/receipt");
    return null;
  }

  const { saved = [] } = ocrResults;

  // 삭제되지 않은 재료만 필터링
  const activeItems = saved.filter((item) => !deletedItems.has(item.id));

  const handleGoToFridge = () => {
    navigate("/refrigerator");
  };

  const handleTakeAnother = () => {
    navigate("/receipt");
  };

  // 개별 재료 삭제 (확인창 없이 바로 삭제)
  const handleDeleteItem = async (item) => {
    // 삭제 중 상태 추가
    setDeletingItems((prev) => new Set(prev).add(item.id));

    try {
      await fridgeAPI.deleteIngredient(item.id);
      // 삭제 성공 시 목록에서 제거
      setDeletedItems((prev) => new Set(prev).add(item.id));
    } catch (error) {
      console.error("재료 삭제 실패:", error);
      alert("재료 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // 삭제 중 상태 제거
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 성공 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <HiCheckCircle className="text-white text-5xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">인식 완료!</h1>
          <p className="text-sm text-gray-600">
            {activeItems.length}개의 재료를 냉장고에 추가했어요
          </p>
        </div>

        {/* 영수증 미리보기 (클릭하면 확대) */}
        {imagePreview && (
          <div className="mb-6">
            <div
              onClick={() => setShowImageModal(true)}
              className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow group"
            >
              <img
                src={imagePreview}
                alt="영수증"
                className="w-full h-48 object-cover"
              />
              {/* 확대 아이콘 오버레이 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <FaSearchPlus className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-gray-700 font-medium">
                클릭하여 확대
              </div>
            </div>
          </div>
        )}

        {/* 이미지 확대 모달 */}
        {showImageModal && imagePreview && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <HiX className="text-2xl" />
            </button>
            <img
              src={imagePreview}
              alt="영수증 전체보기"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* 저장된 재료 목록 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaBoxOpen className="text-green-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">저장된 재료</h2>
            <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {activeItems.length}개
            </span>
          </div>

          {activeItems.length > 0 ? (
            <div className="space-y-3">
              {activeItems.map((item) => {
                const isDeleting = deletingItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all ${
                      isDeleting ? "opacity-50" : "hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {item.name}
                        </h3>
                        {item.quantity && (
                          <span className="text-sm text-gray-500 shrink-0">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <FaCheck className="text-green-500 text-xl" />
                        <button
                          onClick={() => handleDeleteItem(item)}
                          disabled={isDeleting}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          title="삭제"
                        >
                          <HiX className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                {saved.length > 0
                  ? "모든 재료를 삭제했습니다."
                  : "저장된 재료가 없습니다."}
              </p>
            </div>
          )}
        </div>

        {/* 배치 요약 */}
        <div className="mb-6 bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {activeItems.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                현재 냉장고에 추가됨
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400 mb-1">
                {saved.length - activeItems.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                삭제된 재료
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="space-y-3">
          <button
            onClick={handleGoToFridge}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg transition-all shadow-md hover:bg-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <FaCheck />
            <span>냉장고 확인하기</span>
          </button>

          <button
            onClick={handleTakeAnother}
            className="w-full py-3 bg-white text-gray-700 rounded-xl font-medium border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            다른 영수증 인식하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptResult;
