import { Button, Text } from '@chakra-ui/react'
import React from 'react'

const ChainLinkIcon = (props) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

export const LinkButton = ({ getValue, row }) => {
  const raw = getValue?.()

  const extractOrderId = (value) => {
    if (value == null) return null
    const s = typeof value === 'object' ? (value.order_id ?? value.id ?? '') : String(value)
    const match = String(s).match(/\d+/)
    return match ? match[0] : null
  }

  const orderId = extractOrderId(raw) || extractOrderId(row?.original?.receipt_id) || extractOrderId(row?.original?.order_id)
  const href = orderId ? `https://www.etsy.com/your/orders/sold?ref=seller-platform-mcnav&order_id=${orderId}` : undefined

  if (!href) {
    return <Text color="gray.400" fontWeight="semibold">—</Text>
  }

  return (
    <Button
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="xs"
      bg="white"
      borderColor="gray.200"
      color="gray.500"
      _hover={{ bg: 'gray.50', color: 'blue.500', borderColor: 'blue.300' }}
      h="28px"
      w="28px"
      p={0}
      borderRadius="md"
      title={`Open order ${orderId}`}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <ChainLinkIcon />
    </Button>
  )
}
