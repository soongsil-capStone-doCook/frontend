// 이태건: 냉장고 칸별 재료 목록 모달
import { FaTimes } from "react-icons/fa";

// fridgeSlot을 한글 이름으로 변환
const getSlotName = (fridgeSlot) => {
  const slotNames = {
    MAIN_SHELF_1: "냉장실 윗 선반",
    MAIN_SHELF_2: "냉장실 가운데 선반",
    MAIN_SHELF_3: "냉장실 아랫 선반",
    CRISPER_DRAWER: "야채/과일 서랍",
    FREEZER_TOP: "냉동칸",
    DOOR_SHELF_1: "문쪽 맨 위",
    DOOR_SHELF_2: "문쪽 2번째",
    DOOR_SHELF_3: "문쪽 3번째",
    DOOR_SHELF_4: "문쪽 맨 아래",
  };
  return slotNames[fridgeSlot] || fridgeSlot;
};

const RefrigeratorSlotModal = ({ isOpen, onClose, fridgeSlot, items }) => {
  if (!isOpen || !fridgeSlot) return null;

  // 해당 위치의 재료만 필터링
  const slotItems = items.filter((item) => item.fridgeSlot === fridgeSlot);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[scaleUp_0.3s_ease-out] max-h-[80vh] overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {getSlotName(fridgeSlot)}
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {slotItems.length > 0
              ? `${slotItems.length}개의 재료가 있습니다`
              : "재료가 없습니다"}
          </p>
        </div>

        {/* 재료 목록 */}
        {slotItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">이 위치에 재료가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {slotItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg">
                    {item.name}
                  </p>
                  {item.quantity && (
                    <p className="text-sm text-gray-600 mt-1">
                      수량: {item.quantity}
                    </p>
                  )}
                  {item.storageCategory && (
                    <p className="text-xs text-gray-400 mt-1">
                      카테고리: {item.storageCategory}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
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
  );
};

export default RefrigeratorSlotModal;
