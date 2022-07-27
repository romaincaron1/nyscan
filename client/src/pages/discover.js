import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { instance } from '../services/instance';

const Discover = () => {
    const navigate = useNavigate();

    useEffect(() => {
        instance
            .get("/mangas/")
            .then((res) => {
                const length = res.data.length; 
                const random = Math.floor(Math.random() * length);
                navigate(`/manga/${res.data[random]._id}`)
            })
    }, [])

    return (
        <div className='discover'>
            <Navbar />
            <Footer />
        </div>
    );
};

export default Discover;