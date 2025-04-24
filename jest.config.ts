/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  // forceExit: true,
  // detectOpenHandles: true,
  testTimeout: 10000, // optional
};
