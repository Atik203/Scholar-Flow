import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveClass(className: string): R
      toHaveStyle(css: string | Record<string, any>): R
      toHaveValue(value: string | string[] | number): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveFocus(): R
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
      toBeEmptyDOMElement(): R
      toHaveDescription(text: string | RegExp): R
    }
  }
}

export {}
