# Quản lý trung tâm (Students / Courses / Enrollments)

Ứng dụng React + TypeScript mô phỏng hệ thống quản lý:

- Học viên (Students)
- Khoá học (Courses)
- Đăng ký học (Enrollments)
- Dashboard tổng quan (kèm chart)

## Công nghệ sử dụng

- React + TypeScript (Vite)
- Redux Toolkit + React Redux
- UI: Ant Design
- Chart: `@ant-design/charts`
- Styling: TailwindCSS
- Chuẩn hoá code: ESLint + Prettier

## Yêu cầu môi trường

- Node.js (khuyến nghị LTS)
- npm (đi kèm Node)

## Cách chạy project

Cài dependencies:

```bash
npm install
```

Chạy dev server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

## Chất lượng code

Kiểm tra lint:

```bash
npm run lint
```

Auto-fix lint (khi có thể):

```bash
npm run lint:fix
```

Kiểm tra format:

```bash
npm run format
```

Auto-format:

```bash
npm run format:fix
```

## Cấu trúc thư mục (tham khảo)

- `src/pages/`: các trang (Dashboard/Students/Courses/Enrollments)
- `src/store/`: Redux store + slices + selectors

