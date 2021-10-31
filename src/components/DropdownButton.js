import { useState } from 'react';

const DropdownButton = ({
    handleDeleteOnPost,
    handleThreePtClicked,
    isOwner,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleClicked = (e) => {
        e.preventDefault();
        setIsMenuOpen(!isMenuOpen);
        // console.log(e);
        //console.log('isOwner?', isOwner);
    };
    const deleteOnClick = (e) => {
        e.preventDefault();
        handleDeleteOnPost();
    };
    return (
        <div className="dropdownBtnWrapper">
            <button
                className="threePtButton"
                onClick={(e) => {
                    handleClicked(e);
                }}
            >
                <svg
                    aria-label="More options"
                    color="#262626"
                    fill="#262626"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6.5" cy="12" r="1.5"></circle>
                    <circle cx="17.5" cy="12" r="1.5"></circle>
                </svg>
            </button>
            {isOwner ? (
                <div className={isMenuOpen ? 'active' : 'hidden'}>
                    <button
                        className="deleteButton"
                        onClick={(e) => {
                            deleteOnClick(e);
                        }}
                    >
                        Delete
                    </button>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default DropdownButton;
