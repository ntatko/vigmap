import React, { Component } from 'react'
import io from 'socket.io-client'
import { connectToMap, LayerPanel, LayerPanelPage, LayerPanelHeader, LayerPanelContent } from '@bayer/ol-kit'
import Geolocation from 'ol/geolocation'
import proj from 'ol/proj'
import extent from 'ol/extent'
import Feature from 'ol/feature'
import Point from 'ol/geom/point'
import Style from 'ol/style/style'
import Stroke from 'ol/style/stroke'
import Circle from 'ol/style/circle'
import Fill from 'ol/style/fill'
import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'
import easing from 'ol/easing'
import RssFeed from '@material-ui/icons/RssFeed'
import { Checkbox } from '@thumbtack/thumbprint-react'
import { Card, Time, Message, Icon} from './styled'

const emojis = [{name: "POLICE", symbol: "🚓", color: 'rgba(19, 89, 241, 0.64)'}, {name: "FIRE + EMT", symbol: "🚒➕🚑", color: 'rgba(241, 19, 19, 0.64)'}, {name: 'TRAFFIC INCIDENT', symbol: "🚧", color: 'rgba(241, 238, 19, 0.7)'}]

class MapUpdater extends Component {

  // reference to the map: `const { map } = this.props;` will pull the map in for use

  constructor(props) {
    super(props)

    this.state = {
      points: [],
      accidentExtent: null,
      location: null,
      showEventTypes: []
    }

    this.geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: props.map.getView().getProjection()
    })
  }

  componentDidMount() {
    this.streamFeed()
    this.props.map.on('moveend', this.accidents.bind(this))
    this.addUserLocation()
  }

  componentDidUpdate({geolocate: prevGeoLocate}) {
    const { geolocate } = this.props
    if (geolocate && !prevGeoLocate) {
      this.addUserLocation()
    } else if (!geolocate && prevGeoLocate) {

      this.addUserLocation()
    }
  }

  addNewPoint(emittedEvent) {
    this.setState((state) => ({points: state.points.concat(emittedEvent)}));
  }

  streamFeed() {
    const manager = io('localhost:8081')
    manager.on('sent coordinates', (data) => {
      //console.log("we're seeing data", data);
      this.addNewPoint({source: 'stream', time: new Date().getTime(), ...data})
    });
  }

  addUserLocation() {
    const { map, geolocate } = this.props
    const myLayer = map.getLayers().getArray().find((layer) => layer.get('id') === 'ME')
    if (!geolocate && myLayer) {
      // myLayer.on('postrender', animate)
      map.removeLayer(myLayer)
      this.geolocation.setTracking(false)
      this.geolocation.un('change', this.updateUserLocation.bind(this))
    } else if (geolocate && !myLayer) {
      this.geolocation.setTracking(true)
      const iconStyle = new Style({
        stroke: new Stroke(),
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: 'white'
          }),
          stroke: new Stroke({
            color: 'cyan',
            width: 2
          })
          // anchor: [0.5, 46],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'pixels',
          // src: '../../images/cape.png'
        })
      });

      const newMyLayer = new VectorLayer({
        source: new VectorSource(),
        style: iconStyle,
      })

      newMyLayer.set('id', 'ME')
      newMyLayer.set('title', 'My Location')

      map.addLayer(newMyLayer)

      newMyLayer.getSource().on('addfeature', (e) => {
        this.flash(e.feature);
      });

      this.geolocation.on('change:position', this.updateUserLocation.bind(this))

      const iconFeature = new Feature({
        geometry: null,
        name: 'My Location',
        population: 4000,
        rainfall: 500
      })
      iconFeature.set('id', 'currentLocation')
      iconFeature.set('title', 'My Place in the World')
      iconFeature.setStyle(iconStyle)

      newMyLayer.getSource().addFeature(iconFeature)
    }
  }

  updateUserLocation() {
    const { map, setCurrentLocation } = this.props
    const myLayer = map.getLayers().getArray().find((layer) => layer.get('id') === 'ME')
    const myFeature = myLayer && myLayer.getSource().getFeatures().find((feature) => feature.get('id') === 'currentLocation')
    if (myFeature) {
      const coordinates = this.geolocation.getPosition()
      setCurrentLocation(coordinates)
      myFeature.setGeometry(coordinates ? new Point(coordinates) : null)
    }
  }

  flash(feature) {
    const { map } = this.props
    const duration = 3000
    let start = new Date().getTime()
    map.getLayers().getArray().find((layer) => layer.get('id') === 'ME').on('render', animate)
    map.render();

  
    function animate(event) {
      const vectorContext = event.vectorContext
      const frameState = event.frameState
      const flashGeom = feature.getGeometry().clone()
      const elapsed = (frameState.time - start) % duration
      const elapsedRatio = elapsed / duration
      // radius will be 5 at start and 30 at end.
      const radius = easing.easeOut(elapsedRatio) * 50 + 5
      const opacity = easing.easeOut(1 - elapsedRatio)
  
      const style = new Style({
        image: new Circle({
          radius: radius,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, ' + opacity + ')',
            width: 0.25 + opacity
          })
        })
      });
  
      vectorContext.setStyle(style)
      vectorContext.drawGeometry(flashGeom)
      if (elapsed > duration) {
        start = new Date().getTime()
        // unByKey(listenerKey)
        return
      }
      // tell OpenLayers to continue postrender animation
      map.render();
    }
  }

  async accidents() {
    const { map } = this.props;
    const bounds = proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326')
    while (-180 > bounds[0] || bounds[0] > 180) {
      if (bounds[0] < -180) {
        bounds[0] = bounds[0] + 360;
        bounds[2] = bounds[2] + 360;
      } else if (bounds[0] > 180) {
        bounds[0] = bounds[0] - 360;
        bounds[2] = bounds[2] - 360
      }
    }
    const transformedBounds = [bounds[1], bounds[0], bounds[3], bounds[2]]
    if (this.state.accidentExtent && extent.containsExtent(this.state.accidentExtent, map.getView().calculateExtent(map.getSize()))) {
      // if a previous extent contains the current extent, do nothing
      return;
    }
    if (transformedBounds.length !== 4 || Math.abs(transformedBounds[0]-transformedBounds[2]) > 0.7 || Math.abs(transformedBounds[1]-transformedBounds[3]) > 0.7) {
      // if we have the wrong bounds, or the extent is too large, do nothing
      // mapquest does not allow extends broader than .7 of lat or long
      return;
    }
    //build mapquest query
    const key = '82OD8xUAEGtjlGG8QmixjVe90rErA3NU';
    const coordArg = transformedBounds.join('%2C');
    const url = `http://www.mapquestapi.com/traffic/v2/incidents?key=${ key }&boundingBox=${ coordArg }&filters=incidents&outFormat=json`
    
    // save extent to state
    this.setState({accidentExtent: map.getView().calculateExtent(map.getSize())})

    // get mapquest incidents
    const response = await fetch(url)
    if (response.status !== 200) {
      throw Error(response.message);
    }
    const json = await response.json()
    json.incidents && json.incidents.forEach((incident) => {
      if (!this.state.points.find((point) => point.coords.lat === incident.lat && point.coords.long === incident.lng)) {
        console.log("date?", new Date(incident.startTime).getTime())
        this.addNewPoint({source: 'mapquest', event: 'TRAFFIC INCIDENT', time: new Date(incident.startTime).getTime(), coords: { lat: incident.lat, long: incident.lng }, text: incident.fullDesc})
      }
    })
  }

  render() {
    return <LayerPanel style={{ color: 'black' }}>
      <LayerPanelPage tabIcon={<RssFeed />}>
        <LayerPanelHeader
          customActions={
            <div>
              {this.state.points.reduce((acc, point) => acc.includes(point.event) ? acc : acc.concat(point.event), []).map((eventType) => (
                <Checkbox
                  isChecked={this.state.showEventTypes.includes(eventType)}
                  onChange={() => this.setState((state) => state.showEventTypes.includes[eventType] ? ({showEventTypes: state.showEventTypes.concat(eventType)}) : ({showEventTypes: state.showEventTypes.filter((type) => type !== eventType)}))}
                >
                  { eventType }
                </Checkbox>
              ))}
            </div>
          }
          title={'Emergency Event Feed'}
        />
        {/** silly, this expects imports and exports to be on every layer panel page with a header */}
        <LayerPanelContent style={{ maxHeight: 500 }}>
          { /** bug, this always renders even with the layer panel is closed */}
          {this.state.points.slice().reverse().map((point) => (
            <Card key={point.text + new Date().getTime()} color={emojis.find((emoji) => emoji.name===point.event).color}>
              <Icon>
                { `${emojis.find((emoji) => emoji.name===point.event).symbol}` }
              </Icon>
              <Message>
                { point.text }
              </Message>
              { point.time && (
                <Time>
                  { `${(new Date().getTime()-point.time)/1000 < 60 ? Math.round((new Date().getTime() - point.time)/1000) + ' s' : Math.round((new Date().getTime() - point.time)/60000) + ' min' } ago` }
                </Time>
              )}
            </Card>
          ))}
        </LayerPanelContent>
      </LayerPanelPage>
    </LayerPanel>
  }
}

export default connectToMap(MapUpdater)