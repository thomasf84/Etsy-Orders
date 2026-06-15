import { Box, Flex, HStack, Text, Icon, Badge, IconButton, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import Sidebar, { GiftIcon, OverviewIcon, ItemsIcon, LocationIcon, ReportsIcon, SettingsIcon } from "./components/Sidebar";
import DashboardPage from "./pages/Dashboard";
import InventoryPage from "./pages/Inventory";
import LocationsPage from "./pages/Locations";
import GiftsPage from "./pages/Gifts";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import OrderHistoryPage from "./pages/OrderHistory";
import { useAppTheme } from "./theme/ThemeContext";

function App() {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme: appTheme } = useAppTheme();

  return (
    <Flex
      minH="100vh"
      color="gray.800"
      fontFamily="Inter, sans-serif"
      sx={{
        background: `linear-gradient(120deg, ${appTheme.appBg[0]} 0%, ${appTheme.appBg[1]} 30%, ${appTheme.appBg[2]} 70%, ${appTheme.appBg[3]} 100%)`,
      }}
    >
      {/* Permanent Sidebar for Desktop */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Mobile Top Navigation Bar */}
      <Flex
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        h={14}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        borderBottom="1px"
        borderColor="gray.100"
        boxShadow="sm"
        zIndex={200}
        px={4}
        align="center"
        justify="space-between"
        display={{ base: "flex", md: "none" }}
      >
        <HStack spacing={2}>
          <Icon as={GiftIcon} color="blue.500" fontSize="xl" />
          <Text fontWeight="bold" fontSize="lg" color="gray.800">
            Dashboard
          </Text>
          <Badge colorScheme="green" variant="subtle" px={1.5} py={0.2} borderRadius="full" fontSize="10px">
            LIVE
          </Badge>
        </HStack>

        <Menu isLazy>
          <MenuButton
            as={IconButton}
            aria-label="Navigation Menu"
            icon={<span>☰</span>}
            variant="ghost"
            fontSize="lg"
            color="gray.600"
          />
          <Portal>
            <MenuList zIndex={300} bg="white" shadow="md" borderRadius="xl" border="1px" borderColor="gray.100">
              <MenuItem as={Link} to="/" icon={<Icon as={OverviewIcon} />}>Overview</MenuItem>
              <MenuItem as={Link} to="/inventory" icon={<Icon as={ItemsIcon} />}>Items</MenuItem>
              <MenuItem as={Link} to="/locations" icon={<Icon as={LocationIcon} />}>Locations</MenuItem>
              <MenuItem as={Link} to="/gifts" icon={<Icon as={GiftIcon} />}>Gifts</MenuItem>
              <MenuItem as={Link} to="/history" icon={<Icon as={ReportsIcon} />}>History</MenuItem>
              <MenuItem as={Link} to="/reports" icon={<Icon as={ReportsIcon} />}>Reports</MenuItem>
              <MenuItem as={Link} to="/settings" icon={<Icon as={SettingsIcon} />}>Settings</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>

      {/* Main Page Content Area */}
      <Box
        flex="1"
        ml={{ base: 0, md: isSidebarCollapsed ? "80px" : "260px" }}
        pt={{ base: 18, md: 6 }}
        px={{ base: 4, md: 6 }}
        pb={6}
        minH="100vh"
        transition="margin-left 0.2s"
      >
        <Box
          w="100%"
          minH="calc(100vh - 48px)"
          bg="rgba(255, 255, 255, 0.45)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.6)"
          boxShadow="2xl"
          p={{ base: 4, md: 6 }}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/gifts" element={<GiftsPage />} />
            <Route path="/history" element={<OrderHistoryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </Box>
    </Flex>
  );
}

export default App;
