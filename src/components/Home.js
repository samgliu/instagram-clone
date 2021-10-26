import Header from '../components/Header';
import Posts from '../components/Posts';
import Newpost from './Newpost';
import '../style/Home.css';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import Signin from './Signin';
import PostDetail from './PostDetail';
function Home(props) {
    const {
        getUserinfo,
        curemail,
        curuser,
        info,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        getDataFromserver,
        regetdataFromserver,
        onSubmitSignin,
        defaultLogin,
        posts,
        history,
        isusersignedin,
        setIsusersignedin,
        setIsHomeClicked,
        isHomeClicked,
        checkLogin,
    } = useContext(GlobalContext);
    const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState();
    const [locPosts, setLocPosts] = useState();
    /*
    async function onclickgetdata(e) {
        e.preventDefault();

        if (posts === undefined) {
            await defaultLogin();
        }
        await getDataFromserver(curuser);
    }*/
    /*
    useEffect(() => {
        (async () => {
            if (isusersignedin) {
                console.log('isusersignedin changed', isusersignedin);
                regetdataFromserver();
            } else {
                history.push('/signin');
            }
        })();
    }, []);
    */

    console.log('inhome posts', posts);
    useEffect(() => {
        console.log('inhome useEffect');
        async function fetchData() {
            // You can await here
            let response = await checkLogin();
            // ...
            (async () =>
                await new Promise((resolve) => setTimeout(resolve, 1000)))(); //inline delayer
            return response;
        }
        fetchData().then(async (response) => {
            if (response) {
                console.log('user signed in , fetchdata', response);
                regetdataFromserver();
            } else {
                console.log('user not signed in ', response);
                history.push('/signin');
            }
        });
        //return regetdataFromserver();
    }, [isusersignedin]);

    function setDetailOpen() {
        setIsPostDetailOpen(!isPostDetailOpen);
        console.log('isPostDetailOpen', isPostDetailOpen);
    }
    function handleShowDetail(data) {
        setIsPostDetailOpen(!isPostDetailOpen);
        setDetailData(data);
        console.log('handleShowDetail', data);
    }
    //console.log('posts in home', posts);
    //console.log('posts.length in home', posts.length);
    if (posts !== undefined) {
        return (
            <div>
                <Header />
                <div className="Home">
                    <Newpost />
                    {isPostDetailOpen ? (
                        <PostDetail
                            post={detailData}
                            setIsPostDetailOpen={setIsPostDetailOpen}
                            isPostDetailOpen={isPostDetailOpen}
                        />
                    ) : (
                        <div></div>
                    )}
                    <Posts handleShowDetail={(d) => handleShowDetail(d)} />
                </div>
            </div>
        );
    } else {
        console.log('posts is undefined');
        return (
            <div>
                <Signin />
            </div>
        );
    }
}

export default Home;
