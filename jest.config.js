module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  verbose: true,
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json"],
};
