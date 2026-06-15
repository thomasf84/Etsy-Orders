import React, { useEffect, useState, useRef, useMemo } from "react";
import { Box, Heading, SimpleGrid, Card, CardBody, Text, Badge, Icon, Flex, HStack, VStack, useToast, Spinner, Divider, Button, ButtonGroup } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { apiUrl } from "../config";
import { LocationIcon } from "../components/Sidebar";
import { useAppTheme } from "../theme/ThemeContext";
import { Filters } from "../components/Filters";

const LOCATION_COORDINATES = {
  // US States
  "Alabama": [32.806671, -86.791130],
  "Alaska": [61.370716, -152.404419],
  "Arizona": [33.729759, -111.431221],
  "Arkansas": [34.969704, -92.373123],
  "California": [36.116203, -119.681564],
  "Colorado": [39.059811, -105.311104],
  "Connecticut": [41.597782, -72.755371],
  "Delaware": [39.318523, -75.507141],
  "Florida": [27.766279, -81.686783],
  "Georgia": [33.040619, -83.643074],
  "Hawaii": [21.094318, -157.498337],
  "Idaho": [44.240459, -114.478828],
  "Illinois": [40.349457, -88.986137],
  "Indiana": [39.849426, -86.258278],
  "Iowa": [42.011539, -93.210526],
  "Kansas": [38.526600, -96.726486],
  "Kentucky": [37.668140, -84.670067],
  "Louisiana": [31.169546, -91.867805],
  "Maine": [44.693947, -69.381927],
  "Maryland": [39.063946, -76.802101],
  "Massachusetts": [42.230176, -71.530106],
  "Michigan": [43.326618, -84.536098],
  "Minnesota": [45.694454, -93.900192],
  "Mississippi": [32.741646, -89.678696],
  "Missouri": [38.456085, -92.288371],
  "Montana": [46.921925, -110.454353],
  "Nebraska": [41.125370, -98.268082],
  "Nevada": [38.313515, -117.055374],
  "New Hampshire": [43.452492, -71.563896],
  "New Jersey": [40.298904, -74.521011],
  "New Mexico": [34.840515, -106.248482],
  "New York": [42.165726, -74.948051],
  "North Carolina": [35.630066, -79.806419],
  "North Dakota": [47.528912, -99.784012],
  "Ohio": [40.388783, -82.764915],
  "Oklahoma": [35.565342, -96.928917],
  "Oregon": [44.572021, -122.070938],
  "Pennsylvania": [40.590752, -77.209755],
  "Rhode Island": [41.680893, -71.511780],
  "South Carolina": [33.856890, -80.945007],
  "South Dakota": [44.299782, -99.438828],
  "Tennessee": [35.747845, -86.692345],
  "Texas": [31.054487, -97.563461],
  "Utah": [40.150032, -111.862434],
  "Vermont": [44.045876, -72.710686],
  "Virginia": [37.769337, -78.169968],
  "Washington": [47.400902, -121.490494],
  "West Virginia": [38.491227, -80.954453],
  "Wisconsin": [44.268543, -89.616508],
  "Wyoming": [42.755966, -107.302490],
  "District of Columbia": [38.907192, -77.036871],
  
  // International Countries
  "United States": [37.090240, -95.712891],
  "Canada": [56.130366, -106.346771],
  "United Kingdom": [55.378051, -3.435973],
  "Germany": [51.165691, 10.451526],
  "Australia": [-25.274398, 133.775136],
  "France": [46.227638, 2.213749],
  "Italy": [41.87194, 12.56738],
  "Spain": [40.463667, -3.74922],
  "Netherlands": [52.132633, 5.291266],
  "New Zealand": [-40.900557, 174.885971],
  "Ireland": [53.41291, -8.24389],
  "Switzerland": [46.818188, 8.227512],
  "Austria": [47.516231, 14.550072],
  "Belgium": [50.503887, 4.469936],
  "Sweden": [60.128161, 18.643501],
  "Norway": [60.472024, 8.468946],
  "Denmark": [56.26392, 9.501785],
  "Finland": [61.92411, 25.748151],
  "Japan": [36.204824, 138.252924],
};

export default function LocationsPage() {
  const toast = useToast();
  const { theme: appTheme } = useAppTheme();
  const [rawData, setRawData] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [viewMode, setViewMode] = useState("active");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const columns = useMemo(() => [
    { accessorKey: "status", filterFn: (row, columnId, filterStatuses) => {
        if (filterStatuses.length === 0) return true;
        return filterStatuses.includes(row.original.status?.id);
    }},
    { accessorKey: "size", filterFn: (row, columnId, filterSizes) => {
        if (filterSizes.length === 0) return true;
        return filterSizes.includes(row.original.size?.id);
    }},
    { accessorKey: "formatted value", filterFn: 'includesString' },
    { accessorKey: "location" }
  ], []);

  const table = useReactTable({
    data: rawData,
    columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const fetchLocations = async (mode) => {
    setLoading(true);
    try {
      let endpoint = mode === "active" ? "/api/v1/etsy/dashboard-state" : "/api/v1/etsy/all-orders-data";
      let res = await fetch(apiUrl(endpoint));
      let data = await res.json();
      
      if (!data || !data.data || data.data.length === 0) {
        if (mode === "active") {
          res = await fetch(apiUrl("/api/v1/etsy/active-dashboard"));
          data = await res.json();
        }
      }
      setRawData(data.data || data.results || []);
    } catch (e) {
      toast({ status: "error", title: "Error", description: String(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations(viewMode);
  }, [viewMode]);

  const currentLocs = useMemo(() => {
    const locMap = {};
    table.getFilteredRowModel().rows.forEach(row => {
      const order = row.original;
      const locName = order.location;
      if (!locName || locName === "Unknown") return;

      if (!locMap[locName]) {
        locMap[locName] = { name: locName, order_count: 0, item_count: 0, orders: [] };
      }
      locMap[locName].order_count += 1;
      locMap[locName].item_count += (order.quantity || 1);
      locMap[locName].orders.push({
        buyer: order.buyer || order.buyer_email,
        style: order["formatted value"],
        quantity: order.quantity,
        status: order.status
      });
    });
    return Object.values(locMap);
  }, [table.getFilteredRowModel().rows]);

  useEffect(() => {
    const es = new EventSource(apiUrl("/api/v1/etsy/events"));
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg?.type === "dashboard-updated") {
          fetchLocations(viewMode);
        }
      } catch {}
    };
    return () => es.close();
  }, [viewMode]);

  useEffect(() => {
    if (!window.L || loading) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = window.L.map("map-container", {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([37.8, -96], 4);
    
    mapRef.current = map;

    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    currentLocs.forEach((loc) => {
      const coords = LOCATION_COORDINATES[loc.name];
      if (coords) {
        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 190px; font-size: 11px;">
            <strong style="font-size: 14px; font-family: 'Outfit', sans-serif; color: #111827; display: block; margin-bottom: 4px;">${loc.name}</strong>
            <span style="font-size: 10px; font-weight: 800; color: ${viewMode === 'active' ? '#DD6B20' : '#2563EB'}; background-color: ${viewMode === 'active' ? 'rgba(251, 146, 60, 0.12)' : 'rgba(37, 99, 235, 0.08)'}; border: 1px solid ${viewMode === 'active' ? 'rgba(251, 146, 60, 0.25)' : 'rgba(37, 99, 235, 0.15)'}; padding: 3px 8px; border-radius: 9999px; display: inline-block; margin-bottom: 8px;">
              ${loc.item_count} ${loc.item_count === 1 ? 'item' : 'items'} (${loc.order_count} ${loc.order_count === 1 ? 'order' : 'orders'})
            </span>
            <div style="margin-top: 6px; border-top: 1px solid rgba(229, 231, 235, 0.8); padding-top: 6px; max-height: 120px; overflow-y: auto;">
              ${loc.orders.map(o => `
                <div style="margin-bottom: 6px; display: flex; flex-direction: column; line-height: 1.3;">
                  <span style="font-weight: 700; color: #374151; font-size: 10px;">${o.buyer || 'Unknown'}</span>
                  <span style="color: #6B7280; font-size: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Inter', sans-serif;">${o.style || 'Custom Board'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        const activeColor = viewMode === "active" ? "#F97316" : "#3B82F6";
        const pinIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 14px;
            height: 14px;
            background-color: ${activeColor};
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 0 3px ${activeColor}33, 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s;
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -10]
        });

        window.L.marker(coords, { icon: pinIcon })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loading, viewMode, currentLocs]);

  return (
    <Box mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 6, md: 8 }} pb={20}>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={6} gap={4}>
        <Box>
          <Heading size="lg" color="gray.800" display="flex" alignItems="center" gap={3} fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="24px">
            <Icon as={LocationIcon} color="orange.500" />
            Shipping Destinations Map
          </Heading>
          <Text color="gray.500" mt={1} fontSize="xs" fontWeight="semibold" fontFamily="Inter, sans-serif">
            View geographical distribution of both current active workloads and completed shipments.
          </Text>
        </Box>
        
        <ButtonGroup size="sm" bg="white" p={1} borderRadius="2xl" border="1px" borderColor="rgba(226, 232, 240, 0.85)" shadow="sm">
          <Button
            onClick={() => setViewMode("active")}
            bgGradient={viewMode === "active" ? "linear(to-r, #2563EB, #3B82F6)" : "none"}
            bg={viewMode === "active" ? undefined : "transparent"}
            color={viewMode === "active" ? "white" : "gray.600"}
            _hover={{ bg: viewMode === "active" ? undefined : "gray.50" }}
            borderRadius="xl"
            fontWeight="bold"
            px={4}
            boxShadow={viewMode === "active" ? "0 4px 14px rgba(37,99,235,0.3)" : "none"}
            fontFamily="Outfit, sans-serif"
            fontSize="xs"
          >
            Active Orders
          </Button>
          <Button
            onClick={() => setViewMode("past")}
            bgGradient={viewMode === "past" ? "linear(to-r, #2563EB, #3B82F6)" : "none"}
            bg={viewMode === "past" ? undefined : "transparent"}
            color={viewMode === "past" ? "white" : "gray.600"}
            _hover={{ bg: viewMode === "past" ? undefined : "gray.50" }}
            borderRadius="xl"
            fontWeight="bold"
            px={4}
            boxShadow={viewMode === "past" ? "0 4px 14px rgba(37,99,235,0.3)" : "none"}
            fontFamily="Outfit, sans-serif"
            fontSize="xs"
          >
            Past Locations
          </Button>
        </ButtonGroup>
      </Flex>

      <Box mb={6}>
        <Filters 
          columnFilters={columnFilters} 
          setColumnFilters={setColumnFilters} 
          rows={table.getRowModel().rows} 
          setData={() => {}} 
          count={table.getFilteredRowModel().rows.length} 
          stats={{}} 
          onShowStats={() => {}} 
        />
      </Box>

      <Card 
        variant="outline" 
        bg="white" 
        borderRadius="3xl" 
        border="1.5px solid transparent"
        style={{
          background: `linear-gradient(135deg, ${appTheme.tableBg[0]} 0%, ${appTheme.tableBg[1]} 50%, ${appTheme.tableBg[2]} 100%) padding-box, linear-gradient(135deg, ${appTheme.borderGradient[0]} 0%, ${appTheme.borderGradient[1]} 50%, ${appTheme.borderGradient[2]} 100%) border-box`,
        }}
        boxShadow="rgba(20, 184, 166, 0.08) -8px 8px 32px 0px, rgba(139, 92, 246, 0.06) 8px -8px 32px 0px"
        overflow="hidden" 
        mb={8}
        p={1.5}
      >
        <Box id="map-container" h="480px" w="100%" borderRadius="2xl" overflow="hidden" />
      </Card>

      {loading ? (
        <Flex justify="center" align="center" h="20vh">
          <Spinner size="lg" color="blue.500" />
        </Flex>
      ) : currentLocs.length === 0 ? (
        <Card align="center" py={12} variant="outline" bg="white" borderRadius="2xl" border="1px" borderColor="rgba(226, 232, 240, 0.85)">
          <CardBody>
            <VStack spacing={3}>
              <Icon as={LocationIcon} fontSize="4xl" color="gray.300" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.600" fontFamily="Outfit, sans-serif">
                No Locations Data Found
              </Text>
              <Text color="gray.400" textAlign="center" maxW="320px" fontSize="xs" fontFamily="Inter, sans-serif">
                No orders match this configuration filter.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {currentLocs.map((loc) => (
            <Card 
              key={loc.name} 
              variant="outline" 
              bg="white" 
              borderRadius="2xl" 
              boxShadow="rgba(0, 0, 0, 0.02) 0px 4px 12px" 
              border="1px solid" 
              borderColor="rgba(226, 232, 240, 0.85)"
            >
              <CardBody p={5}>
                <Flex justify="space-between" align="center" mb={2}>
                  <HStack spacing={2}>
                    <Icon as={LocationIcon} color={viewMode === "active" ? "orange.500" : "blue.500"} />
                    <Text fontWeight="800" fontSize="sm" color="gray.800" fontFamily="Outfit, sans-serif">
                      {loc.name}
                    </Text>
                  </HStack>
                  <Badge 
                    bg={viewMode === "active" ? "rgba(249, 115, 22, 0.08)" : "rgba(59, 130, 246, 0.08)"} 
                    color={viewMode === "active" ? "orange.700" : "blue.700"} 
                    border="1px solid"
                    borderColor={viewMode === "active" ? "rgba(249, 115, 22, 0.15)" : "rgba(59, 130, 246, 0.15)"}
                    borderRadius="xl" 
                    px={2.5} 
                    py={0.5}
                    fontSize="10px"
                    fontWeight="800"
                    fontFamily="Inter, sans-serif"
                  >
                    {loc.item_count} {loc.item_count === 1 ? "Item" : "Items"}
                  </Badge>
                </Flex>
                <Text fontSize="10px" color="gray.400" fontWeight="bold" fontFamily="Inter, sans-serif" mb={3} letterSpacing="0.01em">
                  {loc.order_count} {loc.order_count === 1 ? "Order" : "Orders"}
                </Text>
                
                <Divider mb={3} borderColor="gray.100" />
                
                <VStack align="flex-start" spacing={3} maxH="180px" overflowY="auto" pr={1}>
                  {loc.orders.map((ord, idx) => {
                    const statusName = ord.status?.name || "Received";
                    const themeStatus = appTheme.statusColors?.[statusName] || {
                      bg: "blue.50",
                      color: "blue.600",
                      borderColor: "blue.200"
                    };

                    return (
                      <Box key={idx} w="100%">
                        <Flex justify="space-between" align="center" w="100%" gap={2}>
                          <VStack align="flex-start" spacing={0} maxW="65%">
                            <Text fontWeight="700" fontSize="xs" color="gray.700" noOfLines={1} fontFamily="Inter, sans-serif">
                              {ord.buyer || "Unknown"}
                            </Text>
                            <Text fontSize="9px" fontWeight="medium" color="gray.400" noOfLines={1} fontFamily="Inter, sans-serif">
                              {ord.style || "Custom Board"}
                            </Text>
                          </VStack>
                          <HStack spacing={1} flexShrink={0}>
                            <Badge variant="outline" fontSize="9px" px={1.5} py={0.2} borderRadius="md" color="gray.500" borderColor="gray.200" fontFamily="Inter, sans-serif" fontWeight="bold">
                              Qty: {ord.quantity}
                            </Badge>
                            <Badge 
                              fontSize="9px"
                              bg={themeStatus.bg}
                              color={themeStatus.color}
                              border="1px solid"
                              borderColor={themeStatus.borderColor}
                              px={2}
                              py={0.2}
                              borderRadius="md"
                              fontFamily="Inter, sans-serif"
                              fontWeight="bold"
                            >
                              {statusName}
                            </Badge>
                          </HStack>
                        </Flex>
                      </Box>
                    );
                  })}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
