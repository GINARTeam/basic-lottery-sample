import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Terminal from 'terminal-in-react'
import './Lott.css'

import _ from 'lodash'

class Lott extends Component {
  state = {
    loading: false,
    lottery: undefined,
    message: '',
    index: -1
  }

  componentDidMount() {
    console.log('Requesting for lottery data...')
    fetch(`/api/lottery`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('Lottery: ', JSON.stringify(json))
        this.setState({
          lottery: json.payload.lottery
        })
      })
      .catch(error => {
        console.log('Error: ', error)
        this.setState({
          lottery: undefined,
          message: error.message
        })
      })
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
            {this.state.loading && (
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
            <div
              className={'Cont animated bounceIn'}
              style={{
                height:
                  this.state.lottery &&
                  this.state.lottery.history &&
                  this.state.index >= 0
                    ? '60%'
                    : '50%'
              }}>
              {this.state.index > -1 && (
                <img
                  className={'LBtn animated fadeIn'}
                  src={'/images/left-arrow.svg'}
                  alt="Left"
                  onClick={() => {
                    this.setState({
                      index: this.state.index - 1
                    })
                  }}
                />
              )}
              {this.state.lottery &&
                this.state.lottery.history &&
                this.state.index + 1 < this.state.lottery.history.length && (
                  <img
                    className={'RBtn animated fadeIn'}
                    src={'/images/right-arrow.svg'}
                    alt="Right"
                    onClick={() => {
                      this.setState({
                        index: this.state.index + 1
                      })
                    }}
                  />
                )}
              <div className={'Priz animated bounceIn'}>
                <span>{`Prize: `}</span>
                {this.state.lottery &&
                  this.state.lottery.current &&
                  this.state.index < 0 && (
                    <span className={'Spec'}>
                      {this.state.lottery.current.prize}
                    </span>
                  )}
                {this.state.lottery &&
                  this.state.lottery.history &&
                  this.state.index >= 0 && (
                    <span className={'Spec'}>
                      {this.state.lottery.history[this.state.index].prize}
                    </span>
                  )}
              </div>
              {this.state.lottery &&
                this.state.lottery.current &&
                this.state.index < 0 && (
                  <React.Fragment>
                    <div className={'Cont__item'}>$$</div>
                    <div className={'Cont__item'}>$$</div>
                    <div className={'Cont__item'}>$$</div>
                    <div className={'Cont__item'}>$$</div>
                    <div className={'Cont__item'}>$$</div>
                    <div className={'Cont__item Spec'}>$$</div>
                  </React.Fragment>
                )}
              {this.state.lottery &&
                this.state.lottery.history &&
                this.state.index >= 0 && (
                  <React.Fragment>
                    {this.state.lottery.history[
                      this.state.index
                    ].result[0].number
                      .map(elm => elm.toString().padStart(2, '0'))
                      .sort()
                      .map((elm, idx) => (
                        <div key={idx} className={'Cont__item'}>
                          {elm}
                        </div>
                      ))}
                    <div className={'Cont__item Spec'}>
                      {this.state.lottery.history[
                        this.state.index
                      ].result[1].number[0]
                        .toString()
                        .padStart(2, '0')}
                    </div>
                  </React.Fragment>
                )}
              {this.state.lottery &&
                this.state.lottery.history &&
                this.state.index >= 0 && (
                  <div className={'Veri animated bounceIn'}>
                    <span>
                      {`Normalball: `}
                      <a
                        href={`https://dev-blackbox.ginar.io/?ticketId=${
                          this.state.lottery.history[this.state.index].result[0]
                            .hash
                        }&dest_lower=1&dest_upper=69`}
                        target={'_blank'}>
                        {
                          this.state.lottery.history[this.state.index].result[0]
                            .hash
                        }
                      </a>
                      <br />
                      {`Powerball: `}
                      <span className={'Spec'}>
                        <a
                          href={`https://dev-blackbox.ginar.io/?ticketId=${
                            this.state.lottery.history[this.state.index]
                              .result[1].hash
                          }&dest_lower=1&dest_upper=26`}
                          target={'_blank'}>
                          {
                            this.state.lottery.history[this.state.index]
                              .result[1].hash
                          }
                        </a>
                      </span>
                    </span>
                  </div>
                )}
            </div>
            <div className={'Tick animated bounceIn'}>
              {this.state.lottery &&
                (this.state.index < 0 ? (
                  this.state.lottery.current.ticket.length > 0 ? (
                    this.state.lottery.current.ticket.map((elm, idx) => {
                      const num = _.take(elm, 5).sort(),
                        pow = elm[5]
                      return (
                        <span key={idx}>
                          {`${num[0]} ${num[1]} ${num[2]} ${num[3]} ${
                            num[4]
                          } | ${pow}`}
                        </span>
                      )
                    })
                  ) : (
                    <span>No ticket found!</span>
                  )
                ) : this.state.lottery.history[this.state.index].ticket.length >
                  0 ? (
                  this.state.lottery.history[this.state.index].ticket.map(
                    (elm, idx) => {
                      const num = _.take(elm, 5)
                          .map(elm => elm.toString().padStart(2, '0'))
                          .sort(),
                        pow = elm[5].toString().padStart(2, '0')
                      return (
                        <span key={idx}>
                          {`${num[0]} ${num[1]} ${num[2]} ${num[3]} ${
                            num[4]
                          } | ${pow}`}
                        </span>
                      )
                    }
                  )
                ) : (
                  <span>No ticket found!</span>
                ))}
            </div>
            <div className={'Ctrl animated bounceIn'}>
              <Link className={'Btun'} to={'/ticket'} target={'_blank'}>
                Buy
              </Link>
              <div
                className={'Btun'}
                onClick={
                  !this.state.loading
                    ? () => {
                        console.log('Requesting for lottery data...')

                        fetch(`/api/lottery`, {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                          }
                        })
                          .then(response => {
                            return response.json()
                          })
                          .then(json => {
                            console.log('Lottery: ', JSON.stringify(json))
                            this.setState({
                              loading: false,
                              lottery: json.payload.lottery
                            })
                          })
                          .catch(error => {
                            console.log('Error: ', error.message)
                            this.setState({
                              loading: false,
                              message: error.message
                            })
                          })

                        this.setState({
                          loading: true
                        })
                      }
                    : () => {}
                }>
                {!this.state.loading ? `Load` : `Loading`}
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

export default Lott
