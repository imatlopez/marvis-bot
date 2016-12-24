"""Language support from Wit.ai"""

from wit import Wit

with open('.fb_oauth', 'r') as wit_oauth:
    WIT = wit_oauth.read().replace('\n', '')
client = Wit(access_token=WIT)


def message(text):
    text = str.lower(text)
    return client.message(text)
