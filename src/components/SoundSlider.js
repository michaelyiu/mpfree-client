import React, { Component } from 'react';
import 'nouislider';
import '../nouislider.css';
import wNumb from 'wnumb';

class SoundSlider extends Component {
    // constructor(props){
    //     super(props);
    // }

    componentDidMount(){
        var noUiSlider = require('nouislider');
        let rangeSlider = document.getElementById('slider-range');

        noUiSlider.create(rangeSlider, 
            {
                start: 50,
                range: {
                    'min': [ 0 ],
                    'max': [ 100 ]
                },
                format: wNumb({
                    decimals: 0
                })
            }
        )
        
        this.setState({
            volume: rangeSlider.noUiSlider.get()
        })
        
        this.createEventHandlers();
    }

    createEventHandlers = () => {
        let rangeSlider = document.getElementById('slider-range');

        rangeSlider.noUiSlider.on('change', (values, handle) => {
            rangeSlider.noUiSlider.set(values[handle]);

            this.props.volumeChange(rangeSlider.noUiSlider.get());
        })
    }

    handleChange(){
        let { volume } = this.state;
        this.props.volumeChange(volume);
    }

    render(){
        return(
            <React.Fragment>
                <div className="sound-controls">
                    <i className="vol-icon fas fa-volume-down"></i>
                    <div id="slider-range" className="noUiSlider" style={{ display: 'inline-block' }}></div>
                </div>
            </React.Fragment>

        )
    }
}


export default SoundSlider;