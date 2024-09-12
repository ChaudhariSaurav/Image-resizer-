// Rating.js
import React, { useState } from 'react';
import { Box, Icon, Text } from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(null);

  const handleMouseEnter = (rating) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = (rating) => {
    onChange(rating);
  };

  return (
    <Box>
      {[1, 2, 3, 4, 5].map((rating) => (
        <Icon
          key={rating}
          as={rating <= (hoverValue || value) ? FaStar : FaRegStar}
          color={rating <= (hoverValue || value) ? 'teal.500' : 'gray.300'}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(rating)}
          boxSize="6"
          cursor="pointer"
        />
      ))}
      <Text fontSize="sm" mt={2}>Rating: {value || 0} / 5</Text>
    </Box>
  );
};

export default Rating;
