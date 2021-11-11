import { React, useState, useEffect, useLayoutEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Container, Button, Typography, Grid } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import Firebase from "./../../Firebase";

import {
    PersonAdd, Settings 
} from '@material-ui/icons';

import "./../../styles/profile.css";
import "./../../styles/global.css";

function Profile(props) {

    const history = useHistory();

    const { data } = useLocation();

    //visitor logged profile parameters
    const [authUserUid, setAuthUserUid] = useState("");
    const [sameUser, setSameUser] = useState();

    //visited profile parameters
    const [profileUid, setProfileUid] = useState();
    const [profileData, setProfileData] = useState([]);
    const [profileImg, setProfileImg] = useState();

    useLayoutEffect(() => {

        let uid;

        if (data) {
            window.sessionStorage.setItem("profileUid", data);
            uid = data;
        }
        else {
            uid = window.sessionStorage.getItem("profileUid");
        }
        console.log(uid)
        getProfileData(uid);
        getProfileImg(uid);
        setProfileUid(uid);
    }, []);

    async function getProfileData(uid) {
        Firebase.auth().onAuthStateChanged((user) => {         
            if (user) {
                setAuthUserUid(user.uid);
                if (user.uid == uid) {
                    setSameUser(true);
                }
                else {
                    setSameUser(false);
                }
                Firebase.firestore().collection("usuario").doc(uid).get()
                    .then((snapshot) => {
                        setProfileData(snapshot.data());
                        console.log(snapshot.data())
                    })
            }
            else {
                history.push("/");
            }
        });
    }

    async function getProfileImg(uid) {
        await Firebase.storage().ref("usuario").child(uid).getDownloadURL()
            .then((url) => {
                setProfileImg(url);
        });
    }

    return (

        <Container maxwidth="lg" align="center">

            <div className="profile-container">

                <div className="profile-attributes">

                    <img className="img-user" src={profileImg}/>

                    <div style={{ "marginTop": "2rem", "marginLeft": "1rem" }}>

                        <h2 className="h2-username">{profileData.nome}</h2>
                        <p className="p-username">@{profileData.usuario}</p>

                        <div style={{"display": "flex"}}>
                            
                        </div>

                    </div>

                </div>

                <div className="div-profile-actions">
                    {
                        sameUser ? (<Settings className="profile-actions-icon"/>) : (<PersonAdd className="profile-actions-icon" />)
                    }
                </div>

            </div>

        </Container>

    )

}

export default Profile;