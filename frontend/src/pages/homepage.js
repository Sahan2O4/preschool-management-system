import React from "react";
import schoolImg from "../assets/school.jpg";
import logo from "../assets/logo.jpg";

import student1 from "../assets/student1.jpg";
import student2 from "../assets/student2.jpg";
import student3 from "../assets/student3.jpg";

const Homepage = () => {

  const currentPage = "Home";

  const navItems = ["Home", "About Us", "Events", "Interactive Sessions", "Feedback"];

  const cardData = [
    {
      title: "Safe Environment",
      text: "We provide a secure, loving, and caring environment where children feel protected and confident every day.",
      image: student1
    },
    {
      title: "Qualified Teachers",
      text: "Our trained and experienced teachers guide each child with patience, passion, and personal attention.",
      image: student2
    },
    {
      title: "Fun & Interactive Learning",
      text: "We combine fun activities with education to develop creativity, intelligence, and social skills.",
      image: student3
    }
  ];

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#ffffff" }}>


      {/* NAVBAR */}
      <nav style={{
        background: "linear-gradient(90deg, #4facfe, #ff7eb3)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: "0",
        zIndex: "1000",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={logo} alt="logo" style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid white"
          }} />
          <h2 style={{
            color: "white",
            margin: 0,
            fontSize: "20px",
            fontWeight: "600"
          }}>
            Merry Kids International
          </h2>
        </div>


        {/* Nav buttons */}
        <div style={{ display: "flex", gap: "18px" }}>
          {navItems.map((item, index) => {

            const isActive = item === currentPage;

            return (
              <button
                key={index}
                style={{
                  padding: "10px 18px",
                  borderRadius: "25px",
                  border: "2px solid white",
                  background: isActive ? "white" : "transparent",
                  color: isActive ? "#ff4fa3" : "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#ff4fa3";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {item}
              </button>
            );
          })}
        </div>


        {/* Login */}
        <button
          style={{
            padding: "10px 22px",
            borderRadius: "25px",
            border: "none",
            background: "white",
            color: "#ff4fa3",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "all 0.3s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Login / Register
        </button>

      </nav>



      {/* HERO SECTION */}
      <section style={{
        position: "relative",
        height: "600px"
      }}>

        <img
          src={schoolImg}
          alt="school"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        {/* Dark overlay */}
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.45)",
          top: "0"
        }} />

        {/* Text */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          padding: "20px"
        }}>

          <h1 style={{
            fontSize: "60px",
            fontWeight: "700",
            marginBottom: "20px"
          }}>
            Welcome to Merry Kids International
          </h1>

          <p style={{
            fontSize: "24px",
            maxWidth: "800px",
            margin: "auto",
            lineHeight: "1.5"
          }}>
            Kids are beautiful little blossoms. They bloom and grow under the care,
            love, and guidance of Merry Kids International Montessori.
          </p>

        </div>

      </section>



      {/* WHY US */}
      <section style={{
        padding: "90px 20px",
        textAlign: "center",
        background: "#f4f9ff"
      }}>

        <h2 style={{
          fontSize: "45px",
          marginBottom: "25px",
          color: "#ff4fa3",
          fontWeight: "700"
        }}>
          Why Choose Merry Kids?
        </h2>

        <p style={{
          maxWidth: "900px",
          margin: "auto",
          fontSize: "20px",
          color: "#444",
          lineHeight: "1.7"
        }}>
          We focus on building confident, creative, and happy children by providing
          a safe, nurturing, and engaging learning environment. Our goal is to help
          every child reach their full potential academically and socially.
        </p>

      </section>



      {/* IMAGE CARDS */}
      <section style={{
        padding: "70px 40px",
        display: "flex",
        justifyContent: "center",
        gap: "35px",
        flexWrap: "wrap"
      }}>

        {cardData.map((card, index) => (

          <div
            key={index}
            style={{
              width: "320px",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              background: "white",
              transition: "all 0.35s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-12px)";
              e.currentTarget.style.boxShadow = "0 18px 35px rgba(0,0,0,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
            }}
          >

            <img
              src={card.image}
              alt={card.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover"
              }}
            />

            <div style={{ padding: "22px" }}>
              <h3 style={{ marginBottom: "10px", color: "#222" }}>
                {card.title}
              </h3>
              <p style={{ color: "#555", lineHeight: "1.5" }}>
                {card.text}
              </p>
            </div>

          </div>

        ))}

      </section>



      {/* GOOGLE MAP */}
      <section style={{
        padding: "70px 20px",
        textAlign: "center",
        background: "#f8f9fa"
      }}>

        <h2 style={{
          fontSize: "38px",
          marginBottom: "25px"
        }}>
          Visit Our School
        </h2>

        <iframe
          title="School Location"
          src="https://www.google.com/maps?q=Merry+Kids+International+Montessori+School,+Elpitiya,+Sri+Lanka&output=embed"
          width="90%"
          height="450"
          style={{
            border: "0",
            borderRadius: "18px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)"
          }}
          loading="lazy"
        />

      </section>



      {/* FOOTER */}
      <footer style={{
        background: "#111",
        color: "white",
        textAlign: "center",
        padding: "50px"
      }}>

        <img src={logo} alt="logo" style={{
          width: "90px",
          marginBottom: "10px"
        }} />

        <h3>Merry Kids International Montessori School</h3>

        <p>Pituwala Road, Elpitiya, Sri Lanka, 80400</p>

        <p>Phone: 077 739 3040</p>

        <p>Email: merrykidsinternational@gmail.com</p>

        <p style={{ marginTop: "20px", color: "#aaa" }}>
          © 2026 Merry Kids International Montessori. All rights reserved.
        </p>

      </footer>


    </div>
  );
};

export default Homepage;