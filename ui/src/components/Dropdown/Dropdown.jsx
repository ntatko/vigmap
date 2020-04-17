import React, { Component } from 'react'
import DropDownButton from './DropdownButton'
import { DisplayWindow, MenuItem, DropDownHeader, DropDownSelect, DropDownContainer } from './styled'
import { LoaderDots } from '@thumbtack/thumbprint-react'

class Dropdown extends Component {
  constructor() {
    super()

    this.state = {
      showDropdown: false
    }
  }

  handleButtonClick = (event) => {
    event.stopPropagation()
    if (!this.state.showDropdown) {
      window.addEventListener('click', this.handleMenuClose)
      this.setState((state) => ({ showDropdown: !state.showDropdown }))
    } else {
      this.handleMenuClose()
    }

  }

  handleMenuClose = () => {
    this.setState({ showDropdown: false })
    window.removeEventListener('click', this.handleMenuClose)
  }

  render() {
    const { loading, values, disabled, value, handleValueChange } = this.props
    return(
      <DropDownContainer>
        <DropDownHeader>
          { 'Basemap' }
        </DropDownHeader>
        <DropDownSelect onClick={!disabled && this.handleButtonClick.bind(this)} >
          <DisplayWindow>
            { loading ? (
              <LoaderDots theme="inverse" size="small" />
            ) : (
              { value }
            )}
          </DisplayWindow>

          <DropDownButton  />
        </DropDownSelect>
        { this.state.showDropdown && values && (
          <MenuItem>
            { 'poop' }
          </MenuItem>
        )}
        

      </DropDownContainer>
    )
  }
}

export default Dropdown