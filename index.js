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
})

cards.addEventListener("click", e => {
    addToCart(e)
})

// Traigo los productos
const fetchData = async () => {
    try{
        const res = await fetch("api.json")
        const data = await res.json()
        // console.log(data)
        mostrarCard(data)
    } catch (error) {
        console.log(error)
    }
}

// Muestro los productos
const mostrarCard = data => {
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
    mostrarCart()
}

const mostrarCart = () => {
    console.log(cart)
}