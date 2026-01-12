import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  setupFiles: ["<rootDir>/src/__tests__/setupEnv.ts"],
  globalSetup: "<rootDir>/src/__tests__/globalSetup.ts",
  globalTeardown: "<rootDir>/src/__tests__/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/afterEnv.ts"],

};

export default config;
