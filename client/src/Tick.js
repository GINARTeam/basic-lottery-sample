import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Terminal from 'terminal-in-react'
import './Tick.css'

import _ from 'lodash'

class Tick extends Component {
  state = {
    buying: false,
    message: '',
    number: {
      normal: Array.from(new Array(69), (val, idx) => idx + 1),
      power: Array.from(new Array(26), (val, idx) => idx + 1)
    },
    choice: {
      normal: [0, 0, 0, 0, 0],
      power: 0
    }
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
            {this.state.buying && (
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
            <div className={'Numb animated bounceIn'}>
              <select
                className={'Numb__item'}
                onChange={event => {
                  let data = this.state.choice
                  data.normal[0] = event.target.value
                  this.setState({
                    choice: data,
                    message: ''
                  })
                }}
                defaultValue={'$$'}>
                <option disabled>$$</option>
                {this.state.number.normal.map((elm, idx) => (
                  <option key={idx}>{elm.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                className={'Numb__item'}
                onChange={event => {
                  let data = this.state.choice
                  data.normal[1] = event.target.value
                  this.setState({
                    choice: data,
                    message: ''
                  })
                }}
                defaultValue={'$$'}>
                <option disabled>$$</option>
                {this.state.number.normal.map((elm, idx) => (
                  <option key={idx}>{elm.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                className={'Numb__item'}
                onChange={event => {
                  let data = this.state.choice
                  data.normal[2] = event.target.value
                  this.setState({
                    choice: data,
                    message: ''
                  })
                }}
                defaultValue={'$$'}>
                <option disabled>$$</option>
                {this.state.number.normal.map((elm, idx) => (
                  <option key={idx}>{elm.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                className={'Numb__item'}
                onChange={event => {
                  let data = this.state.choice
                  data.normal[3] = event.target.value
                  this.setState({
                    choice: data,
                    message: ''
                  })
                }}
                defaultValue={'$$'}>
                <option disabled>$$</option>
                {this.state.number.normal.map((elm, idx) => (
                  <option key={idx}>{elm.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                className={'Numb__item'}
                onChange={event => {
                  let data = this.state.choice
                  data.normal[4] = event.target.value
                  this.setState({
                    choice: data,
                    message: ''
                  })
                }}
                defaultValue={'$$'}>
                <option disabled>$$</option>
                {this.state.number.normal.map((elm, idx) => (
                  <option key={idx}>{elm.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <select
                className={'Numb__item Spec'}
                onChange={event => {
                  let data = this.state.choice
                  data.power = event.target.value
                  this.setState({
                    choice: data,
                    message: ''
                  })
                }}
                defaultValue={'$$'}>
                <option disabled>$$</option>
                {this.state.number.power.map((elm, idx) => (
                  <option key={idx}>{elm.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div className={'Ctrl animated bounceIn'}>
              <Link className={'Btun'} to={'/lottery'} target={'_blank'}>
                History
              </Link>
              <div
                className={'Btun'}
                onClick={
                  !this.state.buying
                    ? () => {
                        console.log(`Validating your ticket...`)

                        const normal = _.uniq(this.state.choice.normal)

                        if (normal.length < 5 || !this.state.choice.power) {
                          console.log(`Invalid choice!`)
                          return this.setState({
                            buying: false,
                            message: 'Invalid choice!'
                          })
                        }

                        const number = [
                          ...normal.sort(),
                          this.state.choice.power
                        ]

                        console.log('Requesting for buying ticket...')

                        fetch(`/api/buy`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                          },
                          body: JSON.stringify({
                            number: number
                          })
                        })
                          .then(response => {
                            return response.json()
                          })
                          .then(json => {
                            console.log('Response: ', JSON.stringify(json))
                            setTimeout(() => {
                              this.setState({
                                buying: false,
                                message: json.message || ''
                              })
                            }, 500)
                          })
                          .catch(error => {
                            console.log('Error: ', error.message)
                            this.setState({
                              buying: false,
                              message: error.message
                            })
                          })

                        this.setState({
                          buying: true
                        })
                      }
                    : () => {}
                }>
                {!this.state.buying ? `Buy` : `Buying`}
              </div>
              <Link className={'Btun'} to={'/'} target={'_blank'}>
                Play
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

export default Tick
