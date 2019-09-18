# import necessary libraries
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_web_apa


# create instance of Flask app
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/pets_db")


# create route that renders index.html template
@app.route("/")
def home():

    # Find one record of data from the mongo database
    pet_data = mongo.db.collection.find_one()

    # Return template and data
    return render_template("index.html", petData = pet_data)


# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():

    # Run the scrape function
    apa_data = scrape_web_apa.get_all_apa_data()

    # Update the Mongo database using update and upsert=True
    mongo.db.collection.drop()
    for pet in apa_data:
        mongo.db.collection.insert_one(pet)

    # Redirect back to home page
    return redirect("/api")

@app.route("/api")
def api():
    api_list = []
    pets_data = mongo.db.collection.find()
    for post in pets_data:
        print(post)
        api_list.append(post)

    return render_template("api.html", pets = api_list)

    # api_dict = {}
    # pets_data = mongo.db.collection.find()
    # for post in pets_data:
    #     api_dict = api_dict + post
    # print(api_dict)

    # return render_template("api.html", pets = api_dict)


if __name__ == "__main__":
    app.run(debug=True)
