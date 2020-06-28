function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].toLowerCase().includes(val.toLowerCase())) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                let search = val.toLowerCase();
                let match = arr[i].toLowerCase();

                b.innerHTML = match.substr(0, match.indexOf(search));
                b.innerHTML += "<strong>" + match.substr(match.indexOf(search), search.length) + "</strong>";
                b.innerHTML += match.substr(match.indexOf(search) + search.length);

                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value=\"" + match + "\">";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

let ingredients_loaded = false;
let ingredients = [];

window.onload = async (e) => {
    console.log("Getting ingredients..");
    while (!ingredients_loaded) {
        try {
            ingredients_loaded = true;
            await fetch("/unique-ingredients-list").then(res => res.json()).then((ingredients) => {
                console.log("Got ingredients list..");
                autocomplete(document.getElementById("myInput"), ingredients.ingredients);
            });

            let inputs = document.getElementById("inputs");
            let spinner = document.getElementById("spinner");
            inputs.classList.remove("loading")
            spinner.classList.add("hidden");
        } catch (error) {
            continue;
        }
    }


    let add_button = document.getElementById("add-button");
    let input = document.getElementById("myInput");
    let ingredients_list = document.getElementById("ingredients-list");
    add_button.onclick = (e) => {
        ingredients.push(input.value);
        console.log(ingredients);
        ingredients_list.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${input.value}<button id="remove-btn" class="badge badge-danger badge-pill btn">X</button></li>`;
        input.value = ""
        update_buttons();
    }

}

function update_buttons() {
    let buttons = document.querySelectorAll("#remove-btn");
    if (buttons.length > 0) {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = (e) => {
                console.log(e);
                let innertext = e.srcElement.parentNode.innerText;
                let ingredient = innertext.substring(0, innertext.length - 1).toLowerCase();
                for (let i = 0; i < ingredients.length; i++) {
                    if (ingredient.normalize("NFKC").trim() === ingredients[i].normalize("NFKC").trim()) {
                        ingredients.splice(i, 1);
                    }
                }
                console.log(ingredients);
                e.srcElement.parentNode.remove();
            }

        }
    }
}