import re
from slack_sdk import WebClient

def send_slack_mess(mes_text):
    token = "token"
    client = WebClient(token)

    user_id = 'user_id'
    client.chat_postMessage(channel=user_id, text=mes_text)

def json_duplication_delete(ids):
    # IDの末尾にA、B、Uなどの文字列が存在した場合削除し、重複を除外
    processed_ids = []

    for id in ids:
        # 正規表現を使用して、IDの末尾の英字を削除
        processed_id = re.sub(r'[A-Z]+$', '', id)

        if processed_id not in processed_ids:
            processed_ids.append(processed_id)

    return processed_ids