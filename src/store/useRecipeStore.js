// Zustand 전역 상태 - 찜한 레시피 목록 (공유 데이터)
import { create } from 'zustand';

const useRecipeStore = create((set) => ({
  favoriteRecipes: [],

  setFavoriteRecipes: (recipes) => set({ favoriteRecipes: recipes }),

  addFavoriteRecipe: (recipe) =>
    set((state) => ({
      favoriteRecipes: [...state.favoriteRecipes, recipe],
    })),

  removeFavoriteRecipe: (recipeId) =>
    set((state) => ({
      favoriteRecipes: state.favoriteRecipes.filter(
        (recipe) => recipe.id !== recipeId
      ),
    })),
}));

export { useRecipeStore };

