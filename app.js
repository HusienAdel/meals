const date = document.querySelector("#date");

date.innerHTML = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

const mealList = document.querySelector("#mealsList");
const alphabet = document.querySelector(".alphabet");
let choseChar, results, apiUrl;

const count = document.querySelector(".count");
const loader = document.querySelector("#loader");

let searchText;
let SearchApi = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
const searchForm = document.querySelector("#searchMeals form");
const searchresultCount = document.querySelector(".searchResults");

searchForm.addEventListener("submit", searchResults);

async function searchResults(e) {
    e.preventDefault();
    searchText = document.querySelector("#search").value;
    let SearchApi = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;

    const searchReuslts = await fetch(SearchApi);

    try {
        const searchData = await searchReuslts.json();

        loaderShow();

        displaySearchResults(searchData);
        loaderHide();
    } catch (err) {
        console.log(err);
    }
}

function displaySearchResults(data) {
    mealList.innerHTML = ``;

    searchresultCount.innerHTML = `
found : ${data.meals.length} reslut`;

    if (data.meals) {
        data.meals.forEach((item) => {
            buildSearchUI(item);
        });
    } else {
        alert("no data found");
    }

    searchForm.reset();
}

function buildSearchUI(item) {
    mealList.classList.add("searchGrid");

    const itemResult = document.createElement("div");
    itemResult.classList.add("itemResult");
    const resultImg = document.createElement("img");
    resultImg.setAttribute("src", item.strMealThumb);
    const resultHeading = document.createElement("h1");
    resultHeading.textContent = item.strMeal;
    const resultInstructions = document.createElement("span");
    resultInstructions.textContent = item.strInstructions;
    const resultvideo = document.createElement("a");
    resultvideo.setAttribute("href", item.strYoutube);

    itemResult.appendChild(resultImg);
    itemResult.appendChild(resultHeading);
    itemResult.appendChild(resultInstructions);
    resultvideo.textContent = "youtube video";
    resultvideo.setAttribute("target", "_blank");
    itemResult.appendChild(resultvideo);
    mealList.appendChild(itemResult);
}

function loaderShow() {
    loader.hidden = false;
}

function loaderHide() {
    loader.hidden = true;
}

alphabet.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.nodeName === "LI") {
        e.target.parentElement
            .querySelectorAll("li")
            .forEach((li) => li.classList.remove("highLight"));

        e.target.classList.add("highLight");

        choseChar = e.target.textContent;

        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${choseChar}`;

        getResults();
    }
});

async function getResults() {
    let respone = await fetch(apiUrl);

    try {
        results = await respone.json();
        count.textContent = results.meals.length;

        if (results.meals !== null) {
            displayReults();
        } else {
            mealList.innerHTML = `
            <h2 class="headingCenter">Sorry there is not content here</h2>
            `;
        }
    } catch (err) {
        console.log(err, "failed to get result");
    }
}

function displayReults() {
    mealList.innerHTML = "";

    results.meals.forEach((result) => {
        const meal = document.createElement("div");
        const mealTitle = document.createElement("h3");
        const mealImg = document.createElement("img");

        meal.classList.add("meal");
        mealTitle.textContent = result.strMeal;
        meal.appendChild(mealTitle);
        mealImg.setAttribute("src", result.strMealThumb);

        meal.appendChild(mealImg);

        mealList.appendChild(meal);
    });
}

mealList.addEventListener("click", imageUp);

function imageUp(e) {
    if (e.target.nodeName === "IMG") {
        const pop = document.createElement("div");
        pop.classList.add("popUp");
        const image = document.createElement("img");
        image.setAttribute("src", e.target.getAttribute("src"));
        pop.appendChild(image);

        const close = document.createElement("span");
        close.textContent = "x";
        pop.appendChild(close);

        document.body.appendChild(pop);

        close.addEventListener("click", (e) => {
            pop.hidden = true;
        });
    }
}