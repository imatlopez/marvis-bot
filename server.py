"""Connects with messenger API"""

from flask import Flask
from flask import request
import json
import requests
from wit import Wit

app = Flask(__name__)

# This needs to be filled with the Page Access Token that will be provided
# by the Facebook App that will be created.
with open('.fb_oauth', 'r') as fb_oauth:
    PAT = fb_oauth.read().replace('\n', '')

with open('.wit_oauth', 'r') as wit_oauth:
    WIT = wit_oauth.read().replace('\n', '')


# WIT ACTIONS
def send(request, response):
    response = json.dumps(response,
                          sort_keys=True,
                          indent=4,
                          separators=(',', ': '))
    print('sending...', response)


def getForecast(request):
    request = json.loads(request)
    context = request["context"]
    entities = request["entities"]
    location = entities["location"]
    if location:
        # Here should go the api call, e.g.:
        # context.forecast = apiCall(context.loc)
        context["forecast"] = "sunny in" + str(location)
        del context["missingLocation"]
    else:
        context["missingLocation"] = True
        del context["forecast"]
    return context

actions = {
    'send': send,
    'getForecast': getForecast
}

client = Wit(access_token=WIT, actions=actions)


@app.route('/', methods=['GET'])
def handle_verification():
    print("Handling Verification.")
    if request.args.get('hub.verify_token', '') == WIT:
        print("Verification successful!")
        return request.args.get('hub.challenge', '')
    else:
        print("Verification failed!")
        return 'Error, wrong validation token'


@app.route('/', methods=['POST'])
def handle_messages():
    print("Handling Messages")
    payload = request.get_data()
    for sender, message in fb_events(payload):
        print("Incoming from %s: %s" % (sender, message))
        messenger(PAT, sender, client.message(message))
    return "ok"


def messenger(token, recipient, text):
    """Send the message text to recipient with id recipient.

    """
    if type(text) is dict:
        text = "I am witless."
    else:
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


def fb_events(payload):
    """Generate tuples of (sender_id, message_text) from the provided payload.

    """

    data = json.loads(payload)
    for event in data["entry"][0]["messaging"]:
        sender = event["sender"]["id"]
        if "message" in event and "text" in event["message"]:
            yield sender, event["message"]["text"].encode('unicode_escape')
        else:
            yield sender, "I can't echo this"

if __name__ == '__main__':
    app.run()
