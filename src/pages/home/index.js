import { React, Component, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Firebase from './../../Firebase';
import '../../styles/home.css';

import { Home, Search, NotificationsNone, Settings, Person, InsertEmoticon,
        AddPhotoAlternate, AddAPhoto, Add, ExitToApp, Whatshot, Share, ChatBubbleOutline
} from '@material-ui/icons';
import InterestTag from "../../components/InterestTag";

import FalconHeavyImg from "./../../public/falcon_heavy.png"

function HomePage() {

    let history = useHistory();

    const [userData, setUserData] = useState("");
    const [interesses, setInteresses] = useState([]);

    useEffect(() => {
        let uid = window.sessionStorage.getItem("uid");

        Firebase.firestore().collection("usuario").doc(uid).get()
        .then((snapshot) => {
            console.log(snapshot.data());
            setUserData(snapshot.data());
            setInteresses(snapshot.data().interesses)
        })
    }, []);

    function signOut() {
        Firebase.auth().signOut();
        history.push("/login");
        console.log("logout")
    }

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

                        <div class="div-post-meta-data">

                            <div class="div-post-profile-img"></div>

                            <div class="div-post-profile-user">
                                <h2 className="h2-post-username">Lucas</h2>
                                <p className="p-post-username">@lucaskleal</p>
                            </div>

                            <div>
                                <p className="p-post-time">Há 5 minutos</p>
                                <InterestTag text="Foguete" styleClass="post-interest-tag" content="post-tag" />
                            </div>

                        </div>

                        <hr className="post-hr"></hr>

                        <div className="post-description">
                            <h1 className="h1-post-title">Falcon Heavy rasgando os céus da Flórida</h1>
                        </div>

                        <div>
                            <img className="post-image" src={FalconHeavyImg}/>
                        </div>

                        <div className="div-post-icons">
                            <div style={{"textAlign": "center"}}>
                                <Whatshot fontSize="small" className="post-icon like-icon" />
                                <p className="p-post-numbers like-number">15</p>
                            </div>

                            <div style={{"textAlign": "center"}}>
                                <Share fontSize="small" className="post-icon share-icon" style={{"marginLeft": "0.2rem"}} />
                            </div>
                            
                            <div style={{"textAlign": "center"}}>
                                <ChatBubbleOutline fontSize="small" className="post-icon comment-icon" style={{"marginLeft": "0.35rem"}} />
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="div-section div-section-right">

                <div className="div-header-icons">
                    <ExitToApp className="header-icon" onClick={signOut} title="Logout"/>
                    <Settings className="header-icon" title="Configurações"/>
                    <NotificationsNone className="header-icon" title="Notificações"/>
                    <Search className="header-icon" title="Pesquisar"/>
                    <Home className="header-icon" title="Home Page" title="Página Inicial"/>
                </div>

            </div>

        </div>

    )

}

export default HomePage;