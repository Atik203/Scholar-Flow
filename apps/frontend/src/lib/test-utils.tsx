import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import React, { ReactElement } from "react";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg",
  ...overrides,
});

export const createMockPaper = (overrides = {}) => ({
  id: "paper-1",
  title: "Sample Research Paper",
  abstract: "This is a sample abstract for testing purposes.",
  authors: ["John Doe", "Jane Smith"],
  publishedAt: "2024-01-01",
  doi: "10.1234/sample.2024.001",
  ...overrides,
});

export const createMockCollection = (overrides = {}) => ({
  id: "collection-1",
  name: "Sample Collection",
  description: "A sample collection for testing",
  papers: [],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ...overrides,
});

// Mock Intersection Observer
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Mock Resize Observer
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
};

// Mock matchMedia
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      length: Object.keys(store).length,
      key: jest.fn((index: number) => Object.keys(store)[index] || null),
    },
    writable: true,
  });
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      length: Object.keys(store).length,
      key: jest.fn((index: number) => Object.keys(store)[index] || null),
    },
    writable: true,
  });
};

// Setup function for common mocks
export const setupTestEnvironment = () => {
  mockIntersectionObserver();
  mockResizeObserver();
  mockMatchMedia();
  mockLocalStorage();
  mockSessionStorage();
};

// Cleanup function
export const cleanupTestEnvironment = () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
};
