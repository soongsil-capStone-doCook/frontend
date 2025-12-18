import RecipeCard from './RecipeCard';

const RecipeGrid = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-2xl animate-pulse h-48"
          ></div>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>레시피가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {recipes.slice(0, 6).map((recipe) => (
        <RecipeCard key={recipe.recipeId} recipe={recipe} size="normal" />
      ))}
    </div>
  );
};

export default RecipeGrid;

