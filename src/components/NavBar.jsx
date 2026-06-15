import { Box, Flex, Heading, HStack, Link as CLink, IconButton, Menu, MenuButton, MenuItem, MenuList, Show, Hide } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"

const NavLink = ({ to, children }) => {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <CLink
      as={Link}
      to={to}
      px={3}
      py={2}
      borderRadius="md"
      fontWeight={isActive ? "bold" : "semibold"}
      color={isActive ? "blue.700" : "gray.700"}
      _hover={{ textDecoration: "none", bg: "gray.100" }}
    >
      {children}
    </CLink>
  )
}

export default function NavBar() {
  return (
    <Box as="header" position="fixed" top={0} left={0} right={0} bg="white" boxShadow="sm" zIndex={1000}>
      <Flex h={14} align="center" justify="space-between" px={4}>
        <Hide below="md">
          <HStack spacing={1}>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/inventory">Inventory</NavLink>
            <NavLink to="/json">JSON</NavLink>
            <NavLink to="/dev">Dev</NavLink>
          </HStack>
        </Hide>
        <Show below="md">
          <Menu isLazy>
            <MenuButton as={IconButton} aria-label="Menu" icon={<span>☰</span>} variant="ghost" />
            <MenuList>
              <MenuItem as={CLink} href="/">Dashboard</MenuItem>
              <MenuItem as={CLink} href="/inventory">Inventory</MenuItem>
              <MenuItem as={CLink} href="/json">JSON</MenuItem>
              <MenuItem as={CLink} href="/dev">Dev</MenuItem>
            </MenuList>
          </Menu>
        </Show>
      </Flex>
    </Box>
  )
}


