import { Box, Icon, Button, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Wrap, Portal, Text } from '@chakra-ui/react'
import React from 'react'
import FilterIcon from './icons/FilterIcon'
import { SIZES } from '../data'

const sizeStyles = {
  "8":  { bg: "#F3E8FF", color: "#7C3AED", borderColor: "#D8B4FE" },
  "16": { bg: "#FEF9C3", color: "#A16207", borderColor: "#FDE047" },
  "18": { bg: "#FCE7F3", color: "#BE185D", borderColor: "#F9A8D4" },
  "24": { bg: "#DCFCE7", color: "#15803D", borderColor: "#86EFAC" },
};

const SizePill = ({ size, setColumnFilters, isActive }) => {
  const style = sizeStyles[size.name] || { bg: "#F3F4F6", color: "#6B7280", borderColor: "#E5E7EB" };

  const toggle = () =>
    setColumnFilters(prev => {
      const sizes = prev.find(f => f.id === 'size')?.value;
      if (!sizes) return prev.concat({ id: 'size', value: [size.id] });
      return prev.map(f =>
        f.id === 'size'
          ? { ...f, value: isActive ? sizes.filter(s => s !== size.id) : sizes.concat(size.id) }
          : f
      );
    });

  return (
    <Box
      as="button"
      onClick={toggle}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w="40px"
      h="40px"
      bg={isActive ? style.bg : 'white'}
      color={isActive ? style.color : '#9CA3AF'}
      border="1.5px solid"
      borderColor={isActive ? style.borderColor : '#E5E7EB'}
      borderRadius="full"
      fontWeight="bold"
      fontSize="13px"
      lineHeight="1"
      cursor="pointer"
      transition="all 0.15s"
      _hover={{ bg: style.bg, color: style.color, borderColor: style.borderColor }}
      opacity={isActive ? 1 : 0.65}
    >
      {size.name}
    </Box>
  );
};

export const FilterSize = ({ columnFilters, setColumnFilters }) => {
  const filterSizes = columnFilters.find(f => f.id === 'size')?.value || [];

  return (
    <Popover isLazy placement="auto-start">
      <PopoverTrigger>
        <Button
          size="sm"
          bgGradient="linear(to-b, #FFFFFF 0%, #F1F5F9 45%, #E2E8F0 75%, #CBD5E1 100%)"
          color="gray.700"
          border="1px solid"
          borderColor={filterSizes.length > 0 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.35)'}
          borderRadius="full"
          px={4}
          h="32px"
          _hover={{ 
            bgGradient: "linear(to-b, #FFFFFF 0%, #E2E8F0 40%, #CBD5E1 70%, #94A3B8 100%)",
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.08), 0 0 12px rgba(59, 130, 246, 0.35)'
          }}
          leftIcon={<Icon as={FilterIcon} fontSize={14} color="blue.500" />}
          fontWeight="extrabold"
          fontSize="xs"
          boxShadow={filterSizes.length > 0 
            ? 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05), 0 0 10px rgba(59, 130, 246, 0.3)' 
            : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05), 0 0 8px rgba(59, 130, 246, 0.15)'}
        >
          Size {filterSizes.length > 0 && `(${filterSizes.length})`}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          bg="white"
          border="1px solid"
          borderColor="gray.150"
          boxShadow="0 8px 24px rgba(0,0,0,0.12)"
          borderRadius="xl"
          p={3}
          w="auto"
          minW="180px"
        >
          <PopoverCloseButton color="gray.500" />
          <PopoverBody p={0}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={3} textTransform="uppercase" letterSpacing="wider">
              Filter by Size
            </Text>
            <Wrap spacing={2}>
              {SIZES.map(size => (
                <SizePill
                  key={size.id}
                  size={size}
                  isActive={filterSizes.includes(size.id)}
                  setColumnFilters={setColumnFilters}
                />
              ))}
            </Wrap>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
