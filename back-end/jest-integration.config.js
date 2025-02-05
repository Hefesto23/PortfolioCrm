const jestConfig = require("./jest.config")

module.exports = {
  ...jestConfig,
  testTimeout: 999999,
}
