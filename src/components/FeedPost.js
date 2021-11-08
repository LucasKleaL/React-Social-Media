import { React, useEffect, useState } from "react";
import Firebase from "./../Firebase";
import './../styles/home.css';

import { Whatshot, Share, ChatBubbleOutline }from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';

import ShareModal from "./ShareModal";
import InterestTag from "./InterestTag";

function FeedPost(props) {

    //post data
    const [authUserUid, setAuthUserUid] = useState();
    const [postImg, setPostImg] = useState();
    const [postUserImg, setPostUserImg] = useState();

    //local post attributes 
    const [likeActive, setLikeActive] = useState();
    const [likeStyle, setLikeStyle] = useState();

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [open, setOpen] = useState();
    const [shareStyle, setShareStyle] = useState();

    useEffect(() => {
        getAuth();
    }, []);

    useEffect(() => {
        isLiked(authUserUid);
    }, [likeActive])

    useEffect(() => {   
        getPostImg();
        getPostUserImg();
    });

    async function getAuth() {
        Firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                setAuthUserUid(user.uid);
                isLiked(user.uid);
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
            debugger
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
            var saldo = 0;
            var autorId = "";
            usersLiked.push(authUserUid);
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
                            users_liked: usersLiked
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

    function clickShare() {

        console.log("clickShare")

        const handleOpen = () => {
            setOpen(true);
        };
    
        const handleClose = () => {
            setOpen(false);
        };

        if(!isShareOpen) {
            console.log("open")
            handleOpen();
            setIsShareOpen(true);
        }
        else {
            setIsShareOpen(false);
        }
    
        return (
    
            <Modal
                open={open}
                onClose={handleClose}
            >
    
                <h1>Modal</h1>
    
            </Modal>
    
        )

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
                        <p className="p-post-username" id="username">{props.username}</p>
                    </div>

                    <div>
                        <p className="p-post-time">{props.datetime}</p>                  
                        {props.interestTag ? <InterestTag text={props.interestTag} styleClass="post-interest-tag" content="post-tag" /> : null }     
                    </div>

                </div>

                <hr className="post-hr"></hr>

                <div className="post-description">
                    <h1 className="h1-post-title">{props.description}</h1>
                </div>

                <div>
                    <img className="post-image" src={postImg} />
                </div>

                <div className="div-post-icons">
                    <div style={{ "textAlign": "center" }}>
                        <Whatshot fontSize="small" className={likeStyle} onClick={clickLike} />
                        <p className="p-post-numbers like-number">{props.usersLiked.length}</p>
                    </div>

                    <div style={{ "textAlign": "center" }}>
                        <Share fontSize="small" className="post-icon share-icon" onClick={clickShare} style={{ "marginLeft": "0.2rem" }} />
                        <p className="p-post-numbers">{props.usersShared.length}</p>
                    </div>

                    <div style={{ "textAlign": "center" }}>
                        <ChatBubbleOutline fontSize="small" className="post-icon comment-icon" style={{ "marginLeft": "0.35rem" }} />
                        <p className="p-post-numbers">{props.comments}</p>
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