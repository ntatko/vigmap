import React, { Component, Fragment } from 'react'
import { connectToMap } from '@bayer/ol-kit'
import { Checkbox, Dropdown } from '@thumbtack/thumbprint-react'

const countyDatas = [
  {
    id: 'Vetran Health Administration registration',
    url: 'https://www.va.gov/data/VAOpenDataMigration2019/VAEnrolleesByCountyFY2015.json'
  },
  {
    id: 'Social Vulnerability Index 2018',
    url: 'https://data.cdc.gov/api/views/48va-t53r/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Drug Poisoning Mortality',
    url: 'https://data.cdc.gov/api/views/p56q-jrxg/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Heart Disease Mortality',
    url: 'https://chronicdata.cdc.gov/views/mfvi-hkb9/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Provisional COVID-19 Death Counts',
    url: 'https://data.cdc.gov/api/views/kn79-hsxy/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Stroke Mortality',
    url: 'https://chronicdata.cdc.gov/views/kgsi-35re/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Lyme Disease',
    url: 'https://data.cdc.gov/api/views/smai-7mz9/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Teen Birth Rates',
    url: 'https://data.cdc.gov/api/views/3h58-x6cd/rows.json?accessType=DOWNLOAD'
  },
  {
    id: 'Population-Weighted Ultraviolet Irradiance',
    url: 'https://data.cdc.gov/api/views/h28b-t43q/rows.json?accessType=DOWNLOAD'
  }
]

class CountyModifier extends Component {

  constructor() {
    super()

    this.state = {
      showFirstData: true,
      firstDataId: null,
      showSecondData: false,
      secondDataId: null
    }
  }

  async fetchData(url) {
    const response = await fetch(url);
    console.log(response)
    console.log(response.json())
  }

  render() {
    const { map } = this.props
    return <Fragment>
      <Checkbox isChecked={this.state.showFirstData} onChange={(v) => this.setState({showFirstData: v})} />
      <Dropdown onChange={(v) => this.setState({firstDataId: v})} />
    </Fragment>
  }
}

export default connectToMap(CountyModifier)
