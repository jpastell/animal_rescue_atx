# import necessary libraries
from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import scrape_web_apa
import json

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
    mongo.db.austin_pets_alive.drop()
    for pet in apa_data:
        mongo.db.austin_pets_alive.insert_one(pet)

    # Redirect back to home page
    return redirect("/apa")

@app.route("/apa_api")
def apa_api():
    #api_dict = {}
    pets_data = mongo.db.austin_pets_alive.find({}, {"_id":0, "pet_name":1, "pet_age": 1, "pet_sex": 1, "pet_breed": 1, "pet_location": 1,
    "dog": 1, "cat": 1, "child": 1, "homealone": 1, "pet_id": 1})
    return jsonify(list(pets_data))

## change data in the following two routes ##

@app.route("/shelter_api")
def shelter_api():
    #api_dict = {}
    shelter_data = mongo.db.animals.find({}, {"_id":0, "Animal ID":1, "Name": 1, "DateTime": 1, "MonthYear": 1, "Date of Birth": 1,
    "Outcome Type": 1, "Outcome Subtype": 1, "Animal Type": 1, "Sex upon Outcome": 1, "Age upon Outcome": 1,
    "Breed": 1, "Color": 1})
    return jsonify(list(shelter_data))

@app.route("/strays_api")
def strays_api():
    #api_dict = {}
    strays_data = mongo.db.coordinates.find({}, {"_id":0, "index":1, "lon": 1, "lat": 1, "addresses": 1, "LooksLike": 1})
    return jsonify(list(strays_data))

@app.route("/fetchedjsondata")
def fetchedjsondata():
    return render_template("fetchedjsondata.html")

@app.route("/apa")
def apa():
    return render_template("apa.html")

@app.route("/geomap")
def geomap():
    return render_template("geomap.html")


if __name__ == "__main__":
    app.run(debug=True)
