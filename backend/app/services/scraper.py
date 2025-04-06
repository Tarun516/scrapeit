from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

def initialize_driver():
    # Setting up Chrome with required options
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Headless mode for running without opening the browser window
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36")

    
    # Initialize the Chrome driver using WebDriver Manager
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    return driver


def scrape_website(url):
    driver = initialize_driver()
    driver.get(url)
    
    # Get the page source and parse with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    
    # Extract title and meta description from the <head>
    title = soup.title.get_text(strip=True) if soup.title else 'No title found'
    meta_description = None
    if soup.head:
        description_tag = soup.head.find('meta', attrs={'name': 'description'})
        meta_description = description_tag['content'] if description_tag else 'No meta description found'
    
    # Extract the body content
    body_content = soup.body.get_text(  strip=True) if soup.body else 'No body content found'
    
    driver.quit()  # Close the driver

    return {
        'title': title,
        'meta_description': meta_description,
        'body_content': body_content
    }

 