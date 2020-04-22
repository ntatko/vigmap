import React, { Component } from 'react'
import { Map, Popup } from '@bayer/ol-kit'
import proj from 'ol/proj'

import Header from './components/Header/Header'
import Controller from './components/Controller/Controller'
import MapUpdater from './components/MapUpdater/MapUpdater'
import { Button } from '@thumbtack/thumbprint-react'

class App extends Component {
  constructor() {
    super()

    this.state = {
      geolocate: true,
      currentLocation: null,
      messages: [],
      alertDistance: 25,
      lastClick: []
    }
  }
  onMapInit = map => {

    map.on('click', (evt) => {
      this.setState({lastClick: evt.coordinate})
    })
    window.map = map
  }

  toggleGeolocation = () => this.setState((state) => ({ geolocate: !state.geolocate, currentLocation: null }))
  setCurrentLocation = (loc) => this.setState({ currentLocation: loc })
  setAlertDistance = (distance) => this.setState({alertDistance: distance})

  render () {
    return (
      <React.Fragment>
        <Map onMapInit={this.onMapInit} fullScreen>
          <Popup actions={
            <Button onClick={() => window.location.href = `https://www.google.com/maps/search/?api=1&query=${ proj.transform(this.state.lastClick, 'EPSG:3857', 'EPSG:4326')[1]},${ proj.transform(this.state.lastClick, 'EPSG:3857', 'EPSG:4326')[0] } `}
            >{'GO HERE NOW!'}</Button>
          }/>
          <Header geolocate={this.state.geolocate} toggleGeolocation={this.toggleGeolocation} alertDistance={this.state.alertDistance} setAlertDistance={this.setAlertDistance} />
          <MapUpdater geolocate={this.state.geolocate} setCurrentLocation={this.setCurrentLocation} />
          <Controller toggleGeolocation={this.toggleGeolocation} geolocate={this.state.geolocate} currentLocation={this.state.currentLocation} />
        </Map>
      </React.Fragment>
    )
  }
}

export default App