import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';

class Footer extends Component {

  render() {
    const severities = {
      'FIRE + EMT': 'alert',
      'POLICE': 'information',
      'TRAFFIC INCIDENT': 'warning'
    }
    return (
      <div>
        { this.props.messages.map((message) => (
          <Snackbar id={message.text + new Date().getTime()} autoHideDuration={6000} onClose={() => this.props.removeMessage(message)}>
            <MuiAlert variant={'filled'} severity={severities[message.type]}>
              {message.text}
            </MuiAlert>
          </Snackbar>
        ))}
      </div>
    )
  }
}

export default Footer