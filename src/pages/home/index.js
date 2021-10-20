import { React, Component, useState, useEffect } from "react";
import Firebase from './../../Firebase';
import '../../styles/home.css';

import { Home, Search, NotificationsNone, Settings, Person, InsertEmoticon,
        AddPhotoAlternate, AddAPhoto, Add
} from '@material-ui/icons';
import InterestTag from "../../components/InterestTag";

function HomePage() {

    const [userData, setUserData] = useState("");
    const [interesses, setInteresses] = useState([]);

    async function getUserData() {

        console.log("getuserdata")

        let uid = window.sessionStorage.getItem("uid");

        Firebase.firestore().collection("usuario").doc(uid).get()
        .then((snapshot) => {
            console.log(snapshot.data())
        })

    }

    useEffect(() => {
        let uid = window.sessionStorage.getItem("uid");

        Firebase.firestore().collection("usuario").doc(uid).get()
        .then((snapshot) => {
            console.log(snapshot.data());
            setUserData(snapshot.data());
            setInteresses(snapshot.data().interesses)
        })
    }, []);

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
                        <h2 className="h2-username">{userData.nome}</h2>
                        <p className="p-username">@lucaskleal</p>
                    </div>

                </div>

                <div className="div-interests">
                    {   
                        interesses.map(interesse => (
                            <InterestTag text={interesse} styleClass="interest-tag" content="text"/>
                        ))
                    }
                    <InterestTag styleClass="rounded-interest-tag" content="icon"><Add /></InterestTag>

                </div>

            </div>

            <div className="div-section div-section-center">

                <div className="div-post-input">
                    <input type="text" className="input-post-text" placeholder="No que você está pensando?"></input>
                    <hr className="hr-post-line"></hr>

                    <div style={{ "paddingLeft": "1rem", "paddingTop": "0.4rem" }}>
                        <AddPhotoAlternate fontSize="small" className="post-icons" />
                        <AddAPhoto fontSize="small" className="post-icons" />
                        <InsertEmoticon fontSize="small" className="post-icons" />
                    </div>

                </div>

                <div class="div-timeline">

                    <div class="div-timeline-post">

                    </div>

                </div>

            </div>

            <div className="div-section div-section-right">

                <div className="div-header-icons">
                    <Settings className="header-icon" />
                    <NotificationsNone className="header-icon" />
                    <Search className="header-icon" />
                    <Home className="header-icon" title="Home Page" />
                </div>

            </div>

        </div>

    )

}

export default HomePage;