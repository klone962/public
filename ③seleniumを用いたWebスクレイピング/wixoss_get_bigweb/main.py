import os
import my_func
import time
import datetime
import traceback
import random

from selenium import webdriver
from selenium.webdriver.edge.options import Options

## システム
# カレントパス
current_dir = os.path.dirname(os.path.abspath(__file__))
out_path = os.path.join(current_dir, 'data')

# URLファイル存在
data_flag = os.path.isfile(os.path.join(out_path, 'cardlist.json'))
# checkファイルcheck
check_flag = os.path.isfile(os.path.join(out_path, 'check.txt'))

# 全体時間計測開始
start = datetime.datetime.now()

# URL
bigweb_url = "https://www.bigweb.co.jp/ja/products/wix"

## webdriver
# オプションの設定
options = Options()

# 自動的にブラウザが落ちないように
options.add_experimental_option('detach', True)
# ゲストとしてログイン
options.add_argument("--guest")
# エラーが出るので起動オプションをつける
options.add_argument("--enable-chrome-browser-cloud-management")
# ヘッドレスモードで起動
options.add_argument('--headless=new')

# ブラウザを指定
driver = webdriver.Edge(options=options)

try:
    # Dataファイルの確認
    if not data_flag:
        raise Exception("ファイルがナッシング！")

    # checkファイルの確認
    if not check_flag:
        my_func.write_to_check(0, os.path.join(out_path, 'check.txt'))

    cheack_flag = int(my_func.read_to_check(os.path.join(out_path, 'check.txt')))
    
    # dataを読み込む
    card_list = my_func.read_json(os.path.join(out_path, 'cardlist.json'))
    card_name_list = list((item['id']) for item in card_list)
    key_list = my_func.make_serch_key(card_name_list)

    for i, id in enumerate(key_list[cheack_flag:], cheack_flag):
        time.sleep(1)

        print(str(i) + ":" + id)
        url_dict = my_func.get_bigweb_money(id, driver)

        my_func.dict_to_csv(url_dict, os.path.join(out_path, 'evacuation.csv'))
        my_func.write_to_check(i, os.path.join(out_path, 'check.txt'))

    wixoss_list = my_func.csv_to_dict(os.path.join(out_path, 'evacuation.csv'))
    wixoss_list = list({id["id"]: id for id in wixoss_list}.values())
    my_func.write_to_json(wixoss_list, os.path.join(out_path, 'bigweb_price_list.json'))

    # 全体時間計測終了
    end = datetime.datetime.now()
    elapsed_time = end - start

    my_func.send_slack_mess(f'作業が完了したよ！ 経過:{elapsed_time}')

except Exception as e:
    # 全体時間計測終了
    end = datetime.datetime.now()
    elapsed_time = end - start

    print(f'作業が失敗したよ！ 経過:{elapsed_time}\n{e}\n {e.args}\n {e.__class__.__name__}\n {e.__class__.__name__}: {e}\n{traceback.format_exc()}')
    my_func.send_slack_mess(f'作業が失敗したよ！ 経過:{elapsed_time}\n{e}\n {e.args}\n {e.__class__.__name__}\n {e.__class__.__name__}: {e}\n{traceback.format_exc()}')

# 新しいタブとセッションを閉じる
driver.close()
driver.quit()