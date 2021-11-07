import { React, Component, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Firebase from '../../Firebase';
import '../../styles/home.css';

import {
    Home, Search, NotificationsNone, Settings, Person, InsertEmoticon,
    AddPhotoAlternate, AddAPhoto, Add, ExitToApp, Whatshot, Share, ChatBubbleOutline
} from '@material-ui/icons';
import { Button, Grid } from "@material-ui/core";

import InterestTag from "../../components/InterestTag";
import FeedPost from "../../components/FeedPost";
import FalconHeavyImg from "./../../public/falcon_heavy.png";
import SetUpTextLogo from "./../../public/SetUpText.png";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

function HomePage() {
    var history = useHistory();
    //user data bring from firebase
    const [userData, setUserData] = useState("");
    const [userUid, setUserUid] = useState("")
    const [interesses, setInteresses] = useState([]);
    const [userImg, setUserImg] = useState();
    const [saldo, setSaldo] = useState();
    //new post attributes
    const [postDescText, setPostDescText] = useState("");
    const [postImg, setPostImg] = useState();

    //posts data bring from firebase
    const [postsData, setPostsData] = useState([]);

    useEffect(() => {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserUid(user.uid);
                let uid = user.uid;
                Firebase.firestore().collection("usuario").doc(uid).get()
                    .then((snapshot) => {
                        debugger
                        console.log(snapshot.data());
                        setUserData(snapshot.data());
                        setInteresses(snapshot.data().interesses)
                        setSaldo(snapshot.data().saldo)
                        getProfileImg(uid)
                    })
            }
            else {
                history.push("/");
            }
        });
    }, []);

    useEffect(() => {
        interesses.forEach(element => {
            getPostsByInterest(element)
        });
    }, [interesses]);
    useEffect(() => {
        interesses.forEach(element => {
            getPostsByInterest(element)
        });
    }, [saldo]);

    function signOut() {
        Firebase.auth().signOut();
        history.push("/");
        console.log("logout")
    }

    async function postPublish() {
        console.log("postPublish")

        let text = postDescText;
        let name = userData.nome;
        let username = userData.usuario;
        let postTag = [];
        let postTagMultiple = [];
        let count = 0;
        interesses.forEach(element => {
            if (count === 0) {
                postTagMultiple.push(element)
                postTag.push(element)
                count++;
            }
            else {
                postTagMultiple.push(", " + element)
                postTag.push(element)
                count++;
            }
        });


        let dateTime = new Date();
        let date = dateTime.getDate() + "/" + dateTime.getMonth() + "/" + dateTime.getFullYear() + " ";
        let time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
        let postDatetime = date + time;

        let postComments = 0;
        let postUpvotes = 0;

        let postUid;

        await Firebase.firestore().collection("posts").add({
            post_comments: postComments,
            post_date_time: postDatetime,
            post_description: text,
            post_tag: postTag,
            post_tagMultiple: postTagMultiple,
            post_upvotes: postUpvotes,
            user_name: name,
            user_uid: userUid,
            username: username,
            users_liked: [],
            users_shared: []
        }).then((docRef) => {
            postUid = docRef.id;
            interesses.forEach(element => {
                Firebase.firestore().collection("interesse").doc(element).update({
                    idPosts: Firebase.firestore.FieldValue.arrayUnion(postUid)
                })
            });
        })

        if (postImg) {
            console.log("docRef: " + postUid)
            await Firebase.storage().ref("posts").child(postUid).put(postImg)
                .then((e) => {
                    console.log("Upload da foto feito com sucesso")
                })
                .catch((e) => {
                    console.log("Erro ao realiar upload da foto")
                })
        }

        interesses.forEach(element => {
            getPostsByInterest(element)
        });
    }

    async function getAllPosts() {
        await Firebase.firestore().collection("posts").get()
            .then((snapshot) => {
                let snapshotArray = [];
                snapshot.docs.map((doc) => snapshotArray.push([doc.data(), doc.id]));
                //snapshotArray.push((snapshot.docs.map(doc => doc.data())));
                setPostsData(snapshotArray);
            })
        console.log(postsData);
    }


    async function getPostsByInterest(interest) {
        await Firebase.firestore().collection("interesse").doc(interest).get()
            .then((snapshot) => {
                let snapshotArray = [];
                var postsData = snapshot.data();
                if (postsData != undefined) {
                    var postsIds = snapshot.data().idPosts;
                    if (postsIds != undefined) {
                        postsIds.forEach(element => {
                            Firebase.firestore().collection("posts").doc(element).get()
                                .then((snapshot) => {
                                    snapshotArray.push([snapshot.data(), snapshot.id])
                                    setPostsData(snapshotArray);
                                })
                        })
                    }
                }
            });
    }


    async function setProfileImg(e) {

        let file = e.target.files[0];

        await Firebase.storage().ref("usuario").child(userUid).put(file).
            then(() => {
                console.log("Foto de perfil atualizada com sucesso.")
            })
            .catch(() => {
                console.log("Erro ao atualizar foto de perfil.");
            })

        getProfileImg();
    }

    async function getProfileImg(uid) {
        var test = Firebase.storage().ref(uid).listAll()



        if (uid) {
            await Firebase.storage().ref("usuario").child(uid).getDownloadURL()
                .then((url) => {

                    setUserImg(url);
                });
        }
        else {
            await Firebase.storage().ref("usuario").child(userUid).getDownloadURL()
                .then((url) => {

                    setUserImg(url);
                });
        }
    }

    function getPostImgFromInput(e) {
        let file = e.target.files[0];
        setPostImg(file);
    }

    return (

        <div className="div-container-home">

            <div className="div-section div-section-left">

                <div className="div-header-logo">
                    <img src={SetUpTextLogo} className="header-logo-img" />
                </div>

                <div className="div-profile">
                    <label>
                        <div className="div-profile-image" for="profileImgInput">
                            {/*
                            <label for="profileImgInput">
                                <Add fontSize="large" style={{"cursor": "pointer", "position": "absolute", "zIndex": "-1"}}/>
                            </label>
                            */
                            }
                            <input type="file" id="profileImgInput" style={{ "display": "none" }} onChange={(e) => { setProfileImg(e) }} />
                            <img src={userImg} alt="" style={{ "width": "100%", "height": "100%", "zIndex": "0", "borderRadius": "100%" }}></img>
                        </div>
                    </label>

                    <div className="div-profile-username">
                        <h2 className="h2-username">{userData.nome}</h2>
                        <p className="p-username">@{userData.usuario}</p>
                    </div>

                </div>

                <div className="div-interests">
                    {
                        interesses.map(interesse => (
                            <InterestTag text={interesse} styleClass="interest-tag" content="text" />
                        ))
                    }
                    <InterestTag styleClass="rounded-interest-tag" content="icon"><Add /></InterestTag>

                </div>

            </div>

            <div className="div-section div-section-center">

                <div className="div-post-input">
                    <input type="text" className="input-post-text" placeholder="No que você está pensando?" onChange={(e) => { setPostDescText(e.target.value) }}></input>
                    <hr className="hr-post-line"></hr>

                    <div style={{ "paddingLeft": "1rem", "paddingTop": "0.4rem" }}>
                        <input type="file" id="addPostImg" style={{ "display": "none" }} onChange={(e) => { getPostImgFromInput(e) }} />
                        <label for="addPostImg">
                            <AddPhotoAlternate fontSize="small" className="post-icons" />
                        </label>
                        <AddAPhoto fontSize="small" className="post-icons" />
                        <InsertEmoticon fontSize="small" className="post-icons" />
                        <div style={{ "float": "right", "marginRight": "5%" }}>
                            <Button className="post-publish-button" onClick={postPublish} style={{ "backgroundColor": "black", "borderRadius": "50", "textTransform": "none" }}>
                                <h1 className="h1-post-publish-button">Publicar</h1>
                            </Button>
                        </div>
                    </div>

                </div>


                <div class="div-timeline">
                    {
                        
                        postsData.map(post => {
                            return (
                                <FeedPost
                                    postUid={post[1]}
                                    userUid={post[0].user_uid}
                                    name={post[0].user_name}
                                    username={"@" + post[0].username}
                                    datetime={post[0].post_date_time}
                                    interestTag={post[0].post_tagMultiple}
                                    description={post[0].post_description}
                                    comments={post[0].post_comments}
                                    usersLiked={post[0].users_liked}
                                    usersShared={post[0].users_shared}
                                />
                            )
                        })
                    }
                    {
                        /*
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
                                <img className="post-image" src={FalconHeavyImg} />
                            </div>

                            <div className="div-post-icons">
                                <div style={{ "textAlign": "center" }}>
                                    <Whatshot fontSize="small" className="post-icon like-icon" />
                                    <p className="p-post-numbers like-number">15</p>
                                </div>

                                <div style={{ "textAlign": "center" }}>
                                    <Share fontSize="small" className="post-icon share-icon" style={{ "marginLeft": "0.2rem" }} />
                                </div>

                                <div style={{ "textAlign": "center" }}>
                                    <ChatBubbleOutline fontSize="small" className="post-icon comment-icon" style={{ "marginLeft": "0.35rem" }} />
                                </div>

                            </div>

                        </div>
                        */
                    }
                </div>
            </div>

            <div className="div-section div-section-right">
                <div className="div-header-icons">
                    
                    <Grid container spacing={2} className="containerFuncoesPrincipais">
                        <Grid item xs={2} className="saldoCoins">
                            <a title="Saldo" class="tab-coins"><div class="coins"><span class="fire-coin"
                            style={{
                                backgroundImage: "url(" + "https://d3r6ceqp4shltl.cloudfront.net/assets/fire-coin_small-22c9cf075930f175532c837169d8b32130dafd9050eb81c102f8b30614e67f79.png" + ")",
                            }}>
                            </span><span class="coins-counter">{userData.saldo}</span></div></a>
                        </Grid>
                        <Grid item xs={1}>
                            <a title="Recarregar UpCoins" class="icon-create-content" ><AddRoundedIcon></AddRoundedIcon></a>
                        </Grid>
                    </Grid>
                    <div className="funcoesMenu">
                        <ExitToApp className="header-icon" onClick={signOut} title="Logout" />
                        <Settings className="header-icon" title="Configurações" />
                        <NotificationsNone className="header-icon" title="Notificações" />
                        <Search className="header-icon" title="Pesquisar" />
                        <Home className="header-icon" title="Home Page" title="Página Inicial" />
                    </div>
                </div>
            </div>
        </div>

    )

}

export default HomePage;