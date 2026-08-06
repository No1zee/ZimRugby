import { checkPermission, UserSession, ActorRole } from "../src/lib/iam/rbac";

interface TestCase {
  name: string;
  session: UserSession;
  action: "read" | "write";
  resource: { resourceType: "player" | "coach" | "referee" | "club"; ownerId?: string; clubId?: string };
  expected: boolean;
}

const testCases: TestCase[] = [
  // Admin permissions
  {
    name: "Admin can read any player profile",
    session: { userId: "admin1", email: "admin@zru.org", role: "admin" },
    action: "read",
    resource: { resourceType: "player", ownerId: "player1" },
    expected: true,
  },
  {
    name: "Admin can write to any collection",
    session: { userId: "admin1", email: "admin@zru.org", role: "admin" },
    action: "write",
    resource: { resourceType: "club", clubId: "club1" },
    expected: true,
  },

  // Player permissions
  {
    name: "Player can read their own profile",
    session: { userId: "player1", email: "player@zru.org", role: "player" },
    action: "read",
    resource: { resourceType: "player", ownerId: "player1" },
    expected: true,
  },
  {
    name: "Player cannot read other player's profile",
    session: { userId: "player1", email: "player@zru.org", role: "player" },
    action: "read",
    resource: { resourceType: "player", ownerId: "player2" },
    expected: false,
  },
  {
    name: "Player can write to their own profile",
    session: { userId: "player1", email: "player@zru.org", role: "player" },
    action: "write",
    resource: { resourceType: "player", ownerId: "player1" },
    expected: true,
  },
  {
    name: "Player cannot write to club resource",
    session: { userId: "player1", email: "player@zru.org", role: "player" },
    action: "write",
    resource: { resourceType: "club", clubId: "club1" },
    expected: false,
  },

  // Coach permissions
  {
    name: "Coach can read squad player profile in their club",
    session: { userId: "coach1", email: "coach@club.org", role: "coach", clubId: "clubA" },
    action: "read",
    resource: { resourceType: "player", clubId: "clubA" },
    expected: true,
  },
  {
    name: "Coach cannot read squad player profile in a different club",
    session: { userId: "coach1", email: "coach@club.org", role: "coach", clubId: "clubA" },
    action: "read",
    resource: { resourceType: "player", clubId: "clubB" },
    expected: false,
  },
  {
    name: "Coach can edit player profiles in their own club",
    session: { userId: "coach1", email: "coach@club.org", role: "coach", clubId: "clubA" },
    action: "write",
    resource: { resourceType: "player", clubId: "clubA" },
    expected: true,
  },

  // Club Registrar permissions
  {
    name: "Registrar can read records in their club",
    session: { userId: "reg1", email: "reg@club.org", role: "club-registrar", clubId: "clubA" },
    action: "read",
    resource: { resourceType: "player", clubId: "clubA" },
    expected: true,
  },
  {
    name: "Registrar cannot write to other club records",
    session: { userId: "reg1", email: "reg@club.org", role: "club-registrar", clubId: "clubA" },
    action: "write",
    resource: { resourceType: "club", clubId: "clubB" },
    expected: false,
  },

  // Referee permissions
  {
    name: "Referee can read own availability profile",
    session: { userId: "ref1", email: "ref@zru.org", role: "referee" },
    action: "read",
    resource: { resourceType: "referee", ownerId: "ref1" },
    expected: true,
  },
  {
    name: "Referee cannot write to player profile",
    session: { userId: "ref1", email: "ref@zru.org", role: "referee" },
    action: "write",
    resource: { resourceType: "player", ownerId: "player1" },
    expected: false,
  }
];

function runTests() {
  console.log("==========================================");
  console.log("RUNNING ZIM RUGBY UNION IAM AUTHORIZATION TESTS");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    const result = checkPermission(tc.session, tc.action, tc.resource);
    const isOk = result === tc.expected;

    if (isOk) {
      console.log(`[PASS] ${tc.name}`);
      passed++;
    } else {
      console.log(`[FAIL] ${tc.name}`);
      console.log(`       Expected: ${tc.expected}, Got: ${result}`);
      failed++;
    }
  }

  console.log("\n==========================================");
  console.log(`TEST SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
