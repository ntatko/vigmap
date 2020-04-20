import React, { Component } from 'react'
import { Map, Popup, PopupActionItem } from '@bayer/ol-kit'
import proj from 'ol/proj'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Controller from './components/Controller/Controller'
import MapUpdater from './components/MapUpdater/MapUpdater'

// import VectorLayer from 'ol/layer/Vector'
// import VectorSource from 'ol/source/Vector'

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
    // const data = new VectorLayer({
    //   source: new VectorSource({
    //     features: [/** Get some data and have fun with it */]
    //   })
    // })

    map.on('click', (evt) => {
      this.setState({lastClick: evt.coordinate})
    })

    // // add the data to the map
    // map.addLayer(data)

    // quickly take the map
    window.map = map
  }

  toggleGeolocation = () => this.setState((state) => ({ geolocate: !state.geolocate, currentLocation: null }))
  setCurrentLocation = (loc) => this.setState({ currentLocation: loc })
  showSnackbar = (message) => {
    this.setState((state) => ({ messages: state.messages.concat(message) }))
  }
  handleSnackbarClose = (message) => this.setState((state) => ({ messages: state.messages.filter((_, index) => !state.messages.findIndex((m) => m.text === message.text) === index)}))
  setAlertDistance = (distance) => this.setState({alertDistance: distance})

  render () {
    return (
      <React.Fragment>
        <Map onMapInit={this.onMapInit} fullScreen>
          <Popup actions={
            <PopupActionItem 
              title={'GO HERE NOW!'}
              onClick={() => {console.log("seems like a bug"); window.location.href = `https://www.google.com/maps/search/?api=1&query=${ proj.transform(this.state.lastClick, 'EPSG:3857', 'EPSG:4326')[0] },${ proj.transform(this.state.lastClick, 'EPSG:3857', 'EPSG:4326')[1] }`}}
            />
          }/>
          <Header geolocate={this.state.geolocate} toggleGeolocation={this.toggleGeolocation} alertDistance={this.state.alertDistance} setAlertDistance={this.setAlertDistance} />
          <MapUpdater geolocate={this.state.geolocate} setCurrentLocation={this.setCurrentLocation} alertDistance={this.state.alertDistance} showSnackbar={this.showSnackbar} />
          <Controller toggleGeolocation={this.toggleGeolocation} geolocate={this.state.geolocate} currentLocation={this.state.currentLocation} />
          <Footer messages={this.state.messages} removeMessage={this.handleSnackbarClose} />
        </Map>
      </React.Fragment>
    )
  }
}

export default App