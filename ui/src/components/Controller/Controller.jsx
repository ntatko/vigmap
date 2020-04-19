import React, { Component } from 'react'
import { Controls, ZoomControls, Compass, connectToMap, centerAndZoom } from '@bayer/ol-kit'
import { IconContainer, IconDivider, Icon } from './styled'
import LocationOn from '@material-ui/icons/LocationOn'
import LocationOff from '@material-ui/icons/LocationOff'
import LocationSearchingIcon from '@material-ui/icons/LocationSearching'
import proj from 'ol/proj'
import { LoaderDots } from '@thumbtack/thumbprint-react'

class Controller extends Component {
  zoomToLocation = () => {
    const { map, currentLocation } = this.props;
    
    const centerLongLat = proj.transform(currentLocation, map.getView().getProjection().getCode(), 'EPSG:4326') //silly, it's gonig to get transformed back immediately
    console.log("centerLongLat", centerLongLat)
    centerAndZoom(map, {x: centerLongLat[0], y: centerLongLat[1], zoom: 13})
  }

  render() {

    return <Controls>
      <IconContainer>
      {this.props.geolocate && (
          <>
            { this.props.currentLocation ? (
              <Icon onClick={this.zoomToLocation}>
                <LocationSearchingIcon />
              </Icon>
            ) : (
              <LoaderDots size="small" />
            )}
            <IconDivider />
          </>
        )}
        <Icon onClick={this.props.toggleGeolocation}>
          { this.props.geolocate ? (<LocationOn />) : (<LocationOff />)}
        </Icon>
        <IconDivider />
        <ZoomControls />
      </IconContainer>
      <Compass />
    </Controls>
  }
}

export default connectToMap(Controller)