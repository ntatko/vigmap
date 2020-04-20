import React, { Component } from 'react'
import { HeaderWrapper } from './styled'
import Dropdown from '../Dropdown/Dropdown'
import Logo from '../../images/logo.jsx'

import { BingMaps, BlankWhite, StamenTonerDark, Map } from '@bayer/ol-kit'
import { Checkbox, TextInput } from '@thumbtack/thumbprint-react'
import Slider from '@material-ui/core/Slider'

class Header extends Component {
  
  render() {
    const basemaps = [
      {map: BingMaps, title: 'Bing Maps'},
      {map: BlankWhite, title: 'Blank White'},
      {map: StamenTonerDark, title: 'Stamen Toner Dark'}
    ]

    return (
      <HeaderWrapper>
        <div style={{ marginRight: 5, marginTop: -3 }}>
          <Logo />
        </div>
        <Dropdown title={'Basemap?'}>
          { basemaps.map((basemap) => (
            <div style={{ display: 'block', width: 200, height:60, padding: 5, borderBlockColor: 'black' }} key={ basemap.title } selected={basemap.title==='Bing Maps'}>
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                { basemap.title }
              </div>
              { basemap.map }
            </div>
          ))}
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
                <div style={{ maxWidth: '150px'}}>
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
      </HeaderWrapper>  
    )
  }
}

export default Header