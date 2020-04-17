import React, { Component } from 'react'
import { HeaderWrapper, TitleText } from './styled'
import Dropdown from '../Dropdown/Dropdown'

class Header extends Component {
  
  render() {
    return (
      <HeaderWrapper>
        <TitleText className={'cut'}>
          {'VigilanteMap'}
        </TitleText>
        <Dropdown loading />
      </HeaderWrapper>  
    )
  }
}

export default Header