# vigmap
1904 ol-kit mapathon project

## process flow
1. start with mp3 file
2. POST /upload endpoint and convert to text chunks (pass down to Python script to do this)
3. Process the stream chunks and identify roads/cross streets and incident type
4. Use identifying info & hit Google to reverse geocode to output coords
5. Push out coords + metadata to websocket channel

```json
{
  "type": "
}
```
6. Subscribe to websocket on map and add points/markers

## Setup
1. Make sure to `npm i` in each sub directory
2. Make sure you `brew install ffmpeg` and `brew install portaudio`
3. In the `/api` directory run `pip3 install -r requirements.txt` to install Python deps

