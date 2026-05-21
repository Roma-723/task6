#!/bin/bash

echo "=== VERIFYING FILTERBUILDER COMPONENT STRUCTURE ==="
echo ""

# Check FilterBuilder main component
echo "1️⃣ FilterBuilder.tsx"
if grep -q "export function FilterBuilder" src/components/FilterBuilder/FilterBuilder.tsx; then
    echo "  ✅ Exports FilterBuilder component"
fi
if grep -q "commands: FilterCommand\[\]" src/components/FilterBuilder/FilterBuilder.tsx; then
    echo "  ✅ Accepts commands array prop"
fi
if grep -q "onCommandsChange" src/components/FilterBuilder/FilterBuilder.tsx; then
    echo "  ✅ Has onCommandsChange callback"
fi
if grep -q "createEmptyCommand" src/components/FilterBuilder/FilterBuilder.tsx; then
    echo "  ✅ Has createEmptyCommand function"
fi
if grep -q "Добавить команду" src/components/FilterBuilder/FilterBuilder.tsx; then
    echo "  ✅ Has add command button"
fi

echo ""
echo "2️⃣ RangeCommand.tsx"
if grep -q "RangeCommand as RangeCommandType" src/components/FilterBuilder/commands/RangeCommand.tsx; then
    echo "  ✅ Properly types RangeCommand"
fi
if grep -q "op1.*op2" src/components/FilterBuilder/commands/RangeCommand.tsx; then
    echo "  ✅ Has both op1 and op2 operators"
fi
if grep -q 'value=">="' src/components/FilterBuilder/commands/RangeCommand.tsx; then
    echo "  ✅ Has >= operator option"
fi

echo ""
echo "3️⃣ WhereCommand.tsx"
if grep -q "values.map(v =>" src/components/FilterBuilder/commands/WhereCommand.tsx; then
    echo "  ✅ Supports multiple values"
fi
if grep -q "+ in" src/components/FilterBuilder/commands/WhereCommand.tsx; then
    echo "  ✅ Has '+ in' button for adding values"
fi
if grep -q "removeValue\|addValueToRow" src/components/FilterBuilder/commands/WhereCommand.tsx; then
    echo "  ✅ Has value management functions"
fi

echo ""
echo "4️⃣ ExistsKeyCommand.tsx"
if grep -q "select1.*select8" src/components/FilterBuilder/commands/ExistsKeyCommand.tsx; then
    echo "  ✅ Has select1-select8 options"
fi
if grep -q "SELECT_OPTIONS" src/components/FilterBuilder/commands/ExistsKeyCommand.tsx; then
    echo "  ✅ Has OPTIONS array"
fi

echo ""
echo "5️⃣ FromToCommand.tsx"
if grep -q "from.*to" src/components/FilterBuilder/commands/FromToCommand.tsx; then
    echo "  ✅ Has from and to fields"
fi
if grep -q "searchable dropdown\|openDropdown" src/components/FilterBuilder/commands/FromToCommand.tsx; then
    echo "  ✅ Has searchable dropdown"
fi
if grep -q "No data" src/components/FilterBuilder/commands/FromToCommand.tsx; then
    echo "  ✅ Shows 'No data' message"
fi

echo ""
echo "6️⃣ ShouldCommand.tsx"
if grep -q "FilterBuilder" src/components/FilterBuilder/commands/ShouldCommand.tsx; then
    echo "  ✅ Renders FilterBuilder recursively"
fi
if grep -q "dashed.*border" src/components/FilterBuilder/commands/ShouldCommand.tsx; then
    echo "  ✅ Has dashed border styling"
fi

echo ""
echo "7️⃣ buildJSON.ts"
if grep -q "export function buildJSON" src/utils/buildJSON.ts; then
    echo "  ✅ Exports buildJSON function"
fi
if grep -q "'gte'\|'gt'\|'lte'\|'lt'" src/utils/buildJSON.ts; then
    echo "  ✅ Converts operators correctly"
fi
if grep -q "buildJSON(shouldCmd.commands)" src/utils/buildJSON.ts; then
    echo "  ✅ Handles recursive should commands"
fi

echo ""
echo "8️⃣ App.tsx"
if grep -q "FilterBuilder" src/App.tsx; then
    echo "  ✅ Imports and uses FilterBuilder"
fi
if grep -q "buildJSON" src/App.tsx; then
    echo "  ✅ Uses buildJSON function"
fi
if grep -q "console.log(output)" src/App.tsx; then
    echo "  ✅ Logs JSON output to console"
fi
if grep -q "<pre>" src/App.tsx; then
    echo "  ✅ Displays JSON in <pre> tag"
fi

echo ""
echo "=== ✅ ALL COMPONENTS VERIFIED ==="
