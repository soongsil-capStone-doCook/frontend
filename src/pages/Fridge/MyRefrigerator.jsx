// 이태건: 냉장고 메인 페이지
import { useUserStore } from "../../store/useUserStore";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fridgeAPI } from "../../api/fridge";
import myRefrigerator from "../../assets/images/refrigerator/myRefrigerator.png";
import testMilk from "../../assets/images/refrigerator/testMilk.png";
import testEgg from "../../assets/images/refrigerator/testEgg.png";
import testMeat from "../../assets/images/refrigerator/testMeat.png";
import { BiFridge } from "react-icons/bi";
import AddIngredientModal from "./AddIngredientModal";
import DeleteIngredientModal from "./DeleteIngredientModal";
import RefrigeratorSlotModal from "./RefrigeratorSlotModal";
import EmptyRefrigerator from "./EmptyRefrigerator";
import {
  AddIngredientButton,
  DeleteIngredientButton,
} from "./RefrigeratorButtons";
import {
  fridgeSlotPositions,
  defaultPosition,
} from "../../config/fridgeSlotPositions";

const MyRefrigerator = () => {
  const { user } = useUserStore();
  const nickname = user?.nickname || "사용자";
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // TanStack Query로 재료 목록 조회 (자동 캐싱)
  const {
    data: fridgeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fridgeItems"],
    queryFn: async () => {
      const response = await fridgeAPI.getFridgeItems();
      return response.data.items || [];
    },
    staleTime: 1000 * 60 * 5, // 5분간 신선한 상태 유지
  });

  const items = fridgeData || [];

  // 재료 추가 Mutation
  const addIngredientMutation = useMutation({
    mutationFn: async (ingredientsData) => {
      console.log("=== 재료 추가 - 백엔드로 전송될 데이터 ===");

      // 단일 재료인 경우
      if (ingredientsData.length === 1) {
        console.log("엔드포인트: POST /fridge");
        console.log("Request Body:", ingredientsData[0]);
        const response = await fridgeAPI.addIngredient(ingredientsData[0]);
        console.log("재료 추가 성공:", response.data);
        return response.data;
      }
      // 다중 재료인 경우
      else {
        console.log("엔드포인트: POST /fridge/batch");
        console.log("Request Body:", { items: ingredientsData });
        const response = await fridgeAPI.addBatchIngredients(ingredientsData);
        console.log("다중 재료 추가 성공:", response.data);
        return response.data;
      }
    },
    onSuccess: () => {
      // 캐시 무효화 및 재조회
      queryClient.invalidateQueries({ queryKey: ["fridgeItems"] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("재료 추가 실패:", error);
      alert("재료 추가에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 모달에서 재료 추가 처리
  const handleAddIngredient = (ingredientsData) => {
    addIngredientMutation.mutate(ingredientsData);
  };

  // 재료 목록 새로고침 (삭제 후 사용)
  const refreshItems = () => {
    queryClient.invalidateQueries({ queryKey: ["fridgeItems"] });
  };

  console.log("현재 보유 식재로: ", items);

  // useMemo로 isEmpty 메모이제이션
  const isEmpty = useMemo(
    () => !isLoading && items.length === 0,
    [isLoading, items.length]
  );

  if (error) {
    console.error("재료 목록 조회 실패:", error);
  }

  return (
    <div className="min-h-screen relative">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {nickname}님의 냉장고
            </h1>
            <BiFridge className="mt-4 text-blue-600" size={32} />
          </div>
          {!isEmpty && (
            <div className="flex flex-col gap-2 mt-2">
              <AddIngredientButton onClick={() => setIsModalOpen(true)} />
              <DeleteIngredientButton
                onClick={() => setIsDeleteModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full relative">
        {/* 냉장고 이미지 */}
        <img
          src={myRefrigerator}
          alt="myRefrigerator"
          className={`w-full h-auto object-contain min-h-[800px] object-fill ${
            isEmpty ? "blur-sm opacity-50" : ""
          }`}
        />

        {/* 재료 이미지들 - fridgeSlot에 따라 배치 */}
        {!isEmpty &&
          items.map((item) => {
            const position =
              fridgeSlotPositions[item.fridgeSlot] || defaultPosition;

            // 같은 fridgeSlot을 가진 재료들의 인덱스 계산
            const sameSlotItems = items.filter(
              (i) => i.fridgeSlot === item.fridgeSlot
            );
            const itemIndexInSlot = sameSlotItems.findIndex(
              (i) => i.id === item.id
            );

            // 최대 2개까지만 UI에 렌더링 (인덱스 0, 1만 표시)
            if (itemIndexInSlot > 1) {
              return null; // 3번째부터는 UI에 렌더링하지 않음 -> 넘칠 우려 방지
            }

            // left 값 계산: 기본 위치 + (인덱스 * 10%)
            const baseLeft = parseFloat(position.left);
            const adjustedLeft = baseLeft + itemIndexInSlot * 12;

            // 실제 백엔드 연동 시 item.imageUrl 사용, 현재는 이름에 따라 이미지 선택
            const getImageUrl = () => {
              if (item.imageUrl) return item.imageUrl;
              if (item.name === "계란_테스트") return testEgg;
              if (item.name === "우유_테스트") return testMilk;
              if (item.name === "고기_테스트") return testMeat;
              return testMilk; // 기본값
            };
            const imageUrl = getImageUrl();

            const handleItemClick = () => {
              console.log("=== 재료 클릭 - 백엔드로 전송될 데이터 ===");
              console.log("선택된 재료:", item);

              // PATCH 요청 데이터
              console.log("\n[PATCH 요청]");
              console.log("엔드포인트: PATCH /fridge/{ingredientId}");
              console.log("Path Parameter:");
              console.log(`  ingredientId: ${item.id}`);
              console.log("Request Body:");
              const patchData = {
                id: item.id,
                name: item.name,
                quantity: item.quantity || null,
                category: item.storageCategory || null,
                expiryDate: item.expiryDate || null,
                inputMethod: item.inputMethod || "MANUAL",
              };
              console.log("  ", patchData);

              // 해당 위치의 재료 목록 모달 열기
              setSelectedSlot(item.fridgeSlot);
              setIsSlotModalOpen(true);
            };

            return (
              <img
                key={item.id}
                src={imageUrl}
                alt={item.name}
                className="absolute w-12 h-12 object-contain z-20 cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  top: position.top,
                  left: `${adjustedLeft}%`,
                  transform: "translate(-50%, -50%)", // 중앙 정렬
                }}
                title={item.name} // 호버 시 이름 표시
                onClick={handleItemClick}
              />
            );
          })}

        {/* 빈 상태 메시지 */}
        {isEmpty && (
          <EmptyRefrigerator onAddClick={() => setIsModalOpen(true)} />
        )}
      </div>

      {/* 재료 추가 모달 */}
      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddIngredient}
      />

      {/* 재료 삭제 모달 */}
      <DeleteIngredientModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteSuccess={refreshItems}
      />

      {/* 냉장고 칸별 재료 목록 모달 */}
      <RefrigeratorSlotModal
        isOpen={isSlotModalOpen}
        onClose={() => {
          setIsSlotModalOpen(false);
          setSelectedSlot(null);
        }}
        fridgeSlot={selectedSlot}
        items={items}
      />
    </div>
  );
};

export default MyRefrigerator;
