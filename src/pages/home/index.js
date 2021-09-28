import { React, Component } from "react";
import '../../styles/home.css';

import { Home, Search, NotificationsNone, Settings, Person } from '@material-ui/icons';


class HomePage extends Component {

    constructor(props) {

        super(props);
        this.state = {

        }

    }

    render() {

        return (

            <div className="div-container-home">

                <div className="div-section div-section-left">

                    <div className="div-header-logo"> 
                        <h1 className="header-title">Social Media</h1>
                    </div>

                    <div className="div-profile">

                        <div className="div-profile-image">
                            
                        </div>

                        <div className="div-profile-username">
                            <h2 className="h2-username">Lucas Kusman Leal</h2>
                            <p className="p-username">@lucaskleal</p>
                        </div>

                    </div>

                </div>

                <div className="div-section div-section-center">

                </div>

                <div className="div-section div-section-right">

                    <div className="div-header-icons">
                        <Settings className="header-icon"/>
                        <NotificationsNone className="header-icon"/>
                        <Search className="header-icon"/>
                        <Home className="header-icon" title="Home Page"/>
                    </div>

                </div>
                    
            </div>

        )

    }

}

export default HomePage;