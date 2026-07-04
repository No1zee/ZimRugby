export interface RefereeResource {
  title: string;
  category: 'laws' | 'guides' | 'forms';
  size: string;
  downloadUrl: string;
}

export interface RefereeCourse {
  title: string;
  level: string;
  date: string;
  venue: string;
  instructor: string;
  status: 'open' | 'closed';
}

export interface RefereeNotice {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export async function getRefereeResources(): Promise<RefereeResource[]> {
  return [
    { title: "World Rugby Laws of the Game 2026", category: "laws", size: "8.5 MB", downloadUrl: "#" },
    { title: "ZRU Domestic Law Variations (Schools & Clubs)", category: "laws", size: "1.4 MB", downloadUrl: "#" },
    { title: "Match Official Positioning Guide (15s)", category: "guides", size: "2.1 MB", downloadUrl: "#" },
    { title: "ZRU Referee Abuse Zero-Tolerance Charter", category: "guides", size: "1.1 MB", downloadUrl: "#" },
    { title: "Match Official Scorecard & Report Template", category: "forms", size: "450 KB", downloadUrl: "#" },
    { title: "Incident / Red Card Report Form", category: "forms", size: "620 KB", downloadUrl: "#" }
  ];
}

export async function getRefereeCourses(): Promise<RefereeCourse[]> {
  return [
    {
      title: "World Rugby Level 1 officiating (15s)",
      level: "Level 1",
      date: "12-13 MAY 2026",
      venue: "Harare Sports Club",
      instructor: "TJ Chifokoyo (World Rugby Educator)",
      status: "open"
    },
    {
      title: "World Rugby Level 2 Officiating (15s)",
      level: "Level 2",
      date: "05-07 JUN 2026",
      venue: "Bulawayo Athletic Club",
      instructor: "Gordon Pangeti (World Rugby Trainer)",
      status: "open"
    },
    {
      title: "Sevens Officiating Specialist Course",
      level: "Specialist",
      date: "18 APR 2026",
      venue: "Old Georgians, Harare",
      instructor: "Ricky Chirengende",
      status: "closed"
    }
  ];
}

export async function getRefereeNotices(): Promise<RefereeNotice[]> {
  return [
    {
      id: "ref-notice-2026-01",
      title: "Implementation of World Rugby 2026 Global Law Trials",
      date: "04 APR 2026",
      excerpt: "Crucial instructions regarding the implementation of the new crotch-bind and offside law variations starting from the 2026 season opener.",
      content: "All ZRU match officials are requested to strictly enforce the new World Rugby global law trials. Pay particular attention to the offside line on kicks and the elimination of the crocodile roll at rucks. Detailed instruction clips are available in the laws portal."
    },
    {
      id: "ref-notice-2026-02",
      title: "Pre-Season Fitness Assessments & Registration",
      date: "25 MAR 2026",
      excerpt: "Schedule and requirements for the mandatory pre-season fitness beep test for all active A and B panel referees.",
      content: "Active match officials on panels A and B must undergo the mandatory pre-season fitness assessment. The shuttle beep test will take place at Harare Sports Club and Bulawayo Athletic Club. Minimum entry requirements must be met to secure appointments."
    }
  ];
}
