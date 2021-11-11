import { React, useState, useEffect, useLayoutEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Container, Button, Typography, Grid } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import Firebase from "./../../Firebase";

import {
    PersonAdd, Settings 
} from '@material-ui/icons';

import FirstPost from "./../../public/achievements/first_post.png";
import FirstUp from "./../../public/achievements/first_up.png";
import ThousandCoins from "./../../public/achievements/thousand_coins.png";
import LevelFive from "./../../public/achievements/level_five.png";

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
    const [profileSharedPosts, setProfileSharedPosts] = useState([]);
    const [profileInterests, setProfileInterests] = useState([]);
    const [profileXp, setProfileXp] = useState();
    const [profileLevel, setProfileLevel] = useState();
    const [profileDonations, setProfileDonations] = useState();

    const levels = [
        200,
        400,
        600,
        800,
        1000,
        1200,
        1400,
        1600,
        1700,
    ]

    //visited profile style
    const [progressBar, setProgressBar] = useState();

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

    useEffect(() => {
        setProfileXp(profileData.xp)
    })

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
                        setProfileSharedPosts(snapshot.data().shared_posts);
                        setProfileInterests(snapshot.data().interesses);
                        setProfileDonations(snapshot.data().total_doado);
                        setProfileXp(snapshot.data().xp);
                        getProfileLevel(snapshot.data().xp);
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

    function getProfileLevel(xp) {

        let currentLevel;
        let xpToNextLevel;
        let min;
        let max;
        
        for (let i = 0; i < levels.length; i++) {
            console.log(levels[i])
            if (xp < levels[i] && xp != levels[i]) {
                currentLevel = i;
                xpToNextLevel = levels[i];
                setProfileLevel(currentLevel);
                console.log("getProfileLevel "+i)
                break;
            }
            else if (xp == levels[i]) {
                currentLevel = i+1;
                setProfileLevel(currentLevel);
                break;
            }
        }

        if (currentLevel == 0) {
            xpToNextLevel = 200;
            min = 0;
            max = 200;
        }
        else {
            //xpToNextLevel = currentLevel * 100 * 2;
            min = xpToNextLevel - (xpToNextLevel / 2);
            max = xpToNextLevel;
        }
        
        console.log("xpToNextLevel: "+xpToNextLevel)

        const percentToNextLevel = ((xp - min) * 100) / (max - min)

        console.log("percentToNextLevel "+percentToNextLevel)

        let xpBarStyle = {
            display: "absolute",
            height: "0.5rem",
            width: percentToNextLevel + "%",
            backgroundColor: "var(--pink-purple)",
            float: "left"
        }

        setProgressBar(xpBarStyle);

    }

    return (

        <Container maxwidth="lg" align="center" className="container">

            <div className="profile-container">

                <div className="profile-attributes">

                    <img className="img-user" src={profileImg}/>

                    <div style={{ "marginTop": "2rem", "marginLeft": "1rem" }}>

                        <h2 className="h2-username">{profileData.nome}</h2>
                        <p className="p-username">@{profileData.usuario}</p>

                        <div style={{"display": "flex"}}>

                            {
                                profileInterests.map(interest => {
                                    return (
                                        
                                        <div className="interest-tag-profile">
                                            <p className="interest-tag-text">{interest}</p>
                                        </div>

                                    )
                                })
                            }
                            
                        </div>

                    </div>

                </div>

                <div className="div-profile-actions">
                    {
                        sameUser ? (<Settings className="profile-actions-icon"/>) : (<PersonAdd className="profile-actions-icon" />)
                    }
                </div>

            </div>

            <div className="profile-achievements">

                <div className="div-achievements">
                    <Typography variant="h6" >@{profileData.usuario}'s Achievements</Typography>
                    <Grid container style={{ "paddingTop": "0.8rem" }}>
                        <Grid item>

                            { profileSharedPosts.length >= 1 ? (<img src={FirstPost} className="achievement-icon" title="Meu primeiro post na SetUp!" alt="Primeiro post" />) : (null) }
                            { profileDonations >= 200 ? (<img src={FirstUp} className="achievement-icon" title="Eu impulsionei um post!" alt="Eu impulsionei um post"/>) : (null) }
                            { profileDonations >= 1000 ? (<img src={ThousandCoins} className="achievement-icon" title="Eu já gastei mil UpCoins!" alt="Eu já gastei mil UpCoins"/>) : (null) }
                            { profileXp >= 1000 ? (<img src={LevelFive} className="achievement-icon" title="Eu atingi o level 5!" alt="Level 5"/>) : (null) }

                        </Grid>
                    </Grid>
                </div>

            </div>

            <div className="profile-level">
                
                <div className="level">
                    <Typography variant="p" className="p-level">{profileLevel}</Typography>
                </div>

                <div style={{ "marginLeft": "1rem" }}>
                    <Typography variant="h6" className="h6-level">Level {profileLevel}</Typography>

                    <div className="experience-bar"> 
                        <div style={progressBar}></div>
                    </div>

                </div>
                
            </div>

        </Container>

    )

}

export default Profile;