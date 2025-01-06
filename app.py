from flask import Flask, render_template, jsonify

from scripts import script
from classes.Library import Library

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/books")
def getBooks():
    pageNum = 1  # Change this number to get books from different pages
    links = script.getBookLinks(pageNum)
    scrapedBooks = script.scrapeBooks(links, pageNum)
    library = Library()
    library.addBooks(scrapedBooks)
    books = library.getAllBooks()
    return jsonify([book.__dict__ for book in books])