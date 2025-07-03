import { menuItems } from "./data.js";

const doc = document;

const renderUi = (data) => {
    const menuContainer = doc.querySelector(".menu-container");
    menuContainer.innerHTML = data;
};

function filterData(type) {
    console.log("called", type);

    switch (type) {
        case "all": {
            const cardUIData = menuItems.map((data) => card(data)).join("");
            renderUi(cardUIData);
            break;
        }
        case "breakfast": {
            const breakfastData = menuItems.filter((data) => data.type === type);
            const cardUIData = breakfastData.map((data) => card(data)).join("");
            renderUi(cardUIData);
            break;
        }
        case "lunch": {
            const lunchData = menuItems.filter((data) => data.type === type);
            const cardUIData = lunchData.map((data) => card(data)).join("");
            renderUi(cardUIData);
            break;
        }
        case "shakes": {
            const ShakeData = menuItems.filter((data) => data.type === type);
            const cardUIData = ShakeData.map((data) => card(data)).join("");
            renderUi(cardUIData);
            break;
        }
        case "dinner": {
            const DinnerData = menuItems.filter((data) => data.type === type);
            const cardUIData = DinnerData.map((data) => card(data)).join("");
            renderUi(cardUIData);
            break;
        }

        default:
            break;
    }
}

function card({ title, description, price, image }) {
    return `
        <div class="flex-item col-12 col-lg-6 d-md-flex gap-4 p-md-2">
          <div class="image-container">
            <img
              class="w-100 image"
              src=${image}
              alt=${image}
              width="100%"
            />
          </div>

          <article class="content flex-grow-2 my-4">
            <h4 class="d-flex justify-content-between">
              <span>${title}</span> <span>$${price}</span>
            </h4>
            <p>
              ${description}
            </p>
          </article>
        </div>
     `;
}

const cardUIData = menuItems.map((data) => card(data)).join("");

renderUi(cardUIData);

// Make it available to inline onclick handlers
window.filterData = filterData;

fetch(
    "https://dummyjson.com/products"
)
    .then((data) => data.json())
    .then((data) => {
        console.log(data);
    });
