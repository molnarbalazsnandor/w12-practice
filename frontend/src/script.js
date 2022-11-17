// import Swiper bundle with all modules installed
import Swiper from "swiper/bundle";

// import styles bundle
import "swiper/css/bundle";

let searchTerm = "";

console.log("loaded");

const fetchImages = async () => {
  return fetch("/images")
    .then((data) => data.json())
    .then((images) => {
      /*       const swiper = new Swiper(...); */
      return images;
    });
};

const imageComponent = (url, title, uploadDate, phName) => `
    <div class="card">
        <h2>${title}</h2>
        <h3>${uploadDate}</h3>
        <h4>${phName}</h4>
        <img src="public/images/${url}" />
    </div>
`;

const formComponent = () => `
    <form>
        <input type="file" name="file" />
        <input type="text" name="title" />
        <input type="text" name="phname" />
        <button>Send</button>
    </form>
`;

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    // Optional parameters
    direction: "horizontal",
    loop: true,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // And if we need scrollbar
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
  console.log(swiper);
};

function initFilter() {
  const filterInput = document.querySelector("#filter");
  filterInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
  });
}

const printImages = (data, imageContainer) => {
  const html = data
    /*     .filter((image) => image.title[0] === "M") */
    .map((image) => {
      imageComponent(image.url, image.title, image.uploadDate, image.phName);
    });
  imageContainer.insertAdjacentHTML("beforeend", html);
};

const init = async () => {
  initSwiper();
  initFilter();
  const data = await fetchImages();
  console.log(data);

  /*   data.forEach((image) => {
    rootElement.insertAdjacentHTML(
      "beforeend",
      imageComponent(image.url, image.title, image.uploadDate, image.phName)
    );
  }); */

  const rootElement = document.querySelector("#root");

  const imageContainer = rootElement.querySelector(".images");

  printImages(data, imageContainer);

  rootElement.insertAdjacentHTML("beforeend", formComponent());
  const formElement = document.querySelector("form");
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "image",
      formElement.querySelector('input[name="file"]').files[0]
    );
    formData.append(
      "title",
      formElement.querySelector('input[name="title"]').value
    );
    formData.append(
      "phname",
      formElement.querySelector('input[name="phname"]').value
    );

    fetch("/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((respjson) =>
        formElement.insertAdjacentHTML(
          "beforebegin",
          imageComponent(
            respjson.url,
            respjson.title,
            respjson.uploadDate,
            respjson.phName
          )
        )
      );
  });
};

init();
