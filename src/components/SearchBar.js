import React from 'react'
import { render } from 'react-dom'
import { Typeahead } from 'react-typeahead'

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      invalidInput: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.onOptionSelected = this.onOptionSelected.bind(this)
    this.loadBusData = this.loadBusData.bind(this)
  }

  handleChange(event) {
    if (this.state.invalidInput) {
      this.setState({invalidInput: false})
    }
    this.setState({inputStopName: event.target.value})
  }

  onOptionSelected(option) {
    this.setState({inputStopName: option}, this.loadBusData)
  }

  loadBusData() {
    let { inputStopName } = this.state
    const { allStops } = this.props
    let stopId = allStops[inputStopName]

    // autofills suggestion
    if (stopId === undefined) {
      for (let key in allStops) {
        if (key.toLowerCase() === inputStopName.trim().toLowerCase()) {
          stopId = allStops[key]
          inputStopName = key
          break
        }
      }
    }

    // no matching stops found
    if (stopId === undefined) {
      this.setState({invalidInput: true})
      this.forceUpdate()
    } else {
      // make request
      this.props.loadBusData(inputStopName, stopId)
    }
  }

  render() {
    const { allStops } = this.props
    const { invalidInput } = this.state
    const formValidity = invalidInput ? 'invalid' : ''
    const typeaheadClasses = {
      input: formValidity,
      results: 'typeahead-dropdown',
      listItem: 'typeahead-list-item',
      hover: 'typeahead-selected'
    }

    return (
      <div>
        <h3> Search Bus Stops </h3>
        <div className="row">
          <div className="col m9 s12">
            <Typeahead
              options={Object.keys(allStops)}
              maxVisible={5}
              placeholder="Enter Stop Here"
              onChange={this.handleChange}
              onOptionSelected={this.onOptionSelected}
              customClasses={typeaheadClasses}
            />
          </div>
          <div className="col m3 s12">
            <button className="btn" onClick={this.loadBusData}>Load</button>
          </div>
        </div>
        { invalidInput && <p className="error">Not a valid stop</p> }
      </div>
    )
  }
}

