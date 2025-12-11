import { useState, useRef, useEffect } from 'react';
import Chatbot from './Chatbot';
import useChatbot from '../hooks/useChatbot';

export default function AssistantPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [hasDragged, setHasDragged] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);
    const chatbot = useChatbot();

    useEffect(() => {
        const updatePosition = () => {
            const footerHeight = 120;
            setPosition({
                x: window.innerWidth - 80,
                y: window.innerHeight - footerHeight - 70
            });
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, []);

    const handleMouseDown = (e) => {
        if (isOpen) return;
        setIsDragging(true);
        setHasDragged(false);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleTouchStart = (e) => {
        if (isOpen) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setHasDragged(false);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            setHasDragged(true);
            const newX = Math.max(0, Math.min(window.innerWidth - 51, e.clientX - dragStart.x));
            const newY = Math.max(0, Math.min(window.innerHeight - 51, e.clientY - dragStart.y));
            setPosition({ x: newX, y: newY });
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            setHasDragged(true);
            const touch = e.touches[0];
            const newX = Math.max(0, Math.min(window.innerWidth - 51, touch.clientX - dragStart.x));
            const newY = Math.max(0, Math.min(window.innerHeight - 51, touch.clientY - dragStart.y));
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleClick = () => {
        if (!hasDragged) {
            setIsOpen(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {!isOpen && (
                <div
                    ref={buttonRef}
                    className="assistant-button"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onClick={handleClick}
                >
                    <div className="assistant-button-icon">
                        <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                            <path d="M13.5 2C7.15 2 2 6.48 2 12C2 14.85 3.35 17.42 5.5 19.18V24L10.18 21.26C11.23 21.53 12.34 21.68 13.5 21.68C19.85 21.68 25 17.2 25 11.68C25 6.16 19.85 2 13.5 2Z" fill="url(#paint0_linear)"/>
                            <ellipse cx="13.5" cy="12" rx="2" ry="2" fill="url(#paint1_linear)"/>
                            <defs>
                                <linearGradient id="paint0_linear" x1="2" y1="2" x2="25" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#0FAFFF"/>
                                    <stop offset="1" stopColor="#CC23D1"/>
                                </linearGradient>
                                <linearGradient id="paint1_linear" x1="11.5" y1="10" x2="15.5" y2="14" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FDFDFD"/>
                                    <stop offset="1" stopColor="#CCEAFF"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            )}

            {isOpen && <Chatbot onClose={handleClose} {...chatbot} />}
        </>
    );
}