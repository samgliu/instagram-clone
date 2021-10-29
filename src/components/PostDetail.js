import '../style/Signup.css';
import instagram from '../images/instagram.png';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useState, useEffect } from 'react';
import '../style/PostDetail.css';
import { v4 as uuidv4 } from 'uuid';
import DropdownButton from './DropdownButton';

function Postdetail({ post, setIsPostDetailOpen, isPostDetailOpen }) {
    const [isOwner, setIsOwner] = useState(false);
    const {
        onSubmitSignin,
        getUserinfo,
        history,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        getDataFromserver,
        setIsHomeClicked,
        regetdataFromserver,
        saveCommentToServer,
        displayname,
        deletePostFromServer,
    } = useContext(GlobalContext);

    useEffect(() => {
        console.log(
            'displayname === post.username0',
            displayname,
            post.username
        );
        if (displayname === post.username) {
            setIsOwner(true);
        }
    }, []);

    function onCloseClick(e) {
        e.preventDefault();
        setIsPostDetailOpen(!isPostDetailOpen);
    }
    let comment = '';
    async function postOnClick(e) {
        e.preventDefault();
        if (comment !== '') {
            await saveCommentToServer(comment, post.uuid, post.postid);
            await regetdataFromserver();
        }
    }

    const handleProceed = (e, link) => {
        e.preventDefault();

        history.push(link);
    };
    let postUid = post.owneruser.path.substring(6);
    //console.log('in post detail ', post);
    function handleThreePtClicked() {
        console.log();
    }
    async function handleDeleteOnPost() {
        let path = `/users/${post.uuid}/post/${post.postid}`;
        await deletePostFromServer(path);
        //history.push('/');
        setIsPostDetailOpen(false);
    }
    return (
        <div className="PostDetail">
            <div className="detailImgContainer">
                <img src={post.pic} alt="" />
            </div>
            <div className="commentContainer">
                <div className="commentHeader">
                    <div className="avatarContainer">
                        <img src={post.avatar} alt="" />

                        <div>
                            <Link
                                to={{
                                    pathname: `/profile/${post.username}/${postUid}`,
                                }}
                                onClick={(e) =>
                                    handleProceed(
                                        e,
                                        `/profile/${post.username}/${postUid}`
                                    )
                                }
                            >
                                <strong>{post.username}</strong>
                            </Link>
                        </div>
                    </div>

                    <div className="buttonContainer">
                        <div className="detailButton">
                            <DropdownButton
                                isOwner={isOwner}
                                onClick={() => {
                                    handleThreePtClicked();
                                }}
                                handleDeleteOnPost={handleDeleteOnPost}
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={(e) => onCloseClick(e)}
                                className="closebtn"
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                </div>
                <div className="commentsDisplay">
                    <div className="singleCmt">
                        <div className="avatarContainer">
                            <img src={post.avatar} alt="" />
                            <Link
                                to={{
                                    pathname: `/profile/${post.username}/${postUid}`,
                                }}
                                onClick={(e) =>
                                    handleProceed(
                                        e,
                                        `/profile/${post.username}/${post.uuid}`
                                    )
                                }
                            >
                                <strong>{post.username}&nbsp;</strong>
                            </Link>
                        </div>
                        <div>{post.topic}</div>
                    </div>
                    {post.comments.map((cmt) => {
                        // console.log('commentsDisplay', cmt);
                        let cmtUid = cmt.owneruser.path.substring(6);
                        return (
                            <div className="singleCmt" key={uuidv4()}>
                                <div className="avatarContainer">
                                    <img src={cmt.avatar} alt="" />
                                    <Link
                                        to={{
                                            pathname: `/profile/${cmt.username}/${postUid}`,
                                        }}
                                        onClick={(e) =>
                                            handleProceed(
                                                e,
                                                `/profile/${cmt.username}/${cmtUid}`
                                            )
                                        }
                                    >
                                        <strong>{cmt.username}&nbsp;</strong>
                                    </Link>
                                </div>
                                <div>{cmt.comment}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="detailCmtContainer">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        onChange={(e) => (comment = e.target.value)}
                    />
                    <a href="/#" onClick={(e) => postOnClick(e)}>
                        Post
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Postdetail;