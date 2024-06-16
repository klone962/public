from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, ElementClickInterceptedException
import re

front_url = 'https://www.bigweb.co.jp/ja/products/wix/list?name='
back_url = '&is_box=0&is_supply=0&is_purchase=0'

def get_bigweb_money(card_id: str, driver) -> str:
    # 価格入れるようのリスト
    data_list = []
    card_dict = dict.fromkeys(['id', 'url', 'data'])

    url = front_url + card_id + back_url

    driver.get(f"{url}")

    # item-gridが読み込まれるまで待機（念のためwaitを1秒）
    driver.implicitly_wait(1)

    # データがないとエラーになる
    try:
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'app-grid-itembox')))

        item_boxes = driver.find_elements(By.CSS_SELECTOR, 'app-grid-itembox')
        
        for box in item_boxes:
            data_dict = dict.fromkeys(['rarity', 'stock', 'price'])
            # レアリティの取得
            raritys = box.find_elements(By.CSS_SELECTOR, '.images-item-title .ng-star-inserted')
            
            for i in raritys:
                if serch_text(i.text):
                    rarity = replace_rarity(replace_text(i.text))

            # 価格の取得
            try:
                price = replace_price(box.find_element(By.CSS_SELECTOR, '.item-product-price').text)
                stock_text = "◯"
            
            except Exception as e:
                price = "×"
                stock_text = "×"
            
            data_dict.update(rarity=rarity, stock=stock_text, price=price)
            data_list.append(data_dict)

    except TimeoutException:
        data_dict = dict.fromkeys(['rarity', 'stock', 'price'])

        data_dict.update(rarity='null', stock='null', price='null')
        data_list.append(data_dict)
        
    card_dict.update(id=card_id, url=url, data=data_list)

    return card_dict

def make_serch_key(ids):
    # IDの末尾にA、B、Uなどの文字列が存在した場合削除し、重複を除外
    processed_ids = []

    for id in ids:
        # 正規表現を使用して、IDの末尾の英字を削除
        processed_id = re.sub(r'(?<!-)[A-Z]+$', '', id)

        if processed_id not in processed_ids:
            processed_ids.append(processed_id)

    return processed_ids

def transform_rarity(s):
    if s == "P-C":
        return "CP"
    elif s == "P-LC":
        return "LCP"
    else:
        return s

def replace_text(text):
    text = re.sub(r'【ﾊﾟﾗﾚﾙ】', 'P', text)
    text = re.sub(r'【シークレット】', 'SCR', text)
    text = re.sub(r'ウルトラレア【UR】', 'UR', text)
    return text

def serch_text(text):
    text = re.search(r'C|L|LC|R|LR|SR|UR|7th|\?\?\?|HRR|TK|CO|ST|SP|PR|V|WS|GC|CD|BB|BM|AS|CL|JR|RE|PI|シークレット|MAM|GR|DIR', text)
    return text

def replace_rarity(text):
    re_text = re.sub(r'\[|\]', '', text)
    return re_text

def replace_price(text):
    re_text = re.sub(r'\D', '', text)
    return re_text

# def get_bigweb_money(card_id: str, card_series: str, driver) -> str:
#     # 価格入れるようのリスト
#     data_list = []
#     card_dict = dict.fromkeys(['id', 'url', 'data'])

#     url = "null"

#     bigweb_url = front_url + card_id + back_url
#     driver.get(f"{bigweb_url}")

#     try:    
#         # item-gridが読み込まれるまで待機（念のためwaitを1秒）
#         driver.implicitly_wait(1)
    
#         # データがないとエラーになる
#         first_item_link = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, "//app-grid-itembox[1]//a")))

#         # url取得
#         url = driver.current_url

#         # 売り切れだとエラーになる
#         try:
#             first_item_link.click()

#         except ElementClickInterceptedException as e:
#             # 検索時の件数を探索
#             item_boxes = driver.find_elements(By.TAG_NAME, "app-grid-itembox")

#             for i in item_boxes:
#                 # 検索ヒットなしだとエラーになる
#                 first_item_link = i.find_element(By.TAG_NAME, "a")

#                 try:
#                     first_item_link.click()
#                     break

#                 except Exception as e:
#                     if i == item_boxes[-1]:
#                         raise ElementClickInterceptedException
        
#         time.sleep(random.randint(1, 3))

#         try:
#             WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR,'table.sameNameItemstable tbody tr')))
#             rows = driver.find_elements(By.CSS_SELECTOR, "table.sameNameItemstable tbody tr")

#             for row in rows:
#                 # data用のdict
#                 data_dict = dict.fromkeys(['rarity', 'stock', 'price'])
                
#                 # bigwebのみ同シリーズの価格のみを取り除く処理を追加
#                 series = row.find_element(By.CSS_SELECTOR, "td.sameNameItemstable-cardset").text
#                 match = re.search(r'〔(.*?)〕', series)
#                 extracted_series = match.group(1) if match else 'Not found'
                
#                 if extracted_series == card_series:
#                     # 各列に対応するデータを取得します。
#                     rarity = row.find_element(By.CSS_SELECTOR, "td.sameNameItemstable-rarity").text
                    
#                     # 状態と在庫は、売り切れの行では取得できないため、条件分岐が必要です。
#                     if "sold_out-row" not in row.get_attribute("class"):
#                         stock_count = row.find_element(By.CSS_SELECTOR, "td.sameNameItemstable-stock_count").text
#                         price = row.find_element(By.CSS_SELECTOR, "td.sameNameItemstable-price").text

#                     else:
#                         stock_count = "0"
#                         price = "売り切れ"
                    
#                     data_dict.update(rarity=replace_text(rarity), stock=stock_count, price=price)
#                     data_list.append(data_dict)
                
#                 if len(data_list) == 0:
#                     data_dict.update(rarity="sold", stock="sold", price="sold")
#                     data_list.append(data_dict)

#         except TimeoutException:
#             print("特殊ページ")
#             data_dict = dict.fromkeys(['rarity', 'stock', 'price'])
#             data_dict.update(rarity="special", stock="special", price="special")
#             data_list.append(data_dict)

#     except ElementClickInterceptedException:
#         print("売り切れ")
#         data_dict = dict.fromkeys(['rarity', 'stock', 'price'])
#         data_dict.update(rarity="sold", stock="sold", price="sold")
#         data_list.append(data_dict)

#     except TimeoutException:
#         print("商品なし")
#         data_dict = dict.fromkeys(['rarity', 'stock', 'price'])
#         data_dict.update(rarity="null", stock="null", price="null")
#         data_list.append(data_dict)

#     card_dict.update(id=card_id, url=url, data=data_list)

#     return card_dict