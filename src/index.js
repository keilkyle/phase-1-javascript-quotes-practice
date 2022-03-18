const quoteList = document.querySelector("#quote-list")

//initial fetch

fetch("http://localhost:3000/quotes?_embed=likes", {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})
.then(resp => resp.json())
.then(data => data.forEach(oneQuote => renderQuote(oneQuote)))

// render quotes
function renderQuote(oneQuote) {
    let li = document.createElement("li")
    li.setAttribute("class","quote-card")
    li.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${oneQuote.quote}</p>
        <footer class="blockquote-footer">${oneQuote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${oneQuote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>`
    li.querySelector(".btn-success").addEventListener("click", () => {
        oneQuote.likes.length += 1
        li.querySelector("span").textContent = oneQuote.likes.length
        updateLikes(oneQuote)
    }
    )
    li.querySelector(".btn-danger").addEventListener("click", () => {
        li.remove()
        deleteQuote(oneQuote.id)
    }
    )
    quoteList.appendChild(li)
}

//form stuff

const form = document.querySelector("form")
form.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
    e.preventDefault()
    let quoteObj = {
        "quote": e.target.querySelectorAll("input")[0].value,
        "author": e.target.querySelectorAll("input")[1].value,
    }
    postQuote(quoteObj)
}

function postQuote(quoteObj) {
    fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(quoteObj)
})
.then(resp => resp.json())
.then(data => {
    data.likes = []
    debugger
    renderQuote(data)
})}

// update likes

function updateLikes(oneQuote) {
    fetch(`http://localhost:3000/likes`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
        "quoteId": oneQuote.id,
        "createdAt": Date.now()
    })
})
.then(resp => resp.json())
}

// delete quote

function deleteQuote(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})
.then(resp => resp.json())
}