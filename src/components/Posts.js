import '../style/Posts.css';
import './Post';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect } from 'react';
import Post from './Post';

function Posts({ handleShowDetail }) {
    let time = '';
    const {
        getDataFromserver,
        posts,
        defaultLogin,
        isHomeClicked,
        setIsHomeClicked,
    } = useContext(GlobalContext);
    async function defLogin() {
        defaultLogin();
    }

    useEffect(() => {}, [posts]);

    console.log('in posts', posts);
    if (posts) {
        return (
            <div className="posts">
                {posts.map((post) => {
                    //console.log('post under map', post);
                    let locComments = post.comments;
                    if (locComments !== [] && locComments.length > 2) {
                        locComments = [locComments[0], locComments[1]];
                    }
                    return (
                        <Post
                            post={post}
                            author={post.author}
                            username={post.username}
                            topic={post.topic}
                            timestamp={post.timestamp.toDate().toString()}
                            pic={post.pic}
                            key={post.timestamp}
                            avatar={post.avatar}
                            useruid={post.uuid}
                            postid={post.postid}
                            comments={locComments}
                            handleShowDetail={(d) => handleShowDetail(d)}
                        />
                    );
                })}
            </div>
        );
    } else {
        return (
            <div className="posts">
                <div>Error. No Posts.</div>
            </div>
        );
    }
}

export default Posts;
