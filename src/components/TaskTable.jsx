import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Box, Button, ButtonGroup, Flex, CardBody, Center, HStack, VStack, Icon, Input, Text, Textarea, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, Portal, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import {  flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, getGroupedRowModel, getExpandedRowModel, getPaginationRowModel} from '@tanstack/react-table'
import CustomOrderModal from "./CustomOrderModal";
import { SIZES } from '../data'
import { useAppTheme } from "../theme/ThemeContext";
import { apiUrl } from '../config'
import { EditableCell } from "./EditableCell";
import StatusCell from "./StatusCell";
import { Filters } from "./Filters";
import SortIcon from './icons/SortIcon'
import { LinkButton } from "./LinkButton";
import SizeCell from "./SizeCell";

const formatDateString = (dateStr) => {
  if (!dateStr) return '—';
  const str = String(dateStr).trim();
  
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    try {
      const parts = str.split('T')[0].split('-');
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    } catch (e) {
      return str;
    }
  }

  const words = str.split(/\s+/);
  if (words.length >= 3) {
    const dayName = words[0].substring(0, 3);
    const month = words[1].substring(0, 3);
    const dayNum = words[2].replace(/\D/g, '');
    return `${dayName}, ${month} ${dayNum}`;
  }
  
  return str;
}

const GiftIcon = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
)

const GiftCell = ({ getValue, row, column, table }) => {
  const isGift = !!getValue();
  const { updateData } = table.options.meta;
  return (
    <Button
      size="xs"
      variant="outline"
      bg={isGift ? "purple.50" : "white"}
      borderColor={isGift ? "purple.200" : "gray.200"}
      color={isGift ? "purple.600" : "gray.400"}
      onClick={() => updateData(row.index, column.id, !isGift)}
      _hover={{ bg: isGift ? "purple.100" : "gray.50" }}
      h="28px"
      w="28px"
      p={0}
      borderRadius="md"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <GiftIcon />
    </Button>
  );
};

const ChevronIcon = ({ isOpen, ...props }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const mainColumns = [
  {
    accessorKey: 'date',
    header: 'DATE',
    size: 130,
    filterFn: 'includesString',
    cell: (props) => { 
      const manualOverride = props.row.original?.manual_warning_override;
      const baseWarnings = props.row.original?.warnings || [];
      let warnings = baseWarnings;
      if (manualOverride === false) warnings = [];
      else if (manualOverride === true && baseWarnings.length === 0) warnings = ["Manually Flagged"];
      
      const address = props.row.original?.shipping_address;
      const isCurrentlyFlagged = warnings.length > 0;
      
      const toggleFlag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newVal = isCurrentlyFlagged ? false : true;
        props.table.options.meta.updateData(props.row.index, 'manual_warning_override', newVal);
      };

      return(
        <Flex align="center" justify="center" gap={1}>
          {props.row.original?.is_custom_order && (
            <span style={{ fontSize: '14px', filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' }} title="Custom Order">⭐️</span>
          )}
          {isCurrentlyFlagged && (
            <Popover placement="top" trigger="click" closeOnBlur={true}>
              <PopoverTrigger>
                <span style={{ cursor: 'pointer', fontSize: '14px', filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))' }}>⚠️</span>
              </PopoverTrigger>
              <Portal>
                <PopoverContent 
                  bg="rgba(15, 23, 42, 0.95)" 
                  color="white" 
                  borderColor="rgba(251, 191, 36, 0.2)"
                  boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  _focus={{ boxShadow: 'none' }}
                  w="auto"
                  maxW="300px"
                  zIndex="popover"
                >
                  <PopoverArrow bg="rgba(15, 23, 42, 0.95)" />
                  <PopoverBody px={3} py={2.5}>
                    <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                      ⚠️ Address Warning
                    </div>
                    {address && (
                      <div style={{ marginBottom: '8px', fontSize: '11px', color: '#CBD5E1', borderLeft: '2px solid #475569', paddingLeft: '6px' }}>
                        {[
                          address.name, 
                          address.first_line, 
                          address.second_line, 
                          `${address.city || ''}${address.city && address.state ? ', ' : ''}${address.state || ''} ${address.zip || ''}`.trim()
                        ].filter(Boolean).map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    )}
                    {warnings.map((w, idx) => (
                      <div key={idx} style={{ fontSize: '11px', color: '#F9FAFB', marginBottom: '2px' }}>
                        • {w}
                      </div>
                    ))}
                    <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                      <Button 
                        size="xs" 
                        variant="solid" 
                        bg="rgba(255,255,255,0.1)"
                        _hover={{ bg: "rgba(255,255,255,0.2)" }}
                        color="white" 
                        h="22px" 
                        fontSize="10px"
                        onClick={toggleFlag}
                      >
                        Unflag Address
                      </Button>
                    </div>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          )}
          <Text 
            fontWeight={isCurrentlyFlagged ? "bold" : "semibold"} 
            color={isCurrentlyFlagged ? "red.600" : "gray.700"} 
            fontSize="xs"
          >
            {formatDateString(props.row.original.date?.formatted)}
          </Text>
        </Flex>
      ) 
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'ship_week',
    header: 'SHIP WEEK',
    size: 100,
    enableGrouping: true,
  },
  {
    accessorKey: 'receipt_id',
    header: 'LINK',
    cell: LinkButton,
    enableSorting: false,
    size: 60,
  },
  {
    accessorKey: 'location',
    header: 'LOCATION',
    cell: EditableCell,
    size: 100,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: StatusCell,
    enableSorting: false,
    enableColumnFilter: true,
    size: 130,
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true
      const status = row.getValue(columnId);
      return filterStatuses.includes(status?.id)
    }
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: EditableCell,
    size: 130,
  },
  {
    accessorKey: 'quantity',
    header: 'QTY',
    cell: EditableCell,
    size: 45,
  },
  {
    accessorKey: 'formatted value',
    header: 'STYLE',
    cell: EditableCell,
    size: 200,
  },
  {
    accessorKey: 'size',
    header: 'SIZE',
    cell: SizeCell,
    size: 70,
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true
      const status = row.getValue(columnId);
      return filterStatuses.includes(status?.id)
    }
  },
  {
    id: 'message_toggle',
    header: 'MSG',
    cell: ({ row, table }) => {
      const { expandedMessages, setExpandedMessages } = table.options.meta;
      const hasMessage = row.original?.['message from buyer'] || row.original?.notes;
      const toggle = () => setExpandedMessages(prev => ({ ...prev, [row.id]: !prev[row.id] }));
      return (
        <Button
          size="xs"
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          bg={hasMessage ? 'orange.50' : 'transparent'}
          borderColor={hasMessage ? 'orange.200' : 'transparent'}
          color={hasMessage ? 'orange.600' : 'gray.400'}
          _hover={{ bg: hasMessage ? 'orange.100' : 'gray.50' }}
          h="28px"
          w="28px"
          p={0}
          borderRadius="md"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </Button>
      );
    },
    size: 50,
  },
  {
    accessorKey: 'is_gift',
    header: 'GIFT',
    cell: GiftCell,
    size: 70,
  }
]

const checkboxColumn = {
  id: 'select',
  header: ({ table }) => (
    <Flex align="center" justify="center" w="100%">
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }}
      />
    </Flex>
  ),
  cell: ({ row }) => (
    <Flex align="center" justify="center" w="100%">
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer' }}
      />
    </Flex>
  ),
  size: 40,
};

let groupingCol = {
  id: "grouping",
  accessor: "grouping",
  enableGrouping: false,
  header: "📅",
  size: 50,
  cell: () => "",
};

export const TableContext = createContext();

const TaskTable = ({ onShowStats, endpointUrl = '/api/v1/etsy/dashboard-state', onFilteredRowsChange, isHistory = false }) => {
  const { isOpen: isEditModalOpen, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const [editingOrder, setEditingOrder] = useState(null);
  const { theme: appTheme } = useAppTheme();
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [stats, setStats] = useState({ total_items: 0, total_locations: 0, this_week_count: 0 })
  const [columns] = useState([groupingCol, ...mainColumns])
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [columnVisibility, setColumnVisibility] = useState({ 'ship_week': false })

  useEffect(() => {
    const baseVisibility = { 'ship_week': false }
    if (isMobile) {
      baseVisibility['message from buyer'] = false
      baseVisibility['notes'] = false
      baseVisibility['is_gift'] = false
      baseVisibility['formatted value'] = false
      baseVisibility['location'] = false
    }
    setColumnVisibility(baseVisibility)
  }, [isMobile])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(apiUrl(endpointUrl))
        let result = await response.json()
        if ((!result || !Array.isArray(result.data) || result.data.length === 0) && endpointUrl === '/api/v1/etsy/dashboard-state') {
          response = await fetch(apiUrl('/api/v1/etsy/active-dashboard'))
          result = await response.json()
        }
        //const response2 = await fetch('https://web-production-9ae4d.up.railway.app//getcolors');
        console.log(result)
        const testData = (result.data || result.results || []).map(r => ({
          ...r
        }));
        setData(testData);
        setCount(result.count ?? (result.results ? result.results.length : 0))
        setStats(result.stats || {})
        //setColors(response2.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchData();
    //console.log(data)
  }, [])

  const myClientId = useRef(Math.random().toString(36).substring(2) + Date.now().toString(36)).current;

  // SSE subscription to auto-refresh when another client saves
  useEffect(() => {
    const es = new EventSource(apiUrl('/api/v1/etsy/events'))
    es.onmessage = async (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        // Skip refreshing if this client initiated the save to prevent race conditions and transient UI reverts
        if (msg?.client_id === myClientId) {
          return;
        }
        if (msg?.type === 'dashboard-updated' && endpointUrl === '/api/v1/etsy/dashboard-state') {
          const response = await fetch(apiUrl('/api/v1/etsy/dashboard-state'))
          const result = await response.json()
          const testData = (result.data || []).map(r => ({
            ...r
          }));
          setData(testData)
          setCount(result.count || 0)
          setStats(result.stats || {})
        }
      } catch {}
    }
    es.onerror = () => {
      // Let the browser attempt reconnection; no-op
    }
    return () => es.close()
  }, [myClientId])

  // Save immediately for discrete fields (status, size, gift) to prevent delay and race conditions
  const saveImmediately = async (payload) => {
    if (endpointUrl !== '/api/v1/etsy/dashboard-state') return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    try {
      await fetch(apiUrl(`/api/v1/etsy/dashboard-state?client_id=${myClientId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    } catch (e) {
      console.error('Save failed', e)
    }
  }

  const autosave = useMemo(() => {
    return (payload) => {
      if (endpointUrl !== '/api/v1/etsy/dashboard-state') return;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(async () => {
        try {
          await fetch(apiUrl(`/api/v1/etsy/dashboard-state?client_id=${myClientId}`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        } catch (e) {
          console.error('Autosave failed', e)
        }
      }, 600)
    }
  }, [myClientId])

  const [columnFilters, setColumnFilters] = useState([])
  const [grouping, setGrouping] = useState(["ship_week"]);
  const [rowSelection, setRowSelection] = useState({})
  const [expanded, setExpanded] = useState({})
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      grouping,
      expanded,
      columnVisibility,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    enableGrouping: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    groupedColumnMode: false,
    autoResetExpanded: false,
    autoResetAll: false,
    
    columnResizeMode: "onChange",
    meta: {
      setColors: (data) => setColors(data),
      expandedMessages,
      setExpandedMessages,
      editOrder: (order) => {
        setEditingOrder(order);
        onOpenEditModal();
      },
      deleteData: (rowIndex) => setData(prev => {
        const next = prev.filter((_, index) => index !== rowIndex);
        saveImmediately({ data: next, count: count - 1, stats });
        return next;
      }),
      updateData: (rowIndex, columnId, value) => setData(prev => {
        const normalize = (colId, val) => {
          if (colId === 'size') {
            if (!val) return null
            if (typeof val === 'object' && val.name) return val
            const match = String(val).trim()
            const found = (SIZES || []).find(s => s.name === match)
            return found || val
          }
          return val
        }
        const nextVal = normalize(columnId, value)
        const next = prev.map((row, index) => index === rowIndex ? { ...prev[rowIndex], [columnId]: nextVal } : row)
        
        const isDiscrete = ['status', 'size', 'is_gift', 'manual_warning_override'].includes(columnId)
        if (isDiscrete) {
          saveImmediately({ data: next, count, stats })
        } else {
          autosave({ data: next, count, stats })
        }
        return next
      })
    }
  })

  // Keep groups expanded for active dashboard, but collapse for history
  useEffect(() => {
    try {
      if (!isHistory) {
        table.toggleAllRowsExpanded(true)
      } else {
        table.toggleAllRowsExpanded(false)
      }
    } catch {}
  }, [table, data, isHistory])
  
  useEffect(() => {
    table.setPageSize(isHistory ? 30 : 10000);
  }, [table, isHistory]);
  
  useEffect(() => {
    if (onFilteredRowsChange) {
      onFilteredRowsChange(table.getFilteredRowModel().rows);
    }
  }, [table.getFilteredRowModel().rows, onFilteredRowsChange]);
 console.log(table.getRowModel())
  return (
    <Box w="100%" fontSize="sm">
      <Filters isHistory={isHistory} columnFilters={columnFilters} setColumnFilters={setColumnFilters} rows={table.getRowModel().rowsById} setData={setData} count={count} stats={stats} onShowStats={onShowStats}/>
      
      {/* Enclosing Table Container Box with gradient border and outer mint/violet glow */}
      <Box
        w="100%"
        backdropFilter="blur(25px)"
        borderRadius="3xl"
        border="1.5px solid transparent"
        style={{
          background: `linear-gradient(135deg, ${appTheme.tableBg[0]} 0%, ${appTheme.tableBg[1]} 50%, ${appTheme.tableBg[2]} 100%) padding-box, linear-gradient(135deg, ${appTheme.borderGradient[0]} 0%, ${appTheme.borderGradient[1]} 50%, ${appTheme.borderGradient[2]} 100%) border-box`,
        }}
        boxShadow="rgba(20, 184, 166, 0.1) -8px 8px 32px 0px, rgba(139, 92, 246, 0.08) 8px -8px 32px 0px"
        p={5}
      >
        {/* Table Header Row (Single separate translucent bar at the top of the container) */}
        <Box 
          w="100%" 
          bg="rgba(255, 255, 255, 0.4)" 
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.5)"
          borderRadius="2xl"
          mb={5}
          boxShadow="sm"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <Flex className="tr" key={headerGroup.id} w="100%" py={2.5}>
              {headerGroup.headers.map((header) => {
                if (header.column.id === 'grouping') return null;
                
                const isLeft = ['date', 'receipt_id', 'location', 'status', 'name'].includes(header.column.id);
                return (
                  <Box 
                    className="th" 
                    w={`${(header.getSize() / table.getTotalSize()) * 100}%`} 
                    key={header.id}
                    display="flex"
                    alignItems="center"
                    justifyContent={isLeft ? "flex-start" : "center"}
                    pl={isLeft ? 4 : 2}
                    pr={isLeft ? 2 : 2}
                    py={1}
                  >
                    <Text
                      as="span"
                      fontSize="11px"
                      fontWeight="800"
                      color="gray.500"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      fontFamily="Outfit, sans-serif"
                    >
                      {header.column.columnDef.header}
                    </Text>
                    {header.column.getCanSort() && (
                      <Icon 
                        as={SortIcon}
                        mx={1.5}
                        fontSize={11}
                        onClick={header.column.getToggleSortingHandler()}
                        color="gray.400"
                      />
                    )}
                    {{
                      "asc": " ▲",
                      "desc": " ▼"
                    }[header.column.getIsSorted()]}
                  </Box>
                );
              })}
            </Flex>
          ))}
        </Box>

        {/* Week Cards (One card container per week group with solid white background) */}
        <VStack spacing={5} align="stretch" w="100%">
          {table.getRowModel().rows.filter(row => row.getIsGrouped()).map((groupRow) => {
            return (
              <Box 
                key={groupRow.id}
                bg="white"
                border="1px solid"
                borderColor="rgba(226, 232, 240, 0.85)"
                borderRadius="2xl"
                boxShadow="rgba(0, 0, 0, 0.02) 0px 4px 12px"
                overflow="hidden"
              >
                {/* Group Header Banner */}
                <Flex
                  w="100%"
                  bg="linear-gradient(90deg, rgba(233, 213, 255, 0.15) 0%, rgba(243, 244, 246, 0.1) 100%)"
                  px={5}
                  py={3.5}
                  borderBottom="1px solid"
                  borderColor="rgba(226, 232, 240, 0.55)"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  onClick={groupRow.getToggleExpandedHandler()}
                  transition="all 0.2s"
                  _hover={{ bg: "linear-gradient(90deg, rgba(233, 213, 255, 0.25) 0%, rgba(243, 244, 246, 0.2) 100%)" }}
                >
                  <HStack spacing={3}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <Text fontWeight="800" fontSize="sm" color="purple.950" fontFamily="Outfit, sans-serif">
                      {groupRow.groupingValue}
                    </Text>
                    <Badge 
                      bg="rgba(124, 58, 237, 0.12)" 
                      color="purple.800" 
                      px={2.5} 
                      py={0.5} 
                      borderRadius="full" 
                      fontSize="10px" 
                      fontWeight="800"
                      fontFamily="Inter, sans-serif"
                    >
                      {groupRow.subRows.length} {groupRow.subRows.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </HStack>
                  <Box color="purple.600" pr={1}>
                    <ChevronIcon isOpen={groupRow.getIsExpanded()} />
                  </Box>
                </Flex>

                {/* Group Leaf Rows */}
                {groupRow.getIsExpanded() && (
                  <Box w="100%">
                    {groupRow.subRows.map((row) => {
                      const rowStatus = row.original?.status?.name || '';
                      const statusRowStyles = appTheme.statusColors;
                      const rowStyle = statusRowStyles[rowStatus] || { bg: "rgba(255, 255, 255, 0.55)", hoverBg: "rgba(255, 255, 255, 0.65)" };
                      
                      return (
                        <Box 
                          key={row.id}
                          w="100%"
                          borderBottom="1px solid"
                          borderColor="rgba(226, 232, 240, 0.45)"
                          bg={rowStyle.bg}
                          _hover={{ bg: rowStyle.hoverBg }}
                          transition="background-color 0.15s"
                          _last={{ borderBottom: 'none' }}
                          onDoubleClick={() => setExpandedMessages(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
                          title="Double-click to view buyer messages & notes"
                        >
                          <Flex className="tr" w="100%" py={2.5}>
                            {row.getVisibleCells().map((cell) => {
                              if (cell.column.id === 'grouping') return null;
                              const isLeft = ['date', 'receipt_id', 'location', 'status', 'name'].includes(cell.column.id);
                              return (
                                <Box 
                                  className="td"
                                  w={`${(cell.column.getSize() / table.getTotalSize()) * 100}%`}
                                  key={cell.id}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent={isLeft ? "flex-start" : "center"}
                                  pl={isLeft ? 4 : 2}
                                  pr={isLeft ? 2 : 2}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Box>
                              );
                            })}
                          </Flex>

                          {/* Expanded Message Section */}
                          {expandedMessages?.[row.id] && (
                            <Box w="calc(100% - 32px)" bg="rgba(254, 243, 199, 0.35)" border="1px solid" borderColor="amber.200" px={4} py={3} mx={4} my={2} borderRadius="xl">
                              <Box mb={2}>
                                <Text fontSize="xs" fontWeight="bold" color="amber.900" mb={1} fontFamily="Outfit, sans-serif">Shipping Address:</Text>
                                <Box bg="white" borderColor="gray.200" borderWidth="1px" borderRadius="md" p={2} fontSize="xs" color="gray.700">
                                  {row.original?.shipping_address ? (
                                    <>
                                      {[
                                        row.original.shipping_address.name, 
                                        row.original.shipping_address.first_line, 
                                        row.original.shipping_address.second_line, 
                                        `${row.original.shipping_address.city || ''}${row.original.shipping_address.city && row.original.shipping_address.state ? ', ' : ''}${row.original.shipping_address.state || ''} ${row.original.shipping_address.zip || ''}`.trim()
                                      ].filter(Boolean).map((line, i) => (
                                        <div key={i}>{line}</div>
                                      ))}
                                      
                                      <Box mt={2} pt={2} borderTop="1px solid" borderColor="gray.100">
                                        <Button 
                                          size="xs" 
                                          variant={row.original?.manual_warning_override === false ? "outline" : "solid"} 
                                          colorScheme={row.original?.manual_warning_override === false ? "gray" : "amber"} 
                                          h="22px" 
                                          fontSize="10px"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const manualOverride = row.original?.manual_warning_override;
                                            const baseWarnings = row.original?.warnings || [];
                                            const isCurrentlyFlagged = (manualOverride === true) || (manualOverride !== false && baseWarnings.length > 0);
                                            table.options.meta.updateData(row.index, 'manual_warning_override', !isCurrentlyFlagged);
                                          }}
                                        >
                                          {((row.original?.manual_warning_override === true) || (row.original?.manual_warning_override !== false && (row.original?.warnings || []).length > 0)) ? "Unflag Address" : "Flag Address"}
                                        </Button>
                                      </Box>
                                    </>
                                  ) : (
                                    <Text color="gray.400">No address provided</Text>
                                  )}
                                </Box>
                              </Box>
                              <Box mb={2}>
                                <Text fontSize="xs" fontWeight="bold" color="amber.900" mb={1} fontFamily="Outfit, sans-serif">Buyer Message:</Text>
                                <Textarea
                                  size="sm"
                                  defaultValue={row.original?.['message from buyer'] ?? ''}
                                  onBlur={e => {
                                    const newVal = e.target.value;
                                    const { updateData } = table.options.meta;
                                    updateData(row.index, 'message from buyer', newVal);
                                  }}
                                  placeholder="Add buyer message..."
                                  resize="vertical"
                                  rows={2}
                                  bg="white"
                                  borderColor="gray.200"
                                  fontSize="xs"
                                  color="gray.700"
                                />
                              </Box>
                              <Box>
                                <Text fontSize="xs" fontWeight="bold" color="amber.900" mb={1} fontFamily="Outfit, sans-serif">Notes:</Text>
                                <Textarea
                                  size="sm"
                                  defaultValue={row.original?.notes ?? ''}
                                  onBlur={e => {
                                    const newVal = e.target.value;
                                    const { updateData } = table.options.meta;
                                    updateData(row.index, 'notes', newVal);
                                  }}
                                  placeholder="Add notes..."
                                  resize="vertical"
                                  rows={2}
                                  bg="white"
                                  borderColor="gray.200"
                                  fontSize="xs"
                                  color="gray.700"
                                />
                              </Box>
                              {row.original?.is_custom_order && (
                                <Box mt={3} pt={3} borderTop="1px solid" borderColor="amber.300">
                                  <HStack spacing={3}>
                                    <Button 
                                      size="sm" 
                                      colorScheme="blue" 
                                      variant="solid" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        table.options.meta.editOrder(row.original);
                                      }}
                                    >
                                      Edit Custom Order
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      colorScheme="red" 
                                      variant="solid" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        table.options.meta.deleteData(row.index);
                                      }}
                                    >
                                      Delete Custom Order
                                    </Button>
                                  </HStack>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* Pagination Controls */}
      {isHistory && (
        <Flex justify="space-between" align="center" mt={4} px={2}>
          <Text fontSize="xs" color="gray.500" fontWeight="bold">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </Text>
          <HStack spacing={2}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => table.previousPage()} 
              isDisabled={!table.getCanPreviousPage()}
              borderRadius="md"
              px={4}
            >
              Previous
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => table.nextPage()} 
              isDisabled={!table.getCanNextPage()}
              borderRadius="md"
              px={4}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      )}
      
      {/* Custom Order Modal */}
      <CustomOrderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          onCloseEditModal();
          setEditingOrder(null);
        }}
        initialData={editingOrder}
        onSave={(data) => {
          if (editingOrder) {
            // Update existing
            const index = table.options.data.findIndex(r => r.id === editingOrder.id || r.receipt_id === editingOrder.receipt_id);
            if (index !== -1) {
              const updated = [...table.options.data];
              updated[index] = { ...updated[index], ...data };
              saveImmediately({ data: updated, count: count, stats: stats });
            }
          }
          onCloseEditModal();
          setEditingOrder(null);
        }}
        isEdit={true}
      />
    </Box>
  );
};

export default TaskTable;
