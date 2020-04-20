import React, { Component } from 'react'
import { HeaderWrapper } from './styled'
import Dropdown from '../Dropdown/Dropdown'
import Logo from '../../images/logo.jsx'

import { BingMaps, BlankWhite, StamenTonerDark, Map } from '@bayer/ol-kit'

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
        <Dropdown title={'Alert Distance'} loading disabled />
      </HeaderWrapper>  
    )
  }
}

export default Header