import React, { Component } from 'react'
import { connectToMap } from '@bayer/ol-kit'
import { Checkbox } from '@thumbtack/thumbprint-react'
import VectorTileSource from 'ol/source/vectortile';
import VectorTileLayer from 'ol/layer/vectortile';
import Projection from 'ol/proj/projection';
import geojsonvt from 'geojson-vt';

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
    // json: US_LOCKS,,
    url: '../../../../geojson/Lock.json',
    desc: 'USACOE Maintained Locks and Dams'
  },
  {
    id: 'US WATERWAY NETWORK',
    // json: US_WATERWAYS,
    url: '../../../../geojson/Waterway_Network.json',
    desc: 'US Waterways'
  },
  {
    id: 'FOOD SCRAP GENERATORS',
    // json: FOOD_SCRAP,
    url: '../../../../geojson/Food_Scrap_Generators.json',
    desc: 'US Food Scrap Generators'
  },
  {
    id: 'FUDS MUNITIONS SITES',
    // json: FUDS_MUNITIONS,
    url: '../../../../geojson/FUDS_Munitions_Response_Site.json',
    desc: 'Formerly Used Defense Munitions Sites'
  },
  {
    id: 'FUDS BOUNDARIES',
    // json: FUDS_BOUNDARIES,
    url: '../../../../geojson/FUDS_Program_Division_Boundaries.json',
    desc: 'Formerly Used Defense Station Boundaries'
  },
  {
    id: 'VIRGINIA HOSPITALS',
    // json: VIRGINIA_HOSPITALS,
    url: '../../../../geojson/Hospitals_and_Urgent_Care_Facilities.json',
    desc: 'Hospitals in Virginia'
  },
  {
    id: 'NON FEDERAL NAVIGATION',
    // json: NAVIGATION,
    url: '../../../../geojson/Navigation_Projects_NonFederal.json',
    desc: 'Non federal navigation points'
  },
  {
    id: 'PUBLIC SCHOOLS',
    // json: PUBLIC_SCHOOLS,
    url: '../../../../geojson/Public_School_Locations__Current.json',
    desc: 'Current US Public Schools'
  },
  {
    id: 'US DEFENSE SITES',
    // json: DOD_SITES,
    url: '../../../../geojson/SAD_Installations.json',
    desc: 'Current US Military Defense sites'
  }
]

const replacer = (key, value) => {
  if (value.geometry) {
    var type;
    var rawType = value.type;
    var geometry = value.geometry;

    if (rawType === 1) {
      type = 'MultiPoint';
      if (geometry.length == 1) {
        type = 'Point';
        geometry = geometry[0];
      }
    } else if (rawType === 2) {
      type = 'MultiLineString';
      if (geometry.length == 1) {
        type = 'LineString';
        geometry = geometry[0];
      }
    } else if (rawType === 3) {
      type = 'Polygon';
      if (geometry.length > 1) {
        type = 'MultiPolygon';
        geometry = [geometry];
      }
    }

    return {
      'type': 'Feature',
      'geometry': {
        'type': type,
        'coordinates': geometry
      },
      'properties': value.tags
    };
  } else {
    return value;
  }
};


class AllTheOtherInformation extends Component {

  toggleLayer = async (datum) => {
    const { map } = this.props
    const existingLayer = map.getLayers().getArray().find((layer) => layer.get(LAYER_KEY) === datum.id)
    if (existingLayer) {
      map.removeLayer(existingLayer)
    } else {
      console.log("adding " + datum.id + " to map")

      await fetch(datum.url, {headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}}).then((response) => {
        console.log('response', response)
        return response.json()
      }).then((json) => {
        console.log("before json?", json)
        var tileIndex = geojsonvt(json, {
          extent: 4096,
          debug: 1
        });
        var vectorSource = new VectorTileSource({
          format: new GeoJSON({
            // Data returned from geojson-vt is in tile pixel units
            dataProjection: new Projection({
              code: 'TILE_PIXELS',
              units: 'tile-pixels',
              extent: [0, 0, 4096, 4096]
            })
          }),
          tileUrlFunction: function(tileCoord) {
            var data = tileIndex.getTile(tileCoord[0], tileCoord[1], tileCoord[2]);
            var geojson = JSON.stringify({
              type: 'FeatureCollection',
              features: data ? data.features : []
            }, replacer);
            return 'data:application/json;charset=UTF-8,' + geojson;
          }
        });
        var vectorLayer = new VectorTileLayer({
          source: vectorSource,
          id: datum.id,
          url: datum.url,
          LAYER_KEY: datum.id
        });
        map.addLayer(vectorLayer);
      })

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