import "@testing-library/jest-dom";

// Suppress buggy act() warning. See https://github.com/testing-library/react-testing-library?tab=readme-ov-file#suppressing-unnecessary-warnings-on-react-dom-168
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
