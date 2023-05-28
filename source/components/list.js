import React, { useState } from 'react';
import {render, Box, Text, useInput, useApp, useFocus} from 'ink';

// jk to move up and down
// space to select
export default function List ({items=[], actions=[]}) {
    const {exit} = useApp();
    const [focusIndex, setFocusIndex] = useState(0)
    const [selection, setSelection] = useState([])
    const {isFocused} = useFocus();
    
    useInput((input, key) => {
        if (isFocused) {
            if (input === 'q') {
                exit()
            } else if (input === 'j') {
                const nextFocusIndex = (focusIndex + 1) > items.length ? 0 : focusIndex + 1
                setFocusIndex(nextFocusIndex)
            } else if (input === 'k') {
                const nextFocusIndex = (focusIndex - 1) < 0 ? items.length -1 : focusIndex - 1
                setFocusIndex(nextFocusIndex)
            } else if (input === ' ') {
                const isSelected = selection.includes(focusIndex)
                setSelection(isSelected ? selection.filter(sel => sel !== focusIndex) : [...selection, focusIndex])
            }
            actions.some(action => {
                if (action.key === input) {
                    action.handler(selection)
                    if (action.clearSelectionAfterAction) {
                        setSelection([])
                    }
                }
            })

        }
	});
    return (
        <Box flexDirection="column" borderStyle="single" width="100%" borderColor={isFocused ? 'blue' : ''}>
            {items.map((item, index) => (
                <Box key={item.id} flexDirection="row" columnGap={3}>
                    <Text color="green">{selection.includes(index) ? "✓" : " " }</Text>
                    {
                        item.content.map(col => (
                            <Text key={col} backgroundColor={focusIndex === index ? "grey" : ""}>{col}</Text>
                        ))
                    }
                </Box>
            ))}
            <Box columnGap={3} display={selection.length > 0 ? 'flex' : 'none'} borderStyle="classic" borderLeft={false} borderRight={false} borderBottom={false}>
                {
                    actions.map((action, index) => (
                        <Text key={index}>{action.key}: {action.description}</Text>
                    ))
                }
            </Box>
        </Box>
    )
};
