import React, { Component } from 'react'
import { Map } from '@bayer/ol-kit'

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
      geolocate: false,
      currentLocation: null
    }
  }
  onMapInit = map => {
    // const data = new VectorLayer({
    //   source: new VectorSource({
    //     features: [/** Get some data and have fun with it */]
    //   })
    // })

    // // add the data to the map
    // map.addLayer(data)

    // quickly take the map
    window.map = map
  }

  toggleGeolocation = () => this.setState((state) => ({geolocate: !state.geolocate}))
  setCurrentLocation = (loc) => this.setState({currentLocation: loc})

  render () {
    return (
      <React.Fragment>
        <Map onMapInit={this.onMapInit} fullScreen>
          <Header />
          <MapUpdater geolocate={this.state.geolocate} setCurrentLocation={this.setCurrentLocation} />
          <Controller toggleGeolocation={this.toggleGeolocation} geolocate={this.state.geolocate} currentLocation={this.state.currentLocation} />
          <Footer />
        </Map>
      </React.Fragment>
    )
  }
}

export default App