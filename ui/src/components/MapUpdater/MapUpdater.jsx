import { Component } from 'react'
import io from 'socket.io-client'
import { connectToMap } from '@bayer/ol-kit'
import proj from 'ol/proj';
import extent from 'ol/extent';


class MapUpdater extends Component {

  // reference to the map: `const { map } = this.props;` will pull the map in for use

  constructor() {
    super()

    this.state = {
      points: [],
      accidentExtent: null
    }
  }

  componentDidMount() {
    this.streamFeed()
    this.props.map.on('moveend', this.accidents.bind(this))
  }

  addNewPoint(emittedEvent) {
    this.setState((state) => ({points: state.points.concat(emittedEvent)}));
  }

  streamFeed() {
    const manager = io('localhost:8081')
    manager.on('sent coordinates', (data) => {
      //console.log("we're seeing data", data);
      this.addNewPoint({source: 'stream', time: Date.now(), ...data})
    });
  }

  async accidents() {
    const { map } = this.props;
    console.log("original bounds", map.getView().calculateExtent(map.getSize()))
    const bounds = proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326')
    console.log("bounds", bounds)
    while (-180 > bounds[0] || bounds[0] > 180) {
      console.log("infinite loop?")
      if (bounds[0] < -180) {
        bounds[0] = bounds[0] + 360;
        bounds[2] = bounds[2] + 360;
      } else if (bounds[0] > 180) {
        bounds[0] = bounds[0] - 360;
        bounds[2] = bounds[2] - 360
      }
    }
    const transformedBounds = [bounds[1], bounds[0], bounds[3], bounds[2]]
    console.log("bounds", transformedBounds)
    if (this.state.accidentExtent && extent.containsExtent(this.state.accidentExtent, map.getView().calculateExtent(map.getSize()))) {
      // if a previous extent contains the current extent, do nothing
      return;
    }
    if (bounds.length !== 4 || Math.abs(transformedBounds[0]-transformedBounds[2]) > 0.7 || Math.abs(transformedBounds[1]-transformedBounds[3]) > 0.7) {
      console.log("too far away to request anything")
      // if we have the wrong bounds, or the extent is too large, do nothing
      // mapquest does not allow extends broader than .2 of lat or long
      return;
    }
    //build mapquest query
    const key = '82OD8xUAEGtjlGG8QmixjVe90rErA3NU';
    const coordArg = transformedBounds.join('%2C');
    const url = `http://www.mapquestapi.com/traffic/v2/incidents?key=${ key }&boundingBox=${ coordArg }&filters=incidents&outFormat=json`
    
    // save extent to state
    this.setState({accidentExtent: map.getView().calculateExtent(map.getSize())})

    // get mapquest incidents
    console.log("url", url)
    const response = await fetch(url)
    if (response.status !== 200) {
      throw Error(response.message);
    }
    const json = await response.json()
    json.incidents && json.incidents.forEach((incident) => {
      this.addNewPoint({event: 'traffic incident', coords: { lat: incident.lat, long: incident.lng }, text: incident.fullDesc})
    })
  }

  render() {
    return null;
  }
}

export default connectToMap(MapUpdater)