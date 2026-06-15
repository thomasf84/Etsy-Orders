import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Card, CardHeader, CardBody, Text, Progress, Icon, Flex, HStack, VStack, useToast, Spinner, Badge } from "@chakra-ui/react";
import { apiUrl } from "../config";
import { ReportsIcon } from "../components/Sidebar";

export default function ReportsPage() {
  const toast = useToast();
  const [reports, setReports] = useState({ wood_demands: [], size_demands: [], weekly_demands: [] });
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch(apiUrl("/api/v1/etsy/reports-data"));
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      } else {
        throw new Error("Failed to load reports");
      }
    } catch (e) {
      toast({ status: "error", title: "Error", description: String(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    const es = new EventSource(apiUrl("/api/v1/etsy/events"));
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "dashboard-updated") {
          fetchReports();
        }
      } catch {}
    };
    return () => es.close();
  }, []);

  // Compute maximum values for progress normalization
  const maxWood = reports.wood_demands.length > 0 ? Math.max(...reports.wood_demands.map(w => w.count)) : 1;
  const maxWeekly = reports.weekly_demands.length > 0 ? Math.max(...reports.weekly_demands.map(w => w.count)) : 1;

  // Total item count across active demands
  const totalItems = reports.wood_demands.reduce((acc, curr) => acc + curr.count, 0);

  // Helper for size colors
  const getSizeColorScheme = (size) => {
    const map = {
      "8": "purple",
      "15": "blue",
      "16": "yellow",
      "18": "pink",
      "24": "green"
    };
    return map[size] || "gray";
  };

  return (
    <Box mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 6, md: 8 }} pb={20}>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={6}>
        <Box>
          <Heading size="lg" color="gray.800" display="flex" alignItems="center" gap={3}>
            <Icon as={ReportsIcon} color="blue.500" />
            Analytics & Reports
          </Heading>
          <Text color="gray.500" mt={1}>
            Real-time material requirements and production backlogs compiled from active orders.
          </Text>
        </Box>
        {!loading && totalItems > 0 && (
          <Badge colorScheme="blue" fontSize="sm" px={3} py={1.5} borderRadius="full" mt={{ base: 2, md: 0 }}>
            {totalItems} Active Units In Backlog
          </Badge>
        )}
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" h="40vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : totalItems === 0 ? (
        <Card align="center" py={12} variant="outline" bg="white" borderRadius="2xl">
          <CardBody>
            <VStack spacing={3}>
              <Icon as={ReportsIcon} fontSize="4xl" color="gray.300" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                No Analytics Data Available
              </Text>
              <Text color="gray.400" textAlign="center" maxW="320px">
                No active orders are currently in the queue to calculate material demand.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Wood Type Demand Card */}
          <Card variant="outline" bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100">
            <CardHeader pb={2}>
              <Text fontWeight="bold" fontSize="lg" color="gray.800">
                Wood Type Requirements
              </Text>
              <Text fontSize="xs" color="gray.500">
                Total boards needed classified by material type
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={5} align="stretch" py={2}>
                {reports.wood_demands.map((wood) => (
                  <Box key={wood.wood}>
                    <Flex justify="space-between" align="center" mb={1}>
                      <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                        {wood.wood}
                      </Text>
                      <Text fontWeight="bold" fontSize="sm" color="gray.800">
                        {wood.count} {wood.count === 1 ? "unit" : "units"}
                      </Text>
                    </Flex>
                    <Progress
                      value={(wood.count / maxWood) * 100}
                      size="sm"
                      borderRadius="full"
                      colorScheme={wood.wood.toLowerCase().includes("cherry") ? "red" : "blue"}
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          <VStack spacing={8} align="stretch">
            {/* Size Breakdown Card */}
            <Card variant="outline" bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100">
              <CardHeader pb={2}>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                  Size Distribution
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Unit allocation across product size configurations
                </Text>
              </CardHeader>
              <CardBody>
                <Flex wrap="wrap" gap={4} py={2}>
                  {reports.size_demands.map((size) => (
                    <Flex
                      key={size.size}
                      direction="column"
                      align="center"
                      justify="center"
                      bg={`${getSizeColorScheme(size.size)}.50`}
                      border="1px solid"
                      borderColor={`${getSizeColorScheme(size.size)}.200`}
                      borderRadius="2xl"
                      px={5}
                      py={4}
                      minW="90px"
                      flex="1"
                    >
                      <Badge colorScheme={getSizeColorScheme(size.size)} px={2} py={0.5} borderRadius="full" mb={2}>
                        Size {size.size}"
                      </Badge>
                      <Text fontWeight="bold" fontSize="xl" color="gray.800">
                        {size.count}
                      </Text>
                      <Text fontSize="10px" color="gray.500" textTransform="uppercase" fontWeight="bold">
                        Demanded
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </CardBody>
            </Card>

            {/* Weekly Production Backlog Card */}
            <Card variant="outline" bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100">
              <CardHeader pb={2}>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                  Weekly Delivery Breakdown
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Scheduled production volume grouped by target ship week
                </Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch" py={2}>
                  {reports.weekly_demands.map((week) => (
                    <Box key={week.week}>
                      <Flex justify="space-between" align="center" mb={1}>
                        <HStack spacing={2}>
                          <Badge colorScheme="purple" variant="solid" borderRadius="md">
                            {week.week}
                          </Badge>
                        </HStack>
                        <Text fontWeight="bold" fontSize="sm" color="gray.800">
                          {week.count} {week.count === 1 ? "unit" : "units"}
                        </Text>
                      </Flex>
                      <Progress
                        value={(week.count / maxWeekly) * 100}
                        size="xs"
                        borderRadius="full"
                        colorScheme="purple"
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
      )}
    </Box>
  );
}
