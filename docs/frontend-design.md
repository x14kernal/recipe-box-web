# Frontend Design Decisions

## 1. Visual Direction

- **Style:** Warm, minimal, friendly
- **Theme:** Light only
- **Shape:** Rounded, soft edges
- **Feel:** Comfortable, calm, approachable
- **Priority:** Recipe content should be the visual focus
- **Avoid:** Visual clutter, excessive borders, excessive shadows, cramped layouts

---

## 2. Typography

Use a simple, readable sans-serif system.

### Font

- **Primary:** `Inter`
- **Fallback:** `ui-sans-serif, system-ui, sans-serif`

### Hierarchy

| Use            | Tailwind                |
| -------------- | ----------------------- |
| Page title     | `text-3xl` → `text-4xl` |
| Section title  | `text-xl` → `text-2xl`  |
| Card title     | `text-lg`               |
| Body           | `text-base`             |
| Secondary text | `text-sm`               |
| Small metadata | `text-xs`               |

### Rules

- Use `font-semibold` for important headings.
- Use `font-medium` for labels and secondary headings.
- Keep body text at comfortable reading sizes.
- Avoid using many font weights.

---

## 3. Spacing & Layout Rules

### Mobile-first

Design for mobile first, then expand.

### Tailwind breakpoints

| Breakpoint |     Width |
| ---------- | --------: |
| Base       | `< 640px` |
| `sm`       |   `640px` |
| `md`       |   `768px` |
| `lg`       |  `1024px` |
| `xl`       |  `1280px` |
| `2xl`      |  `1536px` |

### Spacing

Use Tailwind's spacing scale.

Preferred common spacing:

- `gap-2` — tight
- `gap-4` — normal
- `gap-6` — comfortable
- `gap-8` — sections
- `gap-12` — major sections

Avoid filling the screen with content. Give components room to breathe.

### Layout

- Use a centered `max-width` container.
- Use responsive grids for recipe cards.
- Keep forms readable rather than full-width on large screens.
- Keep recipe content at a comfortable reading width.
- Prefer vertical rhythm over dense layouts.

---

## 4. Colors

Use Tailwind's default color palette.

### Main palette

- **Primary:** `orange`
- **Neutral:** `stone`
- **Background:** `stone`
- **Text:** `stone`
- **Success:** `green`
- **Warning:** `amber`
- **Error:** `red`

### Rules

- Use `stone` for most neutral UI.
- Use `orange` for primary actions and important accents.
- Keep backgrounds mostly neutral and light.
- Avoid introducing custom colors initially.
- Maintain sufficient text/background contrast.

---

## 5. Core UI Patterns

Use **shadcn/ui + Tailwind CSS**.

### Base components

Start with:

- Button
- Input
- Textarea
- Label
- Card
- Badge
- Dialog
- Dropdown Menu
- Select
- Combobox
- Form
- Alert
- Skeleton

### Application components

Build recipe-specific components on top of shadcn:

- RecipeCard
- RecipeGrid
- RecipeHeader
- IngredientList
- IngredientEditor
- StepList
- StepEditor
- ImageEditor
- TagSelector
- RecipeForm

### States

Important components should support:

- Loading
- Empty
- Error
- Success
- Disabled

### Interaction

- Primary actions should be visually obvious.
- Destructive actions should require appropriate confirmation.
- Interactive elements should have clear hover/focus/disabled states.
- Mobile interactions must remain comfortable for touch.

---

## 6. Documented Decisions

| Decision             | Choice                                              |
| -------------------- | --------------------------------------------------- |
| UI library           | shadcn/ui                                           |
| CSS                  | Tailwind CSS                                        |
| Theme                | Light only                                          |
| Visual style         | Warm, minimal, friendly                             |
| Shape                | Rounded                                             |
| Font                 | Inter                                               |
| Responsive strategy  | Mobile-first                                        |
| Breakpoints          | Tailwind defaults                                   |
| Primary color        | Orange                                              |
| Neutral palette      | Stone                                               |
| Spacing              | Tailwind spacing scale                              |
| Custom design system | Not initially                                       |
| UI approach          | shadcn primitives + application-specific components |

## Design Principle

Build only what the application needs.

Do not create a large design system upfront.

Establish consistent patterns through the core recipe experience, then reuse and expand those patterns as new features are built.
