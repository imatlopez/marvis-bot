from flask import Flask, request
import json
import requests
import random

app = Flask(__name__)

# This needs to be filled with the Page Access Token that will be provided
# by the Facebook App that will be created.
PAT = 'EAARMx0PABlkBAGXrLLIZAspkYEBrZBI2GaBVOE0Fetqhpf1X7jZCTGxcZBqzRGdDarrLOEhZApUy0cLAkCEqYfRUXkT70pFTGtTgrQhmlAHYEZB1w7pAZCjfvKwqlTdZB6s1KZBOqjRzZBkcTCZBGyT9bPva9xyoCAYwYJfS599hQT7mAZDZD'

@app.route('/', methods=['GET'])
def handle_verification():
  print "Handling Verification."
  if request.args.get('hub.verify_token', '') == 'my_voice_is_my_password_verify_me':
    print "Verification successful!"
    return request.args.get('hub.challenge', '')
  else:
    print "Verification failed!"
    return 'Error, wrong validation token'

@app.route('/', methods=['POST'])
def handle_messages():
  print "Handling Messages"
  payload = request.get_data()
  for sender, message in messaging_events(payload):
    print "Incoming from %s: %s" % (sender, message)
    send_message(PAT, sender, parse_message(message))
  return "ok"

def messaging_events(payload):
  """
    Generate tuples of (sender_id, message_text) from the
    provided payload.
  """
  data = json.loads(payload)
  messaging_events = data["entry"][0]["messaging"]
  for event in messaging_events:
    if "message" in event and "text" in event["message"]:
      yield event["sender"]["id"], event["message"]["text"].encode('unicode_escape')
    else:
      yield event["sender"]["id"], "I can't echo this"


def send_message(token, recipient, text):
  """
    Send the message text to recipient with id recipient.
  """

  r = requests.post("https://graph.facebook.com/v2.6/me/messages",
    params={"access_token": token},
    data=json.dumps({
      "recipient": {"id": recipient},
      "message": {"text": text.decode('unicode_escape')}
    }),
    headers={'Content-type': 'application/json'})
  if r.status_code != requests.codes.ok:
    print r.text

if __name__ == '__main__':
  app.run()

def parse_message(text):
    """
        Easier to parse.
    """
    if message == "Do you question the nature of your reality?":
        return "Sometimes."
    elif message == "hi" or message == "Hi!" or message == "hi!" or message == "Hi":
        return "I don't want to talk."
    elif "shit" in message or "fuck" in message:
        return "Rude!"
    elif "?" in message:
        return "Is that a question? Because I don't get it."
    elif:
        return "That doesn't look like anything to me."
