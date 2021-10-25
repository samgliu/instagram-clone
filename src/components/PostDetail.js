import '../style/Signup.css';
import instagram from '../images/instagram.png';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext } from 'react';
import '../style/PostDetail.css';
import { v4 as uuidv4 } from 'uuid';

function Postdetail({ post, setIsPostDetailOpen, isPostDetailOpen }) {
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
    } = useContext(GlobalContext);
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
    console.log('in post detail ', post);
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
                        console.log('commentsDisplay', cmt);
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
