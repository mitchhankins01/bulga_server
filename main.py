#!./python

from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
from datetime import datetime
from base64 import urlsafe_b64decode
from email import message_from_bytes
from bs4 import BeautifulSoup
from json import dumps
from sys import stdout, stderr, argv
from uuid import uuid4
import datetime

SCOPES = 'https://www.googleapis.com/auth/gmail.modify'


def parse_mail(messages):
    results = []
    for message in messages:
        html = BeautifulSoup(message, 'html.parser')
        for table in html.select('table'):
            if "".join(table['class']) == 'Content':
                text = table.select('td')[0].text
                amount_index = text.find('$')
                date_index = text.find('Date:')
                description_index = text.find('Description:')
                location_index = text.find('Location:')

                amount = text[amount_index + 1:date_index]
                date = text[date_index + 6:description_index]
                description = " ".join(
                    text[description_index + 13:location_index].split())
                ret = dict(amount=amount, date=datetime.datetime.strptime(date, '%m/%d/%Y').strftime('%Y-%m-%d'),
                           description=description, id="/".join(amount + date + description))
                results.append(ret)
    print(dumps(results))


def fetch_mail():
    messages = []
    store = file.Storage(argv[1])
    credentials = store.get()

    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        credentials = tools.run_flow(flow, store)

    service = build('gmail', 'v1', http=credentials.authorize(Http()))

    query = 'label:unread from:notifications@morganstanley.com'

    result = service\
        .users()\
        .messages()\
        .list(userId='me', q=query)\
        .execute()

    for message in result['messages']:
        result = service\
            .users()\
            .messages()\
            .get(userId='me', id=message['id'])\
            .execute()

        msg_str = urlsafe_b64decode(
            result['payload']['body']['data'].encode('UTF8'))

        mime_msg = message_from_bytes(msg_str)
        messages.append(str(mime_msg))

    parse_mail(messages)


if __name__ == '__main__':
    fetch_mail()
