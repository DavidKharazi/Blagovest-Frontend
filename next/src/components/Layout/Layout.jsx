import React from 'react'
import Navigation from '@/components/Nav/navigation'

export const Layout = ({ children }) => {
    return (
        <div>
           <header>
             <Navigation />
           </header>
           {children}
           <footer></footer>
        </div>
    );
}
