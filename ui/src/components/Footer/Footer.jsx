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
      <div style={{ position: 'fixed', bottom: 0, left: 0}}>
        { this.props.messages.map((message) => {
          return (
            <>
              <Snackbar id={message.text + new Date().getTime()} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} onClose={() => this.props.removeMessage(message)}>
                <div>
                  <MuiAlert variant={'filled'} severity={severities[message.type]}>
                    {message.text}
                  </MuiAlert>
                  <div>
                    <audio ref="audio_tag" src="../../images/radioNoise.mp3" autoPlay/>
                  </div>
                </div>
              </Snackbar>
            </>
          )
        }
          
        )}
      </div>
    )
  }
}

export default Footer