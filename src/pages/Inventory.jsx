import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Button, Input, HStack, Table, Thead, Tr, Th, Tbody, Td, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Select, NumberInput, NumberInputField, useDisclosure, Badge } from "@chakra-ui/react"
import { useEffect, useState, useRef } from 'react'
import { apiUrl } from '../config'
import { SIZES } from '../data'

export default function InventoryPage() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const editDisc = useDisclosure()
  const [editRow, setEditRow] = useState(null)
  const [draft, setDraft] = useState({ sku: '', name: '', wood: '', size: '', on_hand: 0, reserved: 0, reorder_point: 0 })
  const timersRef = useRef({})
  const rowsRef = useRef(rows)
  const [demandMap, setDemandMap] = useState({})

  const load = async () => {
    try {
      const r = await fetch(apiUrl('/api/v1/orders/inventory'))
      const j = await r.json()
      setRows(j.results || [])
      // Load active-dashboard stats and map to wood+size demand
      const rs = await fetch(apiUrl('/api/v1/etsy/active-dashboard'))
      const js = await rs.json()
      const stats = js.stats || {}
      const dm = {}
      Object.entries(stats).forEach(([wood, sizes]) => {
        Object.entries(sizes || {}).forEach(([size, count]) => {
          dm[`${wood}::${String(size)}`] = Number(count) || 0
        })
      })
      setDemandMap(dm)
    } catch (e) {
      toast({ status: 'error', title: 'Load failed', description: String(e) })
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { rowsRef.current = rows }, [rows])

  const visible = rows
    .filter(r => !filter || `${r.sku} ${r.name}`.toLowerCase().includes(filter.toLowerCase()))
    .sort((a,b)=> {
      const w = String(a.wood).localeCompare(String(b.wood))
      if (w !== 0) return w
      const s = String(a.size).localeCompare(String(b.size))
      if (s !== 0) return s
      return String(a.sku).localeCompare(String(b.sku))
    })
  const groupedByWood = visible.reduce((acc, r) => {
    (acc[r.wood] ||= []).push(r)
    return acc
  }, {})
  // Aggregate available by wood+size (sum across SKUs)
  const availableByKey = rows.reduce((m, r) => {
    const key = `${r.wood}::${String(r.size)}`
    const avail = Math.max(0, (r.on_hand || 0) - (r.reserved || 0))
    m[key] = (m[key] || 0) + avail
    return m
  }, {})

  const getOrdered = (wood, size) => demandMap[`${wood}::${String(size)}`] || 0

  const adjustOnHand = (row, delta) => {
    const sku = row.sku
    const nextOn = Math.max(0, (row.on_hand || 0) + delta)
    // Optimistic update immediately
    setRows(rs => rs.map(r => r.sku === sku ? { ...r, on_hand: nextOn } : r))
    // Debounced save per SKU to allow rapid clicks
    if (timersRef.current[sku]) clearTimeout(timersRef.current[sku])
    timersRef.current[sku] = setTimeout(async () => {
      try {
        const current = rowsRef.current.find(r => r.sku === sku)
        if (!current) return
        await fetch(apiUrl('/api/v1/orders/inventory'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current)
        })
        // Refresh needs after save since availability changed
        // Refresh demand after save since availability might change display logic
        const rs = await fetch(apiUrl('/api/v1/etsy/active-dashboard'))
        const js = await rs.json()
        const stats = js.stats || {}
        const dm = {}
        Object.entries(stats).forEach(([wood, sizes]) => {
          Object.entries(sizes || {}).forEach(([size, count]) => {
            dm[`${wood}::${String(size)}`] = Number(count) || 0
          })
        })
        setDemandMap(dm)
      } catch (e) {
        toast({ status: 'error', title: 'Update failed', description: String(e) })
      } finally {
        // Clear loading marker so buttons stay interactive
        delete timersRef.current[sku]
      }
    }, 250)
  }
  const totals = visible.reduce((a,r)=>{
    a.skus += 1; a.on += r.on_hand||0; a.res += r.reserved||0; a.avl += (r.on_hand||0)-(r.reserved||0); return a
  }, {skus:0,on:0,res:0,avl:0})
  const orderedTotal = Object.values(demandMap || {}).reduce((a,v)=>a+(Number(v)||0),0)
  const neededTotal = rows.reduce((sum, r)=>{
    const ordered = (demandMap[`${r.wood}::${String(r.size)}`] || 0)
    const available = Math.max(0, (r.on_hand||0) - (r.reserved||0))
    return sum + Math.max(ordered - available, 0)
  }, 0)
  return (
    <Box mx="auto" px={{ base: 3, md: 6 }} pt={24} pb={10} fontSize="sm">
      <Heading mb={6}>Inventory</Heading>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>Total SKUs</StatLabel>
          <StatNumber>{totals.skus}</StatNumber>
        </Stat>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>Needed</StatLabel>
          <StatNumber>{neededTotal}</StatNumber>
        </Stat>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>Available</StatLabel>
          <StatNumber>{totals.avl}</StatNumber>
        </Stat>
        <Stat p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
          <StatLabel>Total Ordered</StatLabel>
          <StatNumber>{orderedTotal}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} bg="white" boxShadow="sm">
        <HStack justify="space-between" mb={3} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
          <Text fontWeight="bold">SKUs</Text>
          <HStack flexWrap={{ base: 'wrap', md: 'nowrap' }}>
            <Input size="sm" placeholder="Search SKU or name" w={{ base: '100%', md: '260px' }} value={filter} onChange={e=>setFilter(e.target.value)} />
            <Button size="sm" bg="gray.100" color="gray.800" border='1px' borderColor='gray.300' _hover={{ bg: 'gray.200' }} onClick={load}>Refresh</Button>
            <Button size="sm" colorScheme="green" onClick={()=>{ setDraft({ sku:'', name:'', wood:'', size:'', on_hand:0, reserved:0, reorder_point:0 }); onOpen(); }}>New SKU</Button>
          </HStack>
        </HStack>
        <Box overflowX="auto">
        <Table size='sm' minW={{ base: '700px', md: 'auto' }}>
          <Thead>
            <Tr>
              <Th>SKU</Th>
              <Th>Name</Th>
              <Th>Wood</Th>
              <Th>Size</Th>
              <Th isNumeric>On hand</Th>
              <Th isNumeric>Reserved</Th>
              <Th isNumeric>Available</Th>
              <Th isNumeric>Ordered</Th>
              <Th isNumeric>Needed</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(groupedByWood).sort(([a],[b])=>String(a).localeCompare(String(b))).map(([wood, rows]) => (
              <>
                <Tr key={`group-${wood}`} bg='gray.50'>
                  <Td colSpan={10} fontWeight='bold'>{wood}</Td>
                </Tr>
                {(() => {
                  const shownKeys = new Set()
                  return rows.map(r => {
                    const key = `${r.wood}::${String(r.size)}`
                    const first = !shownKeys.has(key)
                    if (first) shownKeys.add(key)
                    const ordered = getOrdered(r.wood, r.size)
                    const groupAvailable = availableByKey[key] || 0
                    const needGroup = Math.max(ordered - groupAvailable, 0)
                    return (
              <Tr key={r.sku}>
                <Td>{r.sku}</Td>
                <Td>{r.name}</Td>
                <Td>{r.wood}</Td>
                <Td>{r.size}</Td>
                <Td isNumeric>{r.on_hand}</Td>
                <Td isNumeric>{r.reserved}</Td>
                <Td isNumeric>{(r.on_hand||0)-(r.reserved||0)}</Td>
                <Td isNumeric>
                  {first && ordered > 0 ? <Badge bg='blue.100' color='blue.800' border='1px' borderColor='blue.200'>{ordered}</Badge> : <Text as='span' color='gray.500'>—</Text>}
                </Td>
                <Td isNumeric>
                  {first && needGroup > 0 ? <Badge bg='red.100' color='red.800' border='1px' borderColor='red.200'>{needGroup}</Badge> : <Text as='span' color='gray.500'>—</Text>}
                </Td>
                <Td isNumeric>
                  <HStack justify="flex-end" spacing={2}>
                    <Button size='xs' bg='red.100' color='red.800' border='1px' borderColor='red.200' _hover={{ bg: 'red.200' }} onClick={()=>adjustOnHand(r, -1)}>-</Button>
                    <Button size='xs' bg='green.100' color='green.800' border='1px' borderColor='green.200' _hover={{ bg: 'green.200' }} onClick={()=>adjustOnHand(r, +1)}>+</Button>
                    <Button size='xs' bg='white' color='gray.800' border='1px' borderColor='gray.300' _hover={{ bg: 'gray.50' }} onClick={()=>{ setEditRow(r); editDisc.onOpen() }}>Edit</Button>
                  </HStack>
                </Td>
              </Tr>
                    )
                  })
                })()}
              </>
            ))}
          </Tbody>
        </Table>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg='white' color='gray.800' border='1px' borderColor='gray.300'>
          <ModalHeader>New Inventory (by Wood + Size)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <FormControl mb={3}>
                <FormLabel>SKU (optional)</FormLabel>
                <Input
                  value={draft.sku}
                  onChange={e=>setDraft(d=>({...d, sku:e.target.value}))}
                  placeholder="Auto-generated from Wood+Size if empty"
                  variant='outline'
                  border='1px'
                  borderColor='gray.300'
                  _hover={{ borderColor: 'gray.400' }}
                  _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Name (optional)</FormLabel>
                <Input
                  value={draft.name}
                  onChange={e=>setDraft(d=>({...d, name:e.target.value}))}
                  placeholder="Auto-generated from Wood + Size if empty"
                  variant='outline'
                  border='1px'
                  borderColor='gray.300'
                  _hover={{ borderColor: 'gray.400' }}
                  _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                />
              </FormControl>
            <HStack>
              <FormControl mb={3} isRequired>
                <FormLabel>Wood</FormLabel>
                <Input
                  value={draft.wood}
                  onChange={e=>setDraft(d=>({...d, wood:e.target.value}))}
                  placeholder="Cherry / Econ / Bag ..."
                  variant='outline'
                  border='1px'
                  borderColor='gray.300'
                  _hover={{ borderColor: 'gray.400' }}
                  _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                />
              </FormControl>
              <FormControl mb={3} isRequired>
                <FormLabel>Size</FormLabel>
                <Select
                  value={draft.size}
                  onChange={e=>setDraft(d=>({...d, size:e.target.value}))}
                  placeholder="Select size"
                  variant='outline'
                  border='1px'
                  borderColor='gray.300'
                  _hover={{ borderColor: 'gray.400' }}
                  _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
                >
                  {SIZES.map(s=> <option key={s.id} value={s.name}>{s.name}</option>)}
                </Select>
              </FormControl>
            </HStack>
            <HStack>
              <FormControl mb={3}>
                <FormLabel>On hand</FormLabel>
                <NumberInput min={0} value={draft.on_hand} onChange={(_,v)=>setDraft(d=>({...d, on_hand: Number.isFinite(v)?v:0}))}>
                  <NumberInputField border='1px' borderColor='gray.300' _hover={{ borderColor: 'gray.400' }} _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }} />
                </NumberInput>
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Reserved</FormLabel>
                <NumberInput min={0} value={draft.reserved} onChange={(_,v)=>setDraft(d=>({...d, reserved: Number.isFinite(v)?v:0}))}>
                  <NumberInputField border='1px' borderColor='gray.300' _hover={{ borderColor: 'gray.400' }} _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }} />
                </NumberInput>
              </FormControl>
              {/* Reorder point removed */}
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} bg='white' color='gray.800' border='1px' borderColor='gray.300' _hover={{ bg: 'gray.50' }} onClick={onClose}>Cancel</Button>
            <Button bg='white' color='green.800' border='1px' borderColor='green.200' _hover={{ bg: 'green.50' }} onClick={async()=>{
              try {
                if (!draft.wood || !draft.size) { toast({ status:'warning', title:'Missing fields', description:'Wood and Size are required.'}); return }
                const payload = { ...draft }
                if (!payload.name && payload.wood && payload.size) {
                  payload.name = `${payload.wood} ${payload.size}`
                }
                const r = await fetch(apiUrl('/api/v1/orders/inventory'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
                if (!r.ok) throw new Error(await r.text())
                onClose(); await load(); toast({ status:'success', title:'Item saved' })
              } catch (e) { toast({ status:'error', title:'Save failed', description:String(e) }) }
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={editDisc.isOpen} onClose={editDisc.onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg='white' color='gray.800' border='1px' borderColor='gray.300'>
          <ModalHeader>Edit Inventory</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editRow && (
              <>
                <Text mb={2} fontWeight='bold'>{editRow.name} ({editRow.sku})</Text>
                <HStack>
                  <FormControl mb={3}>
                    <FormLabel>On hand</FormLabel>
                    <NumberInput min={0} value={editRow.on_hand} onChange={(_,v)=>setEditRow(r=>({...r, on_hand: Number.isFinite(v)?v:0}))}>
                      <NumberInputField border='1px' borderColor='gray.300' _hover={{ borderColor: 'gray.400' }} _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }} />
                    </NumberInput>
                  </FormControl>
                  <FormControl mb={3}>
                    <FormLabel>Reserved</FormLabel>
                    <NumberInput min={0} value={editRow.reserved} onChange={(_,v)=>setEditRow(r=>({...r, reserved: Number.isFinite(v)?v:0}))}>
                      <NumberInputField border='1px' borderColor='gray.300' _hover={{ borderColor: 'gray.400' }} _focusVisible={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }} />
                    </NumberInput>
                  </FormControl>
                </HStack>
              </>
            )}
            </ModalBody>
          <ModalFooter>
            <Button mr={3} bg='white' color='gray.800' border='1px' borderColor='gray.300' _hover={{ bg: 'gray.50' }} onClick={editDisc.onClose}>Cancel</Button>
            <Button mr={3} bg='white' color='red.800' border='1px' borderColor='red.200' _hover={{ bg: 'red.50' }} onClick={async()=>{ if(!editRow) return; if(!confirm('Delete this item?')) return; await fetch(apiUrl(`/api/v1/orders/inventory/${editRow.sku}`), { method:'DELETE' }); editDisc.onClose(); await load(); }}>Delete</Button>
            <Button bg='white' color='green.800' border='1px' borderColor='green.200' _hover={{ bg: 'green.50' }} onClick={async()=>{
              try {
                const payload = { ...editRow }
                const r = await fetch(apiUrl('/api/v1/orders/inventory'), { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
                if (!r.ok) throw new Error(await r.text())
                editDisc.onClose(); await load(); toast({ status:'success', title:'Saved' })
              } catch (e) { toast({ status:'error', title:'Save failed', description:String(e) }) }
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}


