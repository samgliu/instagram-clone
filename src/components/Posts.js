import '../style/Posts.css';
import './Post';
import { GlobalContext } from '../context/GlobalState';
import { useContext } from 'react';
import Post from './Post';
import { v4 as uuidv4 } from 'uuid';

const Posts = ({ handleShowDetail }) => {
    //let time = '';
    const { posts } = useContext(GlobalContext);
    /*async function defLogin() {
        defaultLogin();
    }*/
    /*
    useEffect(() => {
        console.log('posts changed', posts);
    }, [posts]);*/

    //  console.log('in posts', posts);
    const postRender = (post) => {
        //  console.log('post under map', post);
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
                timestamp={
                    post.timestamp === null
                        ? Date.now().toString().substring(0, 15)
                        : post.timestamp.toDate().toString().substring(0, 15)
                }
                pic={post.pic}
                key={uuidv4()}
                avatar={post.avatar}
                useruid={post.uuid}
                postid={post.postid}
                comments={locComments}
                handleShowDetail={handleShowDetail}
            />
        );
    };
    if (posts !== undefined) {
        return (
            <div className="posts">{posts.map((post) => postRender(post))}</div>
        );
    } else {
        return <div className="posts"></div>;
    }
};

export default Posts;
