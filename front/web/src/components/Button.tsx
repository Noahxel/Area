import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

type ButtonProps = {
    children: React.ReactNode;
    type: "button" | "submit" | "reset";
    onClick?: (() => void) | ((e: React.FormEvent) => void);
    buttonStyle: 'btn--primary' | 'btn--outline' | 'btn--primary-inverted' | 'bordered-button';
    buttonSize: 'btn--medium' | 'btn--large';
    linkTo?: string;
    color?: string;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    type,
    onClick,
    buttonStyle = 'btn--primary',
    buttonSize = 'btn--medium',
    linkTo,
    color
}) => {
    const btnStyle = {
        backgroundColor: color,
        borderColor: color
    };

    if (linkTo) {
        return (
            <Link to={linkTo} className={`btn ${buttonStyle} ${buttonSize}`} style={btnStyle}>
                {children}
            </Link>
        );
    } else {
        return (
            <button
                className={`btn ${buttonStyle} ${buttonSize}`}
                onClick={onClick}
                type={type}
                style={btnStyle}
            >
                {children}
            </button>
        );
    }
};