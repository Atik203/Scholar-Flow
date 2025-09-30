# Release Notes

## v1.1.4

Author: @Atik203

### Highlights – v1.1.4

- **Real-Time System Monitoring**: Production-grade dashboard with 10-second auto-refresh for CPU, memory, storage, and database metrics
- **Accurate CPU Calculation**: Intelligent CPU usage using actual idle/total times from Node.js os module with load average fallback
- **Smart Storage Tracking**: Dynamic storage estimation (10x current usage, min 100GB) based on actual database file usage
- **Health Status Dashboard**: Comprehensive health cards (Database/Server/Storage/CPU) with automatic status classification
- **Performance Visualization**: Auto-colored progress bars that change based on metric values (green→blue→yellow→red)
- **System Information Panel**: Real-time platform, Node.js version, database version, memory, and uptime display
- **Optimized Performance**: React.lazy code splitting, Suspense boundaries, 10s HTTP caching, and skeleton loaders

### Technical Summary – v1.1.4

#### Backend Implementation

- Added `ISystemMetrics` interface with health, performance, systemInfo, and database properties
- Implemented `getSystemMetrics()` service method using Node.js os module (cpus, totalmem, freemem, loadavg)
- Created intelligent CPU calculation: idle/total times across cores with load average fallback
- Dynamic storage estimation: `Math.max(usedStorage * 10, 100GB)` for realistic percentages
- Added GET `/api/admin/system/metrics` route with auth, admin-only, and rate limiting
- Implemented 10-second Cache-Control headers for real-time monitoring

#### Frontend Implementation

- Created `useGetSystemMetricsQuery` RTK Query hook with 10-second polling interval
- Built three reusable components: HealthCard (5 status types), PerformanceBar (auto-color), SystemInfoRow
- Implemented React.lazy loading with Suspense boundaries for optimal bundle size
- Added comprehensive optional chaining (metrics?.performance.cpu.usage?.toFixed(1))
- Refactored system page from 238 lines of hardcoded data to dynamic real-time metrics
- Auto-color logic for performance bars: green (<50%), blue (50-70%), yellow (70-85%), red (>85%)

#### Files Modified

- Backend: `admin.interface.ts`, `admin.service.ts`, `admin.controller.ts`, `admin.routes.ts`
- Frontend: `adminApi.ts`, `HealthCard.tsx`, `PerformanceBar.tsx`, `SystemInfoRow.tsx`, `index.ts`, `page.tsx`
- Documentation: `CHANGELOG.md`, `Roadmap.md`, `Release.md`

#### Testing & Quality

- ✅ Zero TypeScript errors across all modified files
- ✅ CPU metrics verified with actual system load testing
- ✅ Storage calculation tested with database file uploads
- ✅ 10-second polling verified with browser DevTools
- ✅ Skeleton loaders tested during initial fetch
- ✅ Admin-only access security verified

---
