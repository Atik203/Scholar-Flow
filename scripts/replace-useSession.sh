#!/bin/bash

# Script to replace NextAuth useSession with Redux useAuth across all TSX files

cd "$(dirname "$0")/../apps/frontend/src"

# Find all TSX files that import from next-auth/react (excluding already updated files)
FILES=$(find . -name "*.tsx" -type f -exec grep -l 'from "next-auth/react"' {} \;)

for file in $FILES; do
    echo "Processing: $file"
    
    # Skip if already uses useAuth from Redux
    if grep -q '@/redux/auth/useAuth' "$file"; then
        echo "  ✓ Already updated, skipping"
        continue
    fi
    
    # Replace import statement for useSession only
    sed -i 's/import { useSession } from "next-auth\/react";/import { useAuth } from "@\/redux\/auth\/useAuth";/g' "$file"
    
    # Replace const { data: session } = useSession();
    sed -i 's/const { data: session } = useSession();/const { session } = useAuth();/g' "$file"
    
    # Replace const { data: session, status } = useSession();
    sed -i 's/const { data: session, status } = useSession();/const { session, status } = useAuth();/g' "$file"
    
    echo "  ✓ Updated"
done

echo "✅ Replacement complete!"
