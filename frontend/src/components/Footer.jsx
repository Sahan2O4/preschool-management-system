import React from "react";
import logo from "../assets/logo.jpg";

const Footer = () => (
  <>
    <footer>
      <img src={logo} alt="logo" />
      <h3>Merry Kids International Montessori School</h3>
      <p>Pituwala Road, Elpitiya, Sri Lanka, 80400</p>
      <p>Phone: 077 739 3040</p>
      <p>Email: merrykidsinternational@gmail.com</p>
      <p>© 2026 Merry Kids International Montessori. All rights reserved.</p>
    </footer>
    <style>{`
      footer { background:#111; color:white; text-align:center; padding:50px; }
      footer img { width:80px; height:80px; object-fit:cover; border-radius:50%; margin-bottom:10px; }
      footer h3 { margin-bottom:10px; }
      footer p { margin: 4px 0; font-size:14px; color:#aaa; }
    `}</style>
  </>
);

export default Footer;
