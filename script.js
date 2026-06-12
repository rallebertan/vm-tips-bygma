// VM Tips Bygma 2026

console.log("VM Tips Bygma laddad");

// Här kommer senare:
 // - Automatisk leaderboard
 // - Matcher
 // - Statistik
 // - Import från Excel/JSON

const leaderboard = [
  { namn: "MNH", poang: 4 },
  { namn: "RNI", poang: 3 },
  { namn: "PTR", poang: 3 }
];

leaderboard.forEach(spelare => {
  console.log(
    `${spelare.namn}: ${spelare.poang} poäng`
  );
});
