# Research: Fix Mobile Calendar Drawer Overflow

## Issue Analysis
The user reports that the Calendar component overflows the Drawer container on mobile devices.
Current structure in `DailyPlanDateSelector.tsx`:
```tsx
<DrawerContent>
  <div className="p-4 flex justify-center">
    <Calendar className='w-full' ... />
  </div>
</DrawerContent>
```

Current `Calendar` component (`src/components/ui/calendar.tsx`):
- Uses `react-day-picker`.
- Has default styling with `p-3`.
- Might have fixed cell sizes or lack `max-w-full` constraints on the internal table.

### Potential Causes
1. **Fixed Cell Sizes**: If `react-day-picker` or Shadcn defaults use fixed width cells (e.g., `h-9 w-9`), 7 columns + padding might exceed small viewport widths.
   - Example: 40px * 7 = 280px. Plus paddings (32px outer + 24px inner) = 336px.
   - iPhone SE width is 320px or 375px. 336px > 320px.
2. **Padding Accumulation**: The `DrawerContent` wrapper has `p-4`, and `Calendar` has `p-3`. Double padding reduces available space.
3. **Missing Responsive Constraints**: The table inside `Calendar` might not be set to `w-full` or `max-w-full`.

## Solution Strategy

### 1. Optimize Padding
- Reduce padding in `DailyPlanDateSelector.tsx` wrapper from `p-4` to `p-0` or `p-2` on mobile.
- The `DrawerContent` already provides some safe area handling (via Vaul), but we need to ensure the inner content respects it.

### 2. Responsive Calendar Styling
- In `DailyPlanDateSelector.tsx`, pass a class to `Calendar` to ensure it fits:
  ```tsx
  <Calendar
    className="w-full max-w-[calc(100vw-2rem)]" // Ensure it doesn't exceed viewport width minus minimal padding
    ...
  />
  ```
- Or modify `src/components/ui/calendar.tsx` to handle responsive sizing better (e.g., allow cells to shrink).

### 3. Safe Area Handling
- Ensure `DrawerContent` has `pb-safe` or similar if it's at the bottom (currently `direction="top"` in the code seen).
- Wait, `DailyPlanDateSelector.tsx` says `<Drawer direction="top" ...>`. Top drawer usually covers the status bar.
- If it's a top drawer, `pt-safe` is important.

### Decision
- **Action**: Modify `DailyPlanDateSelector.tsx` to remove the extra `p-4` wrapper or make it smaller.
- **Action**: Add `max-w-full` and `overflow-hidden` (or `overflow-x-auto`) to the container to prevent breaking layout.
- **Action**: If necessary, override `Day` size styles in `Calendar` via class names to be fluid/smaller on mobile.

## Alternatives Considered
- **Switch to Native Date Picker**: `<input type="date">`.
  - *Rejected*: Inconsistent UI with Desktop. We want a custom look.
- **Horizontal Scrolling**: Allow calendar to scroll horizontally.
  - *Rejected*: Poor UX for a simple month view. It should fit.

