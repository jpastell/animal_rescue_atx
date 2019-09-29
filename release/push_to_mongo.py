# import necessary libraries
from flask_pymongo import PyMongo
import csv
from flask import Flask

# Use PyMongo to establish Mongo connection
app = Flask(__name__)
mongo = PyMongo(app, uri="mongodb://localhost:27017/pets_db")

#Not used (deprecated)
# # Pushing aac data into mongo
# csvfile = open('../csv_docs/austin_animal_center_outcomes.csv', 'r')
# reader = csv.DictReader( csvfile )
# mongo.db.animals.drop()
# header= ["Animal ID", "Name", "DateTime", "MonthYear", "Date of Birth", "Outcome Type", "Outcome Subtype", "Animal Type", "Sex upon Outcome", "Age upon Outcome", "Breed", "Color"]
# for each in reader:
#     row={}
#     for field in header:
#         row[field]=each[field]

#     mongo.db.animals.insert_one(row)

# Pushing shelter coordinates data into mongo
csvfile_2 = open('csv_docs/shelters_coordinates_austin_updated.csv', 'r')
reader = csv.DictReader( csvfile_2 )
mongo.db.coordinates.drop()
header= ["index", "lon", "lat", "addresses", "LooksLike"]
for each in reader:
    row={}
    for field in header:
        row[field]=each[field]

    mongo.db.coordinates.insert_one(row)
