document.addEventListener('DOMContentLoaded', () => {
    
})


//functions and methods
//Initial fetch of API. Returns an array of length 14.
const fetchCategories = () => {
    return fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(resp => resp.json())
    .then(data => data)
    .catch(error => error)
}