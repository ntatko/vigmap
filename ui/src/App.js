import React, { Component } from 'react'
import { Map, Controls, zoomToExtent } from '@bayer/ol-kit'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

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
    zoomToExtent([0, 0], 12)
  }

  render () {
    return (
      <React.Fragment>
        <Map fullScreen style={{ zIndex: 1 }}>
          <Header />
          <Controls />
          <Footer />
        </Map>
      </React.Fragment>
    )
  }
}

export default App