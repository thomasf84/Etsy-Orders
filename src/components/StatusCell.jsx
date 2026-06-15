import React from 'react'
import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { STATUSES } from '../data';
import { useAppTheme } from "../theme/ThemeContext";

export const ColorIcon = ({ color, ...props }) => (
    <Box w="8px" h="8px" bg={color} borderRadius="full" {...props} />
)

const statusStyles = {
  Received: {
    bg: "rgba(59, 130, 246, 0.12)",
    color: "#1d4ed8",
    borderColor: "rgba(59, 130, 246, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="8 12 12 16 16 12" />
        <line x1="12" y1="8" x2="12" y2="16" />
      </svg>
    )
  },
  Cut: {
    bg: "rgba(245, 158, 11, 0.12)",
    color: "#b45309",
    borderColor: "rgba(245, 158, 11, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    )
  },
  Lasered: {
    bg: "rgba(239, 68, 68, 0.12)",
    color: "#b91c1c",
    borderColor: "rgba(239, 68, 68, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    )
  },
  Stained: {
    bg: "rgba(139, 92, 246, 0.12)",
    color: "#6d28d9",
    borderColor: "rgba(139, 92, 246, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  Painted: {
    bg: "rgba(20, 184, 166, 0.12)",
    color: "#0f766e",
    borderColor: "rgba(20, 184, 166, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <line x1="8" y1="16" x2="16" y2="8" />
      </svg>
    )
  },
  Lacquered: {
    bg: "rgba(249, 115, 22, 0.12)",
    color: "#c2410c",
    borderColor: "rgba(249, 115, 22, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
      </svg>
    )
  },
  Ready: {
    bg: "rgba(16, 185, 129, 0.12)",
    color: "#047857",
    borderColor: "rgba(16, 185, 129, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="16 9 11 14 8 11" />
      </svg>
    )
  },
  Shipped: {
    bg: "rgba(59, 130, 246, 0.12)",
    color: "#1d4ed8",
    borderColor: "rgba(59, 130, 246, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    )
  },
  Canceled: {
    bg: "rgba(239, 68, 68, 0.12)",
    color: "#b91c1c",
    borderColor: "rgba(239, 68, 68, 0.25)",
    icon: (props) => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    )
  }
};

const StatusCell = ({getValue, row, column, table}) => {
    const { name } = getValue() || {};
    const { updateData } = table.options.meta
    const { theme: appTheme } = useAppTheme();
    
    const themeStyle = appTheme.statusColors[name] || {};
    const style = {
      bg: themeStyle.bg || "gray.50",
      color: themeStyle.color || "gray.600",
      borderColor: themeStyle.borderColor || "gray.200",
      icon: statusStyles[name]?.icon
    };

    return (
      <Menu isLazy offset={[0,0]} flip={false} autoSelect={false}>
        <MenuButton
          h="auto"
          w="max-content"
          minW="auto"
          px={2.5}
          py={1}
          bg={style.bg}
          color={style.color}
          border="1px solid"
          borderColor={style.borderColor}
          borderRadius="full"
          fontWeight="bold"
          fontSize="xs"
          lineHeight="1"
          _hover={{ opacity: 0.85 }}
          sx={{
            display: 'inline-flex !important',
            alignItems: 'center !important',
            whiteSpace: 'nowrap !important',
            '& > span': {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
            }
          }}
        >
          {style.icon && <style.icon width="11" height="11" style={{ display: 'inline', flexShrink: 0 }} />}
          <span style={{ whiteSpace: 'nowrap' }}>{name || 'Select'}</span>
        </MenuButton>
          <MenuList
            bg="white"
            border="1px solid"
            borderColor="gray.150"
            boxShadow="0 8px 24px rgba(0,0,0,0.12)"
            borderRadius="xl"
            py={2}
            px={2}
            minW="160px"
            overflow="hidden"
          >
            <MenuItem
              onClick={() => updateData(row.index, column.id, null)}
              bg="transparent"
              borderRadius="md"
              _hover={{ bg: 'gray.50' }}
              px={2}
              py={1.5}
              mb={1}
            >
              <Box
                display="inline-flex"
                alignItems="center"
                gap="5px"
                px={2.5}
                py={1}
                bg="gray.100"
                color="gray.500"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="full"
                fontWeight="bold"
                fontSize="11px"
                lineHeight="1"
                whiteSpace="nowrap"
              >
                <Box w="8px" h="8px" bg="gray.400" borderRadius="full" flexShrink={0} />
                <span>Clear</span>
              </Box>
            </MenuItem>
            {STATUSES.map(status => {
              const itemStyle = statusStyles[status.name] || {};
              const IconComp = itemStyle.icon;
              return (
                <MenuItem
                  onClick={() => updateData(row.index, column.id, status)}
                  key={status.id}
                  bg="transparent"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50' }}
                  px={2}
                  py={1.5}
                >
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    gap="5px"
                    px={2.5}
                    py={1}
                    bg={itemStyle.bg}
                    color={itemStyle.color}
                    border="1px solid"
                    borderColor={itemStyle.borderColor}
                    borderRadius="full"
                    fontWeight="bold"
                    fontSize="11px"
                    lineHeight="1"
                    whiteSpace="nowrap"
                  >
                    {IconComp && <IconComp width="11" height="11" style={{ display: 'inline', flexShrink: 0 }} />}
                    <span>{status.name}</span>
                  </Box>
                </MenuItem>
              );
            })}
          </MenuList>
      </Menu>
    )
}

export default StatusCell