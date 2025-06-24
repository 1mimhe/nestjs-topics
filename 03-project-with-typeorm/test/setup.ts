import { rm } from 'fs/promises';
import { join } from 'path';

// We can add global setups here.
// We should add this line to jest-e2e.json file:
// "setupFilesAfterEnv": ["<rootDir>/setup.ts"]

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite')); // Remove test.sqlite file beforeEach test
  } catch (err) {}
});
