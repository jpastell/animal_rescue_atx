#Importing modules
import os
from bs4 import BeautifulSoup
import requests
from splinter import Browser
import pandas as pd
import subprocess
import time
import re

#Pick the driver location
#get_ipython().system('which chromedriver')

driver_path = subprocess.Popen("which chromedriver", shell=True, stdout=subprocess.PIPE).\
                stdout.read().decode("utf-8").split('\n')[0]
print(driver_path)

debug = False

#function used to initilize the browser
def strat_browser():
    executable_path = {'executable_path': 'chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)
    return browser


#Function used to scrape mars data
def scrape_data():

    parsed_dict = dict()

    #browser creation
    browser = strat_browser()

    #-----------------------------
    #news
    #-----------------------------

    #URL of page to be scraped
    url = 'https://mars.nasa.gov/news'
    browser.visit(url)

    #This is ugly but works, delay to let the page load
    time.sleep(1)
      
    # Create BeautifulSoup object; parse with 'html.parser'
    soup = BeautifulSoup(browser.html, 'html.parser')  

    #Find all list divition than contain the data
    latest_news = soup.find('div', class_='list_text')
    news_title = latest_news.find('div', class_='content_title').text
    news_p = latest_news.find('div', class_='article_teaser_body').text

    if debug:
        print(news_title)
        print(news_p)

    parsed_dict.update({'nTitle':news_title})
    parsed_dict.update({'nPar':news_p})

    #-----------------------------
    #Featured Image
    #-----------------------------
    #url
    image_url = 'https://www.jpl.nasa.gov/spaceimages'
    browser.visit(image_url)
    #Uggly delay to let the page load
    time.sleep(1)
    # Create BeautifulSoup object; parse with 'html.parser'
    soup_img = BeautifulSoup(browser.html, 'html.parser')
    #Fimd the page to teh article that has the link to the large image
    image_result = soup_img.find('section', class_='centered_text clearfix main_feature primary_media_feature single')
    link_image = image_result.find('a',class_='button fancybox')['data-link']
    middle_page_link = image_url + link_image.split('spaceimages')[1]
    #Scrape the new URL
    browser.visit(middle_page_link)
    time.sleep(1)
    soup_limg = BeautifulSoup(browser.html, 'html.parser')
    #In this new page find the link to the large image
    limage_result = soup_limg.find('section', class_='content_page module').\
                                find('figure',class_='lede').find('a')['href']
    featured_image_url = image_url + limage_result.split('spaceimages')[1]

    if debug:
        print(f"Large image page: {featured_image_url}")
   

    parsed_dict.update({'featImg':featured_image_url})
   
    #-----------------------------
    #Mars weather
    #-----------------------------
    #URL of page to be scraped
    weather_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(weather_url)
    #Uggly delay
    time.sleep(1)
    weather_soup = BeautifulSoup(browser.html, 'html.parser')
    mars_weather = weather_soup.find('div', id='timeline').\
            find('div', class_='stream').find('div', class_='js-tweet-text-container').text

    if debug:
        print(mars_weather)

    parsed_dict.update({'mWeather':mars_weather})
   
    #-----------------------------
    #Mars facts
    #-----------------------------
    #URL to scrape
    url = 'https://space-facts.com/mars'
    tables = pd.read_html(url)
    table_str=tables[1].to_html(header=False,index=False)
    if debug:
        print(table_str)

    parsed_dict.update({'htmlTable':table_str})
   

    #-----------------------------
    #Hemispheres
    #-----------------------------

    #URL of page to be scraped
    main_page = 'https://astrogeology.usgs.gov'
    hemispheres_url = main_page +'/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemispheres_url)
    #Ugly delay
    time.sleep(1)
    hemispheres_soup = BeautifulSoup(browser.html, 'html.parser')
    hemispheres = hemispheres_soup.find('div', class_='collapsible results').find_all('div',class_='item')
    #Iiterate the paget to collet the data
    for hemisphere in hemispheres:
        title = hemisphere.find('div',class_='description').find('h3').text
        img_url = hemisphere.find('a')['href']
        #print(main_page +img_url)
        #Iterate over the link to get the complete image:
        browser.visit(main_page+img_url)
        img_comp = BeautifulSoup(browser.html, 'html.parser')
        wide_img_link = img_comp.find('div',id='wide-image').find('img',class_='wide-image')['src']
        #Assing the proper data using regular expressions
        txt = title
        if re.search("Cerberus*",txt):
            parsed_dict.update({'cerbTitle':title})
            parsed_dict.update({'cerbImg':main_page+wide_img_link})
            continue
        if re.search("Schiaparelli*",txt):
            parsed_dict.update({'schiaTitle':title})
            parsed_dict.update({'schiaImg':main_page+wide_img_link})
            continue
        if re.search("Syrtis*",txt):
            parsed_dict.update({'syrTitle':title})
            parsed_dict.update({'syrImg':main_page+wide_img_link})
            continue   
        if re.search("Valles*",txt):
            parsed_dict.update({'vallTitle':title})
            parsed_dict.update({'valImg':main_page+wide_img_link})
            continue       

    browser.quit()

    return parsed_dict

