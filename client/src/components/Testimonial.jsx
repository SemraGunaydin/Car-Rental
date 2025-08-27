import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from 'framer-motion'

const Testimonial = () => {
	const testimonials = [
        { name: "Monika Koralkowa", 
		location: "Lodz, Poland", 
		image: assets.testimonial_image_1, 
		testimonial: "I recently rented a car from this company and was amazed by the quality of service. The booking process was quick and easy, and the staff were extremely friendly and helpful. The car was spotless, comfortable, and in excellent condition. Everything went smoothly from start to finish, and I would definitely choose them again." },

        {name: "Jakup Levandowski", 
		location: "Warsaw, Poland", 
		image: assets.testimonial_image_3, 
		testimonial: "The customer service here is outstanding! From the moment I arrived, I felt valued and welcomed. The team explained everything clearly, and there were no hidden fees or unpleasant surprises. Returning the car was just as simple, making the entire experience stress-free. I highly recommend this rental company to anyone looking for a reliable and trustworthy service." },

        {
		name: "Sophia Lee-Nowak", 
		location: "Krakow, Poland", 
		image: assets.testimonial_image_2, 
		testimonial: "I’ve rented cars from different places before, but this was by far the best experience. The vehicle was ready on time, perfectly clean, and fuel-efficient. The staff made sure I had everything I needed and even gave me helpful tips about local attractions. Their professionalism and attention to detail truly exceeded my expectations." }
    ];


  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

		<Title title="What Our Customer Say" subTitle=" Discover why discerning travellers choose StayVenture for their luxury accommodations around the world."/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
          initial={{opacity:0, y:40}}
        	whileInView={{opacity:1, y:0}}
          transition={{duration: 0.6, delay:index *0.2, ease:'easeOut'}}
          viewport={{once:true, amount:0.3}}
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className=" text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
					<img key={index} src={assets.star_icon} alt="star-icon" />
                   
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
