import React, { Component } from 'react'
import { Map, Controls, LayerPanel } from '@bayer/ol-kit'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MapUpdater from './components/MapUpdater/MapUpdater';

// import VectorLayer from 'ol/layer/Vector'
// import VectorSource from 'ol/source/Vector'

class App extends Component {
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

  render () {
    return (
      <React.Fragment>
        <Map onMapInit={this.onMapInit} fullScreen>
          <Header />
          <MapUpdater geolocate={true} />
          <Controls />
          <Footer />
        </Map>
      </React.Fragment>
    )
  }
}

export default App