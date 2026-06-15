import React, { useState, useMemo } from "react";
import { Box, Heading, Text, Flex, Icon, SimpleGrid, Card, CardBody, VStack, HStack, Badge, Button, useToast } from "@chakra-ui/react";
import { ReportsIcon } from "../components/Sidebar";
import TaskTable from "../components/TaskTable";
import { apiUrl } from "../config";

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card variant="outline" bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100">
    <CardBody py={4} px={5}>
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="gray.800" fontFamily="Outfit, sans-serif">
            {value}
          </Text>
          {subtitle && (
            <Text fontSize="xs" color="gray.400" fontWeight="medium">
              {subtitle}
            </Text>
          )}
        </VStack>
        <Flex
          w="48px"
          h="48px"
          borderRadius="xl"
          bg={`${color}.50`}
          color={`${color}.500`}
          align="center"
          justify="center"
          border="1px solid"
          borderColor={`${color}.100`}
        >
          <Text fontSize="xl">{icon}</Text>
        </Flex>
      </Flex>
    </CardBody>
  </Card>
);

export default function OrderHistoryPage() {
  const [filteredRows, setFilteredRows] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const toast = useToast();

  const handleSyncHistory = async () => {
    setSyncing(true);
    try {
      const res = await fetch(apiUrl('/api/v1/etsy/sync-history-background'), { method: 'POST' });
      if (!res.ok) throw new Error("Failed to start sync");
      toast({ status: 'success', title: 'Sync Started', description: 'Fetching all historical orders in the background. This will take a few minutes.' });
    } catch (e) {
      toast({ status: 'error', title: 'Sync Failed', description: String(e) });
    } finally {
      setSyncing(false);
    }
  };

  // Dynamically compute stats from the currently filtered rows
  const stats = useMemo(() => {
    if (!filteredRows || filteredRows.length === 0) {
      return { totalRevenue: 0, totalItems: 0, totalOrders: 0, topLocation: "N/A" };
    }

    let revenue = 0;
    let items = 0;
    const locationsCount = {};

    filteredRows.forEach(row => {
      const order = row.original;
      revenue += (order.total_price || 0);
      items += (order.quantity || 1);
      
      const loc = order.location;
      if (loc) {
        locationsCount[loc] = (locationsCount[loc] || 0) + 1;
      }
    });

    let topLocation = "N/A";
    let maxLocCount = 0;
    Object.entries(locationsCount).forEach(([loc, count]) => {
      if (count > maxLocCount) {
        maxLocCount = count;
        topLocation = loc;
      }
    });

    return {
      totalRevenue: revenue,
      totalItems: items,
      totalOrders: filteredRows.length,
      topLocation
    };
  }, [filteredRows]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <Box w="100%" fontSize="sm">
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={6} gap={4}>
        <Box>
          <Heading size="lg" color="gray.800" display="flex" alignItems="center" gap={3} fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="24px">
            <Icon as={ReportsIcon} color="blue.500" />
            Order History & Analytics
          </Heading>
          <Text color="gray.500" mt={1} fontSize="xs" fontWeight="semibold" fontFamily="Inter, sans-serif">
            View all completed and active orders. Stats dynamically recalculate based on your filters.
          </Text>
        </Box>
        <Button 
          colorScheme="blue" 
          size="sm" 
          isLoading={syncing} 
          onClick={handleSyncHistory}
          loadingText="Syncing..."
          borderRadius="xl"
          boxShadow="sm"
        >
          Sync All History
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          subtitle="From filtered orders"
          icon="💰" 
          color="green" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          subtitle="Filtered order count"
          icon="📦" 
          color="blue" 
        />
        <StatCard 
          title="Total Items Sold" 
          value={stats.totalItems} 
          subtitle="Individual physical units"
          icon="🔨" 
          color="purple" 
        />
        <StatCard 
          title="Top Location" 
          value={stats.topLocation} 
          subtitle="Most frequent destination"
          icon="📍" 
          color="orange" 
        />
      </SimpleGrid>

      <Box>
        <TaskTable 
          endpointUrl="/api/v1/etsy/all-orders-data" 
          onFilteredRowsChange={setFilteredRows}
          onShowStats={() => {}} 
          isHistory={true}
        />
      </Box>
    </Box>
  );
}
