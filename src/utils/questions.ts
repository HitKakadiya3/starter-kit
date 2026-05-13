export interface Question {
  dim: 'E/I' | 'S/N' | 'T/F' | 'J/P' | 'A/T';
  pole: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | 'A';
  text: string;
}

// 60-item first-person bank: 12 items per axis (E/I, S/N, T/F, J/P, A/T).
// Order is intentional — alternating poles within each axis to reduce response-set bias.
export const questions: Question[] = [
  // === Extraversion (E) vs Introversion (I) — 12 items ===
  { dim: 'E/I', pole: 'E', text: 'I feel energised after spending time at a lively social gathering.' },
  { dim: 'E/I', pole: 'I', text: 'After a long day of interacting with people, I need quiet time alone to recharge.' },
  { dim: 'E/I', pole: 'E', text: 'I often think best by talking things through with others.' },
  { dim: 'E/I', pole: 'I', text: 'I prefer to work through my thoughts in my head before sharing them.' },
  { dim: 'E/I', pole: 'E', text: 'Meeting new people at events excites me more than it drains me.' },
  { dim: 'E/I', pole: 'I', text: 'I find small talk with strangers draining.' },
  { dim: 'E/I', pole: 'E', text: "I tend to start conversations, even with people I've just met." },
  { dim: 'E/I', pole: 'I', text: 'I prefer deep one-on-one conversations to group discussions.' },
  { dim: 'E/I', pole: 'E', text: 'A week with lots of social plans sounds like a great week.' },
  { dim: 'E/I', pole: 'I', text: 'I need regular solitude to feel like myself.' },
  { dim: 'E/I', pole: 'E', text: 'I process my feelings best by speaking about them out loud.' },
  { dim: 'E/I', pole: 'I', text: 'Spending a whole evening reading or reflecting alone sounds restorative.' },

  // === Sensing (S) vs Intuition (N) — 12 items ===
  { dim: 'S/N', pole: 'S', text: 'I trust concrete facts and personal experience more than abstract theories.' },
  { dim: 'S/N', pole: 'N', text: 'I often find myself wondering about possibilities and what things could become.' },
  { dim: 'S/N', pole: 'S', text: 'I prefer instructions that are specific and step-by-step.' },
  { dim: 'S/N', pole: 'N', text: 'I notice patterns, symbols, and connections that others miss.' },
  { dim: 'S/N', pole: 'S', text: "I focus on what's actually happening rather than what might happen." },
  { dim: 'S/N', pole: 'N', text: "I'd rather discuss ideas and theories than the practical details." },
  { dim: 'S/N', pole: 'S', text: 'I remember events by the specific sensory details — what something looked, sounded, or felt like.' },
  { dim: 'S/N', pole: 'N', text: "My mind naturally drifts into 'what if' scenarios and imagined futures." },
  { dim: 'S/N', pole: 'S', text: 'I like working with tangible tools and materials I can see and touch.' },
  { dim: 'S/N', pole: 'N', text: "I'm drawn to metaphors, analogies, and abstract thinking." },
  { dim: 'S/N', pole: 'S', text: "I trust something more once I've seen it work in practice." },
  { dim: 'S/N', pole: 'N', text: 'I often see a broader pattern before I notice the individual pieces.' },

  // === Thinking (T) vs Feeling (F) — 12 items ===
  { dim: 'T/F', pole: 'T', text: 'When making decisions, I focus on logic and objective analysis first.' },
  { dim: 'T/F', pole: 'F', text: "I consider how my decisions will affect people's feelings before acting." },
  { dim: 'T/F', pole: 'T', text: "Honest feedback is more valuable than feedback that protects someone's feelings." },
  { dim: 'T/F', pole: 'F', text: 'Harmony in a group matters more to me than winning an argument.' },
  { dim: 'T/F', pole: 'T', text: "I can evaluate someone's work without being influenced by how I feel about them." },
  { dim: 'T/F', pole: 'F', text: "I struggle to deliver criticism, even when it's clearly needed." },
  { dim: 'T/F', pole: 'T', text: 'Fairness means applying the same rule to everyone equally.' },
  { dim: 'T/F', pole: 'F', text: "Fairness means considering each person's unique situation." },
  { dim: 'T/F', pole: 'T', text: "I'd rather be right than be liked." },
  { dim: 'T/F', pole: 'F', text: "I'd rather be kind than be technically correct." },
  { dim: 'T/F', pole: 'T', text: 'I can stay detached when solving emotionally charged problems.' },
  { dim: 'T/F', pole: 'F', text: "I often absorb other people's emotions without meaning to." },

  // === Judging (J) vs Perceiving (P) — 12 items ===
  { dim: 'J/P', pole: 'J', text: 'I feel calmer when my day has a clear plan and schedule.' },
  { dim: 'J/P', pole: 'P', text: 'I thrive when I can keep my options open and adapt as I go.' },
  { dim: 'J/P', pole: 'J', text: 'I prefer to finish tasks well before the deadline.' },
  { dim: 'J/P', pole: 'P', text: 'I do my best work when a deadline is approaching.' },
  { dim: 'J/P', pole: 'J', text: "Unfinished tasks nag at me until they're closed out." },
  { dim: 'J/P', pole: 'P', text: 'I enjoy starting new projects more than finishing old ones.' },
  { dim: 'J/P', pole: 'J', text: 'I make to-do lists and mostly stick to them.' },
  { dim: 'J/P', pole: 'P', text: 'Rigid schedules feel suffocating to me.' },
  { dim: 'J/P', pole: 'J', text: 'I decide and move on — revisiting choices feels inefficient.' },
  { dim: 'J/P', pole: 'P', text: "I like to gather more information even after I've 'decided.'" },
  { dim: 'J/P', pole: 'J', text: 'Messy, unstructured environments stress me out.' },
  { dim: 'J/P', pole: 'P', text: 'Spontaneous plans are more fun than booked ones.' },

  // === Assertive (A) vs Turbulent (T) — identity — 12 items ===
  { dim: 'A/T', pole: 'A', text: "I recover quickly from setbacks and don't dwell on them." },
  { dim: 'A/T', pole: 'T', text: "I often replay past conversations in my head, wishing I'd said something differently." },
  { dim: 'A/T', pole: 'A', text: 'I trust my decisions and rarely second-guess myself.' },
  { dim: 'A/T', pole: 'T', text: "I'm my own harshest critic — I notice every mistake I make." },
  { dim: 'A/T', pole: 'A', text: 'I handle stress without letting it overwhelm me.' },
  { dim: 'A/T', pole: 'T', text: 'Small criticisms can affect my mood for hours or days.' },
  { dim: 'A/T', pole: 'A', text: 'I feel generally confident about the direction of my life.' },
  { dim: 'A/T', pole: 'T', text: 'I worry frequently about things that might go wrong.' },
  { dim: 'A/T', pole: 'A', text: "I don't need external validation to feel good about my work." },
  { dim: 'A/T', pole: 'T', text: 'I often feel that I could — and should — be doing better.' },
  { dim: 'A/T', pole: 'A', text: 'I sleep well even when there are unresolved problems in my life.' },
  { dim: 'A/T', pole: 'T', text: 'I feel pressure to constantly improve myself.' },
];
