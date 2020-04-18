import React, { Component } from 'react'
import io from 'socket.io-client'
import { connectToMap } from '@bayer/ol-kit'

class MapUpdater extends Component {

  constructor() {
    super()

    this.state = {
      points: []
    }
  }

  componentDidMount() {
    this.socket();
  }

  addNewPoint(emittedEvent) {
    this.setState((state) => ({points: state.points.concat(emittedEvent)}));
  }

  socket() {
    const manager = io('localhost:8081')
    manager.on('sent coordinates', (data) => {
      console.log("we're seeing data", data);
      this.addNewPoint(data)
    });
  }

  render() {
    return null;
  }
}

export default connectToMap(MapUpdater)