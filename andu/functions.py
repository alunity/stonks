import yfinance as yf
import csv
from difflib import SequenceMatcher
import json

def removeStocks(stock):
    if portfolio[stock] == 0:
        portfolio.pop(stock)

def getStockPrice(name: str) -> int:
    ticker = yf.Ticker(name).info
    return ticker["regularMarketPrice"]

def save(cash, portfolio):
    data = {"cash": cash, "portfolio": portfolio}
    data = json.dumps(data)
    with open("data.txt", "w") as f:
        f.write(data)

def recover():
    try:
        with open("data.txt", "r") as f:
            data = f.read()
        data = json.loads(data)
        return data["cash"], data["portfolio"]
    except:
        return 1000, {}

def grabInfo(name: str, info: str ):
    ticker = yf.Ticker(name).info
    return ticker[info]

