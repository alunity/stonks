import yfinance as yf
import csv
from difflib import SequenceMatcher
import json

cash = 1000
names = []
portfolio = {}

yes = ["y", "yes", "yh"]

with open("./stockNames.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        names.append(row)


def getStockPrice(name: str) -> int:
    ticker = yf.Ticker(name).info
    return ticker["regularMarketPrice"]


def save(cash, portfolio):
    data = {"cash": cash, "portfolio": portfolio}
    data = json.dumps(data)
    with open("data.txt", "w") as f:
        f.write(data)


def recover():
    with open("data.txt", "r") as f:
        data = f.read()
    data = json.loads(data)
    return data["cash"], data["portfolio"]


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
        print(f"Total cost: ${cost}")
        print(f"Current Balance: ${cash}")
        print(f"Balance after buy: ${round(cash - (cost), 2)}")

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
    elif choice == 2:
        print("What stock do you want to sell?")
        name = input()
        price = getStockPrice(name)
        print(f"{name} costs per share: ${price}")
        print("How many shares do you want to sell")
        amount = float(input())
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
            if name in portfolio:
                portfolio[name] -= amount
            else:
                portfolio[name] = amount

    elif choice == 3:
        total = 0
        for i in portfolio:
            price = getStockPrice(i)
            total += portfolio[i] * price
            print(
                f"{i}: {portfolio[i]}: ${round(price * portfolio[i], 2)}")
        print(f"Total: ${round(total, 2)}")
