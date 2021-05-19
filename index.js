const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCart = document.getElementById("template-cart").content
const fragment = document.createDocumentFragment()
let cart = {}

// con este addEventListener obtengo los datos de mi "base de datos" y el DOMContentLoaded se dispara cuando ya el documento se encuentra totalmente cargado
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"))
        showCart()
    }
})

cards.addEventListener("click", e => {
    addToCart(e)
})

items.addEventListener("click", e => {
    btnAction(e)
})


// Traigo los productos
const fetchData = async () => {
    try{
        const res = await fetch("api.json")
        const data = await res.json()
        // console.log(data)
        showCard(data)
    } catch (error) {
        console.log(error)
    }
}

// Muestro los productos
const showCard = data => {
    // uso el forEach porque el api es un json 
    data.forEach(product => {
        templateCard.querySelector("h5").textContent = product.title
        templateCard.querySelector("p").textContent = product.price
        templateCard.querySelector("img").setAttribute("src", product.thumbnailUrl)
        templateCard.querySelector(".btn-dark").dataset.id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// agrego al carrito
const addToCart = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains("btn-dark"))
    if(e.target.classList.contains("btn-dark")){
        // el e.target.parentElement lo que esta haciendo es mostrar toda la informacion al carrito facilitando el proceso, especificamente se trae el div del card con esa info
        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}

// setear la info
const setCart = objeto =>{
    // console.log(objeto)
    const product = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        price: objeto.querySelector("p").textContent,
        quantity: 1
    }
    if(cart.hasOwnProperty(product.id)){
        product.quantity = cart[product.id].quantity + 1
    }

    cart[product.id] = {...product}
    showCart()
}

const showCart = () => {
    // console.log(cart)
    items.innerHTML = ""
    Object.values(cart).forEach(product =>{
        templateCart.querySelector("th").textContent = product.id 
        templateCart.querySelectorAll("td")[0].textContent = product.title
        templateCart.querySelectorAll("td")[1].textContent = product.quantity
        templateCart.querySelector(".btn-info").dataset.id = product.id
        templateCart.querySelector(".btn-danger").dataset.id = product.id
        templateCart.querySelector("span").textContent = product.quantity * product.price

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    showFooter()

    localStorage.setItem("cart", JSON.stringify(cart))
}

const showFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(cart).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

        return
    }

    const nQuantity = Object.values(cart).reduce((acc, {quantity}) => acc + quantity, 0)
    const nPrice = Object.values(cart).reduce((acc, {quantity, price}) => acc + quantity * price, 0)
    
    templateFooter.querySelectorAll("td")[0].textContent = nQuantity
    templateFooter.querySelector("span").textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnClearAll = document.getElementById("clear-cart")
    btnClearAll.addEventListener("click", () => {
        cart = {}
        showCart()
    })
}

const btnAction = e => {
    // console.log(e.target)
    // para aumentar la cantidad
    if(e.target.classList.contains("btn-info")){
        console.log(cart[e.target.dataset.id])
        // cart[e.target.dataset.id]
        const product = cart[e.target.dataset.id]
        product.quantity = cart[e.target.dataset.id].quantity + 1        // se puede reemplazar todo lo que esta desde el = por ++
        cart[e.target.dataset.id] = {...product}
        showCart()
    }

    if(e.target.classList.contains("btn-danger")){
        const product = cart[e.target.dataset.id]
        product.quantity = cart[e.target.dataset.id].quantity - 1        // se puede reemplazar todo lo que esta desde el = por --
        if(product.quantity === 0){
            delete cart[e.target.dataset.id]
        }
        showCart()
    }

    e.stopPropagation()
}