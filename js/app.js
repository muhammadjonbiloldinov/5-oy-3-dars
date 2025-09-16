const elCardTemplate = document.getElementById("cardTemp");
const elContainer = document.getElementById("container");
const elLoading = document.getElementById("loading");
const elError = document.getElementById("error");
const elForm = document.getElementById("form");
const elEditBtn = document.getElementById("editBtn");
const elAddBtn = document.getElementById("addBtn");
const elPrev = document.getElementById("prev");
const elNext = document.getElementById("next");
const elPrevNext = document.getElementById("prevNext");


const limit = 20;
let skip = 5;


let token = localStorage.getItem("token");


let editID = null;


function init() {
    elLoading.style.display = "block";
    fetch(`https://json-api.uz/api/project/fn43/cars?skip=${skip}&limit=${limit}`)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            ui(res.data);
        })
        .catch(() => {
            elError.classList.remove("hidden");
            elPrevNext.classList.add("hidden");

        })
        .finally(() => {
            elLoading.style.display = "none";
        })
}


function deleteEl(id) {
    if (token) {
        elContainer.innerHTML = null;
        elLoading.style.display = "block";
        fetch(`https://json-api.uz/api/project/fn43/cars/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                init();
            })
            .then((res) => {
            })
            .catch(() => {
            })
            .finally(() => {
            })
    }
    else {
        alert("Ro'yxatdan o'ting");
        location.href = "pages/login.html"
    }
}


function getById(id) {
    fetch(`https://json-api.uz/api/project/fn43/cars/${id}`)
        .then((res) => {
            return res.json()
        })
        .then((res) => {
            fill(res)
        })
        .catch(() => {
        })
        .finally(() => {
        })
}


function addEl(newEl) {
    elContainer.innerHTML = null;
    fetch(`https://json-api.uz/api/project/fn43/cars`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEl),
        })
        .then((res) => {
            alert("Ma'lumot muvaffaqiyatli qo'shildi")
            init();
        })
        .catch(() => {
            console.log("Xatolik");

        })
        .finally(() => {
        })
}


function editEl(editedEl) {
    elContainer.innerHTML = null;
    fetch(`https://json-api.uz/api/project/fn43/cars/${editedEl.id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedEl),
        })
        .then((res) => {
            alert("Ma'lumot muvaffaqiyatli yangilandi")
            init();
        })
        .catch(() => {

        })
        .finally(() => {
        })
}


function fill(obj) {
    elForm.name.value = obj.name;
    elForm.description.value = obj.description;
    elForm.category.value = obj.category;
    elForm.brand.value = obj.brand;
    elForm.price.value = obj.price;

}


init();


function ui(cars) {
    elContainer.innerHTML = "";
    cars.forEach(element => {
        const clone = elCardTemplate.cloneNode(true).content;
        const elTitle = clone.querySelector("h2");
        const elDescription = clone.querySelector("p");
        const elCategory = clone.querySelector("mark");
        const elPrice = clone.querySelector("i");
        const elDeleteBtn = clone.querySelector(".delete-btn");
        const elEditBtn = clone.querySelector(".edit-btn");

        elTitle.innerText = element.name;
        elDescription.innerText = element.description;
        elCategory.innerText = element.category;
        elPrice.innerText = element.price;
        elDeleteBtn.id = element.id;
        elEditBtn.id = element.id;

        elContainer.append(clone);
    });
};



document.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("delete-btn")) {
        const id = evt.target.id;
        deleteEl(id)
    }

    if (evt.target.classList.contains("edit-btn")) {
        elForm.classList.remove("hidden");
        getById(evt.target.id);
        editID = evt.target.id;
        elAddBtn.style.display = "none";
        elEditBtn.style.display = "inline";

    }
});


elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const formData = new FormData(elForm);
    const result = {};
    formData.forEach((value, key) => {
        result[key] = value;
    });

    if (evt.submitter.id === "addB") {
        addEl(result)
    }

    if (evt.submitter.id === "editBtn") {
        if (editID) {
            result.id = editID;
            editEl(result);
            editID = null;
            elForm.classList.remove("hidden");
        }
    }

    elForm.reset();

});



elNext.addEventListener("click", () => {
    elContainer.innerHTML = "";
    skip += limit;
    init();

});

elPrev.addEventListener("click", () => {
    elContainer.innerHTML = "";

    if (skip > limit) {
        skip -= limit;
        init();
    }

});

