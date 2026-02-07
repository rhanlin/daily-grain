# UI Actions Contract

## `DailyPlanDateSelector`

### `openCalendar`

- **Trigger**: User taps the date display button in the top bar.
- **Pre-condition**: App is in "Mobile" mode (viewport width < 768px).
- **Outcome**: 
  - `Drawer` component opens (`isOpen` state -> true).
  - Calendar component is rendered inside the Drawer.
  - **Constraint**: Calendar width must not exceed viewport width.

### `selectDate`

- **Trigger**: User taps a specific day in the Calendar grid.
- **Outcome**:
  - `onDateChange` callback is fired with the selected date string.
  - `Drawer` closes automatically (`isOpen` state -> false).

### `closeCalendar`

- **Trigger**: User taps outside the Drawer or drags the handle to close.
- **Outcome**: `Drawer` closes (`isOpen` state -> false).
