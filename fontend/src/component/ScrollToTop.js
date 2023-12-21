import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import upC from '@iconify/icons-icon-park-solid/up-c';
import '../styles/Styles.css'

const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 1000) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);
    const goToTop = () => {
        window.scrollTo({
            top: 200,
            behavior: "smooth",
        });
    };
    return (
        <div className="top-to-btm">

            {showTopBtn && (
                <Icon icon={upC}
                    color="#495867"
                    width="50"
                    height="50"
                    className="icon-position icon-style"
                    onClick={goToTop}
                />
            )}
        </div>
    );
};
export default ScrollToTop;