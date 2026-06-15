import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Card, CardHeader, CardBody, Text, Badge, Icon, Flex, HStack, VStack, useToast, Spinner, Input } from "@chakra-ui/react";
import { apiUrl } from "../config";
import { GiftIcon } from "../components/Sidebar";

export default function GiftsPage() {
  const toast = useToast();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGifts = async () => {
    try {
      const res = await fetch(apiUrl("/api/v1/etsy/gifts-data"));
      if (res.ok) {
        const data = await res.json();
        setGifts(data.gifts || []);
      } else {
        throw new Error("Failed to load gifts");
      }
    } catch (e) {
      toast({ status: "error", title: "Error", description: String(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();

    // Listen for live updates
    const es = new EventSource(apiUrl("/api/v1/etsy/events"));
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "dashboard-updated") {
          fetchGifts();
        }
      } catch {}
    };
    return () => es.close();
  }, []);

  const filteredGifts = gifts.filter((gift) => {
    const term = searchTerm.toLowerCase();
    return (
      (gift.name || "").toLowerCase().includes(term) ||
      (gift["formatted value"] || "").toLowerCase().includes(term) ||
      (gift.gift_message || "").toLowerCase().includes(term) ||
      (gift["message from buyer"] || "").toLowerCase().includes(term)
    );
  });

  return (
    <Box mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 6, md: 8 }} pb={20}>
      <Flex direction={{ base: "column", md: "row" }} align={{ base: "flex-start", md: "center" }} justify="space-between" mb={6} gap={4}>
        <Box>
          <Heading size="lg" color="gray.800" display="flex" alignItems="center" gap={3}>
            <Icon as={GiftIcon} color="blue.500" />
            Gift Orders
          </Heading>
          <Text color="gray.500" mt={1}>
            Track and process packages marked as gifts or containing gift wrapping/messages.
          </Text>
        </Box>
        <Input
          placeholder="Search buyer name, style, messages..."
          maxW={{ base: "100%", md: "350px" }}
          bg="white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" h="40vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : filteredGifts.length === 0 ? (
        <Card align="center" py={12} variant="outline" bg="white" borderRadius="2xl">
          <CardBody>
            <VStack spacing={3}>
              <Icon as={GiftIcon} fontSize="4xl" color="gray.300" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                No Gift Orders Found
              </Text>
              <Text color="gray.400" textAlign="center" maxW="320px">
                {searchTerm ? "No orders match your search term." : "There are currently no active orders flagged as gifts."}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredGifts.map((gift) => (
            <Card key={gift.receipt_id} variant="outline" bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
              <CardHeader bg="gray.50" py={4} borderBottom="1px" borderColor="gray.100">
                <Flex justify="space-between" align="center">
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="bold" fontSize="md" color="gray.800">
                      {gift.name || "Unknown Buyer"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Receipt: {gift.receipt_id}
                    </Text>
                  </VStack>
                  <Badge colorScheme={gift.status?.color ? gift.status.color.split(".")[0] : "blue"} borderRadius="full" px={2.5} py={0.5}>
                    {gift.status?.name || "Received"}
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody py={5}>
                <VStack align="flex-start" spacing={4} w="100%">
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">
                      Item & Style
                    </Text>
                    <Text fontWeight="semibold" color="gray.700" mt={1}>
                      {gift.quantity}x {gift["formatted value"] || "Custom Board"}
                    </Text>
                    {gift.size && (
                      <Badge size="sm" mt={1} colorScheme={gift.size.color ? gift.size.color.split(".")[0] : "purple"}>
                        Size {gift.size.name}
                      </Badge>
                    )}
                  </Box>

                  {gift.location && (
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">
                        Ship To
                      </Text>
                      <Text color="gray.600" fontSize="sm" mt={1}>
                        {gift.location} ({gift.ship_week})
                      </Text>
                    </Box>
                  )}

                  {gift.gift_message && (
                    <Box w="100%" p={3} bg="purple.50" borderLeft="3px solid" borderColor="purple.300" borderRadius="r">
                      <Text fontSize="xs" fontWeight="bold" color="purple.700" textTransform="uppercase">
                        Gift Message
                      </Text>
                      <Text color="purple.900" fontSize="sm" fontStyle="italic" mt={1}>
                        "{gift.gift_message}"
                      </Text>
                    </Box>
                  )}

                  {gift["message from buyer"] && (
                    <Box w="100%" p={3} bg="gray.50" borderLeft="3px solid" borderColor="gray.300" borderRadius="r">
                      <Text fontSize="xs" fontWeight="bold" color="gray.600" textTransform="uppercase">
                        Buyer Notes
                      </Text>
                      <Text color="gray.700" fontSize="sm" mt={1}>
                        {gift["message from buyer"]}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
