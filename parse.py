"""Language support from Wit.ai"""

import json
from wit import Wit


def send(request, response):
    response = json.dumps(response,
                          sort_keys=True,
                          indent=4,
                          separators=(',', ': '))
    print('sending...', response)


def getForecast(request):
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

with open('.fb_oauth', 'r') as wit_oauth:
    WIT = wit_oauth.read().replace('\n', '')
    print WIT
client = Wit(access_token=WIT, actions=actions)


def message(text):
    text = str.lower(text)
    return client.message(text)
