import React, { useState } from "react";
import { Box, Heading, Text, VStack, Card, CardHeader, CardBody, Button, useToast, Icon, Flex, Badge, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Grid, GridItem, FormControl, FormLabel, Input, HStack } from "@chakra-ui/react";
import { SettingsIcon } from "../components/Sidebar";
import DeveloperPage from "./Developer";
import JsonViewerPage from "./JsonViewer";
import { useAppTheme } from "../theme/ThemeContext";

function anyToHex(val) {
  if (!val) return '#000000';
  if (val.startsWith('#')) return val;
  if (val.startsWith('rgba') || val.startsWith('rgb')) {
    const match = val.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  }
  return '#000000';
}

function hexToRgba(hex, alpha) {
  if (!hex) return '';
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function SettingsPage() {
  const toast = useToast();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const { theme: appTheme, updateTheme, resetTheme } = useAppTheme();

  // Background state
  const [appBg0, setAppBg0] = useState(anyToHex(appTheme.appBg[0]));
  const [appBg1, setAppBg1] = useState(anyToHex(appTheme.appBg[1]));
  const [appBg2, setAppBg2] = useState(anyToHex(appTheme.appBg[2]));
  const [appBg3, setAppBg3] = useState(anyToHex(appTheme.appBg[3]));

  // Table border gradient state
  const [borderGrad0, setBorderGrad0] = useState(anyToHex(appTheme.borderGradient[0]));
  const [borderGrad1, setBorderGrad1] = useState(anyToHex(appTheme.borderGradient[1]));
  const [borderGrad2, setBorderGrad2] = useState(anyToHex(appTheme.borderGradient[2]));

  // Table background gradient state
  const [tableBgGrad0, setTableBgGrad0] = useState(anyToHex(appTheme.tableBg[0]));
  const [tableBgGrad1, setTableBgGrad1] = useState(anyToHex(appTheme.tableBg[1]));
  const [tableBgGrad2, setTableBgGrad2] = useState(anyToHex(appTheme.tableBg[2]));

  // Status colors state
  const [statusColors, setStatusColors] = useState({
    Received: anyToHex(appTheme.statusColors.Received.color),
    Cut: anyToHex(appTheme.statusColors.Cut.color),
    Lasered: anyToHex(appTheme.statusColors.Lasered.color),
    Stained: anyToHex(appTheme.statusColors.Stained.color),
    Painted: anyToHex(appTheme.statusColors.Painted.color),
    Lacquered: anyToHex(appTheme.statusColors.Lacquered?.color || '#c2410c'),
    Ready: anyToHex(appTheme.statusColors.Ready.color),
  });

  const testEtsyConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/v1/etsy/test-etsy-connection");
      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
        if (data.status === "success") {
          toast({ status: "success", title: "Connection Successful", description: data.message });
        } else {
          toast({ status: "error", title: "Connection Failed", description: data.message });
        }
      } else {
        throw new Error("HTTP error connecting to FastAPI");
      }
    } catch (e) {
      toast({ status: "error", title: "Connection Error", description: String(e) });
      setTestResult({ status: "error", message: String(e) });
    } finally {
      setTesting(false);
    }
  };

  const saveColors = () => {
    updateTheme({
      appBg: [appBg0, appBg1, appBg2, appBg3],
      tableBg: [
        hexToRgba(tableBgGrad0, 0.6),
        hexToRgba(tableBgGrad1, 0.4),
        hexToRgba(tableBgGrad2, 0.3)
      ],
      borderGradient: [
        hexToRgba(borderGrad0, 0.7),
        hexToRgba(borderGrad1, 0.45),
        hexToRgba(borderGrad2, 0.6)
      ],
      statusColors: {
        Received: {
          bg: hexToRgba(statusColors.Received, 0.55),
          hoverBg: hexToRgba(statusColors.Received, 0.65),
          color: statusColors.Received,
          borderColor: hexToRgba(statusColors.Received, 0.25)
        },
        Cut: {
          bg: hexToRgba(statusColors.Cut, 0.55),
          hoverBg: hexToRgba(statusColors.Cut, 0.65),
          color: statusColors.Cut,
          borderColor: hexToRgba(statusColors.Cut, 0.25)
        },
        Lasered: {
          bg: hexToRgba(statusColors.Lasered, 0.5),
          hoverBg: hexToRgba(statusColors.Lasered, 0.6),
          color: statusColors.Lasered,
          borderColor: hexToRgba(statusColors.Lasered, 0.25)
        },
        Stained: {
          bg: hexToRgba(statusColors.Stained, 0.55),
          hoverBg: hexToRgba(statusColors.Stained, 0.65),
          color: statusColors.Stained,
          borderColor: hexToRgba(statusColors.Stained, 0.25)
        },
        Painted: {
          bg: hexToRgba(statusColors.Painted, 0.55),
          hoverBg: hexToRgba(statusColors.Painted, 0.65),
          color: statusColors.Painted,
          borderColor: hexToRgba(statusColors.Painted, 0.25)
        },
        Lacquered: {
          bg: hexToRgba(statusColors.Lacquered, 0.55),
          hoverBg: hexToRgba(statusColors.Lacquered, 0.65),
          color: statusColors.Lacquered,
          borderColor: hexToRgba(statusColors.Lacquered, 0.25)
        },
        Ready: {
          bg: hexToRgba(statusColors.Ready, 0.55),
          hoverBg: hexToRgba(statusColors.Ready, 0.65),
          color: statusColors.Ready,
          borderColor: hexToRgba(statusColors.Ready, 0.25)
        }
      }
    });
    toast({ status: "success", title: "Theme Saved", description: "Your custom theme has been saved successfully!" });
  };

  const handleReset = () => {
    resetTheme();
    toast({ status: "info", title: "Theme Reset", description: "Theme reset to default settings." });
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <Box mx="auto" px={{ base: 4, md: 8 }} pt={{ base: 6, md: 8 }} pb={20}>
      <Box mb={6}>
        <Heading size="lg" color="gray.800" display="flex" alignItems="center" gap={3} fontFamily="Outfit, sans-serif" fontWeight="950">
          <Icon as={SettingsIcon} color="blue.500" />
          Settings & Utilities
        </Heading>
        <Text color="gray.500" mt={1}>
          Verify Etsy API connectivity, manage configuration properties, and customize visual settings.
        </Text>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue" bg="white" p={6} borderRadius="2xl" border="1px" borderColor="gray.100" shadow="sm">
        <TabList>
          <Tab fontWeight="semibold">General Settings</Tab>
          <Tab fontWeight="semibold">Theme & Colors</Tab>
          <Tab fontWeight="semibold">JSON Import/Export</Tab>
          <Tab fontWeight="semibold">Developer Logs</Tab>
        </TabList>

        <TabPanels>
          {/* General Tab */}
          <TabPanel pt={6}>
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="sm" color="gray.700" mb={1}>
                  Etsy API Connection Validation
                </Heading>
                <Text fontSize="xs" color="gray.500" mb={4}>
                  Test the connection using settings loaded from your root environment file.
                </Text>
                
                <Flex align="center" gap={4}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={testEtsyConnection}
                    isLoading={testing}
                  >
                    Test Etsy Credentials
                  </Button>
                  
                  {testResult && (
                    <Badge colorScheme={testResult.status === "success" ? "green" : "red"} px={2} py={1} borderRadius="md">
                      {testResult.status === "success" ? "Connected Successfully" : "Connection Failure"}
                    </Badge>
                  )}
                </Flex>

                {testResult && (
                  <Box mt={3} p={3} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200" maxW="500px">
                    <Text fontSize="xs" color="gray.600" fontFamily="mono">
                      {testResult.message}
                    </Text>
                  </Box>
                )}
              </Box>

              <Divider />

              <Box>
                <Heading size="sm" color="gray.700" mb={1}>
                  Application Environment
                </Heading>
                <Text fontSize="xs" color="gray.500" mb={3}>
                  Verify build runtime parameters.
                </Text>
                <VStack align="stretch" spacing={2} maxW="400px" fontSize="xs">
                  <Flex justify="space-between">
                    <Text color="gray.500">FastAPI API Prefix:</Text>
                    <Text fontWeight="semibold" color="gray.700">/api/v1</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.500">Local Timezone:</Text>
                    <Text fontWeight="semibold" color="gray.700">America/Chicago (US Central)</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color="gray.500">CORS Origins Allowed:</Text>
                    <Text fontWeight="semibold" color="gray.700">*</Text>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          {/* Theme & Colors Tab */}
          <TabPanel pt={6}>
            <VStack align="stretch" spacing={6}>
              <Box mb={2}>
                <Heading size="sm" color="gray.700" mb={1} fontFamily="Outfit, sans-serif">Theme & Colors Customization</Heading>
                <Text fontSize="xs" color="gray.500">Pick custom gradients, background colors, and status indicators.</Text>
              </Box>

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                {/* Background Gradients */}
                <GridItem>
                  <Card variant="outline" borderRadius="xl">
                    <CardHeader py={3} px={4} borderBottom="1px" borderColor="gray.100">
                      <Heading size="xs" color="gray.700">App Background Gradient</Heading>
                    </CardHeader>
                    <CardBody p={4}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Color 1 (Top Left)</FormLabel>
                          <HStack>
                            <Input type="color" w="36px" h="36px" p={0} border="none" cursor="pointer" value={appBg0} onChange={e => setAppBg0(e.target.value)} />
                            <Input size="xs" w="70px" borderRadius="md" value={appBg0} onChange={e => setAppBg0(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Color 2 (Mid Left)</FormLabel>
                          <HStack>
                            <Input type="color" w="36px" h="36px" p={0} border="none" cursor="pointer" value={appBg1} onChange={e => setAppBg1(e.target.value)} />
                            <Input size="xs" w="70px" borderRadius="md" value={appBg1} onChange={e => setAppBg1(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Color 3 (Mid Right)</FormLabel>
                          <HStack>
                            <Input type="color" w="36px" h="36px" p={0} border="none" cursor="pointer" value={appBg2} onChange={e => setAppBg2(e.target.value)} />
                            <Input size="xs" w="70px" borderRadius="md" value={appBg2} onChange={e => setAppBg2(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Color 4 (Bottom Right)</FormLabel>
                          <HStack>
                            <Input type="color" w="36px" h="36px" p={0} border="none" cursor="pointer" value={appBg3} onChange={e => setAppBg3(e.target.value)} />
                            <Input size="xs" w="70px" borderRadius="md" value={appBg3} onChange={e => setAppBg3(e.target.value)} />
                          </HStack>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Table Border Gradient */}
                <GridItem>
                  <Card variant="outline" borderRadius="xl">
                    <CardHeader py={3} px={4} borderBottom="1px" borderColor="gray.100">
                      <Heading size="xs" color="gray.700">Table Border Gradient Glow</Heading>
                    </CardHeader>
                    <CardBody p={4}>
                      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Border Color 1</FormLabel>
                          <HStack spacing={1}>
                            <Input type="color" w="32px" h="32px" p={0} border="none" cursor="pointer" value={borderGrad0} onChange={e => setBorderGrad0(e.target.value)} />
                            <Input size="xs" w="65px" borderRadius="md" value={borderGrad0} onChange={e => setBorderGrad0(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Border Color 2</FormLabel>
                          <HStack spacing={1}>
                            <Input type="color" w="32px" h="32px" p={0} border="none" cursor="pointer" value={borderGrad1} onChange={e => setBorderGrad1(e.target.value)} />
                            <Input size="xs" w="65px" borderRadius="md" value={borderGrad1} onChange={e => setBorderGrad1(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Border Color 3</FormLabel>
                          <HStack spacing={1}>
                            <Input type="color" w="32px" h="32px" p={0} border="none" cursor="pointer" value={borderGrad2} onChange={e => setBorderGrad2(e.target.value)} />
                            <Input size="xs" w="65px" borderRadius="md" value={borderGrad2} onChange={e => setBorderGrad2(e.target.value)} />
                          </HStack>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Table Background Gradient */}
                <GridItem>
                  <Card variant="outline" borderRadius="xl">
                    <CardHeader py={3} px={4} borderBottom="1px" borderColor="gray.100">
                      <Heading size="xs" color="gray.700">Table Wrapper Background Gradient</Heading>
                    </CardHeader>
                    <CardBody p={4}>
                      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Bg Color 1</FormLabel>
                          <HStack spacing={1}>
                            <Input type="color" w="32px" h="32px" p={0} border="none" cursor="pointer" value={tableBgGrad0} onChange={e => setTableBgGrad0(e.target.value)} />
                            <Input size="xs" w="65px" borderRadius="md" value={tableBgGrad0} onChange={e => setTableBgGrad0(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Bg Color 2</FormLabel>
                          <HStack spacing={1}>
                            <Input type="color" w="32px" h="32px" p={0} border="none" cursor="pointer" value={tableBgGrad1} onChange={e => setTableBgGrad1(e.target.value)} />
                            <Input size="xs" w="65px" borderRadius="md" value={tableBgGrad1} onChange={e => setTableBgGrad1(e.target.value)} />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">Bg Color 3</FormLabel>
                          <HStack spacing={1}>
                            <Input type="color" w="32px" h="32px" p={0} border="none" cursor="pointer" value={tableBgGrad2} onChange={e => setTableBgGrad2(e.target.value)} />
                            <Input size="xs" w="65px" borderRadius="md" value={tableBgGrad2} onChange={e => setTableBgGrad2(e.target.value)} />
                          </HStack>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Status Indicator Colors */}
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Card variant="outline" borderRadius="xl">
                    <CardHeader py={3} px={4} borderBottom="1px" borderColor="gray.100">
                      <Heading size="xs" color="gray.700">Status Indicator Colors</Heading>
                    </CardHeader>
                    <CardBody p={4}>
                      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                        {Object.keys(statusColors).map(status => (
                          <FormControl key={status}>
                            <FormLabel fontSize="11px" fontWeight="bold" color="gray.500">{status} Status Color</FormLabel>
                            <HStack>
                              <Input 
                                type="color" 
                                w="36px" 
                                h="36px" 
                                p={0} 
                                border="none" 
                                cursor="pointer" 
                                value={statusColors[status]} 
                                onChange={e => setStatusColors(prev => ({ ...prev, [status]: e.target.value }))} 
                              />
                              <Input 
                                size="xs" 
                                w="70px" 
                                borderRadius="md" 
                                value={statusColors[status]} 
                                onChange={e => setStatusColors(prev => ({ ...prev, [status]: e.target.value }))} 
                              />
                            </HStack>
                          </FormControl>
                        ))}
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>

              <Divider mt={2} />

              <HStack spacing={4} justify="flex-end">
                <Button size="sm" colorScheme="gray" variant="ghost" onClick={handleReset}>
                  Reset to Default
                </Button>
                <Button size="sm" colorScheme="blue" px={6} onClick={saveColors}>
                  Save Theme Settings
                </Button>
              </HStack>
            </VStack>
          </TabPanel>

          {/* JSON Viewer Tab */}
          <TabPanel pt={6}>
            <JsonViewerPage />
          </TabPanel>

          {/* Dev Tab */}
          <TabPanel pt={6}>
            <DeveloperPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
