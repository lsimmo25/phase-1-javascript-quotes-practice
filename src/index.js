document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.querySelector("#quote-list")
    const newQuoteForm = document.querySelector("#new-quote-form")
    const addAuthor = document.querySelector("#author")
    const addQuote = document.querySelector("#new-quote")


    function handleSubmit(){

        let quoteObj = {
            quote: addQuote.value,
            author: addAuthor.value,       
        }
        submitQuote(quoteObj)
    }

    newQuoteForm.addEventListener("submit", handleSubmit)

    function submitQuote(quoteObj){
        fetch(`http://localhost:3000/quotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(quoteObj)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            fetchQuotes()
        })
    }
    
    function fetchQuotes() {
        fetch(`http://localhost:3000/quotes`)
            .then(response => response.json())
            .then(data => {
                data.forEach(quote => {displayQuotes(quote)})
            })
            .catch(error => console.log(error))
    }

    function displayQuotes(quote) {
        const favoriteQuotes = document.createElement("li")
        favoriteQuotes.classList.add("quote-card")
        favoriteQuotes.setAttribute("data-quote-id", `${quote.id}`)
        const likes = quote.likes !== undefined ? quote.likes : 0
        favoriteQuotes.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class="btn-success">Likes: <span class="like-counter">${likes}</span></button>
            <button class="btn-danger">Delete</button>
        </blockquote>
        `

        quoteList.appendChild(favoriteQuotes)
    }

    function handleLikes () {
        quoteList.addEventListener("click", (e) => {
            if(e.target.classList.contains("btn-success")) {
                const quoteCard = e.target.closest(".quote-card")
                const quoteId = quoteCard.dataset.quoteId
                const likeCounter = quoteCard.querySelector(".like-counter")
                let currentLikes = parseInt(likeCounter.textContent)
                currentLikes++
                likeCounter.textContent = currentLikes

                updateLikes(quoteId, currentLikes)
            }
        })
    }

    function updateLikes (quoteId, newLikes) {
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ likes: newLikes})
        })
        .then(response => response.json())
    }

    function handleDelete () {
        quoteList.addEventListener("click", (e) => {
            if(e.target.classList.contains("btn-danger")) {
                const quoteCard = e.target.closest(".quote-card")
                const quoteId = quoteCard.dataset.quoteId
                console.log(quoteCard.dataset)
                console.log("Quote card:", quoteCard);
                submitDelete(quoteId)
            }
        })

    }

    function submitDelete(quoteId) {
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        .then(response => {
            const quoteCard = document.querySelector(`[data-quote-id="${quoteId}"]`)
            if (quoteCard) {
                quoteCard.remove()
            }
        })
    }

    function init() {
        fetchQuotes()
        handleDelete()
        handleLikes()
    }

    init()

})