import React, { Component } from 'react'
import PropTypes from 'prop-types'

let offset = null, interval = null

/**
 * Timer module
 * A simple timer component.
**/
export default class Timer extends Component {
  static get propTypes () {
    return {
      options: PropTypes.object
    }
  }

  constructor(props) {
    super(props)
    this.state = { clock: 0, time: '' }
  }

  componentDidMount() {
    this.play();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isComplete !== this.props.isComplete) {
      if (nextProps.isComplete) {
        this.pause();
      } else {
        this.reset();
        this.play();
      }
    }    
  }

  componentWillUnmount() {
    this.pause()
  }

  secondsTohhmmss(totalSeconds) {
    let hours   = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    // round seconds
    seconds = Math.round(seconds * 100) / 100

    let result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;
  }

  pause() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  play() {
    if (!interval) {
      offset = Date.now()
      interval = setInterval(this.update.bind(this), this.props.options.delay)
    }
  }

  reset() {
    let clockReset = 0
    this.setState({clock: clockReset })
    let time = this.secondsTohhmmss(clockReset / 1000)
    this.setState({time: time })
  }

  update() {
    let clock = this.state.clock
    clock += this.calculateOffset()
    this.setState({clock: clock })
    let time = this.secondsTohhmmss(clock / 1000)
    this.setState({time: time })
  }

  calculateOffset() {
    let now = Date.now()
    let newOffset = now - offset
    offset = now
    return newOffset
  }

  render() {
    const timerStyle = {
      margin: "0px"      
    };    

    const secondsStyles = {
      fontSize: "200%",
      fontWeight: "200",
      lineHeight: "1.5",
      margin: "0",
      color: "#666"
    };

    return (
      <div style={timerStyle} className="react-timer">
        <h4 style={secondsStyles} className="seconds"> {this.state.time} {this.props.prefix}</h4>        
      </div>
    )
  }
}