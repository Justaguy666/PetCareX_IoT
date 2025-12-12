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
                        <svg width="60" height="60" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="bubbleGrad" x1="4" y1="4" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#38BDF8"/>
                                    <stop offset="1" stopColor="#818CF8"/>
                                </linearGradient>
                            </defs>
                            <path d="M28 4C15.85 4 6 12.95 6 24C6 29.56 8.87 34.52 13.4 37.92V48L23.27 42.18C24.82 42.5 26.38 42.68 28 42.68C40.15 42.68 50 33.73 50 22.68C50 11.63 40.15 4 28 4Z" fill="url(#bubbleGrad)"/>
                            <rect x="16" y="20" width="20" height="3.5" rx="1.75" fill="white"/>
                            <rect x="16" y="27" width="13" height="3.5" rx="1.75" fill="white"/>
                        </svg>
                    </div>
                </div>
            )}

            {isOpen && <Chatbot onClose={handleClose} {...chatbot} />}
        </>
    );
}