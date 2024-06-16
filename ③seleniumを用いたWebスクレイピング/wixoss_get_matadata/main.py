import os
import my_func
import datetime
import traceback
import random
import time

# カレントパス
current_dir = os.path.dirname(os.path.abspath(__file__))
out_path = os.path.join(current_dir, 'data')

# URLファイル存在
url_check_flag = os.path.isfile(os.path.join(out_path, 'url_list.csv'))
# checkファイルcheck
check_flag = os.path.isfile(os.path.join(out_path, 'check.txt'))

# 全体時間計測開始
start = datetime.datetime.now()

# カードリストURL
base_url = 'https://www.takaratomy.co.jp/products/wixoss/card/card_list.php'
delimiter_url = '?'
series_url = 'product_no=WX24-P1'
search_url = base_url + delimiter_url #+ series_url

try:
    # URLリストがあるかチェック
    if not url_check_flag:
        url_list = my_func.get_wixoss_urllist(search_url)
        my_func.write_to_csv(url_list, os.path.join(out_path, 'url_list.csv'))

    if not check_flag:
        my_func.write_to_check(0, os.path.join(out_path, 'check.txt'))

    cheack_flag = int(my_func.read_to_check(os.path.join(out_path, 'check.txt')))
    url_list = my_func.read_to_csv(os.path.join(out_path, 'url_list.csv'))

    # テスト用
    # url_list = ['https://www.takaratomy.co.jp/products/wixoss/card_list.php?card=card_detail&card_no=PR-247','https://www.takaratomy.co.jp/products/wixoss/card_list.php?card=card_detail&card_no=PR-045','https://www.takaratomy.co.jp/products/wixoss/card_list.php?card=card_detail&card_no=SPDi01-67','https://www.takaratomy.co.jp/products/wixoss/card_list.php?card=card_detail&card_no=SPDi01-83']

    wixoss_list = []

    for i, url in enumerate(url_list[cheack_flag:], cheack_flag):
        time.sleep(random.randint(2, 6))

        print(str(i) + ":" + url)

        my_func.dict_to_csv(my_func.get_wixoss_card(url), os.path.join(out_path, 'evacuation.csv'))
        my_func.write_to_check(i, os.path.join(out_path, 'check.txt'))

    wixoss_list = my_func.csv_to_dict(os.path.join(out_path, 'evacuation.csv'))
    wixoss_list = list({id["id"]: id for id in wixoss_list}.values())
    my_func.write_to_json(wixoss_list, os.path.join(out_path, 'cardlist.json'))

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
