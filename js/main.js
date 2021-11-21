document.addEventListener('DOMContentLoaded', () => {
    renderCategories()
})

//variables

const catContainer = document.querySelector('#catContainer')
const recipeContainer = document.querySelector('#recipeContainer')
const getRecipeBtn = document.querySelector('#getRecipe')
const searchTerm = document.querySelector('#searchTerm')
const searchBtn = document.querySelector('#searchBtn')
const modalBtn = document.querySelector('.modalBtn')
const catModal = document.querySelector('#catModal')

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