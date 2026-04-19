import { getAllFixtures, formatFixtureForUI } from '../src/lib/fixtures';

async function test() {
  console.log('Fetching all fixtures...');
  const fixtures = await getAllFixtures();
  const formatted = fixtures.map(formatFixtureForUI);
  console.log('Results:', JSON.stringify(formatted, null, 2));
}

test().catch(console.error);
