#!/bin/bash

# Fix diagnostics page property names

FILE="d:/DBMS LAB/Project/Scholar-Flow/apps/frontend/src/app/dev/diagnostics/page.tsx"

# Replace all occurrences
sed -i '
s/diagnostics\.nextAuthStatus/diagnostics.reduxAuthStatus/g
s/diagnostics\.nextAuthSession/diagnostics.reduxAuthUser/g
s/diagnostics\.resolvedUser/diagnostics.reduxAuthUser/g
s/diagnostics\.sessionAccessToken/diagnostics.reduxAccessToken/g
' "$FILE"

echo "✅ Fixed diagnostics page"
