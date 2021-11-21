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