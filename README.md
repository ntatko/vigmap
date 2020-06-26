# vigmap
1904 ol-kit mapathon project

Sorry, this isn't listening to the radio.
I really, really wanted it to, but the speech to text services were really bad at getting addresses, and police chatter has so many numbers, it's more than a weekend's job to get it through.

I then went in search of another news source: humans transcribing the radio. There are a good number of twitter feeds that are full of people listening to scanners and transcribing them in a more computer-readable way. That's my plan, for the meantime, but to read from twitter's api, you need a key, and to get a key, you need manual approval. Which, during COVID-19, aparently people need more than 3 days to do that. 

So this data is random. MOSTLY! I found a source that gave accident and traffic info, which could be useful if you're fighting bad people in the nightime. The downside... it's from mapquest.com. Yeah, I'm pretty embarassed about this whole thing, but ol-kit was pretty easy to use

## Setup
1. Make sure to `npm i` in each sub directory
<!-- 2. Make sure you `brew install ffmpeg` and `brew install portaudio`
3. In the `/api` directory run `pip3 install -r requirements.txt` to install Python deps -->

## Running
1. Open several terminal windows
2. From within the `/api` directory, `npm run start`
3. From within the `/ui` directory, `npm run start`

