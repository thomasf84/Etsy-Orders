import { Box, Input, InputGroup, InputLeftElement, Icon, HStack, Button } from '@chakra-ui/react'
import React from 'react'
import SearchIcon from './icons/SearchIcon'
import { FilterPopover } from './FilterPopover';
// import Save from './Save';
import { FilterSize } from './FilterSize'
// import { StatsPopover } from './StatsPopover'

export const Filters = ({ isHistory, columnFilters, setColumnFilters, rows, setData, count, stats, onShowStats }) => {
    const taskName = columnFilters.find((f) => f.id === 'formatted value')?.value || "";
    const dateFilter = columnFilters.find((f) => f.id === 'date')?.value || "";

    const onFilterChange = (id, value) => setColumnFilters(
        prev => prev.filter(f => f.id !== id).concat({id, value})
    )

  return (
    <HStack mb={6} spacing={3} flexWrap={{ base: 'wrap', md: 'nowrap' }} align={{ base: 'stretch', md: 'center' }}>
        <InputGroup
          size='sm'
          maxW={{ base: '100%', md: '16rem' }}
          bg='rgba(255, 255, 255, 0.55)'
          borderRadius="full"
          border='1px solid'
          borderColor='rgba(226, 232, 240, 0.8)'
          boxShadow="sm"
          _hover={{ borderColor: 'gray.300' }}
          transition="all 0.2s"
        >
            <InputLeftElement pointerEvents="none" h="32px">
                <Icon as={SearchIcon} color='gray.400' />
            </InputLeftElement>
            <Input
                type="text"
                variant="unstyled"
                pl={8}
                h="32px"
                placeholder='Search styles...'
                _placeholder={{ color: 'gray.400' }}
                color="gray.800"
                value={taskName}
                onChange={(e) => onFilterChange('formatted value', e.target.value)}
            />
        </InputGroup>
        
        {isHistory && (
          <InputGroup
            size='sm'
            maxW={{ base: '100%', md: '12rem' }}
            bg='rgba(255, 255, 255, 0.55)'
            borderRadius="full"
            border='1px solid'
            borderColor='rgba(226, 232, 240, 0.8)'
            boxShadow="sm"
            _hover={{ borderColor: 'gray.300' }}
            transition="all 0.2s"
          >
              <Input
                  type="text"
                  variant="unstyled"
                  px={4}
                  h="32px"
                  placeholder='Filter by date...'
                  _placeholder={{ color: 'gray.400' }}
                  color="gray.800"
                  value={dateFilter}
                  onChange={(e) => onFilterChange('date', e.target.value)}
              />
          </InputGroup>
        )}

        {!isHistory && <FilterPopover columnFilters={columnFilters} setColumnFilters={setColumnFilters}/>}
        {!isHistory && <FilterSize columnFilters={columnFilters} setColumnFilters={setColumnFilters}/>}
        
        <Button 
          size='sm' 
          bgGradient="linear(to-b, #FFFFFF 0%, #F1F5F9 45%, #E2E8F0 75%, #CBD5E1 100%)"
          color='gray.700' 
          border='1px solid' 
          borderColor='rgba(139, 92, 246, 0.4)' 
          borderRadius="full"
          px={4}
          h="32px"
          _hover={{ 
            bgGradient: "linear(to-b, #FFFFFF 0%, #E2E8F0 40%, #CBD5E1 70%, #94A3B8 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.08), 0 0 12px rgba(139, 92, 246, 0.35)"
          }} 
          onClick={onShowStats}
          fontWeight="extrabold"
          fontSize="xs"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.05), 0 0 8px rgba(139, 92, 246, 0.15)"
        >
          {count} Items
        </Button>
    </HStack>
  )
}
