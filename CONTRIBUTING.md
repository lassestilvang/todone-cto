# Contributing to Todone

Thank you for your interest in contributing to Todone! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and considerate in all interactions.

## Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/todone-cto.git
   cd todone-cto
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/my-feature
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## Code Quality Standards

### TypeScript
- **Use strict typing**: No `any` types
- **Define interfaces** for all data structures
- **Use type inference** where appropriate
- **Add JSDoc comments** for complex functions

### React
- **Functional components** with hooks
- **Component size**: Keep under 300 lines
- **Custom hooks**: Extract reusable logic
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` where needed

### Styling
- **Tailwind CSS**: Use utility classes
- **Responsive design**: Mobile-first approach
- **Accessibility**: ARIA labels, semantic HTML
- **Dark mode**: Use opacity-based colors

### Naming Conventions
- **Components**: PascalCase (e.g., `TaskItem.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTaskStore`)
- **Utilities**: camelCase (e.g., `formatDate`)
- **Types**: PascalCase (e.g., `Task`, `Priority`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `PROJECT_COLORS`)

## Commit Messages

Follow the Conventional Commits standard:

- `feat: add task drag-and-drop`
- `fix: correct date parsing for "next Monday"`
- `docs: update API documentation`
- `style: format code with Prettier`
- `refactor: extract task parsing logic`
- `test: add unit tests for date utilities`
- `chore: update dependencies`

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Run linting**:
   ```bash
   npm run lint
   npm run typecheck
   ```
4. **Format code**:
   ```bash
   npm run format
   ```
5. **Create PR** with a clear description
6. **Link related issues** using keywords (e.g., "Closes #123")

## Feature Requests

Open an issue with:
- Clear description
- Use case
- Expected behavior
- Mockups/screenshots (if applicable)

## Bug Reports

Open an issue with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots
- Browser/OS information

## Testing

### Unit Tests (Future)
```bash
npm run test
```

### E2E Tests (Future)
```bash
npm run test:e2e
```

## Documentation

- Update `README.md` for user-facing changes
- Update `docs/ARCHITECTURE.md` for architectural changes
- Update `docs/API.md` for API changes
- Add inline comments for complex logic

## Project Phases

We're following a phased approach:

- **Phase 1**: Core Foundation ✅ (Current)
- **Phase 2**: Essential Features (In Progress)
- **Phase 3**: Advanced Features
- **Phase 4**: Polish & AI

Check the project board for current priorities.

## Questions?

Feel free to open an issue with the `question` label, or reach out to the maintainers.

---

**Happy coding, and let's make Todone amazing together!** 🚀
