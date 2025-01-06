class Library:
    def __init__(self):
        self.books = {}
    def addBooks(self, books):
        for book in books:
            if book.upc in self.books:
                print(f"Book with UPC {book.upc} ('{book.name}') already exists in the library.")
            else:
                self.books[book.upc] = book
    def getAllBooks(self):
        return list(self.books.values())