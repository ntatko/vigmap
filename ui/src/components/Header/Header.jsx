import React, { Component } from 'react'
import { HeaderWrapper } from './styled'
import Dropdown from '../Dropdown/Dropdown'
import Logo from '../../images/logo.jsx'
import AllTheOtherInformation from '../AllTheOtherInformation/AllTheOtherInformation'

import { OpenStreetMap, StamenTonerDark, StamenTerrain, StamenTonerLite, connectToMap } from '@bayer/ol-kit'
import { Checkbox, TextInput } from '@thumbtack/thumbprint-react'
import Slider from '@material-ui/core/Slider'

class Header extends Component {

  identify = (urls) => {
    switch(urls) { // silly, should have a tag on the shape telling which one is selected
      case ('osm'):
        return 'OpenStreetMap'
      case ("stamenTerrain"):
        return 'Stamen Terrain'
      case ('stamenTonerDark'):
        return 'Stamen Dark'
      case ('stamenTonerLite'):
        return 'Stamen Lite'
      default:
        return urls
    }
  }
  
  render() {
    return (
      <HeaderWrapper>
        <div style={{ marginRight: 5, marginTop: -3 }}>
          <Logo />
        </div>
        <Dropdown title={'Basemap?'} selected={this.identify(this.props.map.getLayers().getArray().find((layer) => layer.get('_ol_kit_basemap')).get('_ol_kit_basemap'))}>
          <div>
            <OpenStreetMap />
            <StamenTonerDark />
            <StamenTerrain />
            <StamenTonerLite />
          </div>
        </Dropdown>
        <Dropdown title={'Alert Distance'} selected={
          <div style={{ color: 'lightgreen'}}>
            {`${ this.props.alertDistance } mileses`}
          </div>
        } >
          <div>
            { !this.props.geolocate ? (
              <Checkbox isChecked={false} onChange={this.props.toggleGeolocation}>
                {'Enable Geolocation'}
              </Checkbox>
            ) : (
              <div>
                <Slider value={this.props.alertDistance} onChange={(_, e) => this.props.setAlertDistance(e)} />
                <div style={{ maxWidth: '160px'}}>
                  <TextInput
                    size="small"
                    id="example-1"
                    value={this.props.alertDistance}
                    innerRight={<span style={{ color: 'gray', alignSelf: 'center'}}>{'mi'}</span>}
                    onChange={this.props.setAlertDistance}
                    maxLength={3}
                  />
                </div>
              </div>
            )}
          </div>
        </Dropdown>
        <Dropdown title={'VigilanteFodder'} selected='Choose something interesting'>
          <AllTheOtherInformation />
        </Dropdown>
      </HeaderWrapper>  
    )
  }
}

export default connectToMap(Header)