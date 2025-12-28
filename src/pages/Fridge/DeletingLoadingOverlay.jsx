// 이태건: 전체 삭제 로딩 오버레이 컴포넌트
const DeletingLoadingOverlay = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-2xl animate-scaleUp">
        {/* 로딩 스피너 */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        </div>

        {/* 메시지 */}
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 mb-2">
            냉장고를 비우고 있습니다..
          </p>
          <p className="text-sm text-gray-500">
            잠시만 기다려주세요
          </p>
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
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeletingLoadingOverlay;

