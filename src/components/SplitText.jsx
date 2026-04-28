'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({ text, className = "", delay = 0, stagger = 0.05 }) {
    const characters = text.split("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay / 1000,
            },
        },
    };

    const childVariants = {
        hidden: { 
            opacity: 0, 
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
            },
        },
    };

    return (
        <motion.span
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`inline-block ${className}`}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={childVariants}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
}
