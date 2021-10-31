import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { v4 as uuidv4 } from 'uuid';
import DropdownButton from './DropdownButton';
const Post = ({
    topic,
    timestamp,
    pic,
    postid,
    username,
    avatar,
    useruid,
    comments,
    post,
    handleShowDetail,
}) => {
    const {
        history,
        saveCommentToServer,
        displayname,
        deletePostFromServer,
        regetdataFromserver,
    } = useContext(GlobalContext);
    // const [threePtClicked, setThreePtClicked] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isPostDeleted, setIsPostDeleted] = useState(false);
    //let { uname, uuid } = useParams();
    const handleProceed = (e, link) => {
        e.preventDefault();
        // uname = username;
        // uuid = useruid;
        history.push(link);

        //console.log(generatePath('/profile/:username', { username }));
        // username &&
        //    history.push(generatePath('/profile/:username', { username }));
    };
    useEffect(() => {
        if (displayname === post.username) {
            setIsOwner(true);
        }
    }, [displayname, post.username]);
    let comment = '';
    function postOnClick(e) {
        e.preventDefault();
        if (comment !== '') {
            saveCommentToServer(comment, useruid, postid);
        }
    }
    function viewPost(e, data) {
        e.preventDefault();
        handleShowDetail(data);
    }
    //console.log('in Post comments', comments);
    /*
    function handleThreePtClicked() {
        console.log();
    }*/
    async function handleDeleteOnPost() {
        let path = `/users/${post.uuid}/post/${postid}`;
        await deletePostFromServer(path);
        await regetdataFromserver();
        setIsPostDeleted(true);
    }
    function cmtRender(cmt) {
        let cmtUid = cmt.owneruser.path.substring(6);
        return (
            <div key={uuidv4()}>
                <Link
                    to={{
                        pathname: `/profile/${cmt.username}/${cmtUid}`,
                    }}
                    onClick={(e) =>
                        handleProceed(e, `/profile/${cmt.username}/${cmtUid}`)
                    }
                >
                    <strong> {cmt.username}</strong>
                </Link>
                &nbsp; {cmt.comment}
            </div>
        );
    }

    return (
        <div
            className={
                !isPostDeleted ? 'postcontainer' : 'postcontainer hidden'
            }
        >
            <div className="postHeader">
                <div className="authorName">
                    <div className="authorimgcontainer">
                        <img src={avatar} alt="" />
                    </div>
                    <Link
                        to={{
                            pathname: `/profile/${username}/${useruid}`,
                        }}
                        onClick={(e) =>
                            handleProceed(e, `/profile/${username}/${useruid}`)
                        }
                    >
                        <strong>{username}</strong>
                    </Link>
                </div>
                <DropdownButton
                    handleDeleteOnPost={handleDeleteOnPost}
                    isOwner={isOwner}
                />
            </div>
            <div className="postimgcontainer">
                <Link to="#" onClick={(e) => viewPost(e, post)}>
                    <img className="postsimg" src={pic} alt="" />
                </Link>
            </div>
            <div className="postscoments">
                <div>
                    <Link
                        to={{
                            pathname: `/profile/${username}/${useruid}`,
                        }}
                        onClick={(e) =>
                            handleProceed(e, `/profile/${username}/${useruid}`)
                        }
                    >
                        <strong>{username}</strong>
                    </Link>
                    &nbsp;{topic}
                </div>
                <div className="allCommentsLink">
                    <Link to="#" onClick={(e) => viewPost(e, post)}>
                        View all comments
                    </Link>
                </div>

                <div className="commentsWrapper">
                    {comments.map((cmt) => cmtRender(cmt))}
                </div>
                <div className="posttime">{timestamp}</div>
                <div className="postCmtContainer">
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
};

export default Post;
