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
import { getFoodImageUrl } from "./foodNameMapping";

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
          (() => {
            // 같은 이름 + 같은 위치의 재료 그룹화
            const groupedItems = items.reduce((acc, item) => {
              const key = `${item.name}_${item.fridgeSlot}`;
              if (!acc[key]) {
                acc[key] = { ...item, count: 1 };
              } else {
                acc[key].count += 1;
              }
              return acc;
            }, {});

            // 각 슬롯별로 재료 배치
            const groupedBySlot = Object.values(groupedItems).reduce(
              (acc, item) => {
                if (!acc[item.fridgeSlot]) {
                  acc[item.fridgeSlot] = [];
                }
                acc[item.fridgeSlot].push(item);
                return acc;
              },
              {}
            );

            return Object.values(groupedBySlot).flatMap((slotItems) =>
              slotItems.slice(0, 3).map((item, index) => {
                const position =
                  fridgeSlotPositions[item.fridgeSlot] || defaultPosition;

                // left 값 계산: 기본 위치 + (인덱스 * 10%)
                const baseLeft = parseFloat(position.left);
                const adjustedLeft = baseLeft + index * 10;

                // S3 이미지 URL 생성
                const getImageUrl = () => {
                  // 테스트용 이미지
                  if (item.name === "계란_테스트") return testEgg;
                  if (item.name === "우유_테스트") return testMilk;
                  if (item.name === "고기_테스트") return testMeat;

                  // S3 URL 생성 (foodNameMapping.js 사용)
                  return getFoodImageUrl(item.name, item.imageUrl);
                };
                const imageUrl = getImageUrl();

                const handleItemClick = () => {
                  console.log("=== 재료 클릭 - 백엔드로 전송될 데이터 ===");
                  console.log("선택된 재료:", item);

                  // 해당 위치의 재료 목록 모달 열기
                  setSelectedSlot(item.fridgeSlot);
                  setIsSlotModalOpen(true);
                };

                // 문쪽 재료인지 확인
                const isDoorShelf = item.fridgeSlot?.includes("DOOR_SHELF");

                return (
                  <div
                    key={`${item.id}_${index}`}
                    className={`absolute cursor-pointer transition-all ${
                      isDoorShelf ? "z-10" : "z-20"
                    }`}
                    style={{
                      top: position.top,
                      left: `${adjustedLeft}%`,
                      transform: isDoorShelf 
                        ? "translate(-50%, -50%) scale(0.85)" 
                        : "translate(-50%, -50%)",
                      opacity: isDoorShelf ? 0.7 : 1,
                      filter: isDoorShelf ? "brightness(0.9) blur(0.3px)" : "none",
                    }}
                    onClick={handleItemClick}
                  >
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-contain hover:opacity-80 transition-opacity"
                        title={item.name}
                      />
                      {item.count > 1 && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                          {item.count}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            );
          })()}

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
