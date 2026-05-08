import React from 'react';

const MethodologyPage: React.FC = () => {
    return (
        <div style = {{ padding: "50px" }}>
            <h1 style = {{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
                Methodology for R&amp;R Atlas
            </h1>

            <div className= 'methodology-description'>
                <p style={{ fontSize: '1.2rem', fontWeight: 'normal', textAlign: "justify" }}>
                    In it's current form, this Risk and Resilience Atlas web application is only a prototype as a proof of concept meant to demonstrate the 
                    application's basic functionality and user interface. Even though we expect a fully released R&amp;R Atlas to use real data, this 
                    prototype utilizes in-memory demo data in order to quickly demonstrate how risk and resilience data will be shown on the application.
                    This prototype demonstrates usage of an interactive map, a search bar that when used will show results for the current demo data, 
                    the ability to compare two cities, a login/create account feature, and a few page menu options a user can click through.
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'normal', textAlign: "justify" }}>
                    When an actual working release of R&amp;R Atlas is completed, the risk and resilience data will be pulled from numerous federal and 
                    organizational data sources, including NOAA, FEMA, AirNow, and USGS, using API adapters. Data will also be taken from various news feeds 
                    that cover topics involving risk and resilience. The accessibility of this data onto a simplistic UI will be important priorities 
                    for the development of R&amp;R Atlas going forward, which makes the development of this prototype important for our users that might 
                    not be skilled with data analysis and research.
                </p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'normal', textAlign: "justify" }}>
                    The final release of R&amp;R Atlas will be an updated version of this prototype that does not significantly rewrite the client UI, 
                    uses real data, integrate a database with risk and resilience data collections, integrate a notification system, and implement the 
                    ability for users to save locations.
                </p>
            </div>
        </div>
    );
};

export default MethodologyPage;