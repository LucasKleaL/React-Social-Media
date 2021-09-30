import { React, Component } from "react";
import { Add } from '@material-ui/icons';
import { createTheme } from "@material-ui/core";

class InterestTag extends Component {

    constructor(props) {

        super(props);
        this.state = {
            
        }

    }

    

    ifContent() {

        const theme = createTheme({
            components: {
                Add: {
                    styleOverrides: {
                        root: {
                            fontSize: "0.1rem",
                        },
                    },
                },
            },
        });

        if (this.props.content == "text") {
            return <h1 className="interest-tag-text">{this.props.text}</h1>
        }
        else if (this.props.content == "icon") {
            return <Add />
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