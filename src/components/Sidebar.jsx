import React, { useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Icon, Badge, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { apiUrl } from "../config";
import CustomOrderModal from "./CustomOrderModal";

// SVG Icons
export const OverviewIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const ItemsIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const LocationIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const GiftIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

export const ReportsIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const SettingsIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const navItemStyles = {
  "Overview": { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.08)" },
  "Items": { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)" },
  "Locations": { color: "#F97316", bg: "rgba(249, 115, 22, 0.08)" },
  "Gifts": { color: "#10B981", bg: "rgba(16, 185, 129, 0.08)" },
  "Reports": { color: "#6366F1", bg: "rgba(99, 102, 241, 0.08)" },
  "Settings": { color: "#EC4899", bg: "rgba(236, 72, 153, 0.08)" },
};

const NavItem = ({ to, icon, label, active, isCollapsed }) => {
  const config = navItemStyles[label] || { color: "gray.500", bg: "rgba(0,0,0,0.04)" };
  return (
    <HStack
      as={Link}
      to={to}
      w="100%"
      px={isCollapsed ? 0 : 3}
      py={2.5}
      borderRadius="xl"
      spacing={isCollapsed ? 0 : 3}
      bgGradient={active ? "linear(to-r, #2563EB, #3B82F6)" : "none"}
      bg={active ? undefined : "transparent"}
      color={active ? "white" : "gray.600"}
      fontWeight={active ? "bold" : "semibold"}
      _hover={{
        bg: active ? undefined : config.bg,
        color: active ? "white" : "gray.800",
        textDecoration: "none",
      }}
      transition="all 0.2s"
      justifyContent={isCollapsed ? "center" : "flex-start"}
      title={isCollapsed ? label : undefined}
      boxShadow={active ? "0 4px 14px rgba(37,99,235,0.3)" : "none"}
    >
      <Icon
        as={icon}
        fontSize="lg"
        color={active ? "white" : config.color}
        style={{ transition: 'color 0.2s' }}
      />
      {!isCollapsed && <Text fontSize="sm" fontFamily="Outfit, sans-serif" fontWeight={active ? "bold" : "medium"}>{label}</Text>}
    </HStack>
  );
};

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const [stats, setStats] = useState({ total_items: 0, total_locations: 0, this_week_count: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchStats = async () => {
    try {
      const res = await fetch(apiUrl("/api/v1/etsy/quick-stats"));
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch quick stats", e);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Live update stats from SSE events
    const es = new EventSource(apiUrl("/api/v1/etsy/events"));
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "dashboard-updated") {
          fetchStats();
        }
      } catch {}
    };
    es.onerror = () => {};
    return () => es.close();
  }, []);

  return (
    <Box
      w={isCollapsed ? "80px" : "260px"}
      bg="linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.25) 100%)"
      backdropFilter="blur(25px)"
      borderRight="1px solid"
      borderColor="rgba(255, 255, 255, 0.4)"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      px={isCollapsed ? 3 : 4}
      py={6}
      zIndex={100}
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      justifyContent="space-between"
      boxShadow="sm"
      transition="width 0.2s, padding 0.2s"
    >
      {/* Floating Toggle Button */}
      <Button
        onClick={onToggle}
        position="absolute"
        top="28px"
        right="-12px"
        w="24px"
        h="24px"
        minW="24px"
        bg="white"
        border="1px"
        borderColor="gray.200"
        borderRadius="full"
        boxShadow="md"
        _hover={{ bg: "gray.50" }}
        zIndex={150}
        p={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {isCollapsed ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </Button>

      <VStack align={isCollapsed ? "center" : "flex-start"} spacing={6} w="100%">
        {/* Branding header */}
        <HStack w="100%" px={2} justify={isCollapsed ? "center" : "flex-start"} align="center" mb={2}>
          <Flex 
            w={9} 
            h={9} 
            align="center" 
            justify="center" 
            bg="rgba(99, 102, 241, 0.12)" 
            border="1px solid"
            borderColor="rgba(99, 102, 241, 0.25)"
            color="indigo.500"
            borderRadius="xl"
            shadow="sm"
          >
            {/* Grid icon (four boxes) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </Flex>
          {!isCollapsed && (
            <VStack align="flex-start" spacing={0} pl={1}>
              <Text fontWeight="900" fontSize="lg" letterSpacing="tight" color="gray.800" lineHeight="1.1" fontFamily="Outfit, sans-serif">
                Dashboard
              </Text>
              <Badge 
                variant="subtle" 
                bg="transparent" 
                color="green.500" 
                p={0}
                fontSize="10px"
                fontWeight="extrabold"
                display="flex"
                alignItems="center"
                gap={1.5}
                fontFamily="Outfit, sans-serif"
              >
                <Box as="span" w="5.5px" h="5.5px" borderRadius="full" bg="green.500" />
                LIVE
              </Badge>
            </VStack>
          )}
        </HStack>

        {/* Navigation pages */}
        <VStack spacing={1.5} w="100%">
          <NavItem to="/" icon={OverviewIcon} label="Overview" active={location.pathname === "/"} isCollapsed={isCollapsed} />
          <NavItem to="/inventory" icon={ItemsIcon} label="Items" active={location.pathname === "/inventory"} isCollapsed={isCollapsed} />
          <NavItem to="/locations" icon={LocationIcon} label="Locations" active={location.pathname === "/locations"} isCollapsed={isCollapsed} />
          <NavItem to="/gifts" icon={GiftIcon} label="Gifts" active={location.pathname === "/gifts"} isCollapsed={isCollapsed} />
          <NavItem to="/history" icon={ReportsIcon} label="History" active={location.pathname === "/history"} isCollapsed={isCollapsed} />
          <NavItem to="/reports" icon={ReportsIcon} label="Reports" active={location.pathname === "/reports"} isCollapsed={isCollapsed} />
          <NavItem to="/settings" icon={SettingsIcon} label="Settings" active={location.pathname === "/settings" || location.pathname === "/json" || location.pathname === "/dev"} isCollapsed={isCollapsed} />
          <CustomOrderModal isOpen={isOpen} onClose={onClose} />
        </VStack>
      </VStack>

      {/* Quick stats and help widgets (hidden when collapsed) */}
      {!isCollapsed && (
        <VStack spacing={4} w="100%" mt="auto">
          {/* Widget Center glassmorphic card */}
          <Box 
            w="100%" 
            bg="rgba(255, 255, 255, 0.45)" 
            backdropFilter="blur(20px)"
            p={4} 
            borderRadius="2xl" 
            border="1px solid" 
            borderColor="rgba(255, 255, 255, 0.6)"
            boxShadow="rgba(31, 38, 135, 0.05) 0px 8px 32px 0px"
          >
            <VStack spacing={4} align="flex-start" w="100%">
              {/* Stat 1: Total Items */}
              <Flex w="100%" align="center" justify="space-between">
                <HStack spacing={3}>
                  <Flex 
                    w={8} 
                    h={8} 
                    align="center" 
                    justify="center" 
                    bg="rgba(139, 92, 246, 0.15)" 
                    border="1px solid"
                    borderColor="rgba(139, 92, 246, 0.3)"
                    borderRadius="lg" 
                    color="purple.600" 
                    shadow="sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </Flex>
                  <Box>
                    <Text fontWeight="800" fontSize="lg" color="gray.850" lineHeight="1" fontFamily="Outfit, sans-serif">
                      {stats.total_items}
                    </Text>
                    <Text fontSize="9px" fontWeight="800" color="gray.400" textTransform="uppercase" mt={0.5} fontFamily="Inter, sans-serif" letterSpacing="0.02em">
                      Total Items
                    </Text>
                  </Box>
                </HStack>
                {/* Purple Area Glow Sparkline Chart */}
                <svg width="55" height="25" viewBox="0 0 45 20" style={{ marginRight: '4px' }}>
                  <defs>
                    <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,15 L8,10 L15,14 L23,4 L31,12 L39,6 L45,2 L45,20 L0,20 Z" fill="url(#purpleGlow)" />
                  <path d="M0,15 L8,10 L15,14 L23,4 L31,12 L39,6 L45,2" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Flex>

              {/* Stat 2: Locations */}
              <Flex w="100%" align="center" justify="space-between">
                <HStack spacing={3}>
                  <Flex 
                    w={8} 
                    h={8} 
                    align="center" 
                    justify="center" 
                    bg="rgba(16, 185, 129, 0.15)" 
                    border="1px solid"
                    borderColor="rgba(16, 185, 129, 0.3)"
                    borderRadius="lg" 
                    color="green.600" 
                    shadow="sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </Flex>
                  <Box>
                    <Text fontWeight="800" fontSize="lg" color="gray.850" lineHeight="1" fontFamily="Outfit, sans-serif">
                      {stats.total_locations}
                    </Text>
                    <Text fontSize="9px" fontWeight="800" color="gray.400" textTransform="uppercase" mt={0.5} fontFamily="Inter, sans-serif" letterSpacing="0.02em">
                      Locations
                    </Text>
                  </Box>
                </HStack>
                {/* Green Area Glow Sparkline Chart */}
                <svg width="55" height="25" viewBox="0 0 45 20" style={{ marginRight: '4px' }}>
                  <defs>
                    <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,18 L8,15 L15,10 L23,12 L31,6 L39,8 L45,4 L45,20 L0,20 Z" fill="url(#greenGlow)" />
                  <path d="M0,18 L8,15 L15,10 L23,12 L31,6 L39,8 L45,4" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Flex>

              {/* Stat 3: This Week */}
              <Flex w="100%" align="center" justify="space-between">
                <HStack spacing={3}>
                  <Flex 
                    w={8} 
                    h={8} 
                    align="center" 
                    justify="center" 
                    bg="rgba(249, 115, 22, 0.15)" 
                    border="1px solid"
                    borderColor="rgba(249, 115, 22, 0.3)"
                    borderRadius="lg" 
                    color="orange.600" 
                    shadow="sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </Flex>
                  <Box>
                    <Text fontWeight="800" fontSize="lg" color="gray.850" lineHeight="1" fontFamily="Outfit, sans-serif">
                      {stats.this_week_count}
                    </Text>
                    <Text fontSize="9px" fontWeight="800" color="gray.400" textTransform="uppercase" mt={0.5} fontFamily="Inter, sans-serif" letterSpacing="0.02em">
                      This Week
                    </Text>
                  </Box>
                </HStack>
                {/* Orange Area Glow Sparkline Chart */}
                <svg width="55" height="25" viewBox="0 0 45 20" style={{ marginRight: '4px' }}>
                  <defs>
                    <linearGradient id="orangeGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,14 L8,18 L15,10 L23,14 L31,5 L39,9 L45,7 L45,20 L0,20 Z" fill="url(#orangeGlow)" />
                  <path d="M0,14 L8,18 L15,10 L23,14 L31,5 L39,9 L45,7" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Flex>
              {/* Custom Order Action */}
              <Flex w="100%" align="center" justify="space-between" mt={2}>
                <HStack 
                  as="button" 
                  onClick={onOpen}
                  w="100%" 
                  bg="rgba(59, 130, 246, 0.08)"
                  p={2}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(59, 130, 246, 0.2)"
                  spacing={3}
                  _hover={{ bg: "rgba(59, 130, 246, 0.15)" }}
                  transition="all 0.2s"
                >
                  <Flex 
                    w={8} 
                    h={8} 
                    align="center" 
                    justify="center" 
                    bg="blue.500" 
                    borderRadius="lg" 
                    color="white" 
                    shadow="sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </Flex>
                  <Box textAlign="left" flex="1">
                    <Text fontWeight="800" fontSize="sm" color="blue.600" lineHeight="1.2" fontFamily="Outfit, sans-serif">
                      Custom Order
                    </Text>
                    <Text fontSize="9px" fontWeight="700" color="blue.400" textTransform="uppercase" fontFamily="Inter, sans-serif" letterSpacing="0.02em">
                      Create Manual Entry
                    </Text>
                  </Box>
                </HStack>
              </Flex>
            </VStack>
          </Box>


        </VStack>
      )}
    </Box>
  );
}
