import Header from '../components/Header';
import Posts from '../components/Posts';
import Newpost from './Newpost';
import '../style/Home.css';
import { GlobalContext } from '../context/GlobalState';
import { useContext, useEffect, useState } from 'react';
import Signin from './Signin';
import PostDetail from './PostDetail';
function Home() {
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
    
    useEffect(async () => {
        if (isusersignedin) {
            console.log('isusersignedin changed', isusersignedin);
            await regetdataFromserver();
        } else {
            history.push('/signin');
        }
    }, [isusersignedin]);*/
    console.log('inhome posts', posts);
    useEffect(() => {
        checkLogin();
        if (isusersignedin) {
            regetdataFromserver();
        } else {
            history.push('/signin');
        }
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
                <Header />
                <div className="Home">
                    {isPostDetailOpen ? (
                        <PostDetail
                            post={detailData}
                            setIsPostDetailOpen={setIsPostDetailOpen}
                            isPostDetailOpen={isPostDetailOpen}
                        />
                    ) : (
                        <div></div>
                    )}
                    <Newpost />
                    <Signin />
                </div>
            </div>
        );
    }
}

export default Home;
