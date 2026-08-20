async function testWomen() {
  const wRankingsUrl = 'https://api.wr-rims-prod.pulselive.com/rugby/v3/rankings/wru?language=en';
  const rRes = await fetch(wRankingsUrl);
  if (rRes.ok) {
    const rData = await rRes.json();
    const zim = rData.entries?.find(e => e.team?.name?.toLowerCase().includes('zimbabwe'));
    console.log('Zimbabwe Women (Lady Sables) World Rugby Ranking:', JSON.stringify(zim, null, 2));
  }
}
testWomen().catch(console.error);
