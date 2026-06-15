import { useEffect, useState } from "react"
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack, Textarea, useToast } from "@chakra-ui/react"
import { apiUrl } from "../config"

export default function JsonViewerPage() {
  const toast = useToast()
  const [formatted, setFormatted] = useState('')
  const [raw, setRaw] = useState('')

  const load = async () => {
    try {
      const r1 = await fetch(apiUrl('/api/v1/etsy/dashboard-state'))
      const j1 = await r1.json()
      setFormatted(JSON.stringify(j1, null, 2))
    } catch (e) {
      toast({ status: 'error', title: 'Load formatted failed', description: String(e) })
    }
    try {
      const r2 = await fetch(apiUrl('/api/v1/etsy/active'))
      const j2 = await r2.json()
      setRaw(JSON.stringify(j2, null, 2))
    } catch (e) {
      toast({ status: 'error', title: 'Load raw failed', description: String(e) })
    }
  }

  useEffect(() => { load() }, [])

  return (
    <Box mx="auto" px={6} pt={24} pb={10}>
      <HStack mb={4}>
        <Heading size="md">JSON</Heading>
        <Button size="sm" onClick={load}>Reload</Button>
      </HStack>
      <Tabs colorScheme="blue">
        <TabList>
          <Tab>Formatted</Tab>
          <Tab>Raw</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={4}>
            <Textarea value={formatted} minH="60vh" fontFamily="mono" fontSize="sm" readOnly />
          </TabPanel>
          <TabPanel p={0} pt={4}>
            <Textarea value={raw} minH="60vh" fontFamily="mono" fontSize="sm" readOnly />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}


