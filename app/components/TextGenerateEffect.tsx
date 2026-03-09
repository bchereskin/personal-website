'use client';

import { motion } from 'motion/react';

export default function TextGenerateEffect({
  words,
  className = '',
  delay = 0,
}: {
  words: string;
  className?: string;
  delay?: number;
}) {
  const wordArray = words.split(' ');

  return (
    <span>
      {wordArray.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: 'easeOut',
          }}
          className={`inline-block mr-[0.25em] ${className}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
