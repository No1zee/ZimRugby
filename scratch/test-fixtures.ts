import { getWorldRugbyFixtures } from '../src/lib/world-rugby';

async function test() {
  console.log('Fetching fixtures...');
  const fixtures = await getWorldRugbyFixtures();
  console.log('Found fixtures:', JSON.stringify(fixtures, null, 2));
}

test().catch(console.error);
