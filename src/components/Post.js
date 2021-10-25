import { Link, useParams } from 'react-router-dom';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import Postdetail from './PostDetail';
import { v4 as uuidv4 } from 'uuid';
function Post({
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
}) {
    const { history, saveCommentToServer } = useContext(GlobalContext);

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
    return (
        <div>
            <div className="postcontainer">
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
                <div className="postimgcontainer">
                    <Link to={'#'} onClick={(e) => viewPost(e, post)}>
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
                                handleProceed(
                                    e,
                                    `/profile/${username}/${useruid}`
                                )
                            }
                        >
                            <strong>{username}</strong>
                        </Link>
                        &nbsp;{topic}
                    </div>
                    <div className="allCommentsLink">
                        <Link to={'#'} onClick={(e) => viewPost(e, post)}>
                            View all comments
                        </Link>
                    </div>

                    <div className="commentsWrapper">
                        {comments.map((cmt) => {
                            let cmtUid = cmt.owneruser.path.substring(6);
                            return (
                                <div key={uuidv4()}>
                                    <Link
                                        to={{
                                            pathname: `/profile/${cmt.username}/${cmtUid}`,
                                        }}
                                        onClick={(e) =>
                                            handleProceed(
                                                e,
                                                `/profile/${cmt.username}/${cmtUid}`
                                            )
                                        }
                                    >
                                        <strong> {cmt.username}</strong>
                                    </Link>
                                    &nbsp; {cmt.comment}
                                </div>
                            );
                        })}
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
        </div>
    );
}

export default Post;
