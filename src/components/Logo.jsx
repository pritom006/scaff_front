import React from 'react';
import logo from '../../public/img/logo.png'
const Logo = () => (
  <div className="flex flex-col items-center mb-8">
    <div className="w-16 h-16 mb-2 rounded-full flex items-center justify-center">
      <img src={logo} alt="main logo" />
    </div>
 </div>
);

export default Logo;