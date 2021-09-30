import { React, Component } from "react";

class InterestTag extends Component {

    constructor(props) {

        super(props);
        this.state = {
            
        }

    }

    render() {

        return (
            <div className="interest-tag">
                <h1 className="interest-tag-text">{this.props.text}</h1>
            </div>
        )

    }
    
}

export default InterestTag;