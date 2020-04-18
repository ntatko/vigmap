import React, { Component } from 'react'
import { HeaderWrapper, TitleText } from './styled'
import Dropdown from '../Dropdown/Dropdown'

import { BingMaps, BlankWhite, StamenTonerDark } from '@bayer/ol-kit'

class Header extends Component {
  
  render() {
    const basemaps = [
      {map: BingMaps, title: 'Bing Maps'},
      {map: BlankWhite, title: 'Blank White'},
      {map: StamenTonerDark, title: 'Stamen Toner Dark'}
    ]

    return (
      <HeaderWrapper>
        <TitleText className={'cut'}>
          {'VigilanteMap'}
        </TitleText>
        <Dropdown title={'Basemap?'}>
          { basemaps.map((basemap) => (
            <div style={{ display: 'block', width: 100, height:40, padding: 5, borderBlockColor: 'black' }} key={ basemap.title } selected={basemap.title==='Bing Maps'}>
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                { basemap.title }
              </div>
              { basemap.map }
            </div>
          ))}
        </Dropdown>
      </HeaderWrapper>  
    )
  }
}

export default Header