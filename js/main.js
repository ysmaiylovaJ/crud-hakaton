const API = "http://localhost:8000/products";

let name = document.querySelector(".inp-name");
let category = document.querySelector(".inp-category");
let url = document.querySelector(".inp-url");
let desc = document.querySelector(".inp-desc");
let btnAdd = document.querySelector(".btn-add");

let cardsContainer = document.querySelector(".cards-container");

let prevBtn = document.querySelector("#prev");
let nextBtn = document.querySelector("#next");
let pageSpan = document.querySelector(".current_page");
let currentPage = 1;
let pageLength = 1;

let inpSearch = document.querySelector("#search-input");
let searchBtn = document.querySelector(".btn-search");
let searchValue = "";

let allFillterBtns = document.querySelector(".filtered-btns button");
let allBtns = document.querySelector("#all");
let planetBtns = document.querySelector("#planets");
let contstellations = document.querySelector("#constellations");
let starBtns = document.querySelector("#stars");
let gallaxies = document.querySelector("#galaxies");
let satellites = document.querySelector("#satellites");
let filterValue = "All";

let editName = document.querySelector(".edit-inp-name");
let editUrl = document.querySelector(".edit-url-name");
let editDesc = document.querySelector(".edit-desc-name");
let editCategory = document.querySelector(".edit-category-name");
let btnSave = document.querySelector(".btn-save");
let editId = null;
let editModal = document.querySelector("#editModal");

async function createProduct(newProduct) {
  try {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
  } catch (error) {
    console.log(error);
  }
}

btnAdd.addEventListener("click", () => {
  if (
    !name.value.trim() ||
    !url.value.trim() ||
    !desc.value.trim() ||
    !category.value.trim()
  ) {
    alert("fill the gaps!");
    return;
  }
  let newProduct = {
    name: name.value,
    url: url.value,
    desc: desc.value,
    category: category.value,
  };
  createProduct(newProduct);
  renderProducts();
  url.value = "";
  desc.value = "";
  name.value = "";
  category.value = "";
});

async function renderProducts() {
  try {
    let res =
      filterValue !== "All"
        ? await fetch(
            `${API}?q=${searchValue}&_page=${currentPage}&_limit=8&category=${filterValue}`
          )
        : await fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=8`);

    let data = await res.json();
    cardsContainer.innerHTML = "";

    data.forEach((item) => {
      cardsContainer.innerHTML += `<div class="card" style="width: 18rem;">
      <img src=${item.url} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.desc}</p>
        <a href="#" onclick="deleteProduct(${item.id})" class="btn btn-outline-dark">Delete</a>
        <a href="#" onclick="editProduct(${item.id})" data-bs-toggle="modal" data-bs-target="#editModal" class="btn btn-outline-dark">Edit</a>
      </div>
    </div>`;
    });
    countPages(searchValue);
  } catch (error) {
    console.log(error);
  }
}

renderProducts();

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  renderProducts();
}

async function editProduct(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let data = await res.json();

    editName.value = data.name;
    editUrl.value = data.url;
    editDesc.value = data.desc;
    editCategory.value = data.category;
    editId = id;
  } catch (error) {
    console.log(error);
  }
}

btnSave.addEventListener("click", () => {
  let editedProduct = {
    name: editName.value,
    desc: editDesc.value,
    category: editCategory.value,
    url: editUrl.value,
  };
  saveChanges(editedProduct);
});

async function saveChanges(editedProduct) {
  try {
    await fetch(`${API}/${editId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedProduct),
    });
    renderProducts();
  } catch (error) {
    console.log(error);
  }
}

async function countPages(search) {
  let res = await fetch(`${API}?q=${search}`);

  let data = await res.json();

  pageLength = Math.ceil(data.length / 3);
}

pageSpan.innerText = currentPage;

prevBtn.addEventListener("click", (event) => {
  if (currentPage <= 1) {
    prevBtn.classList.add("disabled");
    return;
  }
  currentPage--;
  pageSpan.innerText = currentPage;
  renderProducts();
});
nextBtn.addEventListener("click", (event) => {
  if (currentPage >= pageLength) {
    event.target.classList.add("disabled");
    return;
  }
  currentPage++;

  pageSpan.innerText = currentPage;
  renderProducts();
});

function changeColorFilterBtn() {
  allFillterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log(e);
      filterValue = e.target.innerText;
      changeColorFilterBtn();
      renderProducts();
    });
  });
}

function changeColorFilterBtn() {
  allFillterBtns.forEach((btn) => {
    if (filterValue === btn.innerText) {
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "inherit";
      btn.style.color = "black";
    }
  });
}
