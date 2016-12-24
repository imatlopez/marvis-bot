"""Connects with messenger API"""

from flask import Flask
from flask import request
import json
import parse
import requests

app = Flask(__name__)

# This needs to be filled with the Page Access Token that will be provided
# by the Facebook App that will be created.
with open('.fb_oauth', 'r') as fb_oauth:
    PAT = fb_oauth.read().replace('\n', '')

handshake = 'my_voice_is_my_password_verify_me'


@app.route('/', methods=['GET'])
def handle_verification():
    print("Handling Verification.")
    if request.args.get('hub.verify_token', '') == handshake:
        print("Verification successful!")
        return request.args.get('hub.challenge', '')
    else:
        print("Verification failed!")
        return 'Error, wrong validation token'


@app.route('/', methods=['POST'])
def handle_messages():
    print("Handling Messages")
    payload = request.get_data()
    for sender, message in messaging_events(payload):
        print("Incoming from %s: %s" % (sender, message))
        send_message(PAT, sender, parse.message(message))
    return "ok"


def messaging_events(payload):
    """Generate tuples of (sender_id, message_text) from the provided payload.

    """

    data = json.loads(payload)
    messaging_events = data["entry"][0]["messaging"]
    for event in messaging_events:
        sender = event["sender"]["id"]
        if "message" in event and "text" in event["message"]:
            yield sender, event["message"]["text"].encode('unicode_escape')
        else:
            yield sender, "I can't echo this"


def send_message(token, recipient, text):
    """Send the message text to recipient with id recipient.

    """

    text = text.decode('unicode_escape')
    r = requests.post("https://graph.facebook.com/v2.6/me/messages",
                      params={"access_token": token},
                      data=json.dumps({
                                      "recipient": {"id": recipient},
                                      "message": {"text": text}
                                      }),
                      headers={'Content-type': 'application/json'})
    if r.status_code != requests.codes.ok:
        print(r.text)

if __name__ == '__main__':
    app.run()
