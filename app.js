const apiKey = 'daee72f0b09f4352b69f87b8e2e8571f';

document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length >= 3) searchRecipes(query);
});

function searchRecipes(query) {
  fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`)
    .then(response => response.json())
    .then(data => displayRecipes(data.results))
    .catch(error => console.error('Error:', error));
}

function displayRecipes(recipes) {
  const container = document.getElementById('recipesContainer');
  container.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>Preparation time: ${recipe.readyInMinutes} mins</p>
    </div>
  `).join('');
}

function showRecipeDetails(id) {
  fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(recipe => {
      const modal = document.getElementById('recipeModal');
      const details = `
        <h2>${recipe.title}</h2>
        <p>${recipe.summary}</p>
        <h3>Ingredients</h3>
        <ul>${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
        <h3>Instructions</h3>
        <p>${recipe.instructions}</p>
        <button onclick="addFavorite(${id})">Add to Favorites</button>
      `;
      document.getElementById('recipeDetails').innerHTML = details;
      modal.style.display = 'block';
    })
    .catch(error => console.error('Error:', error));
}

function addFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Added to favorites!');
  }
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('recipeModal').style.display = 'none';
});
