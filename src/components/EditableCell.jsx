import { React, useEffect, useRef, useState } from 'react'
import { Input } from '@chakra-ui/react'



export const EditableCell = ({getValue, row, column, table}) => {
    const initalValue = getValue()
    const [value, setValue] = useState(initalValue)
    const [multiRow, setMultiRow] = useState([])
    const debounceRef = useRef(null)
    const warnings = row.original?.warnings || [];
    
    //console.log(colors)
    const colors = {
        "Canada": [
            "#FEF2F2", "location", "#DC2626", "#FECACA"
        ],
        "Minnesota": [
            "#F5F3FF", "location", "#7C3AED", "#DDD6FE"
        ],
        "Wisconsin": [
            "#ECFDF5", "location", "#059669", "#A7F3D0"
        ],
        "Michigan": [
            "#EFF6FF", "location", "#2563EB", "#BFDBFE"
        ],
        "Texas": [
            "#FFF7ED", "location", "#C2410C", "#FED7AA"
        ],
        "Ohio": [
            "#F0FDF4", "location", "#16A34A", "#BBF7D0"
        ],
        "Montana": [
            "#FEF3C7", "location", "#B45309", "#FDE68A"
        ],
        "Virginia": [
            "#FCE7F3", "location", "#BE185D", "#F9A8D4"
        ],
        "California": [
            "#FFF1F2", "location", "#BE123C", "#FECDD3"
        ],
        "Grey": [
            "#F9FAFB", "formatted value", "#6B7280", "#E5E7EB"
        ],
        "Gry": [
            "#F9FAFB", "formatted value", "#6B7280", "#E5E7EB"
        ],
        "Clear": [
            "#FFFBEB", "formatted value", "#B45309", "#FDE68A"
        ],
        "Clr": [
            "#FFFBEB", "formatted value", "#B45309", "#FDE68A"
        ],
        "Wal": [
            "#FFF7ED", "formatted value", "#C2410C", "#FED7AA"
        ],
        "Lt": [
            "#FFFBEB", "formatted value", "#92400E", "#FDE68A"
        ],
        "Econ": [
            "#F0FDF4", "formatted value", "#15803D", "#BBF7D0"
        ],
        "Storage": [
            "#F9FAFB", "formatted value", "#6B7280", "#E5E7EB"
        ],
        "Oak": [
            "#FFFBEB", "formatted value", "#92400E", "#FDE68A"
        ],
        "Chry": [
            "#FFF1F2", "formatted value", "#BE123C", "#FECDD3"
        ],
        "Chr": [
            "#FFF1F2", "formatted value", "#BE123C", "#FECDD3"
        ],
        "Custom": [
            "#FFF1F2", "formatted value", "#BE123C", "#FECDD3"
        ],
        "Cherry": [
            "#FFF1F2", "formatted value", "#BE123C", "#FECDD3"
        ],   
        "Mapl": [
            "#FFF7ED", "formatted value", "#C2410C", "#FED7AA"
        ],
        "Peg": [
            "#EFF6FF", "formatted value", "#2563EB", "#BFDBFE"
        ],
        "Pad": [
            "#F0FDF4", "formatted value", "#15803D", "#BBF7D0"
        ],
        "Vnr": [
            "#FCE7F3", "formatted value", "#BE185D", "#F9A8D4"
        ],
        "Pnt": [
            "#F5F3FF", "formatted value", "#7C3AED", "#DDD6FE"
        ],
        "Fig": [
            "#F5F3FF", "formatted value", "#7C3AED", "#DDD6FE"
        ],
        "Fill": [
            "#EFF6FF", "formatted value", "#2563EB", "#BFDBFE"
        ],
        "Pine": [
            "#F0FDF4", "formatted value", "#15803D", "#BBF7D0"
        ],
        "Marb": [
            "#F9FAFB", "formatted value", "#6B7280", "#E5E7EB"
        ],
        "8inch": [
            "#F5F3FF", "formatted value", "#7C3AED", "#DDD6FE"
        ],
    }


    const getColor = (inWord, isStyleCol, isQty) => {
        const word = String(inWord ?? '').toLowerCase();

        if (isQty) {
            const int = parseInt(inWord)
            if (int > 1) return ["#FFF1F2", "#BE123C", "#FECDD3"]
            return ["#EFF6FF", "#2563EB", "#BFDBFE"]
        }
        
        if (isStyleCol) {
            // Use longest-key-match to avoid short keys like "16" matching product names
            const matches = Object.entries(colors)
              .filter(([key, val]) => val[1] === 'formatted value' && word.includes(key.toLowerCase()))
              .sort((a, b) => b[0].length - a[0].length);

            if (matches.length > 0) {
              const [, [color, _, textColor, borderColor]] = matches[0];
              return [color, textColor, borderColor || color];
            }
            // Default gray pill for all unmatched style values
            return ["#F3F4F6", "#6B7280", "#E5E7EB"];
        }

        if (column.id === 'location') {
            // Mockup shows simple text for locations (no colored badges)
            return ['transparent', "#1A202C", 'transparent'];
        }

        return ['transparent', "#1A202C", 'transparent'];
    };


    const onBlur = () => {
        table.options.meta?.updateData(
            row.index,
            column.id,
            value
        )
    }

    // Debounced autosave while typing
    const onChange = (e) => {
        const nextVal = e.target.value
        setValue(nextVal)
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }
        debounceRef.current = setTimeout(() => {
            table.options.meta?.updateData(
                row.index,
                column.id,
                nextVal
            )
        }, 600)
    }

    useEffect(() => {
        setValue(initalValue)
    }, [initalValue])

    // Detect column type via header name (most reliable — no space/ID issues)
    const colHeader = column.columnDef?.header;
    const isStyleCol = colHeader === 'STYLE' || column.id === 'formatted value' || column.columnDef?.accessorKey === 'formatted value';
    const isQty = column.id === 'quantity' || colHeader === 'QTY' || colHeader === 'QUANTITY';
    const isBadge = isStyleCol || isQty;
    const isLeftAlign = column.id === 'location' || column.id === 'name';

    const [bgC, tC, borderC] = getColor(value, isStyleCol, isQty)

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '6px' }}>
      <Input
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          variant="unstyled"
          size="sm"
          textAlign={isLeftAlign ? "left" : "center"}
          borderRadius={isQty ? "full" : isBadge ? "full" : "md"}
          px={isQty ? 2.5 : (isBadge ? 3 : 2)}
          py={isQty ? 0.5 : (isBadge ? 1 : 1.5)}
          h={isQty ? "24px" : (isBadge ? "24px" : "32px")}
          w={isQty ? "36px" : "100%"}
          minW={isQty ? "36px" : 0}
          fontWeight={isBadge ? "bold" : "medium"}
          fontSize="xs"
          color={tC}
          backgroundColor={bgC}
          border={bgC === 'transparent' ? "none" : "1px solid"}
          borderColor={borderC || 'transparent'}
          _hover={(!isBadge && warnings.length === 0) ? { border: "1px solid", borderColor: "gray.200", bg: "white" } : { opacity: 0.85 }}
          _focus={{ bg: "white", border: "1px solid", borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      />
    </div>
  )
}
