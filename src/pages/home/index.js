import { React, Component, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Firebase from '../../Firebase';
import '../../styles/home.css';

import { Home, Search, NotificationsNone, Settings, Person, InsertEmoticon,
        AddPhotoAlternate, AddAPhoto, Add, ExitToApp, Whatshot, Share, ChatBubbleOutline
} from '@material-ui/icons';
import { Button } from "@material-ui/core";

import InterestTag from "../../components/InterestTag";
import FalconHeavyImg from "./../../public/falcon_heavy.png"

function HomePage() {

    var history = useHistory();

    //user data bring from firebase
    const [userData, setUserData] = useState("");
    const [userUid, setUserUid] = useState("")
    const [interesses, setInteresses] = useState([]);

    //new post attributes
    const [postDescText, setPostDescText] = useState("");
    const [postImg, setPostImg] = useState("");

    useEffect(() => {
        
        Firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                setUserUid(user.uid);
                let uid = user.uid;
                Firebase.firestore().collection("usuario").doc(uid).get()
                .then((snapshot) => {
                console.log(snapshot.data());
                setUserData(snapshot.data());
                setInteresses(snapshot.data().interesses)
                })
            }
            else {
                history.push("/");
            }
        });

    }, []);

    function signOut() {
        Firebase.auth().signOut();
        history.push("/");
        console.log("logout")
    }

    async function postPublish() {
        console.log("postPublish")

        let text = postDescText;
        let name = userData.nome;
        let username = "";
        let postTag = "";
        
        let dateTime = new Date();
        let date = dateTime.getDate()+"/"+dateTime.getMonth()+"/"+dateTime.getFullYear() + " ";
        let time = dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();
        let postDatetime = date + time;

        let postComments = 0;
        let postLikes = 0;
        let postShares = 0;
        let postUpvotes = 0;

        let postUid;

        await Firebase.firestore().collection("posts").add({
            post_comments: postComments,
            post_date_time: postDatetime,
            post_description: text,
            post_likes: postLikes,
            post_shares: postShares,
            post_tag: postTag,
            post_upvotes: postUpvotes,
            user_name: name,
            user_uid: userUid,
            username: username
        }).then((docRef) => {
            postUid = docRef.id;
        })

        if(postImg) {
            console.log("docRef: "+postUid)
            await Firebase.storage().ref("post").child(postUid).put(postImg)
            .then((e) => {
                console.log("Upload da foto feito com sucesso")
            })
            .catch((e) => {
                console.log("Erro ao realiar upload da foto")
            })
        }

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
                    <input type="text" className="input-post-text" placeholder="No que você está pensando?" onChange={(e) => {setPostDescText(e.target.value)}}></input>
                    <hr className="hr-post-line"></hr>

                    <div style={{ "paddingLeft": "1rem", "paddingTop": "0.4rem" }}>
                        <input type="file" id="addPostImg" style={{"display": "none"}} onChange={(e) => {setPostImg(e.target.value) }} />
                        <label for="addPostImg">
                            <AddPhotoAlternate fontSize="small" className="post-icons" />
                        </label>    
                        <AddAPhoto fontSize="small" className="post-icons" />
                        <InsertEmoticon fontSize="small" className="post-icons" />
                        <div style={{"float": "right", "marginRight": "5%"}}>
                            <Button className="post-publish-button" onClick={postPublish} style={{"backgroundColor": "black", "borderRadius": "50", "textTransform": "none"}}>
                                <h1 className="h1-post-publish-button">Publicar</h1>
                            </Button>
                        </div>
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