import { React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Firebase from "./../Firebase";
import './../styles/home.css';

import { Whatshot, Share, ArrowUpward }from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';

import ShareModal from "./ShareModal";
import InterestTag from "./InterestTag";

function FeedPost(props) {

    const history = useHistory();

    //props 
    const [state, setState] = useState("");

    //post data
    const [authUserUid, setAuthUserUid] = useState();
    const [postImg, setPostImg] = useState();
    const [postUserImg, setPostUserImg] = useState();

    //local post attributes 
    const [likeActive, setLikeActive] = useState();
    const [likeStyle, setLikeStyle] = useState();

    const [shareActive, setShareActive] = useState();
    const [shareStyle, setShareStyle] = useState();

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [open, setOpen] = useState();

    const [upvoteActive, setUpvoteActive] = useState();
    const [upvoteStyle, setUpvoteStyle] = useState();

    useEffect(() => {
        getAuth();
    }, []);

    useEffect(() => {
        isLiked(authUserUid);
    }, [likeActive]);

    useEffect(() => {
        isUpvoted(authUserUid);
    }, [upvoteActive])

    useEffect(() => {
        isShared(authUserUid);
    }, [shareActive])

    useEffect(() => {   
        getPostImg();
        getPostUserImg();
    });

    async function getAuth() {
        Firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                setAuthUserUid(user.uid);
                isLiked(user.uid);
                isShared(user.uid);
                isUpvoted(user.uid);
                getPostImg();
                getPostUserImg();
            }
            else {
                //
            }
        });
    }
    async function getPostImg() {
        await Firebase.storage().ref("posts").child(props.postUid).getDownloadURL()
        .then((url) => {
            setPostImg(url);
        });
    }

    async function getPostUserImg() {
        await Firebase.storage().ref("usuario").child(props.userUid).getDownloadURL()
        .then((url) => {
            setPostUserImg(url);
        });
    }

    async function clickLike() {

        let usersLiked = props.usersLiked;
        let liked = false;

        for (var i = 0; i < usersLiked.length; i++) {
            if (usersLiked[i] == authUserUid) {
                liked = true;
                break;
            }
            else {
                liked = false;
            }
        }
        

        if (liked) {
            setLikeActive(false);
            usersLiked.splice(usersLiked.indexOf(authUserUid), 1)
            await Firebase.firestore().collection("posts").doc(props.postUid)
            .update({
                users_liked: usersLiked
            })
        }
        else {
            setLikeActive(true);
            usersLiked.push(authUserUid);
            await Firebase.firestore().collection("posts").doc(props.postUid)
            .update({
                users_liked: usersLiked
            });
        }
    }

    
    function isLiked(uid) {

        let usersLiked = props.usersLiked;
        let liked = false;

        for (var i = 0; i < usersLiked.length; i++) {
            if (usersLiked[i] == uid) {
                liked = true;
                break;
            }
            else {
                continue;
            }
        }

        if (liked) {
            setLikeStyle("post-icon like-icon-active");
        }
        else {
            setLikeStyle("post-icon like-icon");
        }

    }

    async function clickShare() {
        let usersShared = props.usersShared;
        let shared = false;

        for (var i = 0; i < usersShared.length; i++) {
            if (usersShared[i] == authUserUid) {
                shared = true;
                break;
            }
            else {
                shared = false;
            }
        }
        if (shared) {
            alert("Você já compartilhou este post!")
        }
        else {
            var saldo = 0;
            var autorId = "";
            usersShared.push(authUserUid);
            await Firebase.firestore().collection("usuario").doc(authUserUid).get()
            .then((snapshot) => {            
                Firebase.firestore().collection("posts").doc(props.postUid)
                        .update({
                        users_shared: usersShared
                        })
                setShareActive(true);
            })
        }
    }

    async function clickUpvote() {

        let usersUpvoted = props.usersUpvoted;
        let upvoted = false;

        for (var i = 0; i < usersUpvoted.length; i++) {
            if (usersUpvoted[i] == authUserUid) {
                upvoted = true;
                break;
            }
            else {
                upvoted = false;
            }
        }
        

        if (upvoted) {
            alert("Você já deu um UpVote neste post!")
        }
        else {
            var saldo = 0;
            var autorId = "";
            usersUpvoted.push(authUserUid);
            await Firebase.firestore().collection("usuario").doc(authUserUid).get()
            .then((snapshot) => {
                saldo = snapshot.data().saldo;
                if(saldo >= 150){
                    saldo = saldo - 150;
                    Firebase.firestore().collection("usuario").doc(authUserUid)
                            .update({
                                saldo: saldo
                            })
                    Firebase.firestore().collection("posts").doc(props.postUid)
                            .update({
                            users_upvoted: usersUpvoted
                            })
                    Firebase.firestore().collection("posts").doc(props.postUid)
                    .get()
                    .then((snapshot) => {  
                        Firebase.firestore().collection("usuario").doc(authUserUid).get()
                                .then((snapshot) => {
                                    saldo = snapshot.data().saldo;
                                })
                        autorId = snapshot.data().user_uid;
                        Firebase.firestore().collection("usuario").doc(autorId)
                            .update({
                                saldo: saldo + 100
                            })
                    }) 
                    setLikeActive(true);
                }else{
                    alert("Saldo insuficiente")
                }
            })
        }

    }

    function isUpvoted(uid) {
        let usersUpvoted = props.usersUpvoted;
        let upvoted = false;

        for (var i = 0; i < usersUpvoted.length; i++) {
            if (usersUpvoted[i] == uid) {
                upvoted = true;
                break;
            }
            else {
                continue;
            }
        }

        if (upvoted) {
            setUpvoteStyle("post-icon up-icon-active");
        }
        else {
            setUpvoteStyle("post-icon up-icon");
        }
    }

    function isShared(uid) {
        let usersShared = props.usersShared;
        let shared = false;

        for (var i = 0; i < usersShared.length; i++) {
            if (usersShared[i] == uid) {
                shared = true;
                break;
            }
            else {
                continue;
            }
        }

        if (shared) {
            setShareStyle("post-icon share-icon-active");
        }
        else {
            setShareStyle("post-icon share-icon");
        }
    }
      
    function userProfileRedirect(uid) {
        console.log("userProfileRedirect "+uid)
        history.push({
            pathname: "/profile",
            data: uid
        })
    }

    function printFeedPost() {
        return (
            <div>
                
                <div class="div-post-meta-data">
                    <div class="div-post-profile-img">
                        <img src={postUserImg} style={{ "width": "100%", "borderRadius": "100%" }} />
                    </div>
                    <div class="div-post-profile-user">
                        <h2 className="h2-post-username">{props.name}</h2>
                        <p className="p-post-username" id="username" onClick={() => {userProfileRedirect(props.userUid)}}>{props.username}</p>
                    </div>
                    <div>
                        <p className="p-post-time">{props.datetime}</p>                  
                        { props.interestTag ? <InterestTag text={props.interestTag} styleClass="post-interest-tag" content="post-tag" /> : null }     
                    </div>
                </div>

                <hr className="post-hr"></hr>

                <div className="post-description">
                    <h1 className="h1-post-description">{props.description}</h1>
                </div>

                <div>
                    <img className="post-image" src={postImg} />
                </div>

                <div className="div-post-icons">
                    <div style={{"display": "flex", "width": "80%"}}>
                        <div style={{ "textAlign": "center" }}>
                            <Whatshot fontSize="small" className={likeStyle} onClick={clickLike} />
                            <p className="p-post-numbers like-number">{props.usersLiked.length}</p>
                        </div>
                        <div style={{ "textAlign": "center" }}>
                            <Share fontSize="small" className={shareStyle} onClick={clickShare} style={{ "marginLeft": "0.2rem" }} />
                            <p className="p-post-numbers">{props.usersShared.length}</p>
                        </div>
                    </div>
                    <div style={{ "float": "right" }}>
                        <div style={{ "textAlign": "center" }}>
                            <ArrowUpward fontSize="medium" className={upvoteStyle} onClick={clickUpvote} style={{ "marginLeft": "0.2rem"}} />
                            <p className="p-post-numbers">{props.usersUpvoted.length}</p>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
    
    return(
        <div class="div-timeline-post">
            {printFeedPost()}
        </div>
    )

}


export default FeedPost;