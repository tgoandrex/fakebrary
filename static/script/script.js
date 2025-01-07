const shelfContainer = document.getElementById("shelf-container");
let booksPerShelf;
let resizeTimeout;

const fetchBookJSON = (booksPerShelf) => {
    fetch("/api/books")
    .then((response) => response.json())
    .then((books) => {
        // Group books into shelves
        for (let i = 0; i < books.length; i += booksPerShelf) {
            const items = document.createElement("div");
            items.classList.add("items");

            // Slice books for the current shelf
            const shelfBooks = books.slice(i, i + booksPerShelf);

            // Add books to the shelf
            shelfBooks.forEach((book) => {
                const bookDiv = document.createElement("div");
                bookDiv.classList.add("book");

                const bookInfo = document.createElement("div");
                bookInfo.classList.add("book-info");
                bookInfo.classList.add("hide");
                bookDiv.appendChild(bookInfo);

                const bookInfoCover = document.createElement("div");
                bookInfoCover.classList.add("book-info-cover");
                bookInfoCover.classList.add("hide");
                bookInfoCover.addEventListener("click", () => {
                    bookInfo.classList.add("hide");
                    bookInfoCover.classList.add("hide");
                });
                document.body.appendChild(bookInfoCover);

                const exitBtn = document.createElement("span");
                exitBtn.textContent = "\u00D7";
                exitBtn.classList.add("exit-button");
                exitBtn.addEventListener("click", () => {
                    bookInfo.classList.add("hide");
                    bookInfoCover.classList.add("hide");
                });
                bookInfo.appendChild(exitBtn);

                const title = document.createElement("h1");
                title.textContent = book.name;
                bookInfo.appendChild(title);

                const description = document.createElement("p");
                description.textContent = book.description;
                bookInfo.appendChild(description);

                const price = document.createElement("p");
                price.textContent = `Price: £${book.price}`;
                bookInfo.appendChild(price);

                const stock = document.createElement("p");
                stock.textContent = `Stock: ${book.stock}`;
                bookInfo.appendChild(stock);

                const img = document.createElement("img");
                img.classList.add("book-image");
                img.src = book.image;
                img.alt = book.name;
                img.addEventListener("click", () => {
                    bookInfo.classList = "book-info";
                    bookInfoCover.classList = "book-info-cover";
                })
                bookDiv.appendChild(img);

                items.appendChild(bookDiv);
            });

            const shelf = document.createElement("div");
            shelf.classList.add("shelf");

            const shelfSupportContainer = document.createElement("div");
            shelfSupportContainer.classList.add("shelf-support-container");

            const shelfSupportLeft = document.createElement("div");
            shelfSupportLeft.classList.add("shelf-support");
            shelfSupportLeft.classList.add("left");

            const shelfSupportRight = document.createElement("div");
            shelfSupportRight.classList.add("shelf-support");
            shelfSupportRight.classList.add("right");

            shelfContainer.appendChild(items);
            shelfContainer.appendChild(shelf);
            shelfContainer.appendChild(shelfSupportContainer);
            shelfSupportContainer.appendChild(shelfSupportLeft);
            shelfSupportContainer.appendChild(shelfSupportRight);
        }
    })
    .catch((error) => {
        console.error("Error fetching books:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    booksPerShelf = window.innerWidth < 600 ? 3 : 5;
    fetchBookJSON(booksPerShelf);
});

const handleResize = () => {
    booksPerShelf = window.innerWidth < 600 ? 3 : 5;

    while (shelfContainer.firstChild) {
        shelfContainer.removeChild(shelfContainer.firstChild);
    }

    fetchBookJSON(booksPerShelf);
}

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 200);
});