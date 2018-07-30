import React, { Component } from 'react';
import 'nouislider';
import '../nouislider.css';
import wNumb from 'wnumb';

class SoundSlider extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        var noUiSlider = require('nouislider');
        let rangeSlider = document.getElementById('slider-range');
        console.log(this.props.volume);
        

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
        console.log(rangeSlider.noUiSlider.get());
        
        this.setState({
            volume: rangeSlider.noUiSlider.get()
        })
        
        this.createEventHandlers();
    }

    createEventHandlers = () => {
        var noUiSlider = require('nouislider');
        let rangeSlider = document.getElementById('slider-range');

        rangeSlider.noUiSlider.on('change', (values, handle) => {
            console.log("reached");
            console.log(values[handle]);
            rangeSlider.noUiSlider.set(values[handle]);

            // rangeSlider.noUiSlider.set(this.props.volume)
            
        
            // this.props.volumeChange(rangeSlider.noUiSlider.get())
            console.log(rangeSlider.noUiSlider.get());
            this.props.volumeChange(rangeSlider.noUiSlider.get())
            
        })
        

    }

    handleChange(){
        let { volume } = this.state;
        
        this.props.volumeChange(volume);
    }

    render(){
        return(
            <div id="slider-range" className="noUiSlider"></div>

        )
    }
}


export default SoundSlider;