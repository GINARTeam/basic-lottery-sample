import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Terminal from 'terminal-in-react'
import './App.css'

import _ from 'lodash'

class App extends Component {
  state = {
    drawling: false,
    random: [],
    message: ''
  }

  render() {
    return (
      <React.Fragment>
        <div className={'App'}>
          <div className={'Head'}>
            <img
              className={'Logo animated fadeIn'}
              src={'/images/logo.png'}
              alt="Logo"
            />
            <div className={'Mess animated bounceInDown'}>
              <Terminal
                allowTabs={false}
                hideTopBar={true}
                startState={'maximised'}
                watchConsoleLogging
                className={'Mess animated bounceInDown'}
              />
            </div>
            {/* {this.state.message && !this.state.drawling && (
              <div className={'Mess animated bounceInDown'}>
                <span>{this.state.message}</span>
              </div>
            )}
            {this.state.drawling && (
              <Terminal
                allowTabs={false}
                hideTopBar={true}
                startState={'maximised'}
                watchConsoleLogging
                className={'Mess animated bounceInDown'}
              />
            )} */}
          </div>
          <div className={'Main'}>
            <div className={'Rand animated bounceIn'}>
              {(
                _.get(this.state.random, ['0', 'number']) || [
                  '00',
                  '00',
                  '00',
                  '00',
                  '00'
                ]
              )
                .map(elm => elm.toString().padStart(2, '0'))
                .sort()
                .map((elm, idx) => (
                  <div key={idx} className={'Rand__item'}>
                    {elm}
                  </div>
                ))}
              <div className={'Rand__item Spec'}>
                {
                  (_.get(this.state.random, ['1', 'number']) || ['00'])
                    .map(elm => elm.toString().padStart(2, '0'))
                    .sort()[0]
                }
              </div>
            </div>
            <div className={'Ctrl animated bounceIn'}>
              <Link className={'Btun'} to={'/lottery'} target={'_blank'}>
                History
              </Link>
              <div
                className={'Btun'}
                onClick={
                  !this.state.drawling
                    ? () => {
                        // make number change
                        const intervalId = setInterval(() => {
                          if (this.state.drawling) {
                            const pseudo = [
                              {
                                number: [
                                  Math.floor(Math.random() * (69 - 1)) + 1,
                                  Math.floor(Math.random() * (69 - 1)) + 1,
                                  Math.floor(Math.random() * (69 - 1)) + 1,
                                  Math.floor(Math.random() * (69 - 1)) + 1,
                                  Math.floor(Math.random() * (69 - 1)) + 1
                                ]
                              },
                              {
                                number: [Math.floor(Math.random() * (26 - 1))]
                              }
                            ]
                            this.setState({
                              random: pseudo
                            })
                          }
                        }, 100)

                        console.log('Requesting for random number...')

                        fetch(`/api/random`, {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                          }
                        })
                          .then(response => {
                            return response.json()
                          })
                          .then(json => {
                            console.log('Random: ', JSON.stringify(json))
                            setTimeout(() => {
                              clearInterval(intervalId)
                              this.setState({
                                drawling: false,
                                random: json.payload.random,
                                message: json.payload.message || 'OK'
                              })
                            }, 500)
                          })
                          .catch(error => {
                            console.log('Error: ', error.message)
                            this.setState({
                              drawling: false,
                              random: [],
                              message: error.message
                            })
                          })

                        this.setState({
                          drawling: true
                        })
                      }
                    : () => {}
                }>
                {!this.state.drawling ? `Play` : `Playing`}
              </div>
              <Link className={'Btun'} to={'/ticket'} target={'_blank'}>
                Ticket
              </Link>
            </div>
          </div>
          <div className={'Foot'}>
            <span>
              Powered by <u>GINAR</u>!
            </span>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default App
