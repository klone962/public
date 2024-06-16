from slack_sdk import WebClient

def send_slack_mess(mes_text):
    token = "token"
    client = WebClient(token)

    user_id = 'user_id'
    client.chat_postMessage(channel=user_id, text=mes_text)