import '../style/Signup.css';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useState, useEffect } from 'react';
import '../style/PostDetail.css';
import { v4 as uuidv4 } from 'uuid';
import DropdownButton from './DropdownButton';
import PostDetailHeader from './PostDetailHeader';

function Postdetail({ post, setIsPostDetailOpen, isPostDetailOpen }) {
    const [isOwner, setIsOwner] = useState(false);
    const {
        history,
        regetdataFromserver,
        saveCommentToServer,
        displayname,
        deletePostFromServer,
    } = useContext(GlobalContext);

    useEffect(() => {
        if (displayname === post.username) {
            setIsOwner(true);
        }
    }, [displayname, post.username]);

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
            <div className="detailImgContainer desktopPostDetailImg">
                <img src={post.pic} alt="" />
            </div>
            <div className="commentContainer">
                <PostDetailHeader
                    avatar={post.avatar}
                    username={post.username}
                    uid={postUid}
                    isOwner={isOwner}
                    handleThreePtClicked={handleThreePtClicked}
                    onCloseClick={onCloseClick}
                    handleDeleteOnPost={handleDeleteOnPost}
                />
                <div className="detailImgContainer mobilePostDetailImg">
                    <img src={post.pic} alt="" />
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
                    <div className="commentsWrapper">
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
                                            <strong>
                                                {cmt.username}&nbsp;
                                            </strong>
                                        </Link>
                                    </div>
                                    <div>{cmt.comment}</div>
                                </div>
                            );
                        })}
                    </div>
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
