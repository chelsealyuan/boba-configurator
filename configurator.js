/************ Modal Control **************/
let modal = document.getElementById("config_modal");

let close_btn = document.getElementById("close_modal");
close_btn.addEventListener("click", closeAndClear, false);

let close_btn_cart = document.getElementById("close_cart");
close_btn_cart.addEventListener("click", closeCart, false);

let addtocart = document.getElementById("add_to_cart");

let cart_btn = document.getElementById("cart_btn");
let cart_page = document.getElementById("cart_page");
cart_btn.addEventListener("click", openCart, false);

let checkout_btn = document.getElementById("checkout_btn");

function openCart() {
    cart_page.style.display = "block";
}

function closeCart() {
    cart_page.style.display = "none";
}

let milktea_card = document.getElementById("milktea_card");
milktea_card.addEventListener("click", openModal, false);

function openModal() {
    modal.style.display = "block";
    document.querySelector("body").style.overflow = 'hidden';
}

// When the user clicks on Add to Cart, close the modal
addtocart.onclick = function() {
    if (checkRequired()) {
        closeAndClear();
        incrementCart();
    } else {
        let err_msg = document.getElementById("err_msg");
        if (!err_msg.hasChildNodes()) {
            let newNode = document.createElement("p");
            newNode.textContent = "Oops, looks like you forgot to fill out a required field!";
            err_msg.append(newNode);
        }
    }
}

let total_drinks = 0;

function incrementCart() {
    total_drinks++;
    print_cart = "Cart  (" + total_drinks + ")";
    document.getElementById("cart_num").innerHTML = print_cart;
}

function checkRequired() {
    let size_checked = false;
    let sugar_checked = false;
    let ice_checked = false;

    //uncheck all size
    let sizes = document.getElementsByName("size");
    for (let size of sizes) {
        if (size.checked) {
            size_checked = true;
            break;
        }
    }
    //uncheck all sugar
    let sugars = document.getElementsByName("sugar_level");
    for (let sugar of sugars) {
        if (sugar.checked) {
            sugar_checked = true;
            break;
        }
    }

    //uncheck all ice
    let ices = document.getElementsByName("ice_level");
    for (let ice of ices) {
        if (ice.checked) {
            ice_checked = true;
            break;
        }
    }

    return (size_checked && sugar_checked && ice_checked);
}

checkout_btn.onclick = function() {
    cart_page.style.display = "none";
}

function closeAndClear() {
    modal.style.display = "none";
    document.querySelector("body").style.overflow = 'visible';

    //uncheck all toppings checkboxes
    let toppings = document.getElementsByName("topping");
    let quantity_controls = document.getElementsByClassName("quantity_control");
    for (let topping of toppings) {
        topping.checked = false;
    }
    for (let quantity_control of quantity_controls) {
        quantity_control.style.display = "none";
    }

    //uncheck all size
    let sizes = document.getElementsByName("size");
    for (let size of sizes) {
        size.checked = false;
    }
    //uncheck all sugar
    let sugars = document.getElementsByName("sugar_level");
    for (let sugar of sugars) {
        sugar.checked = false;
    }

    //uncheck all ice
    let ices = document.getElementsByName("ice_level");
    for (let ice of ices) {
        ice.checked = false;
    }

    //clear textarea
    document.getElementById("special_instructions_box").value = "";

    //clear err_msg
    let parent = document.getElementById("err_msg");
    if (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }

}


let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        let panel = document.getElementById("panel");
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

/************ Runs On Page Load *************/
let drink_cost = 4.5;

// Number Formatter for Price
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
const topping_pointers = document.getElementsByName('topping');
for (let i = 0; i < topping_pointers.length; i++) {
    //add event listener to each topping checkbox
    topping_pointers[i].addEventListener("click", updateTopping, false);

    //add quantity control HTML to for each topping
    let topping_div = topping_pointers[i].parentElement.parentElement;

    const inc_btn = document.createElement("button");
    inc_btn.setAttribute("id", topping_pointers[i].id + "_inc_btn");
    inc_btn.setAttribute("class", "topping_inc_btn");
    inc_btn.append(String.fromCharCode(0x002B));

    const topping_quantity = document.createElement("div");
    topping_quantity.setAttribute("id", topping_pointers[i].id + "_quantity");
    topping_quantity.setAttribute("class", "topping_quantity");
    topping_quantity.append("1");

    const dec_btn = document.createElement("button");
    dec_btn.setAttribute("id", topping_pointers[i].id + "_dec_btn");
    dec_btn.setAttribute("class", "topping_dec_btn");
    dec_btn.append(String.fromCharCode(0x2212));

    const topping_control = document.createElement("div");
    topping_control.setAttribute("id", topping_pointers[i].id + "_control");
    topping_control.setAttribute("class", "quantity_control");
    topping_control.append(dec_btn);
    topping_control.append(topping_quantity);
    topping_control.append(inc_btn);


    topping_div.append(topping_control);
    topping_control.style.display = "none";

    //add event listeners for each toppingcontrol
    document.getElementById(topping_pointers[i].id + "_inc_btn").addEventListener("click", function() { increaseVal(topping_pointers[i].id + "_quantity"); }, false);
    document.getElementById(topping_pointers[i].id + "_dec_btn").addEventListener("click", function() { decreaseVal(topping_pointers[i].id + "_quantity"); }, false);

    //run once to display regular drink cost immediately
    calculateCost();
}
const sizes = document.getElementsByName("size");
for (let i = 0; i < sizes.length; i++) {
    sizes[i].addEventListener("click", calculateCost, false);
}


/************ Topping Control **************/
function updateTopping() {
    let topping_pointers = document.getElementsByName("topping");

    for (let i = 0; i < topping_pointers.length; i++) {
        //topping's control id
        let control_id = topping_pointers[i].id + "_control";
        let control_div = document.getElementById(control_id);

        if (checkMax() > 3) {
            uncheckLastTopping();
            break;
        } else if (topping_pointers[i].checked) {
            control_div.style.display = "flex";
        } else {
            //reset quantity counter to 1 upon unchecking
            let topping_quantity_id = topping_pointers[i].id + "_quantity";
            document.getElementById(topping_quantity_id).innerHTML = 1;
            control_div.style.display = "none";
        }
        //update cost when new topping is checked
        calculateCost();
    }
}

function uncheckLastTopping() {
    for (let i = 0; i < topping_pointers.length; i++) {
        //topping's control id
        let control_id = topping_pointers[i].id + "_control";
        let control_div = document.getElementById(control_id);

        if (control_div.style.display != "flex") {
            topping_pointers[i].checked = false;
        }
    }
}

/************ Quantity Control **************/
//event listeners for quantity +/-
document.getElementById("quantity_increment_btn").addEventListener("click", function() { increaseVal("quantity_display"); }, false);
document.getElementById("quantity_decrement_btn").addEventListener("click", function() { decreaseVal("quantity_display"); }, false);



/************ Calculate and Update Cost in "Add to Cart" Section **************/
function calculateCost() {
    let total_cost = 0;
    let topping_cost = 0;
    let total_toppings = 0;
    let size_cost = 0;

    //iterate through all toppings to add up total cost of all toppings
    let topping_pointers = document.getElementsByName("topping");
    for (let i = 0; i < topping_pointers.length; i++) {
        //grab quantity only if topping has been checked
        if (topping_pointers[i].checked) {
            let topping_quantity_id = topping_pointers[i].id + "_quantity";
            let topping_quantity_val = parseFloat(document.getElementById(topping_quantity_id).innerHTML);

            //check total amount of toppings to make sure it isn't more than three
            total_toppings = total_toppings + topping_quantity_val;
            //calculate cost of single topping and add to total
            topping_cost = topping_cost + (topping_quantity_val * 0.70);
        }
    }
    //iterate check size to see if additional cost should be added
    let which_size = checkSize();
    if (which_size == "large") {
        size_cost = 2.5;
    }

    //get total number of drink from quantity control 
    let quantity_val = parseFloat(document.getElementById("quantity_display").innerHTML);

    total_cost = quantity_val * (drink_cost + topping_cost + size_cost);
    total_cost = formatter.format(total_cost);
    print_cost = "Add to Order  (" + total_cost + ")";
    document.getElementById("add_to_cart").innerHTML = print_cost;
}

/************ Check if maximum topping has been reached **************/
function checkMax() {
    let total_toppings = 0;
    //iterate through all toppings to add up total cost of all toppings
    let topping_pointers = document.getElementsByName("topping");
    for (let i = 0; i < topping_pointers.length; i++) {
        //grab quantity only if topping has been checked
        if (topping_pointers[i].checked) {
            let topping_quantity_id = topping_pointers[i].id + "_quantity";
            let topping_quantity_val = parseFloat(document.getElementById(topping_quantity_id).innerHTML);

            //check total amount of toppings to make sure it isn't more than three
            total_toppings = total_toppings + topping_quantity_val;
        }
    }
    return total_toppings;
}

function checkSize() {
    //iterate through size choices add up total cost of all toppings
    let size_pointers = document.getElementsByName("size");

    let which_size = null;
    for (let i = 0; i < size_pointers.length; i++) {
        //grab quantity only if topping has been checked
        if (size_pointers[i].checked) {
            which_size = size_pointers[i].value;
            break;
        }
    }
    return which_size;
}


/************ Helper Functions **************/
// Increase/Decrease Functions
//functions for incrementing/decrementing input values
function increaseVal(val_id) {
    if (val_id == "quantity_display") {
        let value = parseInt(document.getElementById(val_id).innerHTML);
        value++;
        document.getElementById(val_id).innerHTML = value;
        //update cost anytime something is increased
        calculateCost();
    } else {
        if (checkMax() >= 3) {
            //cannot select more than three toppings
        } else {
            let value = parseInt(document.getElementById(val_id).innerHTML);
            value++;
            document.getElementById(val_id).innerHTML = value;
            //update cost anytime something is increased
            calculateCost();
        }
    }

}

function decreaseVal(val_id) {
    let value = parseInt(document.getElementById(val_id).innerHTML);
    if (document.getElementById(val_id).className == 'topping_quantity') {
        if (value == 1) {
            document.getElementById(val_id).parentElement.style.display = "none";
            document.getElementById(val_id).parentElement.parentElement.children[0].children[0].checked = false;
        }
    }

    if (value > 1) {
        value--;
    }
    document.getElementById(val_id).innerHTML = value;
    //update cost anytime something is decreased
    calculateCost();
}