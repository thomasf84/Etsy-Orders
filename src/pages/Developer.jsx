import { useEffect, useMemo, useRef, useState } from "react"
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Button, Code, HStack, Text, Badge } from "@chakra-ui/react"
import { apiUrl } from "../config"

export default function DeveloperPage() {
  const [health, setHealth] = useState(null)
  const [dash, setDash] = useState(null)
  const [errors, setErrors] = useState([])
  const [sse, setSse] = useState({ connected: false, lastTs: null })

  const fetchAll = async () => {
    const errs = []
    try {
      const h = await fetch(apiUrl('/health'))
      setHealth(await h.json())
    } catch (e) { errs.push(`health: ${e}`) }
    try {
      const d = await fetch(apiUrl('/api/v1/etsy/dashboard-state'))
      setDash(await d.json())
    } catch (e) { errs.push(`dashboard-state: ${e}`) }
    setErrors(errs)
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    const es = new EventSource(apiUrl('/api/v1/etsy/events'))
    es.onopen = () => setSse(v => ({ ...v, connected: true }))
    es.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg?.ts) setSse({ connected: true, lastTs: msg.ts })
      } catch {}
    }
    es.onerror = () => setSse(v => ({ ...v, connected: false }))
    return () => es.close()
  }, [])

  const apiBase = useMemo(() => (import.meta.env.VITE_API_BASE_URL || '') + '', [])

  return (
    <Box mx="auto" px={6} pt={24} pb={10} fontSize="sm">
      <Heading mb={6}>Developer</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>Backend Health</StatLabel>
          <StatNumber>
            {health?.status === 'healthy' ? <Badge colorScheme="green">healthy</Badge> : <Badge colorScheme="red">unknown</Badge>}
          </StatNumber>
          <StatHelpText>{health?.service || '—'}</StatHelpText>
        </Stat>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>Dashboard State</StatLabel>
          <StatNumber>{Array.isArray(dash?.data) ? dash.data.length : 0}</StatNumber>
          <StatHelpText>items saved</StatHelpText>
        </Stat>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>SSE</StatLabel>
          <StatNumber>
            {sse.connected ? <Badge colorScheme="blue">connected</Badge> : <Badge>disconnected</Badge>}
          </StatNumber>
          <StatHelpText>{sse.lastTs ? new Date(sse.lastTs * 1000).toLocaleTimeString() : '—'}</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} bg="white" boxShadow="sm" mb={4}>
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold">Environment</Text>
          <Button size="sm" onClick={fetchAll}>Refresh</Button>
        </HStack>
        <Text>API Base: <Code>{apiBase || '(proxy /api → http://localhost:8000)'}</Code></Text>
      </Box>

      {errors.length > 0 && (
        <Box border="1px" borderColor="red.200" borderRadius="md" p={4} bg="red.50">
          <Text fontWeight="bold" mb={1}>Errors</Text>
          {errors.map((e, i) => (<Text key={i} color="red.700">{e}</Text>))}
        </Box>
      )}
    </Box>
  )
}


