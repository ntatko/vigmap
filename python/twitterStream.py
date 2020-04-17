#!/usr/bin/env python

import time
from getpass import getpass
from textwrap import TextWrapper
import pprint
import json
import datetime

import tweepy

pp = pprint.PrettyPrinter(indent=4)

def date_range(start,end):
    current = start
    print(current)
    while (end - current).days >= 0:
        yield current
        current = current + datetime.timedelta(seconds=1)
class StreamWatcherListener(tweepy.StreamListener):

    status_wrapper = TextWrapper(width=60, initial_indent='    ', subsequent_indent='    ')

#     # The following is the original on_status function. It runs the stream live.
    # def on_status(self, status):
    #     try:
    #         #pprint.pprint(status._json) #Debugging
    #         #print(dir(status)) #Debugging
    #         #print(status.geo)
    #         print(self.status_wrapper.fill(status.text))
    #         print('\n %s  %s  via %s\n' % (status.author.screen_name, status.created_at, status.source))
    #     except:
    #         # Catch any unicode errors while printing to console
    #         # and just ignore them to avoid breaking application.
    #         pass
        
    # The following is an example for pulling tweets from a date range.
    def on_status(self, status):
        try:
            #status.created_at = datetime.datetime(2019,4,7,15,37,58) #testing manual dt
            startDate = datetime.datetime(2019, 4, 7) #Known tweet range for #stlscannerradio
            stopDate = datetime.datetime(2019, 4, 8) #Known tweet range for #stlscannerradio
            for date in date_range(startDate,stopDate):
                status.created_at = date
                print ("tweet " + str(status.created_at) +"\n")
                print (status.text + "\n")
                print (status.geo + "\n")
        except:
            print('hey')
            # Catch any unicode errors while printing to console
            # and just ignore them to avoid breaking application.
            pass

    def on_error(self, status_code):
        print('An error has occured! Status code = %s' % status_code)
        return True  # keep stream alive

    def on_timeout(self):
        print('Snoozing Zzzzzz')

def main():
    # Prompt for login credentials and setup stream object
    consumer_key = input('Consumer Key: ')
    consumer_secret = getpass('Consumer Secret: ')
    access_token = input('Access Token: ')
    access_token_secret = getpass('Access Token Secret: ')

    auth = tweepy.auth.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = tweepy.Stream(auth, StreamWatcherListener(), timeout=None)

    # Prompt for mode of streaming
    valid_modes = ['sample', 'filter']
    while True:
        mode = input('Mode? [sample/filter] ')
        if mode in valid_modes:
            break
        print('Invalid mode! Try again.')

    if mode == 'sample':
        stream.sample()

    elif mode == 'filter':
        follow_list = input('Users (ids) to follow (comma separated): ').strip()
        track_list = input('Keywords to track (comma seperated): ').strip()
        if follow_list:
            follow_list = [u for u in follow_list.split(',')]
            userid_list = []
            username_list = []
            
            for user in follow_list:
                if user.isdigit():
                    userid_list.append(user)
                else:
                    username_list.append(user)
            
            for username in username_list:
                user = tweepy.API().get_user(username)
                userid_list.append(user.id)
            
            follow_list = userid_list
        else:
            follow_list = None
        if track_list:
            track_list = [k for k in track_list.split(',')]
        else:
            track_list = None
        print(follow_list)
        stream.filter(follow_list, track_list)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\nGoodbye!')

