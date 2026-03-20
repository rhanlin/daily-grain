# Research: Daily Plan Quick Add (UX Optimized)

## Decision: Differential Entry Points (Mobile Speed Dial vs Desktop Sidebar)

### 1. Mobile UI: Staggered Speed Dial
**Decision**: Replace the dual FAB conflict with a single **Speed Dial** button. 
- **Design**: Staggered Labels with Backdrop Blur (using `framer-motion`).
- **Options**: 
    1. "從待辦挑選" (Open Backlog Drawer)
    2. "快捷新增" (Open Quick Add Drawer)
**Rationale**: Resolves the "two overlapping plus buttons" issue. Uses modern staggered animation to provide visual delight ("絲滑") while clearly identifying options with text labels.

### 2. Desktop UI: Sidebar Integrated Input
**Decision**: In desktop view, place a permanent, minimalist title input at the **top of the Backlog sidebar**.
**Rationale**: Desktop users prioritize speed and have ample horizontal space. A persistent input avoids the need for clicks/modals for the most common action (adding a quick subtask).

### 3. "Default Task" Logic (FR-005)
**Decision**: Automatic Category/Task creation fallback.
**Rationale**: Prevents friction for new users.

**Visual Logic Flow**:
```mermaid
graph TD
    A[開始快捷新增] --> B{是否存在任何主任務?}
    B -- 是 --> C[預設選中最近使用的任務]
    B -- 否 --> D[建立預設分類: "一般"]
    D --> E[建立預設任務: "日常任務"]
    E --> F[選中新建的任務]
    C --> G[輸入標題並確認]
    F --> G
    G --> H[建立 SubTask]
    H --> I[加入 DailyPlanItems 排程]
    I --> J[結束]
```

### 4. Animation Strategy (Framer Motion)
**Decision**: Use `staggerChildren` for Speed Dial options and `AnimatePresence` for the Backdrop Blur.
**Rationale**: Ensures the transition feels high-end and premium, matching the "絲滑" requirement from previous optimizations.
