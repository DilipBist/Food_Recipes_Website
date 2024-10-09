const searchBox = document.querySelector('.search_box');
const searchBtn = document.querySelector('.search_btn');
const recipeContainer = document.querySelector('.recipe_container');
const fetchHeading = document.querySelector('.fetch_heading');
const recipeCloseBtn = document.querySelector('.recipe_close_btn');
const recipeIngradients = document.querySelector('.recipe_ingradients');


window.addEventListener('scroll', () => {
    const navBar = document.querySelector('nav');

    if (window.scrollY > 100) {
        navBar.classList.add('fixed');
    } else {
        navBar.classList.remove('fixed');
    }
});

// function to get the recipies from the api 
const fetchRecipies = async (query) => {
    fetchHeading.innerHTML = "fetching data..."

    try {
        // clear the previous result    
        recipeContainer.innerHTML = "";

        let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        let response = await data.json();

        fetchHeading.innerHTML = "";

        response.meals.forEach(meal => {
            console.log(meal);
            let recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe_details');
            recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" >
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `
            // adding the button 
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);
            // addEventListener to button 
            button.addEventListener('click', () => {
                recipeIngrediantDetail.style.display = 'block';
                openRecipePopup(meal);
            });
            recipeCloseBtn.addEventListener('click', () => {
                recipeIngrediantDetail.style.display = 'none';
            })
            recipeContainer.appendChild(recipeDiv);

        });
        // console.log(response.meals[0]);
    }
    catch (error) {
        fetchHeading.innerHTML = `error in fetching recipies
        <img src="https://static.vecteezy.com/system/resources/thumbnails/021/975/488/small/search-not-found-3d-render-icon-illustration-with-transparent-background-empty-state-png.png" >
        `;
        console.error("Error fetching data:", error);
    }
}

window.addEventListener("load", () =>{
    const defaultSearch = "cake";
    fetchRecipies(defaultSearch);
})

const recipeIngrediantDetail = document.querySelector('.recipe_ingrediant_detail');
recipeIngrediantDetail.style.display = 'none';

// fetching the ingrediants 
const fetchIngrediants = (meal) => {
    let ingrediantList = "";
    for (i = 1; i <= 20; i++) {
        const ingrediant = meal[`strIngredient${i}`];
        if (ingrediant) {
            const measure = meal[`strMeasure${i}`];
            ingrediantList += `<li> ${measure} ${ingrediant}</li>`
        }
        else {
            break;
        }
    }
    return ingrediantList;
}
const openRecipePopup = (meal) => {
    recipeIngradients.innerHTML = `
    <h1>${meal.strMeal}</h1>
    <ul>
    <h3>Ingredients</h3>
    ${fetchIngrediants(meal)}
     </ul>
     <h3>Instruction Details </h3>
     <p>${meal.strInstructions}</p>
    `

};
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission (refreshing)
    const searchInput = searchBox.value.trim(); // Trim to remove extra spaces
    if (!searchInput) {
        fetchHeading.textContent = "please enter the recipe that you want to search...";
        return;
    }
    fetchRecipies(searchInput);
    // console.log("Button Clicked");   
})