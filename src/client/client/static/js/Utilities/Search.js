import navigateTo from '../index.js';

document.getElementById("search-btn").addEventListener("click", () => {
    navigateTo('/search/' + document.getElementById("searchText").value);
})