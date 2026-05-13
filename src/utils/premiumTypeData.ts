// Premium report type data — rich content for the deep-dive 12-section report.
// ESTJ is fully populated as the canonical entry; other types fall back to a
// generated placeholder profile that uses the actual type's name.
import { typeData } from './types';

export interface CognitiveFunction {
  name: string;
  abbr: string;
  description: string;
}

export interface PremiumTypeData {
  code: string;
  name: string;
  tagline: string;
  accentColor: string;
  traits: [string, string, string, string];
  famousQuote: { text: string; person: string };
  introduction: string[];
  cognitiveFunctions: {
    dominant: CognitiveFunction;
    auxiliary: CognitiveFunction;
    tertiary: CognitiveFunction;
    inferior: CognitiveFunction;
  };
  strengths: { title: string; description: string }[];
  weaknesses: { title: string; description: string }[];
  stressTriggers: string[];
  stressSigns: string[];
  recoveryStrategies: string[];
  socialBattery: number;
  relationships: {
    narrative: string;
    offers: string[];
    needs: string[];
    challenges: string[];
    compatibleWith: { type: string; reason: string }[];
  };
  friendships: {
    narrative: string;
    positives: string[];
    watchOuts: string[];
  };
  career: {
    narrative: string;
    bestCareers: { label: string; icon: string }[];
    leadershipStyle: string[];
    asTeammate: string[];
    cautionCareers: string[];
  };
  growthRoadmap: { phase: string; description: string }[];
  topGrowthChallenges: string[];
  famousPeople: { name: string; role: string; reason: string }[];
  typeComparisons: {
    vsType: string;
    sharedTraits: string[];
    keyDifferences: string[];
    youMightBeThis: string;
  }[];
  affirmations: string[];
}

const ESTJ: PremiumTypeData = {
  code: "ESTJ",
  name: "The Director",
  tagline: "Getting it done and getting it right.",
  accentColor: "hsl(40 75% 45%)",
  traits: ["Extraverted", "Observant", "Thinking", "Judging"],
  famousQuote: {
    text: "The secret of getting ahead is getting started.",
    person: "Often attributed to leaders of the ESTJ mold",
  },
  introduction: [
    "ESTJs like to organize projects, procedures, and people, and then act to get things done. They live by a set of clear standards and beliefs, make a systematic effort to follow these, and expect the same of others. They value competence, efficiency, and results and display them in their work and play.",
    "ESTJs take an objective approach to problem solving and are tough when the situation requires it. They like to organize their life and work, and they have little patience with confusion, inefficiency, or lack of follow-through. ESTJs tend to be logical, analytical, objectively critical, decisive, and assertive.",
    "ESTJs focus on the present — what is real and actual. They apply and adapt relevant past experience to deal with problems, and they prefer jobs where results are immediate, visible, and tangible. ESTJs are likely to be practical, realistic, matter-of-fact, systematic, and pragmatic.",
    "ESTJs are usually excellent administrators because they understand systems and logistics. They can project the steps needed to accomplish a task, foresee potential problems, assign responsibilities, and marshal resources. They deal with all aspects of a situation, leaving no unresolved issues or unfinished business, and get things done on time.",
    "Because ESTJs naturally devise systems, procedures, and schedules, others rely on them to take charge and get results. Others may find ESTJs overpowering at times because they are so certain about how things should be. Because they are clear and straightforward in their communication, people seldom have to wonder where they stand.",
    "Others usually see ESTJs as conscientious, dependable, decisive, outspoken, and self-confident. They can be quite gregarious and generally enjoy interacting with people, especially in tasks, games, traditions, and family activities. They take relationship roles seriously and fulfill them responsibly.",
  ],
  cognitiveFunctions: {
    dominant: {
      name: "Extraverted Thinking",
      abbr: "Te",
      description: "Your primary mode. You channel observations into efficient, logical action in the outer world. You organize people and systems to achieve measurable results, and this is what others see most clearly when they watch you work.",
    },
    auxiliary: {
      name: "Introverted Sensing",
      abbr: "Si",
      description: "Your support system. You experience the world through a rich internal library of past impressions. You trust what has been proven to work and bring unmatched attention to detail, drawing on experience to inform decisions.",
    },
    tertiary: {
      name: "Extraverted Intuition",
      abbr: "Ne",
      description: "Developing with age. Abstract possibilities and creative brainstorming become more interesting and accessible as you mature. This function helps you consider new ideas rather than only proven approaches.",
    },
    inferior: {
      name: "Introverted Feeling",
      abbr: "Fi",
      description: "Your hidden edge and stress trigger. Beneath your decisive exterior is a personal value system that rarely surfaces. Under stress, you may become hypersensitive to criticism, feel unappreciated, or experience unexpected emotional outbursts.",
    },
  },
  strengths: [
    { title: "Deeply Reliable", description: "When an ESTJ commits to something, it gets done. Their word is their bond, and they follow through on every promise — making them the person others depend on most." },
    { title: "Natural Leader", description: "ESTJs instinctively organize people and resources. They see what needs to happen, assign responsibilities clearly, and drive execution with confidence and purpose." },
    { title: "Logical and Objective", description: "ESTJs make decisions based on facts, data, and logical analysis. They set aside personal feelings to find the most effective solution, even when it's difficult." },
    { title: "Exceptional Follow-Through", description: "Starting is easy; finishing is rare. ESTJs are one of the few types who systematically follow projects through to completion, leaving no loose ends." },
    { title: "Direct Communicator", description: "ESTJs say what they mean and mean what they say. This clarity eliminates confusion and earns them respect, even from people who find their directness challenging." },
    { title: "Highly Organized", description: "From their calendar to their desk to their long-term plans, ESTJs bring structure wherever they go — and genuinely enjoy the process of organizing for efficiency." },
  ],
  weaknesses: [
    { title: "Inflexible to Change", description: "ESTJs trust proven systems and can resist new approaches even when change would be beneficial. They may need to remind themselves that 'it worked before' isn't the same as 'it's the best option now.'" },
    { title: "Struggles to Express Emotions", description: "ESTJs process emotions internally and rarely show vulnerability. This can make them seem cold or uncaring to more feeling-oriented people, even when they care deeply." },
    { title: "Overly Critical", description: "ESTJs hold themselves and others to high standards. When those standards aren't met, they can be blunt or harsh in their feedback without realizing the emotional impact." },
    { title: "Takes on Too Much Alone", description: "Their strong sense of duty means ESTJs often shoulder responsibilities others drop. Over time this leads to exhaustion, and they rarely ask for help until it's too late." },
    { title: "Difficulty Appreciating Others", description: "ESTJs are so focused on tasks and results that they sometimes forget to acknowledge the contributions of those around them — leaving team members feeling unseen." },
  ],
  stressTriggers: [
    "Not having control of their own time and schedule",
    "Being surrounded by incompetent, irresponsible, or indecisive people",
    "Having to deal with others' bad decisions and their consequences",
    "Being personally attacked or unjustly criticized",
    "Being in a disorganized, chaotic environment",
    "Coping with constantly changing goals and procedures",
    "Being expected to work with highly emotional or unpredictable people",
  ],
  stressSigns: [
    "Becoming short-tempered, irritable, or explosive",
    "Experiencing emotional outbursts that feel out of character",
    "Becoming hypersensitive, easily hurt, or overly sentimental",
    "Withdrawing and becoming quiet or uncommunicative",
    "Feeling insecure, self-doubting, or overwhelmed",
    "Worrying excessively that people dislike or resent them",
  ],
  recoveryStrategies: [
    "Engage in physical exercise, especially with a group",
    "Take a full break — read, watch something engrossing, change scenery",
    "Talk to a trusted, uninvolved person for a reality check",
    "Spend some deliberate alone time to decompress and reset",
    "Reframe the stressor as a problem to be solved rather than a personal attack",
  ],
  socialBattery: 75,
  relationships: {
    narrative: "ESTJs approach relationships with the same seriousness and commitment they bring to everything else. They are loyal, dependable partners who take their roles seriously and follow through on promises. They show love through acts of service, reliability, and providing stability. ESTJs may struggle to express affection verbally, but their actions speak loudly — they are the partner who shows up, handles problems, and keeps the household running smoothly. They need a partner who respects their need for structure and appreciates their directness, even when it stings.",
    offers: ["Unwavering loyalty and dependability", "Practical support and problem-solving", "Clear communication — no guessing games"],
    needs: ["Respect for their standards and structures", "A partner who follows through on commitments", "Appreciation for their effort and contributions"],
    challenges: ["Can be controlling or inflexible in shared decisions", "May neglect emotional intimacy in favour of practical tasks", "Difficulty accepting a partner's different working style"],
    compatibleWith: [
      { type: "ISTJ", reason: "Shared values of duty, reliability and practical living create natural harmony" },
      { type: "ISTP", reason: "Complementary skills — ESTJ provides structure while ISTP brings adaptable problem-solving" },
      { type: "ESFJ", reason: "Both value commitment and tradition; ESFJ brings the warmth that balances ESTJ's directness" },
    ],
  },
  friendships: {
    narrative: "ESTJs are loyal, dependable friends who show up when it matters most. They may not be the most emotionally expressive, but they are the friend who helps you move, organises the group trip, and remembers the practical details everyone else forgets. They prefer a smaller circle of trusted friends over a wide social network, and they invest deeply in the relationships they commit to.",
    positives: [
      "The friend who actually follows through — calls when they say they will, shows up when you need them",
      "The organiser — turns vague plans into actual events with times, places, and logistics sorted",
      "The honest advisor — gives you the real answer, not the one designed to make you feel better",
    ],
    watchOuts: [
      "Can be judgemental of friends who don't meet their reliability standards",
      "May struggle to just listen without jumping to solutions or advice",
    ],
  },
  career: {
    narrative: "ESTJs thrive in structured environments where clear goals, defined hierarchies, and measurable results are valued. They are natural administrators and managers — excellent at seeing what needs to happen, assigning responsibility, and driving a team toward a deadline. They prefer organisations with clear chains of command and proven processes, and they have little patience for ambiguity or inefficiency. The ideal ESTJ role puts them in charge of making things happen.",
    bestCareers: [
      { label: "Business Manager", icon: "briefcase" },
      { label: "Military Officer", icon: "shield" },
      { label: "Judge / Attorney", icon: "scale" },
      { label: "Project Manager", icon: "clipboard-list" },
      { label: "Financial Officer", icon: "bar-chart" },
      { label: "Civil Engineer", icon: "building" },
      { label: "School Principal", icon: "graduation-cap" },
      { label: "Supply Chain Manager", icon: "truck" },
    ],
    leadershipStyle: [
      "Takes charge quickly and decisively — rarely waits to be asked",
      "Sets clear expectations and holds everyone (including themselves) accountable",
      "Leads by example: works hard, follows through, and expects the same",
      "Focuses on results and efficiency over process exploration",
    ],
    asTeammate: [
      "The person who keeps the team on track and on deadline",
      "Volunteers for the organisational tasks others avoid",
      "Speaks up when they see a flaw or inefficiency — even when it's uncomfortable",
    ],
    cautionCareers: [
      "Creative arts (high ambiguity, few measurable outcomes)",
      "Social work (emotional demands may conflict with logical decision-making style)",
    ],
  },
  growthRoadmap: [
    { phase: "In Your 20s", description: "You establish your competence fast and earn trust through reliability. Focus on learning to listen before directing — your instinct to take charge is an asset, but involving others builds stronger results than going it alone." },
    { phase: "In Your 30s", description: "Leadership comes naturally now, but growth requires softening edges. Practice genuine appreciation — not just task acknowledgement. Your team performs better when they feel seen, not just managed." },
    { phase: "Midlife", description: "The inferior Feeling function begins to surface. You may find yourself more interested in the emotional dimension of decisions and relationships. Lean into this — it will make you a more complete leader and partner." },
    { phase: "Mature Expression", description: "At your best, you combine lifelong competence with hard-won wisdom about people. You become the trusted elder — firm but fair, experienced but open, decisive but compassionate." },
  ],
  topGrowthChallenges: [
    "Practice saying 'good work' before saying 'here's what could be better' — appreciation fuels the people around you",
    "When facing change, ask 'what could be better about this?' before defaulting to 'this is how we've always done it'",
    "Schedule time to reflect on your feelings — not just your tasks. Your emotional world matters and benefits from the same attention you give your work",
  ],
  famousPeople: [
    { name: "George Washington", role: "First US President", reason: "Disciplined, duty-bound, organised — built systems and institutions that outlasted his lifetime" },
    { name: "Judge Judy Sheindlin", role: "Judge & TV personality", reason: "Blunt, efficient, zero-tolerance for nonsense — a textbook ESTJ in action" },
    { name: "Angela Merkel", role: "Former German Chancellor", reason: "Methodical, pragmatic, evidence-driven leadership over 16 years" },
    { name: "Lyndon B. Johnson", role: "US President", reason: "Forceful, results-driven, used systems and leverage to get legislation passed" },
    { name: "Hermione Granger", role: "Fictional (Harry Potter)", reason: "Rule-following, highly organised, expects competence from herself and others" },
    { name: "Captain Picard", role: "Fictional (Star Trek)", reason: "Commands with logic, structure, and clear standards; leads by principled example" },
    { name: "Warren Buffett", role: "Investor & businessman", reason: "Systematic, disciplined, long-term structured thinking — consistent and reliable over decades" },
    { name: "Ōkubo Toshimichi", role: "Statesman", reason: "Decisive organiser who built modern institutions through structured, top-down reform" },
    { name: "Kondō Isami", role: "Shinsengumi commander", reason: "Stern, rule-bound leader who demanded order and discipline from his unit" },
  ],
  typeComparisons: [
    {
      vsType: "ISTJ",
      sharedTraits: ["Practical and duty-driven", "Highly organised and reliable", "Prefer proven systems over new approaches"],
      keyDifferences: [
        "ESTJs are energised by leading and engaging others; ISTJs prefer working independently",
        "ESTJs are more vocal about standards and quicker to confront; ISTJs process internally first",
        "ESTJs thrive on managing teams; ISTJs prefer mastering their own domain deeply",
      ],
      youMightBeThis: "If you feel drained by managing people and prefer deep solo work with clear, private standards",
    },
    {
      vsType: "ENTJ",
      sharedTraits: ["Both decisive, logical, and action-oriented", "Natural leaders who take charge", "High standards for themselves and others"],
      keyDifferences: [
        "ESTJs focus on the present and proven systems; ENTJs think more strategically about the long-term future",
        "ESTJs follow established procedures; ENTJs redesign systems from scratch when needed",
        "ESTJs are more traditional; ENTJs are more visionary and comfortable with radical change",
      ],
      youMightBeThis: "If you find yourself constantly envisioning entirely new systems rather than improving existing ones",
    },
  ],
  affirmations: [
    "I bring order, reliability, and integrity to everything I do.",
    "My directness is a gift — it gives others the clarity they need to succeed.",
    "I can honour my high standards and still make space for others to grow at their own pace.",
  ],
};

import { INTJ } from './premiumTypes/INTJ';
import { INTP } from './premiumTypes/INTP';
import { ENTJ } from './premiumTypes/ENTJ';
import { ENTP } from './premiumTypes/ENTP';
import { INFJ } from './premiumTypes/INFJ';
import { INFP } from './premiumTypes/INFP';
import { ENFJ } from './premiumTypes/ENFJ';
import { ENFP } from './premiumTypes/ENFP';
import { ISTJ } from './premiumTypes/ISTJ';
import { ISFJ } from './premiumTypes/ISFJ';
import { ESFJ } from './premiumTypes/ESFJ';
import { ISTP } from './premiumTypes/ISTP';
import { ISFP } from './premiumTypes/ISFP';
import { ESTP } from './premiumTypes/ESTP';
import { ESFP } from './premiumTypes/ESFP';

const premiumData: Record<string, PremiumTypeData> = {
  ESTJ,
  INTJ, INTP, ENTJ, ENTP, INFJ, INFP, ENFJ, ENFP,
  ISTJ, ISFJ, ESFJ, ISTP, ISFP, ESTP, ESFP,
};

// Safety fallback — should never be hit now that all 16 types are authored.
function generateFallback(code: string): PremiumTypeData {
  const base = typeData[code];
  const displayName = base?.name ?? `The ${code}`;
  return {
    ...ESTJ,
    code,
    name: displayName,
    tagline: base?.atTheirBest ?? `Your unique ${code} expression.`,
  };
}

export function getPremiumTypeData(code: string): PremiumTypeData {
  return premiumData[code] ?? generateFallback(code);
}

