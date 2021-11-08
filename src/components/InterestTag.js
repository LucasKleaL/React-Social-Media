import { React, Component } from "react";
import { Add } from '@material-ui/icons';

class InterestTag extends Component {

    constructor(props) {

        super(props);
        this.state = {         
            
        }

    }

    ifContent() {

        if (this.props.content == "text") {
            return <h1 className="interest-tag-text">{this.props.text}</h1>
        }
        else if (this.props.content == "post-tag") {
            return <h1 className="post-interest-tag-text">{this.props.text}</h1>
        }
        else if (this.props.content == "icon") {
            return <Add fontSize="small" className="add-icon"/>
        }
        else {
            //
        }
    }

    render() {

        return (
            <div className={this.props.styleClass}>
                { this.ifContent() }
            </div>
        )

    }
    
}

export default InterestTag;