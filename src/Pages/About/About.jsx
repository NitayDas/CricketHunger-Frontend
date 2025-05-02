import React from 'react';
import './about.css'

const About = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="max-w-6xl mx-auto p-5 drop-shadow">
                
                {/* Section 1: Introduction */}
                <section className="text-center py-5 md:py-8 lg:py-12">
                    <h1 className="text-3xl font-bold text-white mb-6 lg:text-4xl">About Crickie Hunger</h1>
                    <p className="text-lg text-white">
                        Welcome to **Cricscore**, your one-stop solution for live cricket scores and match updates. We provide real-time ball-by-ball commentary, detailed match analysis, and much more, ensuring you're always up-to-date with your favorite cricket matches.
                    </p>
                </section>

                {/* Section 2: Features & Benefits */}
                <section className="bg-white rounded-xl py-5 lg:py-8">
    <h2 className="text-3xl font-bold text-black text-center mb-8">Our Key Features</h2>
    <div className="grid grid-cols-1 drop-shadow-2xl rounded-2xl md:grid-cols-2 lg:grid-cols-4 gap-10 p-5">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-black">Live Cricket Score</h3>
            <p className="text-gray-700 mt-4">
                Get live, real-time scores for every match happening around the world, updated instantly.
            </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-black">Ball-by-Ball Commentary</h3>
            <p className="text-gray-700 mt-4">
                Enjoy detailed ball-by-ball commentary for every match, ensuring you never miss a moment.
            </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-black">Match Analysis</h3>
            <p className="text-gray-700 mt-4">
                Get in-depth match analysis and stats, including player performance and team standings.
            </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-black">Commenting per Ball</h3>
            <p className="text-gray-700 mt-4">
                Engage with the match by commenting on every ball played! Share your excitement, opinions, or insights in real-time.
            </p>
        </div>
    </div>
</section>


                {/* Section 3: Team */}
                <section className="py-8 md:py-8 lg:py-12">
                    <h2 className="text-3xl font-bold text-black text-center mb-8">Meet the Team</h2>
                    <div className="flex justify-center items-center gap-20">
                        <div className="text-center flex flex-col items-center">
                        
                            <img src="https://i.ibb.co.com/KF0LJMc/image.png" alt="" className='h-16 w-16 mb-2 rounded-full md:mb-4 md:h-32 md:w-32  lg:h-40 lg:w-40 lg:mb-6'  />
                            {/* <p className="text-gray-700">Co-Founder & Developer</p> */}
                            <h3 className="text-xl font-bold text-black">Srijon Sarker</h3>
                        </div>
                        <div className="text-center flex flex-col items-center">
                   
                            {/* <p className="text-gray-700">Co-Founder & Developer</p> */}
                            <img src="https://i.ibb.co.com/KF0LJMc/image.png" alt="" className='h-16 w-16 mb-2 rounded-full md:mb-4 md:h-32 md:w-32  lg:h-40 lg:w-40 lg:mb-6' />
                            <h3 className="text-xl font-bold text-black">Nitay Das</h3>
                        </div>
                    </div>
                </section>

                {/* Section 4: Contact/CTA */}
                <section className="bg-white drop-shadow-xl rounded-2xl py-8 text-center">
                    <h2 className="text-3xl font-bold text-black ">Get in Touch</h2>
                    <p className="text-lg text-gray-700  p-5 md:p-8 lg:p-12">
                        Have questions or feedback about Cricscore? We would love to hear from you. Reach out to us, and we'll get back to you as soon as possible!
                    </p>
                    <a href="/contact" className="btn gard-bg py-2 px-6 rounded-full text-white">Contact Us</a>
                </section>

            </div>
        </div>
    );
};

export default About;
