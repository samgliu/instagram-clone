import { Link } from 'react-router-dom';
import DropdownButton from './DropdownButton';

const PostDetailHeader = ({
    avatar,
    handleProceed,
    username,
    postUid,
    isOwner,
    handleThreePtClicked,
    handleDeleteOnPost,
    onCloseClick,
}) => {
    return (
        <div className="commentHeader">
            <div className="avatarContainer">
                <img src={avatar} alt="" />

                <div>
                    <Link
                        to={{
                            pathname: `/profile/${username}/${postUid}`,
                        }}
                        onClick={(e) =>
                            handleProceed(e, `/profile/${username}/${postUid}`)
                        }
                    >
                        <strong>{username}</strong>
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
    );
};

export default PostDetailHeader;
