import React, { Component } from 'react'
import { connectToMap } from '@bayer/ol-kit'
import { Checkbox } from '@thumbtack/thumbprint-react'
import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'
import GeoJSON from 'ol/format/geojson'

// import US_LOCKS from '../../geojson/Lock'
// import US_WATERWAYS from '../../geojson/Waterway_Network'
// import FOOD_SCRAP from '../../geojson/Food_Scrap_Generators'
// import FUDS_MUNITIONS from '../../geojson/FUDS_Munitions_Response_Site'
// import FUDS_BOUNDARIES from '../../geojson/FUDS_Program_Division_Boundaries'
// import VIRGINIA_HOSPITALS from '../../geojson/Hospitals_and_Urgent_Care_Facilities'
// inport NAVIGATION from '../../geojson/Navigation_Projects_NonFederal'
// import PUBLIC_SCHOOLS from '../../geojson/Public_School_Locations__Current.js'
// import DOD_SITES from '../../geojson/SAD_Installations'

const LAYER_KEY = 'LAYER_KEY'

const data = [
  {
    id: 'US LOCKS AND DAMS',
    // json: US_LOCKS,
    desc: 'USACOE Maintained Locks and Dams'
  },
  {
    id: 'US WATERWAY NETWORK',
    // json: US_WATERWAYS,
    desc: 'US Waterways'
  },
  {
    id: 'FOOD SCRAP GENERATORS',
    // json: FOOD_SCRAP,
    desc: 'US Food Scrap Generators'
  },
  {
    id: 'FUDS MUNITIONS SITES',
    // json: FUDS_MUNITIONS,
    desc: 'Formerly Used Defense Munitions Sites'
  },
  {
    id: 'FUDS BOUNDARIES',
    // json: FUDS_BOUNDARIES,
    desc: 'Formerly Used Defense Station Boundaries'
  },
  {
    id: 'VIRGINIA HOSPITALS',
    // json: VIRGINIA_HOSPITALS,
    desc: 'Hospitals in Virginia'
  },
  {
    id: 'NON FEDERAL NAVIGATION',
    // json: NAVIGATION,
    desc: 'Non federal navigation points'
  },
  {
    id: 'PUBLIC SCHOOLS',
    // json: PUBLIC_SCHOOLS,
    desc: 'Current US Public Schools'
  },
  {
    id: 'US DEFENSE SITES',
    // json: DOD_SITES,
    desc: 'Current US Military Defense sites'
  }
]

class AllTheOtherInformation extends Component {

  toggleLayer = (datum) => {
    const { map } = this.props
    const existingLayer = map.getLayers().getArray().find((layer) => layer.get(LAYER_KEY) === datum.id)
    if (existingLayer) {
      map.removeLayer(existingLayer)
    } else {
      console.log("adding " + datum.id + " to map")

      const layer = new VectorLayer({
        title: datum.id,
        id: datum.id,
        LAYER_KEY: datum.id,
        source: new VectorSource()
      })

      const features = (new GeoJSON()).readFeatures(datum.json.features)
      const source = layer.getSource()
      features.forEach((feature) => {
        source.addFeature(feature)
      })
      map.addLayer(layer)
    }
    
  }

  buildLayers = () => {
    return data.map((datum) => (
      <Checkbox 
        isChecked={this.props.map.getLayers().getArray().find((layer) => layer.get(LAYER_KEY) === datum.id)}
        onChange={() => this.toggleLayer(datum)}
        key={datum.id}
        isDisabled={!datum.json}
      >
        {datum.desc}
      </Checkbox>
    ))
  }
  render() {
    return (
      <>
        { this.buildLayers() }
      </>
    )
  }
}

export default connectToMap(AllTheOtherInformation)