#Importing modules
import os
from bs4 import BeautifulSoup
import requests
from splinter import Browser
import pandas as pd
import platform
import subprocess
import time
import re

#function used to initilize the browser
def strat_browser():
    '''
    Return the browser object to do data scrape

    Params: None

    Return: browser object
    '''
    if(platform.system() == 'Darwin'):
        print("Mac system detected, loading chrome driver...")
        executable_path = {'executable_path': 'chromedriver'}
        browser = Browser('chrome', **executable_path, headless=False)
        return browser
    elif(platform.system() == 'Windows'):
        print("Mac system detected, loading chrome driver...")
        #-------------------------------
        executable_path = {'executable_path': 'chromedriver.exe'}
        windows_browser = Browser('chrome', **executable_path, headless=False)
        return windows_browser
        #-------------------------------

        #-------------------------------
    else:
        raise OSError("Platform not supported")


#Function used to scrape the data
def get_pages_count(soup):
    '''
    Return the number of pages to visit for APA that contain dog information

    Params: soup --> BeautifulSoup object

    Return: pet_entry --> number of pages to iterate
    '''
    #Get the pagination division
    pagination = soup.find('div', class_='pagination')
    pages = list()
    for page in pagination.find_all('a',class_='page'):
        pages.append(page.text)
    return(int(pages[-1]))

def get_pet_info_by_url(soup):
    '''
    Parse the dog information into a dictionary to append to Mongo DB

    Params: soup --> BeautifulSoup object

    Return: pet_entry --> dictionary will all pat information
    '''
    #Main dictionary that will hold the data base entry
    pet_entry = list()
    # Get all dog information
    all_dogs_per_page = soup.find_all('div', class_='large-tile')
    #Parse teh data
    for dog in all_dogs_per_page:
        #Dictonary used to store the data
        pet_data = dict()
        #Get the text based information
        #[-] Name
        pet_name = dog.find('h3').find('a').text
        #[-] Id
        pet_id = dog.find('h6').text
        #[-] Listed information : Age, Sex, Breed
        pet_info = dog.find('ul').find_all("li")
        #[--] Age , index 0
        age_data = pet_info[0].text.split('Months')[0].split('Years')
        #Conver the age in fraction of years
        pet_age = round(int(age_data[0].strip()) + (int(age_data[1].strip()) /12.0),2)
        #[--] Sex , index 1
        pet_sex = pet_info[1].text
        #[--] Breed , index 2
        pet_breed = pet_info[2].text
        #Build the data into the dictionary
        #Get the pet dtats , we need to translate from stars to numbers
        pet_location = pet_info[3].text
        pet_data.update({'pet_name':pet_name})
        pet_data.update({'pet_age':pet_age})
        pet_data.update({'pet_sex':pet_sex})
        pet_data.update({'pet_breed':pet_breed})
        pet_data.update({'pet_location':pet_location})
        #Count the starts to get the data
        possible_stat_list = dog.find_all('div',class_='stats-panel')
        for possible_stat in possible_stat_list:
            stat = possible_stat.find_all('div',class_='flex')
            for category in stat:
                category_name = category.find('span',class_='stats-text').text
                category_score = 0
                stars = category.find_all('img')
                for star in stars:
                    if('star full' == star['alt']):
                         category_score += 1
                #Update the dictionary for each stat
                pet_data.update({category_name.replace(" ", "").lower():category_score})
        pet_data.update({"pet_id":pet_id})
        #Update the main dictionary with the ID as main key and return
        pet_entry.append(pet_data)
    return pet_entry

def get_all_apa_data():
    '''
    Parse all dog information for APA dogs

    Params: None

    Return: pet_entry --> dictionary with the information
    '''
    #main page for DOG adoption APA
    main_url = url = 'https://www.austinpetsalive.org/adopt/dogs'
    #Base url to add the page to scrape
    bas_url_4_page = 'https://www.austinpetsalive.org/adopt/dogs/p'
    #Dictionary used to store all the data scraped
    pet_data = list()
    #create the browser object
    executable_path = {'executable_path': 'chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)
    #Create the defult list of URLs to vist and add the first page
    url_list = list(main_url)
    #Visit the main page to collect number of pages and the first data scrape
    browser.visit(main_url)
    # Create BeautifulSoup object; parse with 'html.parser'
    soup = BeautifulSoup(browser.html, 'html.parser')
    #Get the number fo pages to scrape besides the main one
    total_pages = get_pages_count(soup)
    #Update the data of the main entry page
    pet_data = pet_data + get_pet_info_by_url(soup)
    #Iterate over the next pages to get the complete data, we start in 2 bacause
    #index 1 is the pain page
    for page_idx in range(2, total_pages+1):
        #Build the new page
        page_url = bas_url_4_page + str(page_idx)
        #Visit the new page
        browser.visit(page_url)
        #parse teh data
        soup = BeautifulSoup(browser.html, 'html.parser')
        #Update the information
        pet_data = pet_data +get_pet_info_by_url(soup)
    #Clos ethe browser
    browser.quit()
    return pet_data

if __name__ == "__main__":
    print(get_all_apa_data())
