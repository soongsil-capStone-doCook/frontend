// 이태건: 재료 삭제 모달
import { useState, useEffect } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { fridgeAPI } from "../../api/fridge";
import DeletingLoadingOverlay from "./DeletingLoadingOverlay";

const DeleteIngredientModal = ({ isOpen, onClose, onDeleteSuccess }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // 재료 목록 조회
  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fridgeAPI.getFridgeItems();
      setItems(response.data.items || []);
    } catch (error) {
      console.error("재료 목록 조회 실패:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 재료 삭제
  const handleDelete = async (ingredientId) => {
    if (!window.confirm("정말 이 재료를 삭제하시겠습니까?")) {
      return;
    }

    try {
      console.log("=== 재료 삭제 - 백엔드로 전송될 데이터 ===");
      console.log("엔드포인트: DELETE /fridge/{ingredientId}");
      console.log("Path Parameter:");
      console.log(`  ingredientId: ${ingredientId}`);

      setDeletingId(ingredientId);
      await fridgeAPI.deleteIngredient(ingredientId); // 재료 삭제 연동
      // 목록에서 제거
      setItems(items.filter((item) => item.id !== ingredientId));
      // 성공 콜백 호출
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("재료 삭제 실패:", error);
      alert("재료 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeletingId(null);
    }
  };

  // 모든 재료 삭제
  const handleDeleteAll = async () => {
    if (!window.confirm("정말 모든 재료를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeletingAll(true); // 전체 삭제 로딩 시작

      // 모든 재료 ID를 순차적으로 삭제
      for (const item of items) {
        await fridgeAPI.deleteIngredient(item.id);
      }
      setItems([]);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      alert("모든 재료가 삭제되었습니다.");
      onClose(); // 삭제 완료 후 모달 닫기
    } catch (error) {
      console.error("전체 삭제 실패:", error);
      alert("일부 재료 삭제에 실패했습니다. 다시 시도해주세요.");
      // 실패 시 다시 목록 불러오기
      fetchItems();
    } finally {
      setIsDeletingAll(false); // 전체 삭제 로딩 종료
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* 배경 오버레이 */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={onClose}
        />

        {/* 모달 컨텐츠 */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[scaleUp_0.3s_ease-out] max-h-[80vh] overflow-y-auto">
          {/* 우측 상단 버튼들 */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            {/* 모두 삭제 버튼 (작게) */}
            {items.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <FaTrash size={10} />
                <span>모두 삭제</span>
              </button>
            )}
          </div>

          {/* 헤더 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              재료 삭제
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              삭제할 재료를 선택해주세요
            </p>
          </div>

          {/* 재료 목록 */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">재료 목록을 불러오는 중...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 font-semibold">
                냉장고가 텅텅 비어있습니다
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    {item.quantity && (
                      <p className="text-sm text-gray-500">{item.quantity}</p>
                    )}
                    {item.storageCategory && (
                      <p className="text-xs text-gray-400 mt-1">
                        {item.storageCategory}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="ml-3 bg-red-500 hover:bg-red-600 active:bg-red-700 
                  text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 
                  shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash size={14} />
                    <span className="text-xs">
                      {deletingId === item.id ? "삭제 중..." : "삭제"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 닫기 버튼 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 애니메이션 스타일 */}
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      </div>

      {/* 전체 삭제 로딩 오버레이 */}
      <DeletingLoadingOverlay isOpen={isDeletingAll} />
    </>
  );
};

export default DeleteIngredientModal;
