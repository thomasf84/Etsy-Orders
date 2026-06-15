import React from 'react'
import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { SIZES } from '../data';
import { ColorIcon } from './StatusCell';

const sizeStyles = {
  "8":  { bg: "#F3E8FF", color: "#7C3AED", borderColor: "#D8B4FE" },
  "16": { bg: "#FEF9C3", color: "#A16207", borderColor: "#FDE047" },
  "18": { bg: "#FCE7F3", color: "#BE185D", borderColor: "#F9A8D4" },
  "24": { bg: "#DCFCE7", color: "#15803D", borderColor: "#86EFAC" },
};

const SizeCell = ({getValue, row, column, table}) => {
  const value = getValue()
  const resolveSize = (raw) => {
    if (!raw) return null
    if (typeof raw === 'object' && raw.name) return raw
    const asText = String(raw).trim()
    return SIZES.find((s) => s.name === asText) || null
  }
  const resolved = resolveSize(value)
  const name = resolved?.name || (value ? String(value) : null)
  
  const style = sizeStyles[name] || { bg: "#F3F4F6", color: "#6B7280", borderColor: "#E5E7EB" };
  const { updateData } = table.options.meta

  return (
    <Menu isLazy offset={[0,0]} flip={false} autoSelect={false}>
        <MenuButton 
          h="32px"
          w="32px"
          minW="32px"
          textAlign="center" 
          px={0}
          py={0} 
          bg={style.bg} 
          color={style.color} 
          border="1.5px solid"
          borderColor={style.borderColor}
          borderRadius="full"
          fontWeight="bold"
          fontSize="xs"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ opacity: 0.85 }}
        >
            {name || '—'}
        </MenuButton>

        <MenuList bg="white" color="gray.800" borderColor="gray.250" maxH="60vh" overflowY="auto" boxShadow="lg" py={1}>
            <MenuItem onClick={() => updateData(row.index, column.id, null)} bg="transparent" _hover={{ bg: 'gray.100' }} fontSize="xs" fontWeight="semibold">
                <ColorIcon color="red.400" mr={3} />
                Clear
            </MenuItem>
            {SIZES.map(size => {
              const itemStyle = sizeStyles[size.name] || {};
              return (
                <MenuItem 
                  onClick={() => updateData(row.index, column.id, size)} 
                  key={size.id} 
                  bg="transparent" 
                  _hover={{ bg: 'gray.100' }}
                  fontSize="xs"
                  fontWeight="semibold"
                  color={itemStyle.color || "gray.800"}
                >
                  <ColorIcon color={size.color} mr={3} />
                  {size.name}
                </MenuItem>
              );
            })}
        </MenuList>
    </Menu>
  )
}

export default SizeCell