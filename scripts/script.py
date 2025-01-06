from bs4 import BeautifulSoup
import requests
import json
import os
from classes.Book import Book

def getBookLinks(pageNum):
    cachefolder = "cache"
    cachefile = os.path.join(cachefolder, f"links_cache_page_{pageNum}.json")
    if os.path.exists(cachefile):
        with open(cachefile, "r") as f:
            print(f"Loading cached links for page {pageNum}...")
            return json.load(f)
    linkList = []
    page = requests.get(f"https://books.toscrape.com/catalogue/page-{pageNum}.html")
    soup = BeautifulSoup(page.text, "html.parser")
    aTags = soup.select(".image_container > a")
    for link in aTags:
        linkList.append(f"https://books.toscrape.com/catalogue/{link["href"]}")
    with open(cachefile, "w") as f:
        json.dump(linkList, f)
    return linkList

def scrapeBooks(links, pageNum):
    cachefolder = "cache"
    cachefile = os.path.join(cachefolder, f"books_cache_page_{pageNum}.json")
    if os.path.exists(cachefile):
        with open(cachefile, "r") as f:
            print("Loading cached book data...")
            cachedBooks = json.load(f)
            return [Book(**book) for book in cachedBooks]
    print("Scraping book data...")
    books = []
    for link in links:
        page = requests.get(link)
        soup = BeautifulSoup(page.text, "html.parser")
        upc = soup.find("th", text="UPC").find_next("td").text
        title = soup.select_one("h1").text
        description = soup.find(id="product_description").find_next_sibling().text[:-8]
        priceRaw = soup.select_one(".price_color").text.strip()
        price = priceRaw[2:].strip() 
        stockRaw = soup.select_one(".availability").text.strip()
        stock = stockRaw[10:12].strip() 
        imageSrc = soup.select_one("img")["src"][2:]
        image = f"https://books.toscrape.com{imageSrc}"
        newBook = Book(
            upc, title, description, price, stock, image
        )
        books.append(newBook)
    with open(cachefile, "w") as f:
        json.dump([book.__dict__ for book in books], f)
    return books