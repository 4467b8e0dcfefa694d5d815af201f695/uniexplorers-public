import os
import time
import logging
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

# Selenium dependencies
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class Scraper:
    SMU_LOGIN_URL = "https://login2.smu.edu.sg/adfs/ls/?wa=wsignin1.0&wtrealm=urn%3asharepoint%3asporprd&wctx=https%3a%2f%2foasis.smu.edu.sg%2f_layouts%2f15%2fAuthenticate.aspx%3fSource%3d%252FPages%252Fdefault%252Easpx"
    SMU_COURSE_URL = "https://studenteservices.smu.edu.sg/psc/ps/EMPLOYEE/PSFT_HR/c/SIS_EO.SIS_EO_SS_CRSEDB_S.GBL"
    OUTPUT_DIR = "./output"
    driver = None
    loggedin = False
    
    def __init__(self, headless=True) -> None:
        """
        Initialize Chrome WebDriver and ENV Variables
        """
        self.start_session(headless)
        load_dotenv()

        self.username = os.environ.get('USERNAME')
        self.pwd = os.environ.get('PASSWORD')

        datestr = datetime.today().strftime('%Y%m%d')
        self.OUTPUT_DIR = f'{self.OUTPUT_DIR}/{datestr}'
        if not os.path.exists(self.OUTPUT_DIR):
            os.mkdir(self.OUTPUT_DIR)
    
    def start_session(self, headless=True):
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless=new")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(2)
        logging.info('Chrome WebDriver Session successfully started')

    def get_session_status(self):
        return self.driver.session_id != None

    def login_smu(self):
        """
        Login to SMU
        """
        if self.loggedin:
            logging.info('SMU is already logged in!')
            return True

        try:
            # Navigate to the website login page
            self.driver.get(self.SMU_LOGIN_URL)
            time.sleep(5)

            # Locate the username and password input fields and the login button
            username_input = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "userNameInput")))
            username_input.send_keys(self.username)
            
            password_input = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "passwordInput")))
            password_input.send_keys(self.pwd)
            
            login_button = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, "submitButton")))
            login_button.click()
            time.sleep(3)

            self.loggedin = self.test_login_status()
            if self.loggedin:
                logging.info('SMU Login Successful!')
        except Exception as e:
            logging.error('SMU Login failed due to exception: %s', str(e))

    def test_login_status(self):
        count = 0
        while count < 3:
            try:
                count += 1
                logging.info(f'Attempting to confirm login... {count}')
                current_url = self.driver.current_url

                if current_url.startswith('https://login.microsoftonline.com'):
                    username_input = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.NAME, "loginfmt")))
                    submit_btn = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='submit' and @value='Next']")))

                    actions = ActionChains(self.driver)
                    actions.send_keys_to_element(username_input, self.username)
                    actions.click(submit_btn)
                    actions.perform()
                    time.sleep(2)
                
                success = WebDriverWait(self.driver, 5).until(EC.url_contains('https://smu.sharepoint.com/sites/oasis'))
                if success:
                    return True
            except Exception:
                logging.error('SMU Login failed...')
        
        return False
        


    def scrape_course_mappings(self, country_filter=[]):
        """
        Scrape course mappings 
        """
        logging.info('Logging in to SMU account')
        self.login_smu()
        if not self.loggedin:
            logging.info('Scraping not initiated due to failed SMU login')
            return 
        
        # Navigate to SMU Course Mapping Page
        self.driver.get(self.SMU_COURSE_URL)
        logging.info('Scraping successfully initiated')

        # Select Undergraduate Option
        program_type = Select(self.driver.find_element(By.ID, 'SIS_EO_DBSRCWRK_ACAD_CAREER'))
        program_type.select_by_value('UGRD')
        time.sleep(1)

        # Select Exchange Program Type
        study_program = Select(self.driver.find_element(By.ID, 'SIS_EO_DBSRCWRK_SIS_EXCH_PROG'))
        study_program.select_by_value('ISEP')
        time.sleep(1)

        # Get all available country options
        country = Select(self.driver.find_element(By.ID, 'SIS_EO_DBSRCWRK_COUNTRY'))
        countries = [(idx, c.text.strip()) for idx, c in enumerate(country.options) if c.text.strip()]
        if country_filter:
            countries = [(idx, c) for idx, c in countries if c in country_filter]

        # Iterate through all countries for applicable exchange programs with max 3 tries
        idx = 0
        tries = 3
        scraped_records = 0
        total_records = 0
        while idx < len(countries):
            try:
                records = set()
                country_idx, country_name = countries[idx]
                # Select country
                country = Select(self.driver.find_element(By.ID, 'SIS_EO_DBSRCWRK_COUNTRY'))
                country.select_by_index(country_idx)
                logging.info(f"Scraping '{country_name}' [country_idx {country_idx}]: {idx+1} / {len(countries)} countries")

                # Submit search
                search_btn = self.driver.find_element(By.ID, 'SIS_EO_DBSRCWRK_SEARCH_BUTTON')
                search_btn.click()
                time.sleep(3)

                # Iterate through available records
                rowcounter = self.driver.find_element(By.CLASS_NAME, 'PSGRIDCOUNTER').text
                total_per_search = int(rowcounter.split('of')[-1].strip())
                logging.info(f"Scraping '{country_name}': {rowcounter}")
                curr = 1
                while curr < total_per_search:
                    curr_records = self.driver.find_elements(By.CLASS_NAME, 'PSEDITBOX_DISPONLY')
                    for i in range(0, len(curr_records), 4):
                        # Every 4 items represent a row. Each item represent a column value
                        records.add((curr_records[i].text, curr_records[i+1].text, curr_records[i+2].text, curr_records[i+3].text))
                        curr += 1

                    # Exit loop if current row count exceeds total records per search
                    if curr >= total_per_search:
                        break
                    try:
                        next_btn = self.driver.find_element(By.ID, 'SIS_EO_DBSRCWRK$hdown$0')
                        next_btn.click()
                        time.sleep(2)
                    except WebDriverException as e:
                        # Break if next button not found; Reached last page
                        break
                
                # Assert scraped records more than 0
                assert len(records) > 0, f"No records found for '{country_name}'. Skipping '{country_name}'"
                
                # Export output to csv
                records = list(records)
                self.export_data(records)
                
                # Keep count of records scraped
                scraped_records += len(records)
                total_records += total_per_search
                
                # Increment iteration
                idx += 1
            except AssertionError as e:
                logging.warning(e.args[0])
                idx += 1
            except Exception as e:
                logging.error(f"Failed to scrape country '{country_name}' [country_idx {country_idx}] due to: %s", e.args[0])
                time.sleep(2)
                tries -= 1
                if tries > 0:
                    logging.info(f'{tries} tries remaining. Retrying...')
                    continue
                else:
                    logging.warning('No tries remaining. Stopping scraping process')
                    break
        
        logging.info(f'Finish scraping {scraped_records} / {total_records} records')
    
    def get_countries_scraped(self):
        output_path = f'{self.OUTPUT_DIR}'
        countries = set()
        for filename in os.listdir(output_path):
            country = filename.split('course_data_')[0].split('_')[0]
            countries.add(country)
        
    
    def export_data(self, records):
        logging.info(f'Exporting scraped data to {self.OUTPUT_DIR}...')
        df = pd.DataFrame.from_records(records)
        df.columns = ['Course Title', 'University', 'Country', 'Course Area']
        country = df.at[0, 'Country']

        # Append datestr to output path
        datestr = datetime.today().strftime('%Y%m%d')
        output_path = f'{self.OUTPUT_DIR}/course_data_{country}_{datestr}.parquet'
        
        df.to_parquet(output_path, index=False)
        logging.info(f'Successfully exported scraped data to {output_path}')

    def _quit(self):
        if self.get_session_status():
            self.driver.quit()
            logging.info('Webdriver session successfully terminated')
        else:
            logging.info('Webdriver session does not exist')
