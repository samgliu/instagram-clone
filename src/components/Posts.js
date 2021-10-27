import '../style/Posts.css';
import './Post';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import Post from './Post';
import { v4 as uuidv4 } from 'uuid';

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

    useEffect(() => {
        console.log('posts changed', posts);
    }, [posts]);

    console.log('in posts', posts);
    if (posts !== undefined) {
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
                            timestamp={() =>
                                post.timestamp === null
                                    ? Date.now()
                                    : post.timestamp.toDate().toString()
                            }
                            pic={post.pic}
                            key={uuidv4()}
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
