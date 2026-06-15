import { useEffect, useMemo, useState } from "react"
import {
  Box,
  Heading,
  HStack,
  VStack,
  Button,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spacer,
  useToast,
  Flex,
  Text,
} from "@chakra-ui/react"
import TaskTable from "../components/TaskTable"
import { apiUrl } from "../config"

function sumBySizes(obj) {
  if (!obj) return 0
  return Object.values(obj).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)
}

const WoodYouImagineLogo = (props) => (
  <Flex
    w="36px"
    h="36px"
    bgGradient="linear(to-br, #F8FAFC 0%, #E2E8F0 45%, #CBD5E1 75%, #94A3B8 100%)"
    borderRadius="full"
    align="center"
    justify="center"
    shadow="md"
    border="1.5px solid"
    borderColor="#E2E8F0"
    position="relative"
    _after={{
      content: '""',
      position: 'absolute',
      top: '1px',
      left: '1px',
      right: '1px',
      bottom: '1px',
      borderRadius: 'full',
      bgGradient: 'linear(to-br, rgba(255,255,255,0.6), rgba(255,255,255,0))',
      pointerEvents: 'none'
    }}
    {...props}
  >
    <Text
      fontSize="lg"
      fontWeight="950"
      color="#334155"
      fontStyle="italic"
      w="100%"
      textAlign="center"
      style={{
        fontFamily: 'Outfit, sans-serif',
        lineHeight: 1,
        textShadow: '1px 1px 1px rgba(255,255,255,0.8), -0.5px -0.5px 1px rgba(0,0,0,0.3)',
        position: 'relative',
        left: '-2px',
        top: '-0.5px'
      }}
    >
      W
    </Text>
  </Flex>
);

const formatLastSyncTime = (dateObj) => {
  if (!dateObj) return '—';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
};

export default function DashboardPage() {
  const toast = useToast()
  const [stats, setStats] = useState({})
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [sseConnected, setSseConnected] = useState(false)
  const [heartbeatOk, setHeartbeatOk] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [showCards, setShowCards] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      // Load saved data for table view
      const savedRes = await fetch(apiUrl('/api/v1/etsy/dashboard-state'))
      const saved = await savedRes.json()
      // Always fetch live-computed stats to keep cards in sync
      const liveRes = await fetch(apiUrl('/api/v1/etsy/active-dashboard'))
      const live = await liveRes.json()
      const useSaved = saved && Array.isArray(saved.data) && saved.data.length > 0
      setStats(live.stats || {})
      setCount((useSaved ? saved.count : live.count) || (useSaved && saved.results ? saved.results.length : 0))
    } catch (e) {
      toast({ status: 'error', title: 'Refresh failed', description: String(e) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  useEffect(() => {
    const es = new EventSource(apiUrl('/api/v1/etsy/events'))
    es.onopen = () => setSseConnected(true)
    es.onmessage = async (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg?.type === 'dashboard-updated') {
          setLastUpdate(new Date(msg.ts * 1000))
          refresh()
        }
      } catch { }
    }
    es.onerror = () => setSseConnected(false)
    return () => es.close()
  }, [])

  // Heartbeat fallback to avoid false "offline" when SSE reconnects
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await fetch(apiUrl('/health'))
        setHeartbeatOk(r.ok)
      } catch {
        setHeartbeatOk(false)
      }
    }, 10000)
    return () => clearInterval(id)
  }, [])

  // Compact header only. Wood/category KPI cards moved to Inventory

  const syncFromEtsy = async () => {
    setSyncing(true)
    try {
      const res = await fetch(apiUrl('/api/v1/etsy/sync-all-from-etsy'))
      if (!res.ok) throw new Error(`Sync failed: ${res.status}`)
      const j = await res.json().catch(() => null)
      const processed = j?.processed ?? j?.total_fetched
      const created = j?.created ?? 0
      const removed = j?.removed ?? 0
      const kept = j?.kept_unchanged ?? 0

      let description = `${processed} orders processed`
      if (created > 0) description += `, ${created} new`
      if (removed > 0) description += `, ${removed} removed`
      if (kept > 0) description += `, ${kept} unchanged`

      toast({ status: 'success', title: 'Sync complete', description })
      await refresh()
    } catch (e) {
      toast({ status: 'error', title: 'Sync failed', description: String(e) })
    } finally {
      setSyncing(false)
    }
  }

  const exportCsv = async () => {
    try {
      const r = await fetch(apiUrl('/api/v1/etsy/dashboard-state'))
      const j = await r.json()
      const rows = (j.data || []).map((e) => ({
        date: e?.date?.formatted,
        receipt_id: e?.receipt_id,
        location: e?.location,
        status: typeof e?.status === 'object' ? e?.status?.name : e?.status,
        name: e?.name,
        quantity: e?.quantity,
        style: e?.["formatted value"],
        size: typeof e?.size === 'object' ? e?.size?.name : e?.size,
        is_gift: e?.is_gift ? 'Yes' : 'No',
        message_from_buyer: e?.['message from buyer']
      }))
      const headers = Object.keys(rows[0] || { example: '' })
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'etsy-dashboard.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      toast({ status: 'error', title: 'Export failed', description: String(e) })
    }
  }

  const SyncIcon = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }} {...props}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );

  const RefreshIcon = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }} {...props}>
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );

  const ExportIcon = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );

  return (
    <Box w="100%" fontSize="sm">
      <HStack mb={6} justify="space-between" align="center" w="100%" flexWrap={{ base: "wrap", md: "nowrap" }} gap={4}>
        <HStack spacing={3}>
          <WoodYouImagineLogo />
          <Heading size="lg" color="gray.850" fontSize="24px" fontWeight="900" fontFamily="Outfit, sans-serif">WoodYouImagineThis</Heading>
          <Badge
            variant="subtle"
            bg="rgba(16, 185, 129, 0.12)"
            color="#047857"
            border="1px solid"
            borderColor="rgba(16, 185, 129, 0.25)"
            px={2.5}
            py={0.5}
            borderRadius="full"
            fontSize="10px"
            fontWeight="bold"
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            h="20px"
            fontFamily="Outfit, sans-serif"
          >
            <Box as="span" w="5.5px" h="5.5px" borderRadius="full" bg="green.500" />
            LIVE
          </Badge>
        </HStack>

        <VStack align="flex-end" spacing={1.5} flexShrink={0}>
          <HStack spacing={3}>
            <Button
              size="sm"
              bg="white"
              color="gray.700"
              border="none"
              borderRadius="xl"
              px={4}
              py={4}
              _hover={{ bg: 'gray.50', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              onClick={syncFromEtsy}
              isLoading={syncing}
              leftIcon={<SyncIcon />}
              fontWeight="extrabold"
              fontSize="xs"
              boxShadow="rgba(0, 0, 0, 0.04) 0px 4px 12px"
            >
              Sync
            </Button>
            <Button
              size="sm"
              bg="white"
              color="gray.700"
              border="none"
              borderRadius="xl"
              px={4}
              py={4}
              _hover={{ bg: 'gray.50', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              onClick={refresh}
              isLoading={loading}
              leftIcon={<RefreshIcon />}
              fontWeight="extrabold"
              fontSize="xs"
              boxShadow="rgba(0, 0, 0, 0.04) 0px 4px 12px"
            >
              Refresh
            </Button>
            <Button
              size="sm"
              bg="white"
              color="gray.700"
              border="none"
              borderRadius="xl"
              px={4}
              py={4}
              _hover={{ bg: 'gray.50', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              onClick={exportCsv}
              leftIcon={<ExportIcon />}
              fontWeight="extrabold"
              fontSize="xs"
              boxShadow="rgba(0, 0, 0, 0.04) 0px 4px 12px"
            >
              Export
            </Button>
          </HStack>
          <Text fontSize="11px" color="gray.400" fontWeight="bold" fontFamily="Inter, sans-serif" letterSpacing="0.01em">
            Last Data Sync: {formatLastSyncTime(lastUpdate || new Date())}
          </Text>
        </VStack>
      </HStack>

      {showCards && (
        <Box mb={4}>
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
            {(function () {
              const order = [
                'Bag', 'Cherry', 'Clear Pine', 'Econ', 'Grey Oak', 'Grey Pine', 'LtOak', 'Maple', 'Walnut', 'Peg Board', 'Custom Board'
              ]
              const keys = Object.keys(stats || {})
              const sorted = order.filter(k => keys.includes(k)).concat(keys.filter(k => !order.includes(k)))
              return sorted.map((wood) => {
                const sizes = stats?.[wood] || {}
                const total = Object.values(sizes).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)
                return (
                  <Stat key={wood} p={4} border='1px' borderColor='gray.200' borderRadius='md' bg='white' boxShadow='sm'>
                    <StatLabel>{wood}</StatLabel>
                    <StatNumber>{total}</StatNumber>
                    <StatHelpText>
                      {(() => {
                        const parts = Object.entries(sizes)
                          .filter(([s, v]) => ['8', '15', '16', '18', '24'].includes(s) && typeof v === 'number' && v > 0)
                          .map(([s, v]) => `${s}: ${v}`)
                        return parts.length ? parts.join('  ·  ') : '—'
                      })()}
                    </StatHelpText>
                  </Stat>
                )
              })
            })()}
          </SimpleGrid>
        </Box>
      )}



      <Box>
        <TaskTable onShowStats={() => setShowCards(v => !v)} />
      </Box>
    </Box>
  )
}


