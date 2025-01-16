import React from 'react';

import "./collapseElement.css"

interface PropType {
    open: boolean;
    children: React.ReactNode;
    className?: string
}

function CollapseElement({ open, children, className }: PropType) {
    return (
        <div className={'collapse-el ' + (open ? "open " : "closed ") + (className ? className : "")}>
            {children}
        </div>
    );
}

export default CollapseElement;