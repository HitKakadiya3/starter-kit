export interface ReportProfile {
  summary: string;
  turbulentScore: number; // 0-100, percentage toward Turbulent
  whoYouAre: {
    howYouThink: string;
    howYouProcess: string;
    howYouDecide: string;
    whatMotivates: string;
    whatDrains: string;
    howOthersSeeYou: string;
    underStress: string;
    socialSettings: string;
    atWork: string;
    learningStyle: string;
  };
  strengths: { title: string; description: string }[];
  growthAreas: { title: string; description: string }[];
  relationships: {
    howYouConnect: string;
    conflictStyle: string;
    emotionalNeeds: string;
    compatibleTypes: string[];
  };
  career: {
    bestFitCareers: string[];
    leadershipStyle: string;
    teamRole: string;
    idealEnvironment: string;
    flexVsStructured: string;
    remoteVsCollaborative: string;
    environmentNote: string;
  };
  growthRoadmap: {
    week1: string;
    week2: string;
    week3: string;
    week4: string;
    dailyExercises: string[];
  };
  insightCards: {
    coreStrength: string;
    communicationStyle: string;
    careerFit: string;
    relationshipStyle: string;
  };
}

const profiles: Record<string, ReportProfile> = {
  INTJ: {
    summary: "You are a visionary strategist who combines deep analytical thinking with long-term vision. You thrive on solving complex problems independently and hold yourself to the highest standards of excellence.",
    turbulentScore: 35,
    whoYouAre: {
      howYouThink: "You think in systems and patterns, always looking several steps ahead. Your mind naturally builds frameworks to organize complex information.",
      howYouProcess: "You filter information through logic and strategic relevance, discarding what doesn't serve your goals and deeply analyzing what does.",
      howYouDecide: "You make decisions based on objective analysis and long-term consequences, rarely swayed by emotional pressure or social expectations.",
      whatMotivates: "Mastery, intellectual challenges, and the pursuit of competence. You're driven by the desire to understand and improve systems.",
      whatDrains: "Repetitive tasks, emotional drama, micromanagement, and environments where mediocrity is accepted.",
      howOthersSeeYou: "Others see you as confident, competent, and sometimes intimidating. Your quiet intensity can be misread as aloofness.",
      underStress: "You may become overly critical, withdraw completely, or fixate on perceived incompetence in yourself and others.",
      socialSettings: "You prefer small, meaningful conversations over large gatherings. You value depth over breadth in social connections.",
      atWork: "You excel in roles requiring strategic planning and independent problem-solving. You prefer autonomy and resist unnecessary bureaucracy.",
      learningStyle: "You learn best through theoretical frameworks, independent research, and connecting concepts to larger systems."
    },
    strengths: [
      { title: "Strategic Vision", description: "Ability to see the big picture and plan several moves ahead" },
      { title: "Analytical Depth", description: "Exceptional skill at breaking down complex problems logically" },
      { title: "Independence", description: "Comfortable working alone and making tough decisions" },
      { title: "Determination", description: "Relentless pursuit of goals once committed" },
      { title: "Innovation", description: "Natural ability to envision and build improved systems" },
      { title: "High Standards", description: "Commitment to excellence drives exceptional output" }
    ],
    growthAreas: [
      { title: "Emotional Expression", description: "Practice sharing feelings and showing vulnerability with trusted people" },
      { title: "Patience with Others", description: "Not everyone processes as quickly — allow space for different speeds" },
      { title: "Delegation", description: "Trust others to handle tasks even if they approach them differently" },
      { title: "Social Connection", description: "Invest in relationships beyond intellectual stimulation" },
      { title: "Perfectionism", description: "Learn when 'good enough' is truly sufficient" },
      { title: "Present Moment", description: "Practice being present instead of always planning ahead" }
    ],
    relationships: {
      howYouConnect: "You connect through intellectual depth and shared vision. You value partners who challenge your thinking and respect your independence.",
      conflictStyle: "You approach conflict logically and may struggle when emotions run high. You prefer to solve the root cause rather than address surface feelings.",
      emotionalNeeds: "You need space for independence, intellectual stimulation, and a partner who doesn't take your directness personally.",
      compatibleTypes: ["ENFP", "ENTP", "INFJ", "ENTJ"]
    },
    career: {
      bestFitCareers: ["Software Architect", "Strategic Consultant", "Research Scientist", "Investment Analyst", "Systems Engineer", "Data Scientist"],
      leadershipStyle: "Visionary leader who sets high standards and expects excellence. You lead through competence and strategic direction.",
      teamRole: "The architect — you design the blueprint and trust others to execute.",
      idealEnvironment: "Autonomous, intellectually stimulating, with minimal bureaucracy and maximum efficiency.",
      flexVsStructured: "You prefer structured goals with flexible methods — define the destination but choose your own path.",
      remoteVsCollaborative: "You thrive in remote or independent work settings with focused collaboration when needed.",
      environmentNote: "INTJs perform best in environments that value competence over seniority, offer intellectual challenges, and provide clear goals with autonomy in execution."
    },
    growthRoadmap: {
      week1: "Observe your automatic judgments. When you notice yourself dismissing someone's idea, pause and ask one genuine question about it.",
      week2: "Practice expressing appreciation to one person daily. Use specific language about what they did and how it impacted you.",
      week3: "Identify one task you can delegate this week. Focus on communicating the desired outcome rather than the exact process.",
      week4: "Set one goal that is outside your comfort zone socially. Attend an event, reach out to a new contact, or deepen an existing relationship.",
      dailyExercises: [
        "5-minute reflection journal: write one thing you appreciated about someone today",
        "Practice active listening in one conversation without planning your response",
        "Take a 10-minute break from problem-solving to do something purely enjoyable",
        "Send one message to someone you haven't connected with recently"
      ]
    },
    insightCards: {
      coreStrength: "Strategic mastery — you see possibilities others miss and build systems to reach them",
      communicationStyle: "Direct, concise, and logic-driven. You prefer substance over small talk",
      careerFit: "Roles requiring independent analysis, long-term planning, and system design",
      relationshipStyle: "Deep, loyal bonds built on mutual respect and intellectual connection"
    }
  },
};

// Generate placeholder profiles for all 16 types
const allTypes = [
  "INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"
];

function generateProfile(type: string): ReportProfile {
  if (profiles[type]) return profiles[type];

  // Use the INTJ profile as a template and customize key fields
  const base = { ...profiles["INTJ"] };
  return {
    ...base,
    summary: `As an ${type}, you bring a unique combination of cognitive preferences that shape how you perceive and interact with the world. Your natural tendencies create a distinctive approach to thinking, communicating, and building relationships.`,
    growthRoadmap: {
      ...base.growthRoadmap,
      dailyExercises: base.growthRoadmap.dailyExercises,
    },
    insightCards: {
      coreStrength: `Your unique ${type} combination of traits gives you natural abilities others admire`,
      communicationStyle: `Your ${type} communication style reflects your authentic way of connecting`,
      careerFit: `Careers that align with your ${type} strengths and natural preferences`,
      relationshipStyle: `You build meaningful connections through your ${type} approach to relationships`
    },
    relationships: {
      ...base.relationships,
      compatibleTypes: allTypes.filter(t => t !== type).slice(0, 4)
    }
  };
}

export function getReportProfile(type: string): ReportProfile {
  return generateProfile(type);
}
