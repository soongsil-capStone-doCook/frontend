// 천재민: OCR 인식 결과 표시 컴포넌트
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { fridgeAPI } from "../../api/fridge";
import {
  FaCheck,
  FaTimes,
  FaBoxOpen,
  FaChevronRight,
  FaRegImage,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const ReceiptInformation = ({
  ocrResults,
  imagePreview,
  onIngredientDelete,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState(ocrResults?.saved || []);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // 같은 이름의 재료 그룹화
  const groupedIngredients = ingredients.reduce((acc, item) => {
    const existing = acc.find(
      (g) => g.name === item.name && g.fridgeSlot === item.fridgeSlot
    );
    if (existing) {
      existing.count += 1;
      existing.ids.push(item.id);
    } else {
      acc.push({
        ...item,
        count: 1,
        ids: [item.id],
      });
    }
    return acc;
  }, []);

  // 냉장고 칸 한글 변환
  const getFridgeSlotName = (slot) => {
    const slotMap = {
      MAIN_SHELF_1: "냉장실 상단 선반",
      MAIN_SHELF_2: "냉장실 중단 선반",
      MAIN_SHELF_3: "냉장실 하단 선반",
      CRISPER_DRAWER: "야채/과일 서랍",
      FREEZER_TOP: "냉동실 칸",
      DOOR_SHELF_1: "문쪽 상단",
      DOOR_SHELF_2: "문쪽 중단",
      DOOR_SHELF_3: "문쪽 중단",
      DOOR_SHELF_4: "문쪽 하단",
    };
    return slotMap[slot] || slot;
  };

  // 개별 재료 삭제 (그룹의 모든 재료 삭제)
  const handleDeleteIngredient = async (ingredientIds) => {
    // ingredientIds가 배열인지 확인, 아니면 배열로 변환
    const idsToDelete = Array.isArray(ingredientIds)
      ? ingredientIds
      : [ingredientIds];

    // 이미 삭제 중인지 확인
    if (idsToDelete.some((id) => deletingIds.has(id))) return;

    // 모든 ID를 삭제 중 목록에 추가
    setDeletingIds((prev) => {
      const newSet = new Set(prev);
      idsToDelete.forEach((id) => newSet.add(id));
      return newSet;
    });

    try {
      // 모든 재료 삭제
      await Promise.all(
        idsToDelete.map((id) => fridgeAPI.deleteIngredient(id))
      );

      // 로컬 상태에서 제거
      setIngredients((prev) =>
        prev.filter((item) => !idsToDelete.includes(item.id))
      );

      if (onIngredientDelete) {
        idsToDelete.forEach((id) => onIngredientDelete(id));
      }
    } catch (error) {
      console.error("재료 삭제 실패:", error);
      alert("재료 삭제에 실패했습니다.");
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        idsToDelete.forEach((id) => newSet.delete(id));
        return newSet;
      });
    }
  };

  // 냉장고로 이동
  const handleGoToFridge = () => {
    // React Query 캐시 무효화 → 냉장고 페이지에서 최신 데이터 다시 불러옴
    queryClient.invalidateQueries({ queryKey: ["fridgeItems"] });
    navigate("/refrigerator");
  };

  // 이미지 확대 모달
  const ImageModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsImageModalOpen(false)}
    >
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <button
          onClick={() => setIsImageModalOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg z-10"
        >
          <FaTimes className="text-gray-800 text-lg" />
        </button>
        <img
          src={imagePreview}
          alt="영수증 확대"
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );

  if (!ocrResults || !ingredients) {
    return null;
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* 영수증 이미지 (간단하게) */}
      {imagePreview && (
        <div className="animate-fadeIn">
          <div
            className="relative bg-gray-100 rounded-xl overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-300 border-2 border-gray-200 hover:border-slate-300"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img
              src={imagePreview}
              alt="영수증"
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <FaRegImage className="text-gray-700 text-lg" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
              클릭하여 확대
            </div>
          </div>
        </div>
      )}

      {/* 성공 헤더 */}
      <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <FaCheck className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              영수증 인식 완료!
            </h2>
            <p className="text-sm text-gray-600">
              {ingredients.length}개의 재료가 냉장고에 추가되었어요
            </p>
          </div>
        </div>
      </div>

      {/* 인식된 재료 목록 */}
      <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-2 mb-3">
          <FaBoxOpen className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">저장된 재료</h3>
        </div>

        {groupedIngredients.length > 0 ? (
          <div className="space-y-2">
            {groupedIngredients.map((item, index) => (
              <div
                key={item.ids[0]}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all duration-300 animate-slideInLeft"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-linear-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <FaBoxOpen className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      {item.count > 1 && (
                        <span className="text-sm font-bold text-blue-600">
                          x{item.count}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {item.fridgeSlot && (
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                          {getFridgeSlotName(item.fridgeSlot)}
                        </span>
                      )}
                      {item.quantity && (
                        <span className="text-xs text-gray-500">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDeleteIngredient(item.ids)}
                  disabled={item.ids.some((id) => deletingIds.has(id))}
                  className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="재료 삭제"
                >
                  {item.ids.some((id) => deletingIds.has(id)) ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaTimes className="text-sm" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <FaBoxOpen className="text-gray-400 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">모든 재료가 삭제되었습니다.</p>
          </div>
        )}
      </div>

      {/* 냉장고 확인하기 버튼 */}
      <button
        onClick={handleGoToFridge}
        className="w-full py-4 bg-slate-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fadeIn"
        style={{ animationDelay: "0.2s" }}
      >
        <span>냉장고 확인하기</span>
        <FaChevronRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* 이미지 확대 모달 */}
      {isImageModalOpen && <ImageModal />}

      {/* 커스텀 애니메이션 스타일 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReceiptInformation;
