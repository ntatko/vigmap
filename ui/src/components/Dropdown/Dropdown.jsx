import React, { Component } from 'react'
import DropDownButton from './DropdownButton'
import { DisplayWindow, DropDownHeader, DropDownSelect, DropDownContainer } from './styled'
import { LoaderDots } from '@thumbtack/thumbprint-react'

class Dropdown extends Component {
  constructor() {
    super()

    this.state = {
      showDropdown: false
    }
  }

  handleButtonClick = (event) => {
    console.log("clicking button")
    event.stopPropagation()
    if (!this.state.showDropdown) {
      window.addEventListener('click', this.handleMenuClose)
      this.setState((state) => ({ showDropdown: !state.showDropdown }))
    } else {
      this.handleMenuClose()
    }

  }

  handleMenuClose = () => {
    console.log("closing menu")
    this.setState({ showDropdown: false })
    window.removeEventListener('click', this.handleMenuClose)
  }

  render() {
    const { loading, disabled, children, title } = this.props
    return(
      <DropDownContainer>
        <DropDownHeader>
          { title }
        </DropDownHeader>
        <DropDownSelect onClick={!disabled && this.handleButtonClick.bind(this)} >
          <DisplayWindow>
            { loading || !this.props.selected ? (
              <div style={{ margin: '0 20px 0 20px'}}>
                <LoaderDots theme="inverse" size="small" />
              </div>
            ) : 
              this.props.selected
            }
          </DisplayWindow>

          <DropDownButton  />
        </DropDownSelect>
        { this.state.showDropdown && children }
      </DropDownContainer>
    )
  }
}

export default Dropdown