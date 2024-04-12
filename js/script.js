let products; 

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(); 
    });

function displayProducts() {
    let section = document.getElementsByTagName('section')[0];
    section.innerHTML = ''; 
    
    products.forEach(e => {
        section.innerHTML += `<div class='product'>
            <img src="${e.image}">
            <p>${e.title.slice(0, 15)}.../${e.price}$</p>
            <button onclick='add_to_cart(${e.id})'>Add to cart</button>
        </div>`;
    });
}

function add_to_cart(productId) {
    let product;
    if (localStorage.getItem(`product_${productId}`)) {
        product = JSON.parse(localStorage.getItem(`product_${productId}`));
        product.count++;
        localStorage.setItem(`product_${productId}`, JSON.stringify(product));
    } else {
        product = products.find(item => item.id == productId);
        product.count = 1;
        localStorage.setItem(`product_${productId}`, JSON.stringify(product));
    }
    product.totalPrice = product.count * product.price
    show();
}

let isOpen = false
function cart_div_open_close() {
    cartContent.classList.toggle('active')
    show()
}

let section = document.getElementsByTagName('section')[0]
let total_div = document.getElementById('total_div')

function show() {
    let total_price = 0;
    cart_div.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('product_')) {
            let product = JSON.parse(localStorage.getItem(key));
            product.totalPrice = product.count * product.price
            cart_div.innerHTML += `
                <div class='selected_items'>
                    <img src="${product.image}">
                    <div>
                        <i class="fa-solid fa-xmark" id='cancel_select' onclick='delete_selected_product(${product.id})'></i>
                        <div>
                            <p>${product.title.slice(0, 15)}...</p>
                            <p>${product.totalPrice}$</p>
                            <div id='count_container'>
                                <p>x${product.count}</p>
                                <div id='plus_minus'>
                                    <i class="fa-solid fa-minus" onclick="changeCount('minus',${product.id})"></i>
                                    <i class="fa-solid fa-plus" onclick="changeCount('plus',${product.id})"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            total_price += product.price * product.count
            total_div.innerHTML = `
            <p>Total price is: ${total_price}$</p>
    `;
        }
    }
   
}

show()

function delete_selected_product(id) {
    localStorage.removeItem(`product_${id}`)
    show()
}

// function minus(id){
//     let product = JSON.parse(localStorage.getItem(`product_${id}`));
//     product.count--;
//     if(product.count < 1){
//         product.count = 1;
//     }
//     product.totalPrice = product.price * product.count
//     localStorage.setItem(`product_${id}`, JSON.stringify(product));
//     show();
// }

// function plus(id){
//     let product = JSON.parse(localStorage.getItem(`product_${id}`));
//     product.count++;
//     product.totalPrice = product.price * product.count
//     localStorage.setItem(`product_${id}`, JSON.stringify(product));
//     show();
// }

function changeCount(value,id){
    let product = JSON.parse(localStorage.getItem(`product_${id}`));
    if(value == 'plus'){
        product.count++
    }
    else{
        product.count--
        if(!product.count) product.count = 1
    }
    product.totalPrice = product.price * product.count
        localStorage.setItem(`product_${id}`, JSON.stringify(product));
        show();
}