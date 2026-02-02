# Requirements Checklist: Personal Time Allocation App

**Purpose**: "Unit Tests for Requirements" - Validate spec completeness and clarity before coding.
**Context**: Local-First PWA, Agile/Eisenhower, Manual Sort.
**Audience**: Developer (Self-Check).

## 1. Functional Requirement Completeness

- [ ] CHK001 Are create/update/delete requirements defined for **Categories**? [Completeness, Spec §US1]
- [ ] CHK002 Is the default **Eisenhower Attribute (Q4)** behavior explicitly stated for new tasks? [Completeness, Spec §FR-003]
- [ ] CHK003 Are requirements for **Sub-task creation** within a parent task scope defined? [Completeness, Spec §US2]
- [ ] CHK004 Is the **Auto-Completion** trigger logic (all subtasks done → parent done) clearly specified? [Clarity, Spec §FR-011]
- [ ] CHK005 Are requirements defined for the **Rollover** mechanism (moving unfinished tasks to next day)? [Completeness, Spec §FR-013]
- [ ] CHK006 Is the **Hybrid Drag** constraint (drag subtask IF exists, else parent) explicitly defined? [Clarity, Spec §FR-007]

## 2. UI/UX Interaction Clarity

- [ ] CHK007 Is the **Manual Sorting** behavior (reordering within Daily Plan) distinguishable from time-based scheduling? [Clarity, Spec §FR-007]
- [ ] CHK008 Are visual requirements for the **Read-Only Eisenhower Matrix** (colors/quadrants) defined? [Clarity, Spec §FR-004]
- [ ] CHK009 Is the **Toggle** behavior between "Manual Order" and "Eisenhower Order" described? [Clarity, Spec §FR-008]
- [ ] CHK010 Is the **Dimmed** visual state for completed items clearly described? [Clarity, Spec §FR-014]
- [ ] CHK011 Are requirements defined for how **Archived** items are hidden/shown? [Completeness, Spec §FR-014]

## 3. Data & Sync Logic

- [ ] CHK012 Is the **Last-Write-Wins** conflict resolution strategy defined for specific fields? [Clarity, Spec §FR-010]
- [ ] CHK013 Are requirements defined for **Offline** data access (IndexedDB)? [Completeness, Spec §FR-009]
- [ ] CHK014 Is the data relationship between **DailyPlanItem** and **Task/SubTask** defined? [Traceability, Plan Data Model]
- [ ] CHK015 Are requirements specified for **Google Sign-In** integration? [Completeness, Spec §FR-001]

## 4. Edge Cases & Constraints

- [ ] CHK016 Is behavior defined when dragging a task *with* subtasks to the Daily Plan (should it block or expand)? [Edge Case, Spec §FR-007]
- [ ] CHK017 Are requirements defined for when a Rollover task conflicts with existing pinned items? [Edge Case, Spec §FR-013]
- [ ] CHK018 Is the behavior defined if a user un-checks a subtask after the parent was auto-completed? [Edge Case, Gap]
- [ ] CHK019 Are "No Network" state indicators required in the UI? [UX, Gap]

## 5. Constitution & Standards

- [ ] CHK020 Are all UI labels and text required to be in **Traditional Chinese**? [Constitution V]
- [ ] CHK021 Are **Unit Tests** required for complex logic (Auto-complete, Rollover)? [Constitution I, Tasks T038-T041]
- [ ] CHK022 Are visual diagrams (Mermaid/UML) required for the Sync Protocol? [Constitution VI]
