import { React, useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import Firebase from '../../Firebase';
import '../../styles/home.css';

import {
    Home, Search, NotificationsNone, Settings, InsertEmoticon,
    AddPhotoAlternate, AddAPhoto, Add, ExitToApp
} from '@material-ui/icons';
import { Button, Grid } from "@material-ui/core";

import InterestTag from "../../components/InterestTag";
import FeedPost from "../../components/FeedPost";

import SetUpTextLogo from "./../../public/SetUpText.png";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { LinkedCameraSharp } from "@mui/icons-material";

function HomePage() {
    var history = useHistory();
    //user data bring from firebase
    const [userData, setUserData] = useState("");
    const [userUid, setUserUid] = useState("")
    const [interesses, setInteresses] = useState([]);
    const [userImg, setUserImg] = useState();
    const [saldo, setSaldo] = useState();
    //new post attributes
    const tagInterests = [
        'Esportes',
        'Games',
        'Tecnologia',
        'Astronomia',
        'Matemática',
        'Filmes',
        'Ciência',
        'Memes',
        'Séries',
        'Fotografia',
    ];
    const [postTag, setPostTag] = useState("");
    const [postDescText, setPostDescText] = useState("");
    const [postImg, setPostImg] = useState();
    const [isPosted, setIsPosted] = useState();

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
                        //getAllPosts()
                    })
            }
            else {
                history.push("/");
            }
        });
    }, []);

    
    useEffect(() => {
        interesses.forEach(element => {
            getPostsByInterest(element);
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


        let datetime = new Date();
        let postDatetime = datetime.toLocaleDateString("pt-br", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });

        let postUid;

        await Firebase.firestore().collection("posts").add({
            post_datetime: postDatetime,
            post_description: text,
            post_tag: postTag,
            post_tagMultiple: postTagMultiple,
            user_name: name,
            user_uid: userUid,
            username: username,
            users_liked: [],
            users_shared: [],
            users_upvoted: []
        }).then((docRef) => {
            postUid = docRef.id;
            setIsPosted(true);
            interesses.forEach(element => {
                Firebase.firestore().collection("interesse").doc(element).update({
                    idPosts: Firebase.firestore.FieldValue.arrayUnion(postUid)
                })
            })
        })

        if (postImg) {
            console.log("docRef: " + postUid)
            await Firebase.storage().ref("posts").child(postUid).put(postImg)
                .then((e) => {
                    console.log("Upload da foto feito com sucesso")
                })
                .catch((e) => {
                    console.log("Erro ao realizar upload da foto")
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
                setPostsData(snapshotArray);
            })
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

                        <select className="select-post-tag" onChange={(e) => { setPostTag(e.target.value) }}>
                            <option></option>
                            {
                                tagInterests.map(interest => {
                                    return(
                                        <option>{interest}</option>
                                    )
                                })
                            }
                        </select>

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
                                    datetime={post[0].post_datetime}
                                    interestTag={post[0].post_tagMultiple}
                                    description={post[0].post_description}
                                    usersLiked={post[0].users_liked}
                                    usersShared={post[0].users_shared}
                                    usersUpvoted={post[0].users_upvoted}
                                />
                            )
                        })
                    }
                </div>

            </div>

            <div className="div-section div-section-right">

                <div className="div-header-icons">
                      
                    <ExitToApp className="header-icon" onClick={signOut} title="Logout" />
                    <Settings className="header-icon" title="Configurações" />
                    <NotificationsNone className="header-icon" title="Notificações" />
                    <Search className="header-icon" title="Pesquisar" />
                    <Home className="header-icon" title="Home Page" title="Página Inicial" />
                    
                </div>

                <div>
                    <Grid container spacing={2} className="containerFuncoesPrincipais">
                            <Grid item xs={2} className="saldoCoins">
                                <a title="Saldo" class="tab-coins"><div class="coins"><span class="fire-coin"
                                style={{
                                    backgroundImage: "url(" + "https://d3r6ceqp4shltl.cloudfront.net/assets/fire-coin_small-22c9cf075930f175532c837169d8b32130dafd9050eb81c102f8b30614e67f79.png" + ")",
                                }}>
                                </span><span class="coins-counter">{userData.saldo}</span></div></a>
                            </Grid>
                            <Grid item xs={1}>
                                <Link to="/upcoins"><a title="Recarregar UpCoins" class="icon-create-content" ><AddRoundedIcon style={{ "marginTop": "0.1rem", "marginLeft": "0.05rem" }} /></a></Link>
                            </Grid>
                    </Grid>
                </div>

            </div>
        </div>

    )

}

export default HomePage;