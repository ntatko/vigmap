# twitterStream.py
1904 ol-kit mapathon project

## Setup
1. Run the script with `python twitterStream.py`
2. You must supply the following for Twitter Auth: `consumer_key`, `consumer_secret`, `access_token` and `access_token_secret`. This [link](https://themepacific.com/how-to-generate-api-key-consumer-token-access-key-for-twitter-oauth/994/) can help with getting this info
3. You can then either `sample` (stream twitter feed live) or `filter` (filter to list of `user_ids` and/or `keywords` i.e. hashtags)

## Helpful tips
1. This [link](http://gettwitterid.com/) is an easy way to grab the Twitter handle `user_id`
2. [Tweepy Docs](https://github.com/tweepy/tweepy/blob/master/docs/streaming_how_to.rst)