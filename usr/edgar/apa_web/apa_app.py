# import necessary libraries
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import spa_web


# create instance of Flask app
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/dog_app")


# create route that renders index.html template
@app.route("/")
def home():

    # Find one record of data from the mongo database
    dogs = mongo.db.collection.find_one()

    # Return template and data
    return render_template("index.html", dogs = dogs)


# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():

    # Run the scrape function
    apa_data = get_all_apa_data()

    # Update the Mongo database using update and upsert=True
    mongo.db.collection.update({}, apa_data, upsert=True)

    # Redirect back to home page
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
