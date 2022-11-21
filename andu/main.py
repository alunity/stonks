import yfinance as yf
import csv
from difflib import SequenceMatcher
import json
from functions import removeStocks, getStockPrice, save, recover, grabInfo

cash = 1000
names = []
portfolio = {}

yes = ["y", "yes", "yh"]

with open("./stockNames.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        names.append(row)

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

cash, portfolio = recover()

running = True
while running:

    print("\n")
    print(f"Cash: ${cash}")
    print(""" 
    1. Buy stock
    2. Sell stock
    3. View portfolio 
    4. Exit
    """)
    choice = int(input())

    if choice == 4:
        save(cash, portfolio)
        running = False
    elif choice == 1:
        print("What stock do you want to buy?")
        name = input()
        price = getStockPrice(name)
        print(f"{name} costs per share: ${price}")
        print("How many shares do you want to buy")
        amount = float(input())
        cost = round(amount * price, 2)
        if cash > cost:
            print(f"Total cost: ${cost}")
            print(f"Current Balance: ${cash}")
            print(f"Balance after payment: ${round(cash - (cost), 2)}")
            confirmation = input("Confirm purchase: ")
            if confirmation.lower() in yes:
                print(
                    f"You have purchased {amount} share{'s' if amount != 1 else ''} of {name} for ${cost}")
                cash -= cost
                cash = round(cash, 2)
                if name in portfolio:
                    portfolio[name] += amount
                else:
                    portfolio[name] = amount
        else:
            print(f"You have insufficient cash to purchase {amount} share{'s' if amount != 1 else ''} of {name} for ${cost}")
            print(f"Your balance is only {cash}")
    elif choice == 2:
        print("What stock do you want to sell?")
        name = input()
        if name in portfolio:
            print(f"you have {portfolio[name]} amount of this stock")
            price = getStockPrice(name)
            print(f"{name} costs per share: ${price}")
            print("How many shares do you want to sell")
            amount = float(input())
            if amount <= portfolio[name]:
                cost = round(amount * price, 2)
                print(f"Total cost: ${cost}")
                print(f"Current Balance: ${cash}")
                print(f"Balance after sell: ${round(cash + (cost), 2)}")
                print("Confirm sell: ")
                confirmation = input()

                if confirmation.lower() in yes:
                    print(
                        f"You have sold {amount} share{'s' if amount != 1 else ''} of {name} for ${cost}")
                    cash += cost
                    cash = round(cash, 2)
                    portfolio[name] -= amount
                    removeStocks(name)
            else:
                print(f"you don't own {amount} of {name}")
        else:
            print(f"you dont have {name} stocks in your portfolio")
        


    elif choice == 3:
        total = 0
        for i in portfolio:
            price = getStockPrice(i)
            total += portfolio[i] * price
            print(
                f"{i}: {portfolio[i]}: ${round(price * portfolio[i], 2)}")
        print(f"Total: ${round(total, 2)}")
