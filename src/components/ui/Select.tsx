import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
    // Add any custom props here
}

export function Select(props: SelectProps) {
    return <SelectPrimitive.Root {...props} />
}

export default Select
