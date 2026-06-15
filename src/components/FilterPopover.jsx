import { Box, Icon, Button, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Wrap, Portal, Text } from '@chakra-ui/react'
import React from 'react'
import FilterIcon from './icons/FilterIcon'
import { STATUSES } from '../data'

const statusStyles = {
  Received: {
    bg: "rgba(59, 130, 246, 0.12)",
    color: "#1d4ed8",
    borderColor: "rgba(59, 130, 246, 0.25)",
    icon: (props) => (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <line x1="8" y1="16" x2="16" y2="8" />
      </svg>
    )
  },
  Ready: {
    bg: "rgba(16, 185, 129, 0.12)",
    color: "#047857",
    borderColor: "rgba(16, 185, 129, 0.25)",
    icon: (props) => (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    )
  }
};

const StatusPill = ({ status, setColumnFilters, isActive }) => {
  const style = statusStyles[status.name] || { bg: "gray.50", color: "gray.600", borderColor: "gray.200" };
  const IconComp = style.icon;

  const toggle = () =>
    setColumnFilters(prev => {
      const statuses = prev.find(f => f.id === 'status')?.value;
      if (!statuses) return prev.concat({ id: 'status', value: [status.id] });
      return prev.map(f =>
        f.id === 'status'
          ? { ...f, value: isActive ? statuses.filter(s => s !== status.id) : statuses.concat(status.id) }
          : f
      );
    });

  return (
    <Box
      as="button"
      onClick={toggle}
      display="inline-flex"
      alignItems="center"
      gap="5px"
      px={3}
      py={1.5}
      bg={isActive ? style.bg : 'white'}
      color={isActive ? style.color : 'gray.400'}
      border="1.5px solid"
      borderColor={isActive ? style.borderColor : 'gray.200'}
      borderRadius="full"
      fontWeight="bold"
      fontSize="11px"
      lineHeight="1"
      whiteSpace="nowrap"
      cursor="pointer"
      transition="all 0.15s"
      _hover={{ bg: style.bg, color: style.color, borderColor: style.borderColor }}
      opacity={isActive ? 1 : 0.65}
    >
      {IconComp && <IconComp style={{ display: 'inline', flexShrink: 0 }} />}
      <span>{status.name}</span>
    </Box>
  );
};

export const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const filterStatuses = columnFilters.find(f => f.id === 'status')?.value || [];

  return (
    <Popover isLazy placement="auto-start">
      <PopoverTrigger>
        <Button
          size="sm"
          bgGradient="linear(to-b, #FFFFFF 0%, #F1F5F9 45%, #E2E8F0 75%, #CBD5E1 100%)"
          color="gray.700"
          border="1px solid"
          borderColor={filterStatuses.length > 0 ? 'rgba(20, 184, 166, 0.7)' : 'rgba(20, 184, 166, 0.35)'}
          borderRadius="full"
          px={4}
          h="32px"
          _hover={{ 
            bgGradient: "linear(to-b, #FFFFFF 0%, #E2E8F0 40%, #CBD5E1 70%, #94A3B8 100%)",
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.08), 0 0 12px rgba(20, 184, 166, 0.35)'
          }}
          leftIcon={<Icon as={FilterIcon} fontSize={14} color="teal.500" />}
          fontWeight="extrabold"
          fontSize="xs"
          boxShadow={filterStatuses.length > 0 
            ? 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05), 0 0 10px rgba(20, 184, 166, 0.3)' 
            : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05), 0 0 8px rgba(20, 184, 166, 0.15)'}
        >
          Status {filterStatuses.length > 0 && `(${filterStatuses.length})`}
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
          minW="200px"
        >
          <PopoverCloseButton color="gray.500" />
          <PopoverBody p={0}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={3} textTransform="uppercase" letterSpacing="wider">
              Filter by Status
            </Text>
            <Wrap spacing={2}>
              {STATUSES.map(status => (
                <StatusPill
                  key={status.id}
                  status={status}
                  isActive={filterStatuses.includes(status.id)}
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
