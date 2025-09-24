let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let description = document.getElementById("description");
let imageUrl = document.getElementById("imageUrl");
let submit = document.getElementById("submit");

let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];
let searchMood = "title";
let tmp;
let mood = "create";

function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "#04AA6D";
  } else {
    total.innerHTML = "";
    total.style.background = "#a83279";
  }
}

function previewImage() {
  let preview = document.getElementById("previewImg");
  if (imageUrl.value) {
    preview.src = imageUrl.value;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
}

submit.onclick = function () {
  let newPro = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
    description: description.value,
    imageUrl: imageUrl.value,
  };

  if (title.value != "" && price.value != "" && category.value != "") {
    if (mood === "create") {
      let c = parseInt(count.value) || 1;
      for (let i = 0; i < c; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro[tmp] = newPro;
      mood = "create";
      submit.innerHTML = "Add Product";
    }
    clearData();
  }

  localStorage.setItem("product", JSON.stringify(dataPro));
  showData();
  updateStats();
};

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  description.value = "";
  imageUrl.value = "";
  previewImage();
}

function showData() {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    table += `
    <tr>
      <td>${i + 1}</td>
      <td>${dataPro[i].title}</td>
      <td>${dataPro[i].price}</td>
      <td>${dataPro[i].taxes}</td>
      <td>${dataPro[i].ads}</td>
      <td>${dataPro[i].discount}</td>
      <td>${dataPro[i].total}</td>
      <td>${dataPro[i].category}</td>
      <td>${dataPro[i].description}</td>
      <td><img src="${dataPro[i].imageUrl || ""}"></td>
      <td><button onclick="updateData(${i})">Update</button></td>
      <td><button onclick="deleteData(${i})">Delete</button></td>
    </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;
  updateStats();
}

function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(dataPro));
  showData();
}

function clearAll() {
  if (confirm("Are you sure you want to delete all data?")) {
    localStorage.clear();
    dataPro = [];
    showData();
  }
}

function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotal();
  count.value = dataPro[i].count;
  category.value = dataPro[i].category;
  description.value = dataPro[i].description;
  imageUrl.value = dataPro[i].imageUrl;
  previewImage();
  submit.innerHTML = "Update Product";
  mood = "update";
  tmp = i;
  scroll({ top: 0, behavior: "smooth" });
}

function updateStats() {
  document.getElementById("totalItems").innerText = dataPro.length;
  let totalVal = dataPro.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );
  document.getElementById("totalValue").innerText = totalVal.toFixed(2);
}

function searchData(value) {
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    if (
      (searchMood === "title" &&
        dataPro[i].title.toLowerCase().includes(value.toLowerCase())) ||
      (searchMood === "category" &&
        dataPro[i].category.toLowerCase().includes(value.toLowerCase()))
    ) {
      table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td>${dataPro[i].description}</td>
        <td><img src="${dataPro[i].imageUrl || ""}"></td>
        <td><button onclick="updateData(${i})">Update</button></td>
        <td><button onclick="deleteData(${i})">Delete</button></td>
      </tr>
      `;
    }
  }
  document.getElementById("tbody").innerHTML = table;
}

function getSearchMood(id) {
  searchMood = id === "searchTitle" ? "title" : "category";
  document.getElementById("search").placeholder = "Search by " + searchMood;
  document.getElementById("search").focus();
  document.getElementById("search").value = "";
  showData();
}

function sortByPriceAsc() {
  dataPro.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  showData();
}

function sortByPriceDesc() {
  dataPro.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  showData();
}

showData();
