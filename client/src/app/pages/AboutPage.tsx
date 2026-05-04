import React from 'react';

const AboutPage: React.FC = () => {
  return (
<div style = {{ padding: "40px"}}>
        <h1 style = {{ fontSize: "2rem", fontWeight: "bold", textAlign: "center"}}>
            About R&amp;R Atlas
        </h1>

        <div className= 'about-description'>
            <p style={{ fontSize: '1.2rem', fontWeight: 'normal', textAlign: "center" }}>
          Risk and Resilience Atlas is a project developed by 5 students 
          from California State University, Fullerton as part of our capstone project. R&amp;R Atlas is a web application
            that provides users with a comprehensive overview of the risks and resilience factors in their communities.
            This app is meant to help users make informed decisions about where to live, how to prepare for environmental
            hazards and disasters, and how to create more resilient communities.
            </p>
            </div>

        <div className= 'about-the-team'>
            <h2 style = {{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center"}}>
                Meet the Team
            </h2>
            <div style= {{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
            }}>
                <div className= 'team-member'>
                    <p style= {{fontWeight: 'bold'}}> Christian McGowan</p>
                </div>
                <div className= 'team-member'>
                    <p style= {{fontWeight: 'bold'}}> Joanna Menghamal</p>
                </div>
                <div className= 'team-member'>
                    <p style= {{fontWeight: 'bold'}}> Stav Sendrovitz</p>
                </div>
                <div className= 'team-member'>
                    <p style= {{fontWeight: 'bold'}}> Owen Keyser</p>
                </div>
                <div className= 'team-member'>
                    <p style= {{fontWeight: 'bold'}}> Emmanuel De Guzman</p>
                </div>
            </div>
        </div>

        <div className= 'about-the-team'>
            <h2 style = {{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center"}}>
                Github Repository
            </h2>
            <p style= {{ display: 'flex', justifyContent: 'center'}}> https://github.com/Christian-McGowan/rr-atlas</p>
        </div>

    </div>
  );
};

export default AboutPage;
