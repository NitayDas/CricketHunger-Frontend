import { useState } from 'react';
import emailjs from 'emailjs-com';
import { TiSocialFacebook } from "react-icons/ti";
import { FaLinkedinIn } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './contact.css'

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const templateParams = {
            to_name: 'Cricscore Support Team',
            from_name: formData.name,
            form_email: formData.email,
            message: formData.message,
        };

        emailjs
            .send(
                'service_91yswgd', // Replace with your service ID
                'template_6gqq4yk', // Replace with your template ID
                templateParams,
                'QsHO8ode_Z5AWYDFS' // Replace with your user ID
            )
            .then((response) => {
                toast.success('Email sent successfully!', {
                    autoClose: 3000,
                });

                setFormData({ name: '', email: '', message: '' });
            })
            .catch((error) => {
                toast.error('Error sending email. Please try again.', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                console.error('Error sending email:', error);
            });
    };

    return (
        <div className="contact-page-container min-h-[700px] flex items-center z-0">
            <div className='max-w-6xl mx-auto p-5 drop-shadow'>
                <div className="grid grid-cols-1 bg-white drop-shadow-2xl rounded-2xl lg:grid-cols-2">
                    {/* Left side - Contact Information */}
                    <div className="grid grid-cols-2">
                        <div className="p-3 lg:p-8">
                            <h3 className="text-xl font-medium text-black lg:text-3xl">Get in Touch with <span className='text-2xl lg:text-3xl'>Crickie Hunger</span></h3>
                            <p className="text-black font-base py-3 font-medium lg:text-lg">We bring you live cricket scores and updates, with real-time commentary and match analysis.</p>
                            <p className='text-black font-base font-medium lg:text-lg'>Have a question about our live cricket score updates, features, or need help? Get in touch, and we'll get back to you as soon as possible.</p>
                        </div>
                        <div className="p-10">
                            <div className="flex flex-col">
                                <h1 className="font-bold text-lg text-black pb-3">Call Us</h1>
                                <p className="text-black"> +880 1793250987</p>
                                <p>+880 1893450087</p>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-black py-3">Location</h1>
                                <p>House #20 (3rd Floor) Road # 17,<br /> Nikanjia-2 Dhaka, Bangladesh</p>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-black py-3">Our Services</h1>
                                <div className='flex justify-start items-center'>
                                    <IoCheckmarkDoneSharp></IoCheckmarkDoneSharp>
                                    <p>Live Cricket Score Updates</p>
                                </div>
                                <div className='flex justify-start items-center'>
                                    <IoCheckmarkDoneSharp></IoCheckmarkDoneSharp>
                                    <p>Ball-by-ball Commentary</p>
                                    </div>
                                <div className='flex justify-start items-center'>
                                    <IoCheckmarkDoneSharp></IoCheckmarkDoneSharp>
                                    <p>Detailed Match Analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Contact Form */}
                    <div className='p-5 lg:p-10'>
                        <h2 className='font-bold text-3xl ml-7'>Send Us Your Feedback</h2>
                        <form onSubmit={handleSubmit} className="form-container card-body">
                            <div className="form-control">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="input input-bordered mb-3"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your Email"
                                    className="input input-bordered mb-3"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <input
                                    type="text"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Your Message"
                                    className="input input-bordered h-24"
                                    required
                                />
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn text-black gard-bg">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Contact;