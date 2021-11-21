document.addEventListener('DOMContentLoaded', () => {
    renderCategories()
    getRecipeBtn.addEventListener('click', randomRecipe)
    searchBtn.addEventListener('click', filterCat)
})

//variables

const catContainer = document.querySelector('#catContainer')
const recipeContainer = document.querySelector('#recipeContainer')
const getRecipeBtn = document.querySelector('#getRecipe')
const searchTerm = document.querySelector('#searchTerm')
const searchBtn = document.querySelector('#searchBtn')
const modalBtn = document.querySelector('.modalBtn')
const catModal = document.querySelector('#catModal')
const fullHeart = "&#10084"
const emptyHeart = "&#9825"
const catDetails = {}

//functions and methods
//Initial fetch of API. Returns an array of length 14.
const fetchCategories = () => {
    return fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(resp => resp.json())
    .then(data => data)
    .catch(error => error)
}

//Using the data returned from fetchCategories, we render the Categories.

const renderCategories = () => {
    fetchCategories()
    .then(data => {
        data.categories.forEach((category) => {

            catDetails[category.strCategory] = category

            const catType = document.createElement('div')

            catType.className = 'catType_Card'

            catType.id = `${category.strCategory}`

            catType.innerHTML = 
            `<img src='${category.strCategoryThumb}' class='cat_image' alt='${category.strCategory}' onclick='clickCat("${category.strCategory}")'/>
            <div class='cat_menu'>
            <h2 class='cat_title'>${category.strCategory}</h2>
            <button class='modalBtn' onclick='catInfo("${category.strCategory}")'>Category Info</button>
            </div>
            `

            catContainer.append(catType)
        })
    })
}

//If user is interested in finding out information about a particular category, they can click on the category info button

const catInfo = (category) => {

    const catModal = document.querySelector('#catModal')
                    
    if(`${catDetails[category].strCategory} === ${catDetails[category].strCategoryDescription}.split("")[0]`) {
        catModal.innerHTML = `<p>${catDetails[category].strCategoryDescription}</p>
        <span id='modal_close' class='modalClose'>[close]</span>`

        if (catModal.class !== 'hidden') {
            catModal.classList.replace('hidden', 'active')

            const closeBtn = document.querySelector('#modal_close')
            closeBtn.addEventListener('click', () => {
                catModal.classList.replace('active', 'hidden')
            })
        } 
    }
}

//On clicking the categories, we create cards for each recipe within the category.

const clickCat = (category) => {

    catContainer.innerHTML = ''

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(resp => resp.json())
    .then(data => {
        data.meals.forEach((meal) => {
            const recipe = document.createElement('div')

            recipe.className = 'recipe_Card'

            recipe.id = `${meal.strMeal}`

            recipe.innerHTML = 
                `<img src='${meal.strMealThumb}' class='recipe_image' alt='${meal.strMeal}'/>
                <span id='Heart_${meal.idMeal}' class='empty' onclick='like(event)'>${emptyHeart}</span>
                <div class='recipe_menu'>
                <h2 class='recipe_title'>${meal.strMeal}</h2>
                <button id='recipeBtn' class='recipe_button' onclick='recipeDetails("${meal.idMeal}")'>Recipe details</button>
                </div>
                `
            
            catContainer.append(recipe)
        })
    })
    .catch(error => error)
}

//User clicks on buttons and the recipe renders at the top of the page

const recipeDetails = (recipe) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe}`)
    .then(resp => resp.json())
    .then(data => {
        renderRecipe(data.meals[0])
    })
    .catch(error => console.log(error))
    window.scrollTo(0,0)
}

const randomRecipe = () => {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(resp => resp.json())
    .then(data => {
        renderRecipe(data.meals[0])
    })
    .catch(error => console.log(error.message))
    window.scrollTo(0,0)
}

const renderRecipe = (recipe) => {
    const ingredients = []

    for(let i = 1; i <= 20; i++) {
        const ingredientMeasures = `${recipe[`strIngredient${i}`]} : ${recipe[`strMeasure${i}`]}`

        if (recipe[`strIngredient${i}`]) {
            ingredients.push(ingredientMeasures)
        } else {
            break
        } 
    }

    recipeContainer.innerHTML = 
         `<div class='recipe_Display'>
            <div class='recipe_display_menu'>
            <div>
            <h1>Recipe</h1>
            <p>Here is your recipe! Enjoy cooking ...</p>
            </div>
            <button id="closeRecipe" class='recipe_details_button' onClick='closeRecipe()'>Close Recipe</button>
            </div>
            <div class='recipe_details_title'>
                <div>${recipe.strCategory ? `<b>Category: </b>${recipe.strCategory}` : ""}</div> 
                <div>${recipe.strArea ? `<b>Area: </b>${recipe.strArea}` : ""}</div>
                <div>${recipe.strTags ? `<b>Tags: </b>${recipe.strTags.split(',').join(', ')}` : ""}</div>
            </div>
            <div class='recipe_details_container'>
                <div class='recipe_details_image_video'>
                    <div class='recipe_details_image'>
                        <img src='${recipe.strMealThumb}' class='recipe_image' alt='${recipe.strMeal}'/>
                    </div>
                    <div>
                        <iframe src="https://www.youtube.com/embed/${recipe.strYoutube.slice(-11)}" allowfullscreen></iframe>
                    </div>
                </div>
                <div class='recipe_details_instructions'>
                    <div class='recipe_details_ingredients'>
                        <h3>Ingredients</h3>
                        <ul>
                            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    <div class='recipe_details_preparation'>
                        <h4>${recipe.strMeal}</h4>
                        <p>${recipe.strInstructions}</p>
                    </div>
                </div>
            </div>
            <div>${recipe.strSource ? `<p><b>Image source courtesy of: </b>${recipe.strSource}</p>` : ""}</div>
    `
}

//function to close recipe

const closeRecipe = () => recipeContainer.innerHTML = ""

//User can filter recipes by searching category

const filterCat = (e) => {

    e.preventDefault()

    recipeContainer.innerHTML = ""

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm.value.toLowerCase()}`)
    .then(resp => resp.json())
    .then(data => {
        if (data.meals) {
            catContainer.innerHTML = ""
            data.meals.forEach((meal) => {

                const recipe = document.createElement('div')
    
                recipe.className = "recipe_Card"

                recipe.id = `${meal.idMeal}`
    
                recipe.innerHTML = `<img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
                <div class='recipe_menu'>
                <h2 class='recipe_title'>${meal.strMeal}</h2>
                <button id='recipeBtn' class='recipe_button' onclick='recipeDetails("${meal.idMeal}")'>Recipe details</button>
                </div>
                `
    
                catContainer.append(recipe)
            })
        } else {
            catContainer.innerHTML = ""
            const message = document.createElement('p')
            message.innerText = 'Sorry, we couldn\'t find what you were looking for.'

            catContainer.append(message)
        }
    })
    .catch(error => console.log(error.message))

    searchTerm.value = ""
}

//toggles between an empty heart and full heart when a user clicks to 'like'
const like = (e) => {
    if(e.target.className === 'empty') {
        e.target.innerHTML = fullHeart
        e.target.classList.replace('empty', 'full')
    } else {
        e.target.innerHTML = emptyHeart
        e.target.classList.replace('full', 'empty')
    }
}
