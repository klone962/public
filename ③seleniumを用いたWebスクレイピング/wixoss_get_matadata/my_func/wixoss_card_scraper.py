import requests
import time
import os
import random

from bs4 import BeautifulSoup

# スクレイピング対象のURL（最初のページ）
base_url = "https://www.takaratomy.co.jp/products/wixoss/card/card_list.php"

# URLからHTMLを取得する関数
def get_html(url):
    for _ in range(10):
        response = requests.get(url)

        if response.status_code == 200:
            # HTMLを解析する
            time.sleep(1)
            return response.content

        else:
            print(f"Error: Received status code {response.status_code}")
            print(_)
            time.sleep(random.randint(60, 90))

# HTMLを解析し、hrefを取得する関数
def scrape_href(html):
    soup = BeautifulSoup(html, 'html.parser')
    links = soup.find_all('ul')

    for ul in links:
        a_tag = ul.find('a', class_='ajax cboxElement')  # classが"ajax cboxElement"のaタグを取得

        if a_tag:
            url = a_tag['href']  # href属性の値を取得
            yield url

def get_wixoss_urllist(site_url: str) -> list:
    # ページネーションを辿りながら全ページのデータを取得
    current_page = 1

    # csv用
    all_data = []

    while True:
        url = f"{site_url}&card_page={current_page}"
        html = get_html(url)

        print(f"Scraping page {current_page}")
        
        #リストに格納してく
        #page_data = list(scrape_href(html))
        href_url = list(scrape_href(html))

        for i in href_url:
            all_data.append(base_url + str(i))

        #all_data.extend(page_data)
        
        # 次のページのリンクを取得
        soup = BeautifulSoup(html, 'html.parser')
        next_page_link = soup.find('a', string=str(current_page + 1))

        if next_page_link:
            current_page += 1

            time.sleep(1)
            
        else:
            break

    return all_data

# cardttlwrapの取得
def scrape_cardttlwrap(soup):

    dd_elements = soup.find_all('div', class_='cardttlwrap')
    cardttlwrap_dic = dict.fromkeys(['id', 'series', 'no', 'name', 'sp', 'rarity'])

    for element in dd_elements:
        # 例 WXDi-P16-084
        card_id = element.find('p', class_='cardNum').text
        index = card_id.rfind('-')
        card_series = card_id[:index]
        card_no = card_id[index+1:]

        # spanタグを削除する前に、span内のテキストを取得
        card_name = element.find('p', class_='cardName')
        span_text = card_name.find('span').text # 読み方

        card_name.find('span').decompose()  # spanタグを削除
        card_name_text = card_name.text.strip()  # 先頭と末尾の空白を削除 

        card_rarity = element.find('div', class_='cardRarity').text

        cardttlwrap_dic.update(id=card_id, series=card_series, no=card_no, name=card_name_text, sp=span_text, rarity=card_rarity)

        return cardttlwrap_dic


# cardDataの取得
def scrape_metadata(soup):
    cardData_elements = soup.find('div', class_='cardData')

    #cardData_dic = dict.fromkeys(['metadata', 'effect', 'flavor'])
    cardData_dic = dict.fromkeys(['effect', 'flavor'])
    metadata_key = ['category', 'type', 'color', 'lv', 'grow_cost', 'cost', 'limit', 'power', 'variable1', 'variable2', "format", "story"]

    # dlのみ抽出
    dl_elements = cardData_elements.find_all("dl", recursive=False)

    # ddの抽出
    dd_list = []

    for dl in dl_elements:
        dd = dl.find_all("dd")

        for i in dd:
            # altから文字列を抜き出す フォーマット用
            if i.find_all('img'):
                dd_alt_text = []

                for img in i.find_all('img'):
                    if 'cardData_story_img' in img.get('class', []):
                        filename = os.path.basename(img['src'])
                        name_part = filename.split('_')[-1]  # 'icon_txt_dissona.png' から 'dissona.png'
                        clean_name = name_part.split('.')[0].replace("dissona", "ディソナ")  # 'dissona.png' から 'dissona'
                        dd_alt_text = clean_name

                    else:
                        dd_alt_text.append(img.get('alt').replace("《", "").replace("》", "").replace("アイコン", ""))

                dd_list.append(dd_alt_text)

            # 通常時 ストーリーが空欄ならこれ
            else:
                dd_list.append(i.text.strip())

    # 抽出したddのリストとキーを1:1で辞書型に変換
    dd_dict = dict(zip(metadata_key, dd_list))
    
    # 各メタデータの処理
    dd_dict['category'] = dd_dict.get("category").split("\n")
    dd_dict["type"] = dd_dict.get("type").replace("\r\n", "\n").split("\n")
    dd_dict["color"] = list(dd_dict.get("color").replace("\n", ""))
    dd_dict["variable2"] = dd_dict.get("variable2").split("\n")
    dd_dict["format"] = dd_dict.get("format")
    
    # cardSkillのみ抽出
    cardskill_elements = cardData_elements.find_all('div', class_='cardSkill')
    cardskill_list = []
    effect_text = ""

    for skill in cardskill_elements:
        text_parts = []

        if skill.find('img'):
            alt_dict = {}
            skill_text = str(skill).replace("?", "")
            
            for tag in skill.find_all('img'):
                alt_text = str(tag['alt'])
                alt_add_text = tag.get_text()
                alt_all_text = alt_text + alt_add_text
                alt_dict[str(tag)] = alt_all_text
            
            for word, read in alt_dict.items():
                skill_text = skill_text.replace(word, read)
                
            skill_text = BeautifulSoup(skill_text, 'html.parser')
            text_parts.append(skill_text.text)

        else:
            for content in skill.contents:
                text_parts.append(content.string if content.string is not None else '')
            
        effect_text = ''.join(text_parts).strip().replace("\r\n", "\n").replace("\n", "").replace("アイコン", "")
        # 結合してクリーニング
        cardskill_list.append(effect_text)

    # cardText mb20のみ抽出
    flavor_elements = cardData_elements.find_all('div', class_='cardText mb20')
    flavor_text = ""

    for flavor in flavor_elements:
        flavor_text = flavor.text.strip()

    cardData_dic.update(effect=cardskill_list, flavor=flavor_text)
    cardData_dic.update(dd_dict)

    return cardData_dic

def get_wixoss_cardlist(urllist: list) -> list:

    card_list = []

    for i in urllist:
        card_dic = {}
    
        card_url = get_html(i)

        soup = BeautifulSoup(card_url, 'html.parser')
    
        cardttlwrap = scrape_cardttlwrap(soup)
        mata_data = scrape_metadata(soup)
        
        card_dic = dict(**cardttlwrap, **mata_data)
        
        print(i)
        card_list.append(card_dic)
        
    return card_list


def get_wixoss_card(url: str) -> dict:

    card_dic = {}
    card_url = get_html(url)
    
    soup = BeautifulSoup(card_url, 'html.parser')

    cardttlwrap = scrape_cardttlwrap(soup)
    mata_data = scrape_metadata(soup)
    
    card_dic = dict(**cardttlwrap, **mata_data)

    return card_dic