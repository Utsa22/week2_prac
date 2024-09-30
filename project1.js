const loadMealsByName = (searchValue) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } 
            else {
                displayNotFound();
            }
        })
};

const displayMeals = (meals) => {
    const mealContainer = document.getElementById('meal-container');
    mealContainer.innerHTML = '';
    meals.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `
            <div class="card">
                <img src="${meal.strMealThumb || 'https://via.placeholder.com/100'}" class="card-img-top" alt="Meal Image">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal || 'No Name'}</h5>
                    <p class="card-text">Category: ${meal.strCategory || 'Not Available'}</p>
                    <p class="card-text">Cuisine: ${meal.strArea || 'Not Available'}</p>
                    <button class="btn btn-primary" onclick="showMealDetails(${meal.idMeal})" data-bs-toggle="modal" data-bs-target="#mealModal">Details</button>
                </div>
            </div>
        `;
        mealContainer.appendChild(div);
    });
};

const displayNotFound = () => {
    const mealContainer = document.getElementById('meal-container');
    mealContainer.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('col-12', 'text-center', 'mt-5');
    div.innerHTML = `
        <h3>No meals found for this search term.</h3>
        <p>Please try searching for another meal.</p>
    `;
    mealContainer.appendChild(div);
};

const showMealDetails = (mealId) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            document.getElementById('modal-body').innerHTML = `
                <img src="${meal.strMealThumb}" class="img-fluid" alt="Meal Image">
                <h5>${meal.strMeal}</h5>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Cuisine:</strong> ${meal.strArea}</p>
                <p><strong>Instructions:</strong> ${meal.strInstructions.slice(0, 100)}...</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            `;
        })
        .catch(err => {
            console.log('Error fetching meal details:', err);
        });
};
const getIngredients = (meal) => {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }
    return ingredients;
};

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('search-input').value;
    loadMealsByName(searchValue);
});

loadDefaultMeals();
