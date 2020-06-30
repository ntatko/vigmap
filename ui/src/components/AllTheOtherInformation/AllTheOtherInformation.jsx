import React, { Component } from 'react'
import { connectToMap, loadDataLayer } from '@bayer/ol-kit'
import { Checkbox } from '@thumbtack/thumbprint-react'

const LAYER_KEY = 'LAYER_KEY'

const data = [
  {
    id: 'US_PRIVATE_SCHOOLS',
    url: 'https://opendata.arcgis.com/datasets/1c004a108b18460bba1ddb29ec1f7982_0.geojson',
    desc: 'US Private Schools'
  },
  {
    id: 'US_PUBLIC_SCHOOLS',
    url: 'https://opendata.arcgis.com/datasets/fb92b1df7c5a445c96840005cd6de264_0.geojson',
    desc: 'US Public Schools'
  },
  {
    id: 'US LOCKS AND DAMS',
    url: 'https://opendata.arcgis.com/datasets/349ce90ebfcd47f49401ac4d817b0d58_3.geojson',
    desc: 'USACOE Maintained Locks and Dams'
  },
  {
    id: 'US WATERWAY NETWORK',
    url: 'https://opendata.arcgis.com/datasets/349ce90ebfcd47f49401ac4d817b0d58_7.geojson',
    desc: 'US Waterways'
  },
  {
    id: 'VT_FOOD_SCRAP_GENERATORS',
    url: 'https://opendata.arcgis.com/datasets/21d080724e414ba59cb509972f924eb5_165.geojson',
    desc: 'Vermont Food Scrap Generators'
  },
  {
    id: 'FUDS_MUNITIONS_SITES',
    url: 'https://opendata.arcgis.com/datasets/3f8354667d5b4b1b8ad7a6e00c3cf3b1_3.geojson',
    desc: 'Formerly Used Defense Munitions Sites'
  },
  {
    id: 'FUDS_BOUNDARIES',
    url: 'https://opendata.arcgis.com/datasets/3f8354667d5b4b1b8ad7a6e00c3cf3b1_10.geojson',
    desc: 'Formerly Used Defense Station Boundaries'
  },
  {
    id: 'VT_HOSPITALS',
    url: 'https://opendata.arcgis.com/datasets/910089de7b5c402cb915c519662887cd_0.geojson',
    desc: 'Service Hospitals in Vermong'
  },
  {
    id: 'NON FEDERAL NAVIGATION',
    url: 'https://opendata.arcgis.com/datasets/fec7341a4b2b4e43bc1f6258057fd115_2.geojson',
    desc: 'Non federal navigation points'
  },
  {
    id: 'US DEFENSE SITES',
    url: 'https://opendata.arcgis.com/datasets/85e5114c86fc4e5ba2d1e29ca213b834_1.geojson',
    desc: 'Current US Military Defense sites'
  },
  {
    id: 'LIDAR BLOCKS',
    url: 'https://opendata.arcgis.com/datasets/336825ff1aec4aaabb1fa2fafe55f09a_12.geojson',
    desc: '2015-2017 Lidar Blocks'
  },
  {
    id: 'GRASSLAND UNITS',
    url: 'https://opendata.arcgis.com/datasets/b8db5d69787c408d9654a1f36438acbd_0.geojson',
    desc: 'National Grassland Units'
  },
  {
    id: 'COUNTIES',
    url: 'https://opendata.arcgis.com/datasets/9248aea543dd4ef0833680d136fe8496_1.geojson',
    desc: 'US County Boundaries'
  }
]

class AllTheOtherInformation extends Component {

  toggleLayer = async (datum) => {
    const { map } = this.props
    const existingLayer = map.getLayers().getArray().find((layer) => layer.get(LAYER_KEY) === datum.id)
    if (existingLayer) {
      map.removeLayer(existingLayer)
    } else {
      console.log("adding " + datum.id + " to map")

      const dataLayer = await loadDataLayer(map, datum.url)
      dataLayer.set('id', datum.id)
      dataLayer.set(LAYER_KEY, datum.id)
      dataLayer.set('title', datum.id)
      dataLayer.set('name', datum.id)
    }
    this.forceUpdate()
    
  }

  buildLayers = () => {
    return data.map((datum) => (
      <Checkbox 
        isChecked={this.props.map.getLayers().getArray().find((layer) => layer.get(LAYER_KEY) === datum.id)}
        onChange={() => this.toggleLayer(datum)}
        key={datum.id}
        isDisabled={!datum.url}
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