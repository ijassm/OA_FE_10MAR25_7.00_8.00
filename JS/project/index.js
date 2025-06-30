import { menuItems } from "./data.js";

const doc = document;

const renderUi = (data) => {
    const menuContainer = doc.querySelector(".menu-container");
    menuContainer.innerHTML = data;
};


function filterData(type) {
    console.log("called", type);

    switch (type) {
        case "all":
            {
                const cardUIData = menuItems.map((data) => card(data)).join("")
                renderUi(cardUIData);
                break;
            }
        case "breakfast":
            {
                const breakfastData = menuItems.filter((data) => data.type === type);
                const cardUIData = breakfastData.map((data) => card(data)).join("");
                renderUi(cardUIData);
                break;
            }
        case "lunch":
            {
                const breakfastData = menuItems.filter((data) => data.type === type);
                const cardUIData = breakfastData.map((data) => card(data)).join("");
                renderUi(cardUIData);
                break;
            }
        case "shakes":
            {
                const breakfastData = menuItems.filter((data) => data.type === type);
                const cardUIData = breakfastData.map((data) => card(data)).join("");
                renderUi(cardUIData);
                break;
            }
        case "dinner":
            {
                const breakfastData = menuItems.filter((data) => data.type === type);
                const cardUIData = breakfastData.map((data) => card(data)).join("");
                renderUi(cardUIData);
                break;
            }

        default:
            break;
    }
};

function card({ title, description, price }) {
    return `
        <div class="flex-item col-6 d-flex gap-4 p-4">
          <div>
            <img
              class="w-100 image"
              src="https://static.toiimg.com/thumb/msid-112019658,width-1280,height-720,resizemode-4/112019658.jpg"
              alt="ice cream"
            />
          </div>

          <article class="content">
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


const cardUIData = menuItems.map((data) => card(data)).join("")

renderUi(cardUIData)


// Make it available to inline onclick handlers
window.filterData = filterData;