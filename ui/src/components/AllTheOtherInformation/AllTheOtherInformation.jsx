import React, { Component } from 'react'
import { connectToMap, loadDataLayer } from '@bayer/ol-kit'
import { Checkbox } from '@thumbtack/thumbprint-react'
import VectorTileSource from 'ol/source/vectortile';
import VectorTileLayer from 'ol/layer/vectortile';
import Projection from 'ol/proj/projection';
import geojsonvt from 'geojson-vt';

import GeoJSON from 'ol/format/geojson'

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
    // json: US_WATERWAYS,
    url: 'https://opendata.arcgis.com/datasets/349ce90ebfcd47f49401ac4d817b0d58_7.geojson',
    desc: 'US Waterways'
  },
  {
    id: 'VT_FOOD_SCRAP_GENERATORS',
    // json: FOOD_SCRAP,
    url: 'https://opendata.arcgis.com/datasets/21d080724e414ba59cb509972f924eb5_165.geojson',
    desc: 'Vermont Food Scrap Generators'
  },
  {
    id: 'FUDS_MUNITIONS_SITES',
    // json: FUDS_MUNITIONS,
    url: 'https://opendata.arcgis.com/datasets/3f8354667d5b4b1b8ad7a6e00c3cf3b1_3.geojson',
    desc: 'Formerly Used Defense Munitions Sites'
  },
  {
    id: 'FUDS_BOUNDARIES',
    // json: FUDS_BOUNDARIES,
    url: 'https://opendata.arcgis.com/datasets/3f8354667d5b4b1b8ad7a6e00c3cf3b1_10.geojson',
    desc: 'Formerly Used Defense Station Boundaries'
  },
  {
    id: 'VT_HOSPITALS',
    // json: VIRGINIA_HOSPITALS,
    url: 'https://opendata.arcgis.com/datasets/910089de7b5c402cb915c519662887cd_0.geojson',
    desc: 'Service Hospitals in Vermong'
  },
  {
    id: 'NON FEDERAL NAVIGATION',
    // json: NAVIGATION,
    url: 'https://opendata.arcgis.com/datasets/fec7341a4b2b4e43bc1f6258057fd115_2.geojson',
    desc: 'Non federal navigation points'
  },
  {
    id: 'US DEFENSE SITES',
    // json: DOD_SITES,
    url: 'https://opendata.arcgis.com/datasets/85e5114c86fc4e5ba2d1e29ca213b834_1.geojson',
    desc: 'Current US Military Defense sites'
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

      // await fetch(datum.url, {mode: 'no-cors', headers: {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json',
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      //   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      // }}).then((response) => {
      //   console.log('response', response)
      //   return response.json()
      // }).then((json) => {
      //   console.log("before json?", json)
      //   var tileIndex = geojsonvt(json, {
      //     extent: 4096,
      //     debug: 1
      //   });
      //   var vectorSource = new VectorTileSource({
      //     format: new GeoJSON({
      //       // Data returned from geojson-vt is in tile pixel units
      //       dataProjection: new Projection({
      //         code: 'TILE_PIXELS',
      //         units: 'tile-pixels',
      //         extent: [0, 0, 4096, 4096]
      //       })
      //     }),
      //     tileUrlFunction: function(tileCoord) {
      //       var data = tileIndex.getTile(tileCoord[0], tileCoord[1], tileCoord[2]);
      //       var geojson = JSON.stringify({
      //         type: 'FeatureCollection',
      //         features: data ? data.features : []
      //       }, replacer);
      //       return 'data:application/json;charset=UTF-8,' + geojson;
      //     }
      //   });
      //   var vectorLayer = new VectorTileLayer({
      //     source: vectorSource,
      //     id: datum.id,
      //     url: datum.url,
      //     LAYER_KEY: datum.id
      //   });
      //   map.addLayer(vectorLayer);
      // })

      // const layer = new VectorTileLayer ({
      //   title: datum.id,
      //   id: datum.id,
      //   LAYER_KEY: datum.id,
      //   source: new VectorSource()
      // })

      // const features = (new GeoJSON()).readFeatures(datum.json.features)
      // const source = layer.getSource()
      // features.forEach((feature) => {
      //   source.addFeature(feature)
      // })
      // map.addLayer(layer)
    }
    
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