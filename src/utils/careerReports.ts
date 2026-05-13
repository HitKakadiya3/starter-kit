// Auto-generated from MBTI_Career_Upsell_Content.xlsx
export interface CareerMatch { rank: string; role: string; fit: string; salary: string }
export interface CareerStage { label: string; text: string }
export interface CareerTrap { title: string; text: string }
export interface CareerPlanItem { label: string; text: string }

// ───── Premium (v2) extended fields — currently populated for INTJ only.
export interface PremiumStrength { title: string; text: string }
export interface PremiumMatch { rank: string; role: string; fit: string; why: string; comp: string }
export interface PremiumCompStage { stage: string; range: string; driver: string }
export interface PremiumScript { label: string; text: string }
export interface PremiumStageDetail {
  label: string; intro: string;
  milestones: string; mistakes: string; signals: string;
}
export interface PremiumPivot { title: string; text: string }
export interface PremiumWeek { label: string; text: string }
export interface PremiumCareerReport {
  executiveSummary: string;
  careerDna: string[];
  strengths: PremiumStrength[];
  matches: PremiumMatch[];
  bestIndustries: string[];
  avoidIndustries: string[];
  greenFlags: string[];
  redFlags: string[];
  compTrajectory: PremiumCompStage[];
  leadershipStrengths: string[];
  leadershipBlindspots: string[];
  leadershipScripts: PremiumScript[];
  stages: PremiumStageDetail[];
  investSkills: string[];
  deprioritizeSkills: string[];
  negotiationOverview: string;
  negotiationScripts: PremiumScript[];
  pivots: PremiumPivot[];
  traps: { title: string; text: string }[];
  redFlagPhrases: string[];
  networking: string;
  weeks: PremiumWeek[];
  visionExercise: string;
}

export interface CareerReport {
  title: string; subtitle: string; careerDna: string;
  matches: CareerMatch[]; environment: string; leadership: string;
  stages: CareerStage[]; traps: CareerTrap[]; plan: CareerPlanItem[];
  /** Optional rich v2 content. When present, the report page renders the premium layout. */
  premium?: PremiumCareerReport;
}

export const careerReports: Record<string, CareerReport> = {
  INTJ: {
    title: `INTJ — The Strategist`,
    subtitle: `Premium career insights tailored to your INTJ profile`,
    careerDna: `You're wired to solve problems no one else has cracked yet. While roughly 2% of the population shares your type, far fewer learn to leverage their rarest asset: the ability to hold a 10-year vision in one hand and a concrete execution plan in the other. Most INTJs underperform their potential for a decade before realizing their strengths are strategic, not tactical. This report shortcuts that decade.`,
    matches: [
      { rank: `1`, role: `Strategy Consultant / Corporate Strategist`, fit: `94%`, salary: `$150K – $400K+` },
      { rank: `2`, role: `Software Architect / Technical Lead`, fit: `92%`, salary: `$160K – $350K` },
      { rank: `3`, role: `Investment Analyst / Quantitative Researcher`, fit: `90%`, salary: `$150K – $500K+` },
      { rank: `4`, role: `Research Scientist (R&D, AI, Biotech)`, fit: `89%`, salary: `$130K – $300K` },
      { rank: `5`, role: `Founder / Product Visionary`, fit: `87%`, salary: `Variable, high ceiling` },
      { rank: `6`, role: `Management Consultant (Specialist Track)`, fit: `85%`, salary: `$180K – $500K` },
      { rank: `7`, role: `Policy Analyst / Think Tank Researcher`, fit: `82%`, salary: `$100K – $220K` },
    ],
    environment: `You lose up to 40% of your capacity in open-plan offices and status-meeting cultures. You gain it back in environments with: deep-work blocks of 3+ hours, written-first communication, flat hierarchy, outcomes-based evaluation, and colleagues who can challenge you intellectually. If your current role lacks 3 or more of these, you are likely operating at 60% of your true earning capacity.`,
    leadership: `You're not a cheerleader — you're a compass. Teams led by INTJs outperform in strategy and execution but often underperform on morale if you don't deliberately cultivate warmth. The fix: schedule relational touchpoints like you schedule deep work. Your reputation will shift from 'brilliant but cold' to 'the leader who saw it coming.'`,
    stages: [
      { label: `Years 1–7 — The Proving Ground`, text: `You'll be frustrated by slower colleagues and resistant to politics. Build credibility through one signature project that showcases both depth and long-term thinking.` },
      { label: `Years 8–15 — The Leverage Years`, text: `This is where most INTJs either break through to senior roles or plateau. The deciding factor is whether you learn to influence people you can't out-think.` },
      { label: `Years 16+ — The Architect Phase`, text: `Your peak. You design systems, mentor successors, and often start your own venture. INTJs frequently hit their highest earning years between 45 and 60.` },
    ],
    traps: [
      { title: `Staying technical too long`, text: `Your strategic value compounds faster than your technical value after year 7.` },
      { title: `Underpricing yourself`, text: `INTJs chronically undervalue their work by 20–30% because it 'felt easy.'` },
      { title: `Avoiding visibility`, text: `The work speaks for itself — but only to people in the room. Get in more rooms.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Audit your current role against the 5 environment factors above. Score yourself honestly on each.` },
      { label: `Days 31–60`, text: `Identify one strategic project that no one else in your organization is positioned to own. Propose it.` },
      { label: `Days 61–90`, text: `Build a written portfolio (one-pager or Notion page) showing your strategic wins. Documented INTJs outperform undocumented ones by 2–3x in promotion cycles.` },
    ],
    premium: {
      executiveSummary: `You are wired to design systems that outlast you. Among the 16 types you have one of the highest career ceilings in fields that reward long-horizon thinking — strategy, software architecture, capital allocation, research. Your career risk is not lack of ability; it's invisibility. The work speaks for itself only if you put it in front of the right people. This report is a 30-year operating manual.`,
      careerDna: [
        `You think in systems. While most people see the trees, you see the forest, the soil chemistry, the watershed, and the 50-year fire cycle. About 2% of the population shares this wiring, and far fewer convert it into compensation that matches it. The conversion mechanism is not more brilliance — it's deliberate visibility.`,
        `Your default move on any problem is to build a model. You don't just want to solve it once; you want to solve the class of problems it belongs to. This is rocket fuel in the right role and dead weight in the wrong one. INTJs in execution-heavy, status-meeting cultures lose 30-40% of their potential output without realizing it.`,
        `The single career lever that returns most for INTJs is learning to translate strategic insight into language non-strategists can act on. Your peers will out-earn you for a decade if you don't learn this. After year 10, the curve flips — and INTJs who mastered translation pull dramatically ahead of those who only mastered the work.`,
      ],
      strengths: [
        { title: `Long-horizon strategic vision`, text: `You hold a 10-year roadmap and a Tuesday tactical decision in the same frame. This makes you valuable in capital allocation, product strategy, and any role where today's choice locks in tomorrow's options.` },
        { title: `Independent system design`, text: `You design from first principles with minimal supervision. Senior leaders learn they can hand you a vague problem and get back a structured solution.` },
        { title: `Pattern recognition under noise`, text: `You see signal where peers see chaos. Your edge in research, due diligence, investment, and analytical contexts.` },
        { title: `Tolerance for solitary deep work`, text: `You can work 4-hour stretches without external stimulation. In an attention-starved market, this is increasingly priced.` },
      ],
      matches: [
        { rank: `1`, role: `Chief Strategy Officer / Corporate Strategist`, fit: `96%`, why: `Why: Strategy is your native language; CSO roles let you see the whole board.\n\nTypical day: M&A pipelines, scenario modeling, board prep, leadership offsites.\n\nWatch for: CSO roles can become political; pick CEOs who actually listen.`, comp: `Comp: $220K – $600K base + equity\n\nTarget employers: Mid-cap public companies, PE portfolio companies, late-stage tech.` },
        { rank: `2`, role: `Software / Systems Architect`, fit: `94%`, why: `Why: Designing the framework others build on for years is INTJ work at its purest.\n\nTypical day: System design reviews, technical strategy, hiring senior engineers.\n\nWatch for: Stay close to code or you'll lose technical credibility within 2 years.`, comp: `Comp: $180K – $450K total comp\n\nTarget employers: Hyperscalers (AWS/Azure/GCP), fintech, late-stage infra startups.` },
        { rank: `3`, role: `Investment Strategy / Hedge Fund Analyst`, fit: `93%`, why: `Why: Long-horizon thinking + comfort with ambiguity = compounding returns.\n\nTypical day: Thesis development, modeling, expert calls, portfolio construction.\n\nWatch for: High-burnout culture; protect deep-work blocks.`, comp: `Comp: $200K – $1M+ (variable comp)\n\nTarget employers: Long-only, macro, or activist funds; quant shops.` },
        { rank: `4`, role: `Strategy Consultant — MBB or Premium Boutique`, fit: `91%`, why: `Why: Frame the problem, build the model, deliver the recommendation.\n\nTypical day: Client interviews, hypothesis trees, slide construction, partner reviews.\n\nWatch for: 'Up or Out' culture punishes introversion if you don't actively build sponsorship.`, comp: `Comp: $170K – $500K (Manager → Partner)\n\nTarget employers: McKinsey, BCG, Bain, LEK, Parthenon, Strategy&.` },
        { rank: `5`, role: `Research Scientist / Principal Engineer (R&D)`, fit: `90%`, why: `Why: Deep, autonomous problem-solving with publishable output.\n\nTypical day: Literature review, experiment design, paper writing, conference talks.\n\nWatch for: Pick a hot domain at the right time; research roles can become irrelevant.`, comp: `Comp: $160K – $500K+\n\nTarget employers: Industry research labs (Anthropic, DeepMind, MSR), national labs, top universities.` },
        { rank: `6`, role: `Founder / CTO of Technical Startup`, fit: `89%`, why: `Why: Designing before building is the rarest founder asset.\n\nTypical day: Product strategy, hiring engineers, fundraising, customer discovery.\n\nWatch for: Solo INTJ founders fail at sales. Find a complementary co-founder.`, comp: `Comp: $0 – $50M+ (variance is the point)\n\nTarget employers: Vertical SaaS, infra, AI tooling, fintech.` },
        { rank: `7`, role: `Quantitative Researcher / Senior Data Scientist`, fit: `88%`, why: `Why: Models, signals, structured ambiguity — your brain at play.\n\nTypical day: Feature engineering, hypothesis testing, model deployment.\n\nWatch for: Quant culture is intense; protect the deep-work blocks that make you valuable.`, comp: `Comp: $200K – $700K\n\nTarget employers: Two Sigma, Citadel, Jane Street, DE Shaw; FAANG ML platform teams.` },
        { rank: `8`, role: `Senior Policy Analyst / Think-Tank Fellow`, fit: `84%`, why: `Why: Long-form analysis, structured argument, real-world influence.\n\nTypical day: White papers, expert testimony, briefings, op-eds.\n\nWatch for: Lower comp ceiling; choose only when income isn't your top priority.`, comp: `Comp: $110K – $250K\n\nTarget employers: Brookings, RAND, AEI, university policy schools, central banks.` },
        { rank: `9`, role: `VP of Engineering / Product (Strategy-heavy)`, fit: `83%`, why: `Why: Translates design instincts into team-scale execution leverage.\n\nTypical day: Roadmap, headcount, cross-functional alignment, exec reviews.\n\nWatch for: Avoid roles that are 80% people-management; you'll burn out.`, comp: `Comp: $250K – $700K total comp\n\nTarget employers: Late-stage startups, scale-ups, mid-cap tech.` },
        { rank: `10`, role: `Independent Strategy / Boutique Consulting`, fit: `82%`, why: `Why: Maximum autonomy, premium rates, intellectual variety.\n\nTypical day: Client work, IP development, writing, speaking.\n\nWatch for: Sales is the bottleneck; budget 30% of your time for it indefinitely.`, comp: `Comp: $300K – $1M+ at scale\n\nTarget employers: Solo, 2-3 person practice, or partnership.` },
      ],
      bestIndustries: [
        `Strategy consulting (premium boutiques and MBB)`,
        `Late-stage software / SaaS / AI infrastructure`,
        `Capital allocation: PE, VC, hedge funds, family offices`,
        `Research-driven biotech and deep tech`,
        `Policy / think tanks (if income is secondary)`,
      ],
      avoidIndustries: [
        `Mass-market retail / hospitality (transactional, energy-draining)`,
        `High-volume sales (rapid context-switching is your kryptonite)`,
        `Traditional advertising/PR (vibe-driven, low rigor)`,
      ],
      greenFlags: [
        `Deep-work blocks of 3+ hours protected on the calendar`,
        `Written-first communication (memos > meetings)`,
        `Outcomes-based evaluation, not hours-based`,
        `Flat hierarchy where ideas beat seniority`,
        `Colleagues who can intellectually challenge you`,
      ],
      redFlags: [
        `Open-plan offices with constant interruption`,
        `Status meetings without agendas or outcomes`,
        `Politics-over-merit promotion culture`,
        `Forced socialization (mandatory happy hours)`,
        `Leaders who reward optics over substance`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$80K – $130K`, driver: `Building credibility and depth. Don't optimize for title; optimize for who you work for.` },
        { stage: `Years 4-7`, range: `$130K – $220K`, driver: `First leverage point. Strategic instincts start being visible. Negotiate hard at year 5.` },
        { stage: `Years 8-15`, range: `$220K – $500K`, driver: `Compounding years. Senior IC or director-level. Equity becomes meaningful.` },
        { stage: `Years 16-25`, range: `$400K – $1.5M`, driver: `Peak earning years. Executive, partner, or founder-level outcomes.` },
        { stage: `Years 25+`, range: `$300K – $5M+`, driver: `Board roles, advisory, equity portfolio income. Often higher than mid-career.` },
      ],
      leadershipStrengths: [
        `Vision clarity — your team always knows where they're going`,
        `Decision speed when criteria are clear`,
        `Structural thinking — you fix the system, not just the symptom`,
        `Comfort with introvert talent — you protect them from extrovert-default cultures`,
      ],
      leadershipBlindspots: [
        `Underweighting morale and emotional labor`,
        `Skipping the 'why' when communicating decisions`,
        `Mistaking competence for trust (it isn't)`,
        `Tolerating low performers too long when they're 'nice'`,
      ],
      leadershipScripts: [
        { label: `Delivering hard feedback`, text: `'Here's what I'm seeing, here's the impact, here's what I need you to change. Tell me what you heard, and what you'll do differently in the next two weeks.'` },
        { label: `When you've been distant`, text: `'I've been heads-down on [project]. I want to make sure I haven't missed anything you needed from me. What's on your mind?'` },
        { label: `Promoting team work upward`, text: `'The team did X, which moved metric Y by Z%. [Person] led [specific contribution].'` },
      ],
      stages: [
        {
          label: `Years 1-7 — The Proving Ground`,
          intro: `You'll be smarter than your title suggests. Resist the urge to job-hop every 18 months — credibility compounds in the same room.`,
          milestones: `Master one technical domain. Lead one cross-functional project. Build one external mentor relationship.`,
          mistakes: `Job-hopping for $5K raises. Refusing the 'boring' work that earns trust. Avoiding politics entirely.`,
          signals: `Senior people seek your opinion. You're invited above your pay grade. You have one signature piece of work others reference.`,
        },
        {
          label: `Years 8-15 — The Leverage Years`,
          intro: `Make-or-break decade. INTJs either break through to strategic / leadership roles or plateau as senior ICs at $200K forever.`,
          milestones: `Run a function or own a P&L. Hire and develop a successor. Build external visibility (writing, speaking, board work).`,
          mistakes: `Staying technical when strategic doors open. Refusing to manage. Underpricing in negotiations.`,
          signals: `Executives bring you into strategic decisions. You're known outside your company. Comp doubles between years 8 and 15.`,
        },
        {
          label: `Years 16+ — The Architect Phase`,
          intro: `Your peak. INTJs often hit highest earnings between 45 and 60 — opposite the cultural narrative.`,
          milestones: `Executive role, partner, or founder. Board seats. Mentorship pipeline.`,
          mistakes: `Optimizing for prestige over impact. Holding on to operational work you should delegate. Burning out before you compound.`,
          signals: `Multiple income streams. Decision authority over significant resources. Younger versions of you ask for your time.`,
        },
      ],
      investSkills: [
        `Executive communication (memo writing, exec presentations)`,
        `Influence without authority (cross-functional persuasion)`,
        `Capital allocation literacy (P&L, NPV, equity structures)`,
        `Hiring and team architecture (pattern-matching talent)`,
        `One commercial skill: sales, fundraising, or BD`,
      ],
      deprioritizeSkills: [
        `Generic time-management systems (you already have one)`,
        `Public-speaking polish (good-enough wins; depth matters more)`,
        `Networking-for-networking's-sake events`,
        `Productivity tool-hopping`,
      ],
      negotiationOverview: `INTJs are excellent at preparation and weak at the social mechanics of negotiation. You'll research the comp band, build the case, then anchor too low because you don't want to seem aggressive. Fix: write the number you actually want, add 15%, and treat that as your opening. Silence after stating a number is your friend — INTJs over-explain when they should let the offer breathe.`,
      negotiationScripts: [
        { label: `Asking for a raise`, text: `'Based on my contributions over the last 12 months — [specific outcomes] — and benchmarks for this role at [comparable companies], I'd like to bring my comp to [target]. What would it take to get there?'` },
        { label: `Negotiating an offer`, text: `'Thank you for the offer. The base is below the range I'd need to make a move — I'd need [target]. I'm flexible on equity and start date. What can you do?'` },
      ],
      pivots: [
        { title: `Technical IC → Strategy`, text: `Apply technical depth to a strategy problem (e.g., a tech M&A target). Build one strategic deliverable on top of your technical work. Use it to land a strategy role internally or at a consulting firm.` },
        { title: `Corporate → Founder`, text: `Don't quit yet. Validate one wedge nights/weekends or as an internal moonshot. Find a commercial co-founder before leaving. Most failed INTJ founders skipped that step.` },
        { title: `Operating → Investing`, text: `Build a public track record (writing, angel investing, board observer roles). Get to know 5+ funds before you formally apply. INTJs make better investors than firms realize, but they hire on signal.` },
      ],
      traps: [
        { title: `Staying technical too long`, text: `Your strategic value compounds faster than your technical value after year 7. Every year past that costs ~10% in lifetime earnings.` },
        { title: `Underpricing yourself`, text: `INTJs undervalue their work because it 'felt easy.' If something is easy for you and hard for the market, that's leverage. Charge more.` },
        { title: `Avoiding visibility`, text: `Your work speaks for itself only to people in the room. Get in more rooms — one internal-blog post per quarter, one external talk per year, one mentor higher than you.` },
        { title: `Tolerating bad managers`, text: `INTJs rationalize a bad manager for 18 months because 'the work is interesting.' The cost is your trajectory. If they don't promote your work upward, leave.` },
        { title: `Refusing to manage people`, text: `The IC ceiling is real. If you want exec-level comp, you'll need to manage at some point. Don't fight it forever.` },
        { title: `Building in isolation`, text: `Your best work alone is worse than your average work in a high-trust pair. Find one peer thinking partner.` },
      ],
      redFlagPhrases: [
        `'Wear many hats' (means: undefined role, you'll do everyone else's work)`,
        `'Fast-paced environment' (often code for: chaotic, no strategy)`,
        `'We're like a family' (often code for: poor boundaries, weak HR)`,
        `'Self-starter' with no actual autonomy`,
        `'Visibility-driven culture' (style over substance)`,
      ],
      networking: `INTJs hate networking events because they're optimized for ESFPs. Your version is depth, not breadth. Pick 5 people more senior than you in your field and offer them something specific (analysis, an introduction, a paper recommendation) once a quarter. Skip the conferences; have one substantive 1-on-1 per month. Over a decade this builds a more valuable network than any extrovert's Rolodex.`,
      weeks: [
        { label: `Week 1`, text: `Audit current role against the 5 environment factors. Score yourself 1-10 on each. Honest answers only.` },
        { label: `Week 2`, text: `Write a one-page 'where I want to be in 5 years' memo. Comp, role, industry, lifestyle. Don't share yet.` },
        { label: `Week 3`, text: `Identify 3 people who already have the role you want. Read everything they've written. Note the patterns.` },
        { label: `Week 4`, text: `Reach out to 1 of those 3 with a specific, useful observation about their work. No ask. Just a thoughtful note.` },
        { label: `Week 5`, text: `Identify 1 strategic project at your company nobody else is positioned to own. Sketch the proposal.` },
        { label: `Week 6`, text: `Pitch the project to your manager. Frame: here's the problem, here's why I can solve it, here's what I need.` },
        { label: `Week 7`, text: `Start a private weekly journal of strategic insights — what you noticed, decided, missed. This becomes your memo bank.` },
        { label: `Week 8`, text: `Begin one external visibility artifact: memo, Substack, or LinkedIn post series. Quality over quantity.` },
        { label: `Week 9`, text: `Identify your largest skill gap toward your 5-year goal. Find a course, mentor, or book to address it.` },
        { label: `Week 10`, text: `Have a real conversation with your manager about your trajectory. Use the 5-year memo as the frame.` },
        { label: `Week 11`, text: `Reach out to your 2nd target senior person with a specific question or observation.` },
        { label: `Week 12`, text: `Review weeks 1-11. What worked? What didn't? Set the next 90-day plan.` },
      ],
      visionExercise: `Imagine yourself at 60. You're at a quiet dinner with a 30-year-old version of yourself. They ask: 'What's the single decision in your 30s I should make differently?' What do you tell them? Write it down. Now reverse-engineer what you'd have to start doing this quarter to make that answer true.`,
    },
  },
  INTP: {
    title: `INTP — The Thinker`,
    subtitle: `Premium career insights tailored to your INTP profile`,
    careerDna: `You're a pattern-seeker and theory-builder. Your mind produces its best output when given unstructured time to explore and connect. INTPs are vastly undervalued in execution-heavy cultures because your contribution is invisible — you rearrange how problems are understood, not how they're shipped. Learning to translate that value into a career is the single biggest multiplier on your earning potential.`,
    matches: [
      { rank: `1`, role: `Research Scientist / AI Researcher`, fit: `95%`, salary: `$150K – $400K` },
      { rank: `2`, role: `Software Engineer / Systems Architect`, fit: `93%`, salary: `$150K – $450K` },
      { rank: `3`, role: `Data Scientist / Quant Researcher`, fit: `91%`, salary: `$140K – $350K` },
      { rank: `4`, role: `Economist / Financial Analyst`, fit: `88%`, salary: `$120K – $280K` },
      { rank: `5`, role: `Academic / Philosophy-Adjacent Researcher`, fit: `85%`, salary: `$80K – $220K` },
      { rank: `6`, role: `Systems & Product Designer`, fit: `84%`, salary: `$130K – $280K` },
      { rank: `7`, role: `Technical Writer / Independent Analyst`, fit: `80%`, salary: `$90K – $200K` },
    ],
    environment: `You perform at your peak in environments with: deep autonomy over outputs, freedom to explore tangents, asynchronous communication, minimal politics, and peers who enjoy being challenged. You lose energy fast in roles dominated by meetings, status reports, or emotional-labor-heavy teamwork. A small shift toward the right environment can unlock 2x productivity.`,
    leadership: `You lead through reframing the question. INTPs are thought leaders, not people managers — your team follows because you make the problem clearer than anyone else in the room. The risk: you can feel aloof. The fix: explain your reasoning out loud. Your thinking is your leadership; externalize it.`,
    stages: [
      { label: `Years 1–7 — The Restless Years`, text: `You'll job-hop while searching for roles that reward thinking over execution. That's fine — the right fit is worth finding.` },
      { label: `Years 8–15 — The Niche Years`, text: `You'll develop unusually deep expertise in a narrow domain. This is where your compensation curve steepens.` },
      { label: `Years 16+ — The Thought Leader Phase`, text: `You're the person people call when a problem is weird. Consulting, research leadership, or advisor roles pay you for what you already do naturally.` },
    ],
    traps: [
      { title: `Research without shipping`, text: `Ideas are currency only once they're observable. Shipping frequency beats perfection.` },
      { title: `Undervaluing practical skills`, text: `Basic project management and self-promotion add 30%+ to your earnings.` },
      { title: `Avoiding self-marketing`, text: `No one will discover your brilliance by accident. Build one public artifact per quarter.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Pick one domain where you have unusual depth. Write the one-paragraph version of why you're the person to solve problems in it.` },
      { label: `Days 31–60`, text: `Ship one public artifact — essay, open-source contribution, talk, or paper — in that domain.` },
      { label: `Days 61–90`, text: `Build one accountability loop: a peer, coach, or deadline structure that keeps you shipping.` },
    ],
    premium: {
      executiveSummary: `You're a pattern-seeker and theory-builder whose career upside is largely determined by how willing you are to be discovered. INTPs produce the most ideas per capita of any type and capture the smallest share of their value. This report is your blueprint for converting cognitive horsepower into compensation, leverage, and the kind of work that doesn't bore you by year 5.`,
      careerDna: [
        `Your mind reorganizes how problems are understood. While most people grind on solutions, you reframe the problem until the solution becomes obvious. This is uniquely valuable — and uniquely invisible. INTPs are the most underpaid cognitive workforce in the economy.`,
        `You're at your best with unstructured time and the freedom to follow tangents. You're at your worst in execution-heavy, deadline-driven environments where 'finished' beats 'understood.' Your career strategy starts with picking environments that match how your brain actually works.`,
        `The one move that doubles INTP earnings is shipping. Not perfecting. Not over-researching. Shipping. Every published artifact compounds your reputation; every unfinished masterpiece evaporates. Make 'done' a higher value than 'right.'`,
      ],
      strengths: [
        { title: `First-principles reasoning`, text: `You strip a problem to its assumptions and rebuild from scratch. Invaluable in research, engineering, and any domain where the conventional answer is wrong.` },
        { title: `Cross-domain pattern matching`, text: `You connect ideas across fields no one else thought to compare. This is the engine of breakthrough work.` },
        { title: `Tolerance for ambiguity`, text: `You're calm with 'we don't know yet.' Most people aren't. In R&D, AI, and frontier work this is gold.` },
        { title: `Detached analysis`, text: `You can evaluate ideas without emotional attachment — including your own. Rare and high-value.` },
      ],
      matches: [
        { rank: `1`, role: `AI Researcher / Machine Learning Scientist`, fit: `95%`, why: `Why: Open problems, technical depth, written output. Built for INTPs.

Typical day: Reading papers, designing experiments, model training, writing.

Watch for: Optimize for the right lab, not the highest comp — the wrong lab kills your output.`, comp: `Comp: $200K – $700K+ at top labs

Target employers: Anthropic, DeepMind, OpenAI, Meta FAIR, top universities.` },
        { rank: `2`, role: `Principal Software Engineer / Distinguished Engineer`, fit: `93%`, why: `Why: Deep technical leadership without forced people-management.

Typical day: Architecture decisions, mentoring, hard debugging, technical strategy.

Watch for: Avoid being pulled into management against your will.`, comp: `Comp: $300K – $1M+ at top tech companies

Target employers: FAANG, hyperscalers, top-tier infra startups.` },
        { rank: `3`, role: `Quantitative Researcher`, fit: `92%`, why: `Why: Markets are open problems with feedback loops. INTP heaven.

Typical day: Hypothesis testing, model building, signal research, paper-to-prod.

Watch for: Burnout is the major risk; pick funds with healthy hours.`, comp: `Comp: $250K – $1M+ in top funds

Target employers: Citadel, Two Sigma, Jane Street, DE Shaw, Renaissance.` },
        { rank: `4`, role: `Independent Researcher / Substacker / Public Intellectual`, fit: `88%`, why: `Why: Total autonomy, intellectual variety, audience leverage.

Typical day: Reading, writing, podcasting, syndication, occasional consulting.

Watch for: Income takes 2-4 years to build; have runway.`, comp: `Comp: $0 – $1M+ depending on traction

Target employers: Solo. Maybe a small team after year 3.` },
        { rank: `5`, role: `Data Scientist / Senior Analytical Engineer`, fit: `87%`, why: `Why: Complex problems, cross-functional autonomy, real-world data.

Typical day: Modeling, dashboards, A/B testing, stakeholder translation.

Watch for: Avoid roles that are 80% reporting; you need real research time.`, comp: `Comp: $140K – $400K

Target employers: Tech companies, fintech, healthcare AI, consultancies.` },
        { rank: `6`, role: `Academic / Tenured Professor (R1)`, fit: `86%`, why: `Why: Lifetime intellectual freedom, tenure protection, deep work.

Typical day: Research, teaching, advising, grant writing.

Watch for: Path is long and political; only pursue if research itself is the reward.`, comp: `Comp: $100K – $300K+ in select fields

Target employers: Top research universities; STEM and quantitative social sciences pay best.` },
        { rank: `7`, role: `Strategy / Tech Consultant (Specialist Track)`, fit: `84%`, why: `Why: Premium fees, intellectual variety, project-based independence.

Typical day: Client work, modeling, frameworks, writing.

Watch for: INTPs hate the politics of partner-track; specialist or independent suits you better.`, comp: `Comp: $200K – $800K as solo or partner

Target employers: MBB Specialist, top boutiques, independent practice.` },
        { rank: `8`, role: `Software Architect / Engineering Lead (Small Team)`, fit: `83%`, why: `Why: Designs systems, manages 4-8 engineers, retains technical depth.

Typical day: Architecture, code review, hiring, hands-on work.

Watch for: Don't take a role with more than 8 reports — you'll lose the technical work that energizes you.`, comp: `Comp: $220K – $500K total comp

Target employers: Series B-C startups, scale-ups, healthy mid-size tech.` },
        { rank: `9`, role: `Patent Attorney / Technical Lawyer`, fit: `80%`, why: `Why: Combines deep technical interest with high pay and autonomy.

Typical day: Patent drafting, claim analysis, prosecution, expert testimony.

Watch for: Law school is a 3-year detour; only pursue if you genuinely enjoy the work.`, comp: `Comp: $200K – $600K

Target employers: Boutique IP firms, big-law IP groups, in-house at tech companies.` },
        { rank: `10`, role: `Game Designer / Systems Designer`, fit: `79%`, why: `Why: Design problems, system thinking, creative output.

Typical day: Mechanic design, balance, prototyping, playtesting.

Watch for: Industry can be unstable; design diversification helps.`, comp: `Comp: $80K – $250K

Target employers: AAA studios, indie, board game design houses.` },
      ],
      bestIndustries: [
        `AI / ML research and applied research`,
        `Quantitative finance and trading`,
        `Academia (R1 universities, top-30 PhD programs)`,
        `Independent media (Substack, podcasts, niche newsletters)`,
        `Frontier tech (biotech, energy, hard tech)`,
      ],
      avoidIndustries: [
        `Sales-led organizations (transactional, relationship-heavy)`,
        `Hospitality / customer service`,
        `Traditional retail or operations roles`,
      ],
      greenFlags: [
        `Long uninterrupted blocks for thinking and writing`,
        `Async-first communication culture`,
        `Smart colleagues who push your thinking`,
        `Outcomes evaluated over months, not weeks`,
        `Permission to follow tangents`,
      ],
      redFlags: [
        `Daily standups, weekly check-ins as performance theater`,
        `Time-tracking or billable-hours pressure`,
        `Customer-facing rotation as 'culture building'`,
        `Open-plan offices with constant interruption`,
        `Managers who measure activity over output`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$70K – $140K`, driver: `Building technical depth. The 'right' role matters more than salary.` },
        { stage: `Years 4-7`, range: `$140K – $250K`, driver: `First specialty emerges. Salary jumps when you ship something visible.` },
        { stage: `Years 8-15`, range: `$250K – $500K`, driver: `Niche depth pays. Senior IC or principal roles. Independent income becomes plausible.` },
        { stage: `Years 16-25`, range: `$400K – $1M+`, driver: `Thought leadership, books, advisory. Multiple income streams.` },
        { stage: `Years 25+`, range: `$300K – multi-million`, driver: `Equity, royalties, portfolio. INTPs often peak late.` },
      ],
      leadershipStrengths: [
        `Reframing problems so the team can move`,
        `Defending intellectual rigor under pressure`,
        `Spotting flawed reasoning in plans before they fail`,
        `Cultivating individual talent through respect for ideas`,
      ],
      leadershipBlindspots: [
        `Avoiding necessary confrontations`,
        `Under-communicating (you assume what's obvious to you is obvious)`,
        `Letting strategy drift while exploring tangents`,
        `Discomfort with emotional labor`,
      ],
      leadershipScripts: [
        { label: `When the team is stuck`, text: `'Let's restate the problem in three sentences. What are we actually solving for? What constraints are real vs assumed?'` },
        { label: `Giving feedback`, text: `'Here's what I observed. Here's the impact I think it has. Curious how you see it.' (Leaves room — INTPs hate dictating.)` },
        { label: `Setting direction`, text: `'The hypothesis we're testing this quarter is X. If we see Y, we double down. If we see Z, we change direction.' (Frames as experiment, not edict.)` },
      ],
      stages: [
        { label: `Years 1-7 — The Restless Phase`, intro: `You'll job-hop while searching for environments that reward thinking over execution. That's fine — the right fit is worth finding.`, milestones: `Master one technical domain. Publish (blog, paper, repo). Build a small reputation in one community.`, mistakes: `Endless side projects without finishing. Switching domains every 12 months. Underselling yourself in interviews.`, signals: `Senior peers know your name. You've shipped one substantial public artifact. You've turned down at least one job that wasn't right.` },
        { label: `Years 8-15 — The Niche Phase`, intro: `Compounding starts. INTPs who pick a niche and stay 5+ years out-earn restless peers by 2-3x.`, milestones: `Become known for one specialty. Speak or write publicly. Develop one income stream beyond salary.`, mistakes: `Drifting into management to chase comp. Ignoring business skills. Hoarding ideas.`, signals: `Recruiters reach out by name. You set rates rather than accept them. You teach or mentor formally.` },
        { label: `Years 16+ — The Thought Leader Phase`, intro: `Peak earning and influence years. Books, advisory, speaking, equity all compound.`, milestones: `Senior advisor, principal researcher, or independent practice. Equity portfolio. Body of work.`, mistakes: `Fading into pure isolation. Letting tangents pull you off your signature work. Mistaking respect for income.`, signals: `Multiple revenue streams. People pay for your time. You choose your work.` },
      ],
      investSkills: [
        `Writing (essays, papers, technical posts)`,
        `One in-demand technical specialty (deep, not broad)`,
        `Spoken communication for non-experts`,
        `Basic business and pricing literacy`,
        `One sales-adjacent skill: pitching ideas, fundraising, or proposals`,
      ],
      deprioritizeSkills: [
        `Generic management training`,
        `Status-driven networking`,
        `Productivity tool-hopping`,
        `Polishing presentations beyond clear`,
      ],
      negotiationOverview: `INTPs negotiate poorly because they treat negotiation as a logic puzzle the other side will eventually solve in your favor. They won't. Negotiation is performance. Prepare your case, then practice saying the number out loud 20 times before the call. Most INTP underpay is from the inability to ask. Asking — calmly, factually, repeatedly — is the whole skill.`,
      negotiationScripts: [
        { label: `Stating your number`, text: `'For the scope and impact described, my expected comp is [target]. That's based on [comparable benchmarks]. Where does that land for you?'` },
        { label: `Defending against scope creep`, text: `'Happy to take on [new thing]. To do it well, I'd need to drop [old thing] or extend the timeline. Which works better for you?'` },
      ],
      pivots: [
        { title: `Academic → Industry research`, text: `Translate one academic skill (paper, dataset, method) into an industry-relevant artifact. Reach out to industry researchers via that artifact. Path is shorter than INTPs assume.` },
        { title: `Engineer → AI Researcher`, text: `Pick one open ML problem. Build, write, publish. Repeat 3 times over 18 months. You'll get inbound from labs.` },
        { title: `Employee → Independent (Substack/consulting)`, text: `Build audience nights/weekends for 18-24 months while employed. Quit only when income covers ~60% of salary.` },
      ],
      traps: [
        { title: `Endless research without shipping`, text: `Ideas are currency only when observable. Shipping frequency beats perfection. Publish before you're ready, every time.` },
        { title: `Undervaluing practical skills`, text: `Project management, writing, basic sales add 30%+ to lifetime earnings. Don't dismiss them as 'beneath you.'` },
        { title: `Avoiding self-marketing`, text: `No one will discover your brilliance by accident. One public artifact per quarter, minimum.` },
        { title: `Chronic exploration without commitment`, text: `You can't learn 12 things at expert depth. Pick one for 5 years.` },
        { title: `Tolerating dysfunctional environments`, text: `INTPs adapt to bad cultures because they 'live in their heads.' The output cost is real. Leave faster.` },
        { title: `Charging hourly`, text: `Hourly rates cap your income at hours-in-day. Productize, package, or salary up. Anything but pure hourly past year 5.` },
      ],
      redFlagPhrases: [
        `'Hit the ground running' (no onboarding, no thinking time)`,
        `'Wear many hats' (no focus, constant context-switching)`,
        `'High-energy team' (extrovert-default, exhausting)`,
        `'Customer-obsessed' if applied to engineering roles (means: support work)`,
        `'Move fast and break things' as policy (no time for rigor)`,
      ],
      networking: `Forget conferences. Build a 'thinking network': 8-12 people you exchange ideas with quarterly via writing or 1-on-1s. Send them papers, drafts, half-formed thoughts. INTPs build deep, durable networks via intellectual exchange — not coffee chats.`,
      weeks: [
        { label: `Week 1`, text: `Pick one domain you have unusual depth in. Write a one-paragraph 'I'm the person to solve X' statement.` },
        { label: `Week 2`, text: `Inventory unfinished projects. Pick the ONE worth shipping. Mark a publish date.` },
        { label: `Week 3`, text: `Set a writing/output habit: 30 min, 3x/week, same time. No exceptions for 12 weeks.` },
        { label: `Week 4`, text: `Reach out to one person whose work you respect. Send a specific, thoughtful observation. No ask.` },
        { label: `Week 5`, text: `Begin shipping the chosen project — even rough version. Publish weekly progress updates.` },
        { label: `Week 6`, text: `Identify your top earning lever (specialty, audience, employer match). Pick one to invest in for the year.` },
        { label: `Week 7`, text: `Audit time vs output. Cut 2 things from your calendar that don't serve the year-long goal.` },
        { label: `Week 8`, text: `Ship a public artifact (blog post, repo, talk). Even if rough. Done > perfect.` },
        { label: `Week 9`, text: `Reach out to a second person. Same protocol — substantive, no ask.` },
        { label: `Week 10`, text: `Negotiate something — a raise, a rate, a scope. Practice the script aloud first.` },
        { label: `Week 11`, text: `Review the year-long goal. Adjust based on 10 weeks of data. Be honest.` },
        { label: `Week 12`, text: `Set the next 90-day plan. Cut twice as much as you add.` },
      ],
      visionExercise: `Imagine your obituary in 30 years. What's the work you're known for? Write three sentences. Now ask: what would you have to start building this year for those sentences to be true? Most INTPs already know the answer; the exercise is just permission to start.`,
    },
  },
  ENTJ: {
    title: `ENTJ — The Leader`,
    subtitle: `Premium career insights tailored to your ENTJ profile`,
    careerDna: `You're wired to organize people, resources, and strategy toward an ambitious goal. ENTJs are only ~2% of the population but vastly overrepresented among CEOs and senior executives. You have the highest earnings ceiling of any personality type — but also the highest risk of burning out the relationships that got you there. The bottleneck on your career is almost never strategy. It's patience.`,
    matches: [
      { rank: `1`, role: `CEO / Senior Executive`, fit: `96%`, salary: `$300K – $2M+` },
      { rank: `2`, role: `Management Consultant Partner`, fit: `93%`, salary: `$250K – $800K` },
      { rank: `3`, role: `Private Equity / Investment Banking Partner`, fit: `91%`, salary: `$400K – $2M+` },
      { rank: `4`, role: `Corporate Attorney (Partner Track)`, fit: `89%`, salary: `$250K – $1M` },
      { rank: `5`, role: `Entrepreneur / Founder`, fit: `88%`, salary: `Variable, high ceiling` },
      { rank: `6`, role: `Business School Dean / Academic Leader`, fit: `85%`, salary: `$200K – $600K` },
      { rank: `7`, role: `Chief Revenue Officer / Sales Leadership`, fit: `87%`, salary: `$250K – $700K` },
    ],
    environment: `You thrive in environments with: clear authority, performance-based culture, ambitious peers, measurable outcomes, and high-stakes decisions. You wither in consensus-heavy, slow-moving bureaucracies. The single biggest lever on your career is choosing an industry that moves at your speed.`,
    leadership: `You lead commandingly and directly. The upside: clarity and speed. The risk: bulldozing the people who would follow you forever if given a little air. The fix is not softness — it's deliberate listening. Spend 25% of leadership time asking, not telling. Your team's output will surprise you.`,
    stages: [
      { label: `Years 1–7 — The Proving Years`, text: `You'll grind visibly harder than peers and get frustrated by slow promotions. Credibility compounds; trust the curve.` },
      { label: `Years 8–15 — The Team-Building Years`, text: `You'll stop doing the work and start multiplying through people. Your soft skills become your hard skills.` },
      { label: `Years 16+ — The Empire Years`, text: `You're running something substantial. The question shifts from 'can I win?' to 'what do I want to win at?'` },
    ],
    traps: [
      { title: `Impatience costing key relationships`, text: `The person you steamrolled in year 5 becomes the gatekeeper in year 15.` },
      { title: `Neglecting rest and family`, text: `ENTJs burn out harder than any type because you won't notice it coming.` },
      { title: `Underestimating introverted talent`, text: `Your quietest team member may be your most valuable one. Hunt for them.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Identify the highest-leverage problem in your current organization. Put your name on it.` },
      { label: `Days 31–60`, text: `Build a coalition of 3–5 people who have different skills than you. Your career ceiling is their ceiling too.` },
      { label: `Days 61–90`, text: `Execute ruthlessly on the core bet. Document wins in a way others can cite.` },
    ],
    premium: {
      executiveSummary: `You have the highest career ceiling of any of the 16 types — and the highest risk of burning the people who would have followed you to it. Among ENTJs in their 50s, the differentiator between $5M outcomes and $50M outcomes is rarely strategy; it's almost always relational capital. This report is your operating manual for converting drive into compounding leverage without burning your bridges.`,
      careerDna: [
        `You are wired to organize people, resources, and strategy toward an ambitious goal. You don't deliberate; you decide. You don't wait for permission; you take ground. The world rewards this — ENTJs are vastly overrepresented in C-suites, founders, and senior partners despite being only ~2% of the population.`,
        `Your default cognitive sequence is: size up the situation, identify leverage, move. This is a superpower in fast-moving environments and a liability in slow-moving ones. ENTJs in bureaucracies are often the most frustrated employees in the building, and the most promoted in cultures that reward decisiveness.`,
        `The hardest lesson for ENTJs is that your career ceiling is set by how many people will still take your call after you've left a role. The relationships you protect — and the ones you bulldoze — compound for or against you over decades. Strategy is the easy part. Patience with people is the bottleneck.`,
      ],
      strengths: [
        { title: `Strategic pattern recognition`, text: `You see the 5-move chess game while peers are placing pieces. Invaluable in capital allocation, turnarounds, and competitive strategy.` },
        { title: `Decisive action under ambiguity`, text: `You make calls with 60% information that others wait for 90% to make. In high-velocity environments this is a 10x advantage.` },
        { title: `Coalition-building toward a goal`, text: `You can rally people behind a vision when you focus on it. Your weakness is forgetting to focus on it.` },
        { title: `Tolerance for hard truths`, text: `You can hear bad news without flinching. Once your team learns this, you become the leader they bring problems to first.` },
      ],
      matches: [
        { rank: `1`, role: `CEO / Senior Executive (PE-backed or Public)`, fit: `96%`, why: `Why: Capital allocation + leadership + strategy. Your highest-leverage role.

Typical day: Board prep, key hires, capital decisions, customer wins, exec offsites.

Watch for: Diligence the culture as hard as the financials. ENTJs in fragile cultures fail in 18 months.`, comp: `Comp: $300K base + equity → $2M+ all-in

Target employers: PE portfolio companies, late-stage tech, mid-cap public.` },
        { rank: `2`, role: `Management Consulting Partner (MBB / Premium Boutique)`, fit: `93%`, why: `Why: High-velocity decisions on big problems. Built for ENTJ wiring.

Typical day: Client portfolio management, partner reviews, BD, recruiting senior talent.

Watch for: Up-or-out is real; don't coast in the senior-manager years.`, comp: `Comp: $300K – $2M+ at partner level

Target employers: McKinsey, BCG, Bain, top boutiques.` },
        { rank: `3`, role: `Investment Banking / Private Equity Partner`, fit: `92%`, why: `Why: Velocity, leverage, and big-dollar decisions. ENTJ playground.

Typical day: Deal sourcing, diligence, negotiations, portfolio support.

Watch for: Lifestyle is brutal; pace yourself or your relationships will pay.`, comp: `Comp: $500K – $5M+ at MD/Partner

Target employers: Bulge bracket, top middle-market PE, growth equity.` },
        { rank: `4`, role: `Founder / CEO (Venture-backed)`, fit: `92%`, why: `Why: Highest variance, highest ceiling. ENTJs are the prototypical founder type.

Typical day: Vision, fundraising, key hires, sales, board management.

Watch for: Hire complementary skills early. Solo-ENTJ founders steamroll their teams.`, comp: `Comp: $0 – $100M+ outcome variance

Target employers: Tech, services, healthcare, fintech.` },
        { rank: `5`, role: `General Counsel / Senior Partner (Big Law)`, fit: `89%`, why: `Why: Leadership, strategic counsel, big problems with big stakes.

Typical day: Deal review, litigation strategy, partner management, business advice.

Watch for: Law school is a long detour; only pursue if leverage and prestige matter.`, comp: `Comp: $500K – $2M+ at top firms

Target employers: AmLaw 50, top-tier in-house roles.` },
        { rank: `6`, role: `Sales / Revenue Leadership (CRO / VP Sales)`, fit: `88%`, why: `Why: Quota responsibility, team leverage, comp upside.

Typical day: Pipeline reviews, exec selling, hiring, comp design.

Watch for: Quota cycles can wear; pick companies with realistic targets.`, comp: `Comp: $300K base + variable → $1M+

Target employers: Enterprise SaaS, B2B services, mid-cap tech.` },
        { rank: `7`, role: `Hedge Fund Portfolio Manager (Sector or Macro)`, fit: `87%`, why: `Why: Decisive capital deployment, performance compensation, high autonomy.

Typical day: Thesis development, position sizing, risk management, investor relations.

Watch for: Drawdowns are existential; risk discipline is the differentiator.`, comp: `Comp: $500K – multi-million (high variance)

Target employers: Multi-strategy funds, sector specialists, macro shops.` },
        { rank: `8`, role: `Operating Partner (PE / Growth Equity)`, fit: `85%`, why: `Why: Leverage at scale across a portfolio without quarterly earnings pressure.

Typical day: Portfolio company strategy, exec hiring, value-creation plans.

Watch for: Hard to break in mid-career; usually requires CEO-level experience first.`, comp: `Comp: $400K – $1.5M+ + carry

Target employers: PE platforms (KKR, Apollo, Blackstone, Vista, Thoma Bravo).` },
        { rank: `9`, role: `Business School Dean / Senior Academic Administrator`, fit: `82%`, why: `Why: Vision plus institutional leadership; influence over a generation.

Typical day: Faculty management, fundraising, curriculum strategy, board relations.

Watch for: Academic politics may frustrate ENTJ velocity; pick schools that move.`, comp: `Comp: $300K – $1M+ at top schools

Target employers: Top-30 MBA programs, executive education leaders.` },
        { rank: `10`, role: `Independent Strategy / Executive Coaching (post-CEO)`, fit: `80%`, why: `Why: High autonomy, premium rates, board-adjacent influence.

Typical day: Coaching, advisory, board work, occasional interim CEO.

Watch for: Best as a second-act career after a CEO role; hard to start cold.`, comp: `Comp: $500K – $2M+ at scale

Target employers: Solo or boutique partnership.` },
      ],
      bestIndustries: [
        `Private equity / growth equity / venture capital`,
        `Enterprise SaaS and B2B technology`,
        `Management consulting (MBB and premium boutiques)`,
        `Financial services (investment banking, hedge funds)`,
        `Founder-friendly verticals (fintech, healthtech, deeptech)`,
      ],
      avoidIndustries: [
        `Slow-moving traditional industries (utilities, public sector)`,
        `Roles structured around consensus over decisive action`,
        `Careers requiring long, low-feedback gestation (some academic paths)`,
      ],
      greenFlags: [
        `Performance-measured culture with clear KPIs`,
        `Ambitious peer group that pushes you`,
        `Decision authority commensurate with responsibility`,
        `Fast feedback loops (weeks, not quarters)`,
        `Equity / variable comp tied to outcomes`,
      ],
      redFlags: [
        `Consensus-driven decision-making with no tiebreaker`,
        `Title inflation without authority`,
        `Risk-averse leadership that vetoes initiatives`,
        `Long approval cycles for routine moves`,
        `Cultures that punish bluntness`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$80K – $160K`, driver: `Build credibility and visible wins. Don't chase title; chase access to senior leaders.` },
        { stage: `Years 4-7`, range: `$160K – $300K`, driver: `First leverage point. Manage a team or own a P&L. Negotiate hard.` },
        { stage: `Years 8-15`, range: `$300K – $800K`, driver: `Director → VP → SVP. Equity becomes meaningful. Network compounds.` },
        { stage: `Years 16-25`, range: `$600K – $3M+`, driver: `Executive, partner, or founder level. Multiple income streams.` },
        { stage: `Years 25+`, range: `$1M – $20M+`, driver: `Board portfolios, advisory, equity outcomes. Many ENTJs hit peak earnings post-55.` },
      ],
      leadershipStrengths: [
        `Speed of decision and action`,
        `Vision clarity that rallies teams`,
        `Ruthless prioritization under pressure`,
        `High tolerance for hard conversations`,
      ],
      leadershipBlindspots: [
        `Bulldozing dissent until no one brings you bad news`,
        `Mistaking compliance for alignment`,
        `Underestimating introverted talent`,
        `Burning out top performers by setting your pace as theirs`,
      ],
      leadershipScripts: [
        { label: `Slowing down to listen`, text: `'Before I respond, I want to make sure I heard you. Tell me more about what's behind that.' (Forces you to pause and them to expand.)` },
        { label: `Inviting pushback`, text: `'I'm leaning toward X. What's the strongest argument against it that nobody's saying?' (Structurally invites dissent.)` },
        { label: `Promoting a quieter team member`, text: `'[Name] led this. I want to make sure their contribution is visible to leadership.' (Public attribution, repeatable.)` },
      ],
      stages: [
        { label: `Years 1-7 — The Proving Years`, intro: `You'll grind visibly harder than peers. Promotions will feel slow. Trust the curve — credibility compounds.`, milestones: `Lead one cross-functional initiative. Build one external mentor. Develop comfort with corporate politics.`, mistakes: `Mistaking velocity for direction. Burning peers you'll need later. Job-hopping for $10K raises.`, signals: `Senior leaders bring you into rooms. You're given hard problems first. You have a clear sponsor.` },
        { label: `Years 8-15 — The Team-Building Years`, intro: `You stop doing the work and start multiplying through people. Soft skills become hard skills.`, milestones: `Manage 10+ people directly or 50+ indirectly. Develop one successor. Build external visibility.`, mistakes: `Holding on to operational tasks. Refusing to develop the next layer. Skipping difficult conversations.`, signals: `Comp jumps significantly. You're hired into bigger roles by reputation, not application. Your team is sticky.` },
        { label: `Years 16+ — The Empire Years`, intro: `You're running something substantial. Question shifts from 'can I win?' to 'what do I want to win at?'`, milestones: `C-suite role, partnership, or successful founder. Board seats. Strategic mentorship.`, mistakes: `Optimizing for prestige over impact. Sacrificing health for one more deal. Becoming the bottleneck.`, signals: `Multiple compounding income streams. Decision authority over significant capital. Lasting institutional influence.` },
      ],
      investSkills: [
        `Active listening (yes, really — your highest leverage skill)`,
        `Written executive communication (memos, board updates)`,
        `Capital allocation and equity-structure literacy`,
        `Hiring at the executive level`,
        `Storytelling for fundraising / investors / boards`,
      ],
      deprioritizeSkills: [
        `Operational tooling beyond fluency`,
        `Generic time-management systems (you have one)`,
        `Public speaking polish beyond competent`,
        `Conference networking for its own sake`,
      ],
      negotiationOverview: `ENTJs are the strongest natural negotiators of any type. Your risk is overplaying your hand and damaging the relationship. The best ENTJ negotiators do their pushing privately, finalize in writing, and protect the other side's dignity. Always. The deals you'll regret are the ones you 'won' too publicly.`,
      negotiationScripts: [
        { label: `Compensation conversation`, text: `'Based on the scope and the impact I'm bringing, I'd expect comp at [target]. Walk me through how you got to your number — there may be levers I'm not seeing.'` },
        { label: `Pushing back without burning the room`, text: `'I want to make this work. Where I'm stuck is [issue]. What flexibility do you have on [specific lever]?'` },
      ],
      pivots: [
        { title: `Operator → Investor (PE / VC)`, text: `Build a public investor track record (writing, angel investments, board observer roles). Get to know 10+ funds. Most successful operator → investor pivots happen between years 12-20.` },
        { title: `Big-company executive → Founder`, text: `Validate an idea from your industry edge. Raise from people who knew you. Don't quit until your founder identity is more compelling than your title.` },
        { title: `Sales / Operating leader → CEO`, text: `Move into roles with full P&L responsibility, not just functional ownership. Most VPs who became CEOs ran a business unit first.` },
      ],
      traps: [
        { title: `Impatience costing key relationships`, text: `The peer you steamrolled in year 5 becomes the gatekeeper in year 15. Cost: your CEO seat.` },
        { title: `Neglecting rest and family`, text: `ENTJs burn out harder than any type because you won't notice it coming. Build in rest like a non-negotiable KPI.` },
        { title: `Underestimating introverted talent`, text: `Your quietest team member may be your most valuable one. Hunt for them deliberately.` },
        { title: `Steamrolling dissent`, text: `When no one disagrees with you, your decisions get worse. Build structural disagreement into your process.` },
        { title: `Tolerating mediocre #2s`, text: `Your trajectory is capped by your weakest direct report. Upgrade ruthlessly but humanely.` },
        { title: `Mistaking authority for trust`, text: `Compliance is cheap; trust compounds. Spend the time.` },
      ],
      redFlagPhrases: [
        `'Consensus-driven culture' (translation: you can't decide)`,
        `'Highly matrixed organization' (translation: no clear ownership)`,
        `'Long sales cycles' if you're operationally focused (slow feedback kills ENTJs)`,
        `'Quietly confident leaders' (often code for: low ambition)`,
        `'Work-life balance' as a top selling point (often code for: low intensity)`,
      ],
      networking: `Your network is your single largest career asset. Treat it like a portfolio. Maintain a list of ~150 people you'll touch quarterly (CRM-grade). Have one substantive conversation per week with someone outside your company. ENTJs who do this for 10 years become the most-connected operator in their industry and inherit deal flow for free.`,
      weeks: [
        { label: `Week 1`, text: `Identify the highest-leverage problem in your current org. Put your name on it publicly.` },
        { label: `Week 2`, text: `List your top 50 relationships. Score them: when did we last talk? What do they need from me?` },
        { label: `Week 3`, text: `Reach out to 5 from that list with a specific, useful offer. No ask.` },
        { label: `Week 4`, text: `Build a coalition of 3 people inside your org with skills different from yours. Set a recurring rhythm.` },
        { label: `Week 5`, text: `Identify the one part of your job you're holding on to that you should delegate. Hand it off this week.` },
        { label: `Week 6`, text: `Schedule one hard conversation you've been avoiding. Have it. Move on.` },
        { label: `Week 7`, text: `Block 3 hours/week for strategic thinking. Treat as inviolable. Use for the project from week 1.` },
        { label: `Week 8`, text: `Pick one external visibility move: speaking, writing, or board prep. Commit publicly.` },
        { label: `Week 9`, text: `Have a real conversation with your manager / board about your trajectory and comp.` },
        { label: `Week 10`, text: `Hire or upgrade one role on your team. ENTJ trajectories hinge on talent quality.` },
        { label: `Week 11`, text: `Audit your physical health. Sleep, exercise, nutrition. ENTJs ignore this until it costs them.` },
        { label: `Week 12`, text: `Set the next 90-day plan with a specific, measurable goal. Tell three people who will hold you to it.` },
      ],
      visionExercise: `Imagine your retirement party. Two groups of people are there: one whose careers you accelerated, one whose careers you didn't. Who's in each? What do you wish you'd done differently? The answer is your hiring and management strategy for the next 10 years.`,
    },
  },
  ENTP: {
    title: `ENTP — The Innovator`,
    subtitle: `Premium career insights tailored to your ENTP profile`,
    careerDna: `You're an idea-generator and productive disrupter. You see angles other people miss and connect fields they assume are unrelated. Your career sweet spot is environments that reward novel thinking and tolerate productive chaos — which is rarer than you think. When you find it, you outperform everyone. When you don't, you underperform yourself.`,
    matches: [
      { rank: `1`, role: `Startup Founder / Entrepreneur`, fit: `94%`, salary: `Variable, very high ceiling` },
      { rank: `2`, role: `Venture Capitalist / Investor`, fit: `91%`, salary: `$250K – $1M+` },
      { rank: `3`, role: `Strategy Consultant`, fit: `90%`, salary: `$180K – $500K` },
      { rank: `4`, role: `Product Manager (Innovation-focused)`, fit: `89%`, salary: `$160K – $350K` },
      { rank: `5`, role: `Litigation Attorney / Trial Lawyer`, fit: `87%`, salary: `$180K – $700K` },
      { rank: `6`, role: `Marketing & Brand Strategist`, fit: `85%`, salary: `$130K – $300K` },
      { rank: `7`, role: `Journalist / Public Thought Leader`, fit: `80%`, salary: `$90K – $300K` },
    ],
    environment: `You need intellectual stimulation, tolerance for debate, fast feedback cycles, and low bureaucracy. ENTPs are miserable in environments that reward sameness. Pay a salary cut, if needed, to work somewhere you can think out loud — the long-term earnings will more than compensate.`,
    leadership: `You lead as a visionary provocateur. You inspire action by making the status quo look boring. The risk: you start more than you finish. The fix: find a completion partner and protect them with your life. Your ideas plus their discipline is a legendary combination.`,
    stages: [
      { label: `Years 1–7 — The Pivot Years`, text: `You'll try 3–5 different paths. Each teaches you something. Resist the pressure to commit too early.` },
      { label: `Years 8–15 — The Convergence Years`, text: `Your seemingly random experiences become a signature synthesis only you can offer.` },
      { label: `Years 16+ — The Mentor/Investor Phase`, text: `You back and advise the next generation of builders. Your portfolio thinking pays off compounded.` },
    ],
    traps: [
      { title: `Boredom-driven pivots`, text: `The boredom is usually in you, not the opportunity. Staying 2 more years doubles compounding returns.` },
      { title: `Conflict as sport`, text: `Debates that feel fun to you can corrode relationships. Ask if you're debating to learn or to win.` },
      { title: `Neglecting follow-through`, text: `Ideas are cheap. Execution is expensive. Price your time accordingly.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Kill three side projects. Free the cognitive space for one core bet.` },
      { label: `Days 31–60`, text: `Ship one core project end-to-end, not 70% of five.` },
      { label: `Days 61–90`, text: `Hire or partner with an operator who finishes what you start.` },
    ],
    premium: {
      executiveSummary: `You're an idea generator and pattern disrupter. You see angles others miss and connect fields they assume are unrelated. Your career ceiling is genuinely uncapped — but only if you can solve the ENTP paradox: shipping. The graveyard of ENTP potential is full of brilliant ideas, half-finished. This report is your operating manual for finishing.`,
      careerDna: [
        `Your mind is a combinatorial engine. You see frame, reframe, and counter-frame in seconds. This is breathtaking in environments that reward novelty and dead in environments that reward consistency. Pick your environment first; everything else follows.`,
        `You're at your best when you're learning at the edge — fast, in public, with stakes. You're at your worst doing the same thing twice. ENTPs who try to be 'reliable employees' burn out; ENTPs who design careers around novelty thrive.`,
        `The single move that doubles ENTP outcomes is partnering with a finisher. Solo ENTP careers cap. Partnered ENTP careers (with an ISTJ, ISFJ, or ENTJ executor) compound for decades. Find your finisher early and protect them with your life.`,
      ],
      strengths: [
        { title: `Combinatorial creativity`, text: `You combine ideas from different fields in ways no one expects. This is the engine of disruption — high-value in startups, strategy, and creative industries.` },
        { title: `Devil's advocacy under pressure`, text: `You can argue any side of a debate well. In strategy and law this is gold; in customer service it's a liability.` },
        { title: `Rapid context-switching`, text: `You move between domains faster than peers can follow. Asset for founders and consultants; risk for specialist roles.` },
        { title: `Comfort with conflict and debate`, text: `You enjoy productive disagreement. Most people don't. In high-stakes negotiation this is decisive.` },
      ],
      matches: [
        { rank: `1`, role: `Founder / CEO (Disruption-stage Startup)`, fit: `94%`, why: `Why: ENTPs are over-represented among successful founders for a reason.

Typical day: Vision, fundraising, customer discovery, hiring, sales.

Watch for: Hire a finisher #2 before product-market fit, not after.`, comp: `Comp: $0 – $100M+ outcome variance

Target employers: Tech, services, healthcare, marketplaces.` },
        { rank: `2`, role: `Venture Capitalist / Growth-Stage Investor`, fit: `92%`, why: `Why: Pattern matching across industries plus founder empathy.

Typical day: Sourcing, diligence, founder support, board work.

Watch for: Junior VC roles can be repetitive; aim for partner track or specialty.`, comp: `Comp: $300K – $2M+ at partner level

Target employers: Top-tier VC funds, growth equity, corporate VC.` },
        { rank: `3`, role: `Strategy Consultant (Innovation / Disruption Practice)`, fit: `90%`, why: `Why: Big problems, smart clients, high-variance projects.

Typical day: Client work, hypothesis development, partner-track BD.

Watch for: Up-or-out structure can be brutal; build sponsor relationships.`, comp: `Comp: $200K – $700K+ partner level

Target employers: MBB innovation practices, premium boutiques.` },
        { rank: `4`, role: `Product Manager (Innovation-focused) / VP Product`, fit: `89%`, why: `Why: Define what to build, why it matters, who it's for.

Typical day: Customer research, roadmap, cross-functional alignment, exec reviews.

Watch for: Avoid maintenance product roles; you'll suffocate.`, comp: `Comp: $160K – $500K total comp

Target employers: FAANG, late-stage startups, scale-ups, B2B SaaS.` },
        { rank: `5`, role: `Trial Lawyer / Litigator`, fit: `87%`, why: `Why: Adversarial environment rewards your debate-loving wiring.

Typical day: Case strategy, depositions, witness prep, courtroom.

Watch for: Hours are punishing in years 1-7; only worth it if you love the work.`, comp: `Comp: $200K – $1M+ at partner / top firm

Target employers: Big Law litigation, plaintiffs' firms, white-collar criminal defense.` },
        { rank: `6`, role: `Marketing / Brand Strategist (Senior)`, fit: `85%`, why: `Why: Storytelling plus pattern recognition plus speed.

Typical day: Brand strategy, campaign development, exec advising, agency leadership.

Watch for: Marketing can be vibe-driven; choose data-respecting environments.`, comp: `Comp: $150K – $500K

Target employers: Top agencies, in-house brand at consumer leaders, freelance senior roles.` },
        { rank: `7`, role: `Journalist / Independent Media (Subscriber-driven)`, fit: `84%`, why: `Why: High variance, full creative control, audience leverage.

Typical day: Reporting, writing, podcasting, distribution.

Watch for: Income lags audience by 1-2 years; build runway first.`, comp: `Comp: $80K – $1M+ depending on traction

Target employers: Substack, top publications, podcast networks.` },
        { rank: `8`, role: `Sales Leader (Enterprise / Strategic Accounts)`, fit: `83%`, why: `Why: High-stakes negotiation, pattern matching across deals.

Typical day: Pipeline, exec selling, deal strategy, team leadership.

Watch for: Quotas can grind ENTPs; pick teams with realistic targets and creative deal structures.`, comp: `Comp: $200K + variable → $1M+

Target employers: Enterprise SaaS, B2B services, growth-stage companies.` },
        { rank: `9`, role: `Talent Agent / Booking Manager`, fit: `80%`, why: `Why: Deal-making, story selling, relationship leverage.

Typical day: Client management, deal negotiation, BD, scouting.

Watch for: Industry can be cyclical and political; build durable client relationships.`, comp: `Comp: $100K – $500K+

Target employers: Top agencies (CAA, WME, UTA), boutique firms.` },
        { rank: `10`, role: `Public Speaker / Workshop Leader`, fit: `78%`, why: `Why: Premium fees per hour, intellectual variety, audience leverage.

Typical day: Speaking, workshop design, content development.

Watch for: Building a speaking practice takes 5-7 years; book it on top of another role first.`, comp: `Comp: $200K – $1M+ for established speakers

Target employers: Independent practice, agency representation.` },
      ],
      bestIndustries: [
        `Venture-backed tech and startups`,
        `Strategy consulting (innovation practices)`,
        `Venture capital and growth equity`,
        `Subscriber-driven media (newsletters, podcasts, premium content)`,
        `Litigation and trial law`,
      ],
      avoidIndustries: [
        `Roles requiring repetitive specialist work`,
        `Bureaucracies with multi-month approval cycles`,
        `Customer-service-heavy roles`,
      ],
      greenFlags: [
        `High intellectual variety and new problems weekly`,
        `Tolerance for productive debate`,
        `Outcome-based evaluation`,
        `Fast feedback loops`,
        `Smart, opinionated colleagues`,
      ],
      redFlags: [
        `Repetitive operational work`,
        `Heavy policy and process culture`,
        `Single-stakeholder approval chains`,
        `'Stay in your lane' management`,
        `Conflict-averse cultures`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$80K – $150K`, driver: `Multiple pivots are normal. Optimize for learning velocity and exposure to senior leaders.` },
        { stage: `Years 4-7`, range: `$150K – $280K`, driver: `Specialty starts to emerge. First real comp jump.` },
        { stage: `Years 8-15`, range: `$280K – $700K`, driver: `Synthesis of varied experience pays. Leadership or specialty roles.` },
        { stage: `Years 16-25`, range: `$500K – $3M+`, driver: `Founder, partner, or independent practice. Equity matters.` },
        { stage: `Years 25+`, range: `$1M – $20M+`, driver: `Boards, advisory, portfolio. ENTPs often peak through compounding networks.` },
      ],
      leadershipStrengths: [
        `Energizing teams with vision and possibility`,
        `Reframing problems when the team is stuck`,
        `Recruiting talent through pure enthusiasm`,
        `Comfort delivering hard truths in negotiations`,
      ],
      leadershipBlindspots: [
        `Pivoting strategy too often (team whiplash)`,
        `Starting more than you can finish`,
        `Underestimating operational discipline`,
        `Conflict-as-sport bleeding into team dynamics`,
      ],
      leadershipScripts: [
        { label: `Committing to direction`, text: `'We're committing to X for the next 6 months. I'm not going to change it. If something breaks, we'll fix it inside that frame.' (Counters your own pivot tendency.)` },
        { label: `Defending your finisher`, text: `'[Name] keeps us shipping. When you ask them for changes, please route through me first.' (Protects the operator who keeps your vision real.)` },
        { label: `Slowing down before pivoting`, text: `'I have a new idea. Let's table it for two weeks. If it still feels right then, we'll discuss.' (Most ENTP pivots evaporate in 14 days.)` },
      ],
      stages: [
        { label: `Years 1-7 — The Pivot Years`, intro: `You'll try 3-5 different paths. Each teaches you something. Resist commitment pressure.`, milestones: `Master one debate-rich domain. Build one finisher partnership. Ship one substantial public artifact.`, mistakes: `Pivoting every 12 months. Burning relationships in debate. Underestimating how much execution matters.`, signals: `Multiple roles taught you patterns. You have one notable accomplishment. Senior peers know your name.` },
        { label: `Years 8-15 — The Convergence Years`, intro: `Your seemingly random experiences become a signature synthesis only you can offer.`, milestones: `Founder, partner, or signature operator. Build a meaningful team. Develop external reputation.`, mistakes: `Refusing to commit to a single bet for 3+ years. Letting your finisher quit. Skipping operational basics.`, signals: `Inbound opportunities for what you're known for. Comp 3-5x year-7 baseline. You set terms more than you accept them.` },
        { label: `Years 16+ — The Mentor / Investor Phase`, intro: `You back and advise the next generation. Portfolio thinking pays compounded.`, milestones: `Investor, board member, or scaled founder. Multiple income streams. Mentorship pipeline.`, mistakes: `Diluting attention across too many bets. Skipping the 'how' for the 'what.' Burnout from over-commitment.`, signals: `Decision authority over capital. Multiple compounding revenue sources. Younger ENTPs ask for your time.` },
      ],
      investSkills: [
        `Operational discipline (one system, one calendar, one weekly review)`,
        `Storytelling for fundraising / sales / hiring`,
        `Long-form writing (essays, memos, decks)`,
        `Negotiation and deal-making`,
        `Recruiting and retaining executors`,
      ],
      deprioritizeSkills: [
        `Generic productivity hacks`,
        `Becoming the deepest specialist in any one area`,
        `Polishing presentations beyond clear`,
        `Conference networking for its own sake`,
      ],
      negotiationOverview: `ENTPs are excellent at the verbal game and weak at the patience game. You'll talk yourself out of a great deal because the other side is silent and you fill the air. Practice silence. State your number, then say nothing for 30 seconds. The deal you 'win' is the one you didn't oversell.`,
      negotiationScripts: [
        { label: `Anchoring high`, text: `'For this scope, we typically see [target +20%]. What's your range?'` },
        { label: `Closing without overselling`, text: `'Sounds like we're aligned on [terms]. Let me put it in writing today, you confirm by Friday, we move next week.'` },
      ],
      pivots: [
        { title: `Consultant / employee → Founder`, text: `Validate one wedge with paying customers before quitting. The riskiest pivot is the one with no validation.` },
        { title: `Operator → Investor`, text: `Build a public track record (writing, angel investments, scout roles). Most successful operator-to-investor moves take 3-5 years.` },
        { title: `Generalist → Specialist (counterintuitively)`, text: `ENTPs who pick one domain after 10 years of breadth dominate. Breadth becomes the moat once you commit.` },
      ],
      traps: [
        { title: `Boredom-driven pivots`, text: `The boredom is in you, not the opportunity. Two more years of compounding usually beats a new start.` },
        { title: `Conflict as sport`, text: `Debates that feel fun to you can corrode relationships. Ask: am I debating to learn or to win?` },
        { title: `Neglecting follow-through`, text: `Ideas are cheap. Execution is expensive. Hire your weakness.` },
        { title: `Refusing to commit to a domain`, text: `Your career compounds when you stay; not when you switch. Pick one for 5+ years post-30.` },
        { title: `Underrating operators`, text: `The ENTJ, ISTJ, or ENTP-with-discipline who runs your operations is your single biggest career asset. Pay them, promote them, protect them.` },
        { title: `Chronic over-commitment`, text: `Saying yes to everything dilutes everything. Each yes after the third one halves the previous one's impact.` },
      ],
      redFlagPhrases: [
        `'Highly process-driven' (translation: bureaucratic)`,
        `'Long sales cycles' if you're not patient`,
        `'Strict approval hierarchy' (translation: no autonomy)`,
        `'Detail-oriented' as primary requirement (poor fit for your wiring)`,
        `'Stable, mature culture' (often code for: stagnant)`,
      ],
      networking: `Your network IS your career. ENTPs build the broadest networks of any type — turn that into compounding capital by creating value, not collecting contacts. One curated quarterly newsletter to 100 thoughtful people will outperform 1,000 LinkedIn connections. Pick the 10 best people you've ever worked with and stay in real touch.`,
      weeks: [
        { label: `Week 1`, text: `List every project you're working on. Kill three. Pick ONE to make your 90-day priority.` },
        { label: `Week 2`, text: `Audit your operating cadence. What's the one system you'd want a finisher to manage if you hired one?` },
        { label: `Week 3`, text: `Reach out to 5 ex-colleagues with a substantive update or offer. No ask.` },
        { label: `Week 4`, text: `Build a feedback loop on your 90-day priority — daily metric or weekly check-in.` },
        { label: `Week 5`, text: `Identify your finisher candidate (internal or external). Start the conversation.` },
        { label: `Week 6`, text: `Make one decision you've been deferring. ENTPs hide indecision as 'optionality.' Decide.` },
        { label: `Week 7`, text: `Block 4 hours/week for deep work on the priority. No exceptions.` },
        { label: `Week 8`, text: `Make one public statement about your priority — blog post, deck, talk. Visibility forces commitment.` },
        { label: `Week 9`, text: `Re-engage 3 cold but valuable contacts. Bring something useful to each.` },
        { label: `Week 10`, text: `Negotiate something — a rate, a scope, a deal. Practice silence in the room.` },
        { label: `Week 11`, text: `Hire or activate the finisher. Even 10 hours/week of operations is transformative.` },
        { label: `Week 12`, text: `Review the 90 days. What did you finish? What did you start and abandon? Set the next plan.` },
      ],
      visionExercise: `Imagine your career in 10 years. You're known for one thing. Write the headline that would describe you. Now: what are the 3 projects you'd need to NOT start in the next year for that headline to come true? ENTP success is more about saying no than yes.`,
    },
  },
  INFJ: {
    title: `INFJ — The Visionary`,
    subtitle: `Premium career insights tailored to your INFJ profile`,
    careerDna: `You're the rarest type (~1% of the population), operating at the intersection of deep empathy and long-term strategy. You see patterns in people the way an INTJ sees patterns in systems. You underperform in transactional roles because meaning is your fuel — and overperform in roles that combine insight into humans with structured execution.`,
    matches: [
      { rank: `1`, role: `Therapist / Counselor / Clinical Psychologist`, fit: `93%`, salary: `$90K – $220K` },
      { rank: `2`, role: `Author / Writer / Essayist`, fit: `90%`, salary: `Variable, high ceiling for signature voices` },
      { rank: `3`, role: `Professor (Humanities, Social Sciences)`, fit: `88%`, salary: `$90K – $200K` },
      { rank: `4`, role: `Nonprofit Executive Director`, fit: `87%`, salary: `$100K – $250K` },
      { rank: `5`, role: `UX Researcher / Behavioral Designer`, fit: `86%`, salary: `$120K – $240K` },
      { rank: `6`, role: `Executive or Life Coach`, fit: `85%`, salary: `$120K – $400K` },
      { rank: `7`, role: `Chief People Officer / HR Executive`, fit: `84%`, salary: `$150K – $400K` },
    ],
    environment: `You need meaning-rich work, quiet uninterrupted space, depth over breadth, and values-aligned leadership. You burn out faster than any type in noisy, transactional, conflict-heavy cultures. Protect your environment like your performance depends on it — because it does.`,
    leadership: `You lead through quiet conviction. People follow you because you make them feel seen and point toward something bigger than themselves. The risk: burnout from over-giving. The fix: treat boundaries as strategy. Saying no protects your ability to say yes deeply.`,
    stages: [
      { label: `Years 1–7 — The Searching Years`, text: `You'll struggle to find the exact fit. Every role teaches you more about what you won't compromise on.` },
      { label: `Years 8–15 — The Signature Work Phase`, text: `You converge on a signature problem or perspective that only you offer in quite that way.` },
      { label: `Years 16+ — The Wisdom Role`, text: `You're the person people seek out for counsel. Speaking, writing, advising, or leading become natural extensions.` },
    ],
    traps: [
      { title: `Carrying others' emotional weight`, text: `Empathy without boundaries is self-erasure. Schedule emotional recovery.` },
      { title: `Perfectionism delaying launch`, text: `Your 80% work is better than most people's 100%. Ship before you're ready.` },
      { title: `Avoiding self-promotion`, text: `Humility is a virtue; invisibility is a tax. Name your work publicly.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Name the single problem you want to be known for. Write it in one sentence.` },
      { label: `Days 31–60`, text: `Create one public artifact expressing your unique view on that problem.` },
      { label: `Days 61–90`, text: `Schedule non-negotiable weekly recovery. Your long-term impact depends on it.` },
    ],
    premium: {
      executiveSummary: `You're the rarest type (~1%), wired at the intersection of deep empathy and long-term strategy. Your career risk isn't capability; it's burnout from saying yes too long, paired with under-asking when you finally find your voice. This report is your manual for converting rare insight into lasting impact and income — without losing yourself.`,
      careerDna: [
        `You see patterns in people the way an INTJ sees patterns in systems. You understand motivations, fears, and trajectories of others before they articulate them. This is your superpower in any role that turns insight into outcome — therapy, leadership, design, advocacy.`,
        `You burn out faster than any type because your default mode is to absorb others' emotional load. Roles that don't protect against this — high-volume customer-facing work, dysfunctional cultures, transactional environments — drain you in 18 months. Choose your environment as carefully as you choose your craft.`,
        `The single career lever that returns most for INFJs is naming your work publicly. INFJs do the deepest, most meaningful work and tell the fewest people about it. Visibility doesn't compromise your authenticity; it amplifies your reach. Your work meets the people it's meant for only when they can find it.`,
      ],
      strengths: [
        { title: `Empathic accuracy`, text: `You read what people actually need vs what they say. Invaluable in therapy, leadership, design, and any human-facing strategy.` },
        { title: `Long-arc vision`, text: `You see how today's decision plays out in 10 years for the people involved. Rare in transactional environments.` },
        { title: `Synthesizing depth and warmth`, text: `You can hold both rigor and care in the same frame. Most people pick one.` },
        { title: `Sustained focus on meaningful work`, text: `You can stay with deep work for years if it matters. INFJs build bodies of work that compound.` },
      ],
      matches: [
        { rank: `1`, role: `Therapist / Clinical Psychologist`, fit: `94%`, why: `Why: Empathy + structure + meaning. INFJ work par excellence.

Typical day: Sessions, supervision, case notes, treatment planning.

Watch for: Licensure path is long (5-10 years); only pursue if therapy is the calling.`, comp: `Comp: $90K – $250K+ in private practice

Target employers: Private practice, group practice, hospital settings.` },
        { rank: `2`, role: `Author / Long-form Writer`, fit: `92%`, why: `Why: Meaningful work, autonomy, audience leverage.

Typical day: Writing, editing, research, public engagement.

Watch for: Income lags audience; most authors earn slowly until a breakthrough.`, comp: `Comp: Variable — $50K to multi-million for established voices

Target employers: Independent practice, traditional publishing, Substack.` },
        { rank: `3`, role: `Executive / Leadership Coach`, fit: `90%`, why: `Why: Deep one-on-one work, premium rates, intellectual variety.

Typical day: Client sessions, assessment, program design, marketing.

Watch for: Building a coaching practice takes 5+ years; layer it on top of another role.`, comp: `Comp: $150K – $500K at scale

Target employers: Independent practice, boutique firms, internal corporate coaching.` },
        { rank: `4`, role: `Chief People Officer / VP HR`, fit: `88%`, why: `Why: Strategic + relational + organizational. INFJ leadership at scale.

Typical day: Talent strategy, exec coaching, culture design, comp/benefits.

Watch for: HR can become administrative if the CEO doesn't see it as strategic.`, comp: `Comp: $200K – $500K

Target employers: Mid-cap and late-stage tech, services firms.` },
        { rank: `5`, role: `UX Researcher / Behavioral Designer`, fit: `87%`, why: `Why: Deep human insight applied to design and product.

Typical day: User interviews, ethnography, synthesis, design partnership.

Watch for: Some teams treat research as a checkbox; pick orgs where it shapes decisions.`, comp: `Comp: $130K – $280K

Target employers: FAANG, design consultancies, healthtech.` },
        { rank: `6`, role: `Nonprofit Executive Director / Foundation Leader`, fit: `86%`, why: `Why: Mission-driven leadership at meaningful scale.

Typical day: Fundraising, programs, board, strategy.

Watch for: Fundraising-heavy roles can wear; choose orgs with strong development teams.`, comp: `Comp: $100K – $300K at established orgs

Target employers: Major foundations, healthcare nonprofits, education.` },
        { rank: `7`, role: `Professor (Humanities / Social Sciences / Education)`, fit: `85%`, why: `Why: Lifetime intellectual freedom, teaching, writing.

Typical day: Teaching, research, advising, committee work.

Watch for: Tenure path is long and political; only pursue if research and teaching are the reward.`, comp: `Comp: $90K – $200K+ at top schools

Target employers: R1 universities, top liberal arts colleges.` },
        { rank: `8`, role: `Strategic Communications / Speechwriter (Senior)`, fit: `82%`, why: `Why: Combines insight, language, and influence at scale.

Typical day: Writing, exec advising, narrative strategy.

Watch for: Best fit for INFJs who can hold leaders' counsel and ego.`, comp: `Comp: $150K – $400K at C-suite level

Target employers: Top firms, in-house at large companies, independent practice.` },
        { rank: `9`, role: `Author-Speaker (Hybrid Practice)`, fit: `81%`, why: `Why: Books, speaking, courses, audience leverage.

Typical day: Writing, speaking, teaching, content development.

Watch for: Income compounds slowly over decades; build runway.`, comp: `Comp: $200K – $1M+ at established voices

Target employers: Independent practice, agency representation.` },
        { rank: `10`, role: `Hospice / Palliative Care Specialist`, fit: `78%`, why: `Why: Deeply meaningful work; INFJs disproportionately thrive here.

Typical day: Patient care, family communication, team coordination.

Watch for: Emotional intensity is real; build recovery practices into your week.`, comp: `Comp: $100K – $250K (depending on credentialing)

Target employers: Hospitals, hospice agencies, specialty practices.` },
      ],
      bestIndustries: [
        `Mental health and clinical practice`,
        `Long-form publishing and independent media`,
        `Executive and leadership coaching`,
        `Mission-driven nonprofits and foundations`,
        `Research-driven design (UX, behavioral)`,
      ],
      avoidIndustries: [
        `High-volume sales (transactional, energy-draining)`,
        `Aggressive trading floors / cutthroat finance cultures`,
        `Mass-market entertainment / fast-vibe industries`,
      ],
      greenFlags: [
        `Meaning-rich work tied to a real outcome`,
        `Quiet workspace and protected deep-work time`,
        `Values-aligned leadership`,
        `Boundaries respected as a feature, not bug`,
        `Depth over breadth in expectations`,
      ],
      redFlags: [
        `High-volume / customer-facing without recovery time`,
        `Politics-driven cultures with constant turf battles`,
        `Leaders whose values don't match their stated mission`,
        `Open-plan offices with continuous interruption`,
        `Cultures of performative urgency`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$60K – $110K`, driver: `Searching for fit. Don't optimize for salary; optimize for environment that doesn't deplete you.` },
        { stage: `Years 4-7`, range: `$110K – $180K`, driver: `First specialty emerges. Modest jumps.` },
        { stage: `Years 8-15`, range: `$180K – $350K`, driver: `Signature work begins to compound. Practice, books, or platform takes off.` },
        { stage: `Years 16-25`, range: `$300K – $700K+`, driver: `Authority and audience pay. Multiple income streams.` },
        { stage: `Years 25+`, range: `$300K – $1M+`, driver: `Body of work compounds. Often peak earnings late.` },
      ],
      leadershipStrengths: [
        `Reading the room before the room knows itself`,
        `Coaching rising talent into sustainable greatness`,
        `Holding hard conversations with care`,
        `Vision tied to human meaning`,
      ],
      leadershipBlindspots: [
        `Carrying others' emotional weight to your own cost`,
        `Avoiding overdue confrontations`,
        `Perfectionism delaying decisions`,
        `Underestimating your own influence`,
      ],
      leadershipScripts: [
        { label: `Setting a boundary`, text: `'I want to support you. To do that well, I need [boundary]. That's not a no to you; it's a yes to doing this right.'` },
        { label: `Holding someone accountable`, text: `'I noticed [behavior]. The impact on the team is [specific]. What's getting in your way and how can we address it?'` },
        { label: `Saying no to a request`, text: `'I'm not able to take this on without dropping something else. Here's what I'd have to drop. Which would you prefer?'` },
      ],
      stages: [
        { label: `Years 1-7 — The Searching Years`, intro: `You'll struggle to find exact fit. Each role teaches you what you won't compromise on.`, milestones: `Identify the problem you most want to be known for. Build one signature project. Develop emotional recovery practices.`, mistakes: `Burning out in dysfunctional cultures. Saying yes to everything. Avoiding visibility.`, signals: `You've named your craft. You have at least one mentor. You can sustain meaningful work without depletion.` },
        { label: `Years 8-15 — The Signature Phase`, intro: `You converge on a signature problem or perspective only you offer in quite that way.`, milestones: `Practice, book, platform, or program at scale. External recognition. First major income jump.`, mistakes: `Perfectionism delaying launch. Underpricing. Carrying organizational dysfunction past your breaking point.`, signals: `Inbound opportunities. People pay premium for your specific work. You teach or write publicly.` },
        { label: `Years 16+ — The Wisdom Years`, intro: `You're sought as counselor and authority. Speaking, writing, advising compound.`, milestones: `Body of work, multiple income streams, mentorship pipeline.`, mistakes: `Saying yes to too many requests. Refusing to delegate. Hoarding wisdom in your head.`, signals: `Multiple income streams. People pay for your time. Your work outlasts your direct involvement.` },
      ],
      investSkills: [
        `Public-facing communication (writing, speaking)`,
        `Boundary-setting (yes, this is a skill)`,
        `Pricing and packaging your work`,
        `One business-side competency: marketing, ops, or sales`,
        `Sustainable energy management`,
      ],
      deprioritizeSkills: [
        `Mass-market self-promotion tactics`,
        `Generic productivity systems`,
        `Networking events that don't fit your style`,
        `Polishing artifacts past 'clearly useful'`,
      ],
      negotiationOverview: `INFJs hate negotiating because it feels transactional. The fix isn't to become transactional — it's to reframe the conversation as collaborative problem-solving. Your strengths (empathy, listening, long-arc thinking) are negotiation strengths. Use them. Most INFJs leave $30K-$100K/year on the table because they don't ask. Ask.`,
      negotiationScripts: [
        { label: `Stating your value`, text: `'For the scope and impact described, the rate I'd need to do this work sustainably is [target]. That number reflects [specific outcomes the client cares about]. How does that land?'` },
        { label: `Renegotiating mid-engagement`, text: `'When we started, the scope was X. It's grown to Y. To keep doing this well, I'd need to either adjust the scope back, or revisit the terms. Which works for you?'` },
      ],
      pivots: [
        { title: `Helping profession → Author / Speaker`, text: `Most INFJs in clinical or coaching work undervalue their writing. Start writing publicly. The hybrid practice (clinical + speaking + book) is INFJ heaven.` },
        { title: `Corporate → Independent practice`, text: `Build the practice on the side for 18-24 months before leaving. INFJs need certainty before they leap.` },
        { title: `Generalist → Specialist`, text: `INFJs gain enormous compounding by picking one specialty for 10+ years. Breadth feels safer; depth pays.` },
      ],
      traps: [
        { title: `Carrying others' emotional weight`, text: `Empathy without boundaries is self-erasure. Schedule weekly recovery.` },
        { title: `Perfectionism delaying launch`, text: `Your 80% work is most people's 100%. Ship before you're ready.` },
        { title: `Avoiding self-promotion`, text: `Humility is virtue; invisibility is tax. Name your work publicly.` },
        { title: `Saying yes too often`, text: `Each yes drains your reserve for the work that matters.` },
        { title: `Tolerating dysfunctional cultures past breaking`, text: `Loyalty to mission ≠ loyalty to a broken org. Leave when the cost is your health.` },
        { title: `Underpricing chronically`, text: `INFJs price emotionally. Price your work the way an outsider would price your value.` },
      ],
      redFlagPhrases: [
        `'Mission-driven, demanding hours' (often translates: martyrdom expected)`,
        `'Family-feel culture' (often code for: weak boundaries)`,
        `'Self-starter' with no defined role`,
        `'High-touch client service' (energy-draining)`,
        `'Wear many hats' (no specialization)`,
      ],
      networking: `INFJs build the deepest networks but the smallest ones. Pick 12 people you respect deeply and tend those relationships for life. One quarterly substantive note to each. Skip the conferences. Your career capital comes from depth, not reach.`,
      weeks: [
        { label: `Week 1`, text: `Name the single problem you want to be known for. Write it in one sentence.` },
        { label: `Week 2`, text: `Audit current role against the 5 environment factors. Where does it deplete you?` },
        { label: `Week 3`, text: `Block 5 hours/week for non-negotiable recovery time. Treat as inviolable.` },
        { label: `Week 4`, text: `Reach out to one mentor or peer with a thoughtful update. No ask.` },
        { label: `Week 5`, text: `Identify one piece of your work to publish — blog post, talk, paper, or post.` },
        { label: `Week 6`, text: `Set a minimum rate or salary expectation in writing. Practice saying it aloud 10 times.` },
        { label: `Week 7`, text: `Have one boundary conversation you've been avoiding.` },
        { label: `Week 8`, text: `Publish the artifact from week 5. Done > perfect.` },
        { label: `Week 9`, text: `Reach out to 2 people you'd love to learn from. Specific, useful note.` },
        { label: `Week 10`, text: `Audit your client / project list. Identify the bottom 20% to phase out.` },
        { label: `Week 11`, text: `Plan one external visibility move for next quarter (talk, podcast, op-ed).` },
        { label: `Week 12`, text: `Review the 90 days. Where did you grow? Where did you compromise? Adjust forward.` },
      ],
      visionExercise: `Imagine your work in 20 years still mattering to someone who never met you. What is it? Who is it for? What did you have to be willing to do publicly for that to be possible? The answer is your invitation to start now.`,
    },
  },
  INFP: {
    title: `INFP — The Idealist`,
    subtitle: `Premium career insights tailored to your INFP profile`,
    careerDna: `You're a values-driven creator. Your best work appears when your craft aligns with your purpose — and evaporates when it doesn't. INFPs produce culture-defining creative work, but often undervalue themselves economically because the work 'feels' like self-expression, not labor. Rebuilding that self-valuation is the single biggest career lever you have.`,
    matches: [
      { rank: `1`, role: `Writer / Novelist / Poet / Screenwriter`, fit: `92%`, salary: `Variable, high ceiling for signature voices` },
      { rank: `2`, role: `Psychologist / Therapist`, fit: `90%`, salary: `$90K – $200K` },
      { rank: `3`, role: `Content Creator / Independent Artist`, fit: `88%`, salary: `Variable, very high ceiling` },
      { rank: `4`, role: `UX / Product Designer`, fit: `86%`, salary: `$120K – $240K` },
      { rank: `5`, role: `Nonprofit Program Director`, fit: `85%`, salary: `$80K – $180K` },
      { rank: `6`, role: `Art Therapist / Expressive Arts Practitioner`, fit: `82%`, salary: `$70K – $130K` },
      { rank: `7`, role: `Librarian / Archivist / Museum Curator`, fit: `80%`, salary: `$70K – $130K` },
    ],
    environment: `You need creative autonomy, values alignment, flexible schedules, and low-conflict cultures. Toxic workplaces cost INFPs more than any other type — not just emotionally, but creatively. Your output is your income; protect the conditions that produce it.`,
    leadership: `You lead by inspiration, not direction. Your people feel your care and rise to meet your vision. The risk: conflict avoidance that lets problems fester. The fix: scripted courage. Write hard conversations before having them. Your authenticity will shine through prepared words just as much as spontaneous ones.`,
    stages: [
      { label: `Years 1–7 — The Identity Years`, text: `You'll explore many forms before finding your medium. That exploration is the craft.` },
      { label: `Years 8–15 — The Deepening Years`, text: `You specialize. Your work becomes recognizably yours. Rates finally rise.` },
      { label: `Years 16+ — The Voice-of-Authority Years`, text: `You're referenced, quoted, taught. You've earned the right to charge what your work is worth.` },
    ],
    traps: [
      { title: `Pricing too low`, text: `INFPs are the most chronically underpaid creatives. Raise rates 25% today.` },
      { title: `Avoiding business skills`, text: `Basic systems — contracts, invoices, taxes — protect your art. Don't outsource them until you understand them.` },
      { title: `Perfection over publish`, text: `Finished and shared beats polished and hidden.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Name your craft precisely. What do you do, for whom, and why it matters.` },
      { label: `Days 31–60`, text: `Ship one public piece per month. Quantity first; quality follows.` },
      { label: `Days 61–90`, text: `Raise your rates by 20–25%. The market can bear it; you've been subsidizing clients.` },
    ],
    premium: {
      executiveSummary: `You're a values-driven creator whose career upside is limited only by your willingness to charge what your work is worth. INFPs produce some of the most resonant creative output in any industry and capture the smallest share of that value. This report is your operating manual for combining authentic craft with the business scaffolding that lets it sustain you.`,
      careerDna: [
        `You make things that matter. INFPs are wired to produce work that resonates because it's genuine, not calculated. Your career thrives when your craft aligns with your values and evaporates when it doesn't.`,
        `You're at your worst in environments that treat your work as commodity output. You're at your best when you can shape how, when, and for whom you work. Choose autonomy over title every time.`,
        `The single move that doubles INFP earnings is rebuilding self-valuation. Most INFPs price their work at the cost of producing it instead of the value it creates. The market will pay 2-3x what you're charging if you ask. The work doesn't need to change; the asking does.`,
      ],
      strengths: [
        { title: `Authentic creative expression`, text: `You make things that feel true. In creative industries this is durable competitive advantage.` },
        { title: `Values clarity`, text: `You know what you'll and won't do. This protects you from career drift.` },
        { title: `Emotional depth`, text: `You can sit with hard feelings — yours and others'. Valuable in therapy, art, and human-facing work.` },
        { title: `Long-form imagination`, text: `You can hold a novel, a script, a body of work in your head over years.` },
      ],
      matches: [
        { rank: `1`, role: `Author / Novelist / Screenwriter`, fit: `93%`, why: `Why: Long-form, voice-driven, autonomous work. INFP heaven.

Typical day: Writing, revision, research, public engagement.

Watch for: Income is highly variable; build runway and a day job in early years.`, comp: `Comp: Variable — $40K to multi-million for breakouts

Target employers: Independent, traditional publishing, hybrid models.` },
        { rank: `2`, role: `Therapist / Clinical Counselor`, fit: `91%`, why: `Why: Deep human work, autonomy, meaning.

Typical day: Sessions, treatment planning, supervision.

Watch for: Licensure path is long; pursue if the work calls you.`, comp: `Comp: $80K – $200K in private practice

Target employers: Private or group practice, agency settings.` },
        { rank: `3`, role: `Independent Content Creator (Audience-driven)`, fit: `89%`, why: `Why: Total creative control, audience leverage, multiple income streams.

Typical day: Content production, platform building, monetization.

Watch for: Income lags audience by 2-4 years; have runway.`, comp: `Comp: $0 – $1M+ depending on traction

Target employers: Substack, YouTube, podcasts, niche platforms.` },
        { rank: `4`, role: `UX / Product Designer (Senior)`, fit: `87%`, why: `Why: Creative craft, human focus, premium pay.

Typical day: Research, design, prototyping, design systems.

Watch for: Choose orgs where research drives decisions, not aesthetics.`, comp: `Comp: $130K – $280K

Target employers: Tech companies, design firms, agencies.` },
        { rank: `5`, role: `Nonprofit Program Director`, fit: `85%`, why: `Why: Mission-driven leadership at human scale.

Typical day: Program design, grant writing, staff management.

Watch for: Choose orgs with strong fundraising support so you focus on programs.`, comp: `Comp: $80K – $180K at established orgs

Target employers: Major nonprofits, foundations, social enterprises.` },
        { rank: `6`, role: `Art Therapist / Expressive Arts Practitioner`, fit: `83%`, why: `Why: Combines creative work with healing practice.

Typical day: Sessions, group facilitation, supervision.

Watch for: Smaller market than traditional therapy; fit matters.`, comp: `Comp: $70K – $130K

Target employers: Private practice, hospitals, schools.` },
        { rank: `7`, role: `Editor / Acquisitions / Literary Agent`, fit: `82%`, why: `Why: Deep craft, voice cultivation, taste-driven work.

Typical day: Manuscript review, author relationships, negotiation.

Watch for: Industry pay is moderate; passion is the real return.`, comp: `Comp: $70K – $200K (variable in agenting)

Target employers: Major publishers, boutique agencies.` },
        { rank: `8`, role: `Curator / Museum Specialist`, fit: `80%`, why: `Why: Aesthetic depth, scholarly work, public meaning.

Typical day: Exhibition design, research, programming, fundraising.

Watch for: Limited positions; long path.`, comp: `Comp: $70K – $150K at major institutions

Target employers: Top museums, galleries, university collections.` },
        { rank: `9`, role: `Librarian / Archivist (Specialty Focus)`, fit: `78%`, why: `Why: Quiet, meaningful, rigorous work.

Typical day: Collection development, research support, public programs.

Watch for: Stable but moderate pay; choose specialties (rare books, archives) for depth.`, comp: `Comp: $60K – $120K

Target employers: Research libraries, special collections, academic institutions.` },
        { rank: `10`, role: `Brand / Voice Strategist (Independent)`, fit: `76%`, why: `Why: Creative practice, premium fees, mission-aligned clients.

Typical day: Strategy work, voice development, content systems.

Watch for: Sales is the bottleneck; budget time for it.`, comp: `Comp: $120K – $400K at scale

Target employers: Independent practice, boutique firms.` },
      ],
      bestIndustries: [
        `Long-form publishing (books, narrative journalism)`,
        `Mental health and counseling`,
        `Creative independent practice (writing, art, design)`,
        `Mission-driven nonprofits`,
        `Audience-driven independent media`,
      ],
      avoidIndustries: [
        `High-volume sales / cold calling`,
        `Aggressive corporate sales cultures`,
        `Routine high-volume customer service`,
      ],
      greenFlags: [
        `Creative autonomy and time to think`,
        `Values-aligned mission`,
        `Flexibility in schedule and place`,
        `Quiet, low-conflict cultures`,
        `Permission to work in your voice`,
      ],
      redFlags: [
        `Quotas, leaderboards, public ranking`,
        `Aggressive workplace politics`,
        `Cultures that demand 'always-on' availability`,
        `Forced extroversion as 'team building'`,
        `Mission-mismatch (saying one thing, doing another)`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$50K – $90K`, driver: `Likely underpaid. Build skills and a portfolio; fix pricing in years 4+.` },
        { stage: `Years 4-7`, range: `$90K – $160K`, driver: `Specialty emerges. First income jump if you charge appropriately.` },
        { stage: `Years 8-15`, range: `$160K – $350K`, driver: `Signature work begins to compound. Practice, book, or platform takes off.` },
        { stage: `Years 16-25`, range: `$200K – $600K`, driver: `Body of work, multiple income streams. Authority pays.` },
        { stage: `Years 25+`, range: `$200K – $1M+`, driver: `INFPs often peak late as bodies of work compound.` },
      ],
      leadershipStrengths: [
        `Inspiring through authentic vision`,
        `Coaching individuals into their best work`,
        `Defending values under pressure`,
        `Reading what unspoken concerns are in the room`,
      ],
      leadershipBlindspots: [
        `Conflict avoidance that lets problems fester`,
        `Underrating administrative and operational work`,
        `Setting unclear expectations because you assume understanding`,
        `Personalizing professional disagreements`,
      ],
      leadershipScripts: [
        { label: `Hard conversation script`, text: `'I want this work to thrive. Right now [behavior] is in the way. Here's what I need to see in the next two weeks.' (Pre-write to lower the conflict cost.)` },
        { label: `Defending values under pressure`, text: `'I hear you. The reason I'm holding this line is [value]. If we cross it, here's what I think it costs us long-term.'` },
        { label: `Inviting feedback`, text: `'What's one thing I'm doing that's making your work harder? I want to hear the version you'd say if you weren't worried about how I'd take it.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Identity Years`, intro: `You'll explore many forms before finding your medium. Don't apologize for the search.`, milestones: `Develop one signature voice or craft. Build a portfolio. Find one mentor in your field.`, mistakes: `Underpricing chronically. Avoiding business basics. Switching mediums every year.`, signals: `You can articulate your craft in one sentence. You have a body of work to show. You charge above hobbyist rates.` },
        { label: `Years 8-15 — The Deepening Years`, intro: `Specialization compounds. Your work becomes recognizably yours.`, milestones: `Signature project, book, or platform. External recognition. Income jumps.`, mistakes: `Perfectionism past the point of useful. Avoiding business strategy. Resentment from undercharging.`, signals: `Recognized voice in your niche. Comp 2-3x year-7. You set rates rather than accept them.` },
        { label: `Years 16+ — The Voice-of-Authority Years`, intro: `You're referenced, quoted, taught. Your work outlasts your direct involvement.`, milestones: `Body of work, multiple income streams, mentorship pipeline.`, mistakes: `Holding on to operations you should delegate. Refusing to scale. Burning out from over-giving.`, signals: `Multiple revenue streams. Inbound for your specific work. People pay for your time.` },
      ],
      investSkills: [
        `Pricing your work (worth multiple courses)`,
        `Public-facing communication (writing about your work, not just doing it)`,
        `One business-side competency: marketing, ops, or sales`,
        `Boundary-setting and contract literacy`,
        `One audience-building practice (newsletter, podcast, platform)`,
      ],
      deprioritizeSkills: [
        `Becoming the most technical specialist`,
        `Mass-market self-promotion tactics`,
        `Generic productivity systems`,
        `Polishing your craft past 'good enough' for the audience you have`,
      ],
      negotiationOverview: `INFPs are the worst-negotiating type, full stop. Not because you're incapable — because negotiation feels like betraying the work. Reframe: charging well IS honoring the work. The clients who pay 3x are the ones who treat your work with the respect it deserves. Set rates in writing before conversations. Practice saying the number aloud until it stops feeling like a violation.`,
      negotiationScripts: [
        { label: `Stating your rate`, text: `'My rate for this scope is [target]. That includes [specific deliverables].' (Period. No qualifiers, no apologies.)` },
        { label: `Pushing back on lowballing`, text: `'I appreciate the offer. To do this work to the standard I want, I'd need [target]. If that's not workable, I understand — and I'd recommend [alternative].'` },
      ],
      pivots: [
        { title: `Day-job → Independent creator`, text: `Build audience nights/weekends for 18-24 months. Don't quit until income covers 60-70% of salary.` },
        { title: `Generalist creative → Specialist`, text: `INFPs who pick one form (novels, scripts, illustration) for 10+ years dominate. Breadth feels safer; depth pays.` },
        { title: `Helping profession → Hybrid practice`, text: `Add writing, teaching, or speaking on top of clinical practice. Hybrid models 2-3x income.` },
      ],
      traps: [
        { title: `Pricing too low`, text: `INFPs are chronically underpaid creatives. Raise rates 25% today. The market can bear it.` },
        { title: `Avoiding business basics`, text: `Contracts, invoices, taxes, marketing. Not glamorous. Necessary.` },
        { title: `Perfection over publish`, text: `Finished and shared beats polished and hidden. Always.` },
        { title: `Personalizing rejection`, text: `A 'no' on the work isn't a 'no' on you. Separate identity from output.` },
        { title: `Mistaking nice clients for good clients`, text: `The friendliest clients are sometimes the most exploitative. Watch the boundaries, not the smiles.` },
        { title: `Saying yes for fear of disappointing`, text: `Every yes you don't want is a no to the work that matters.` },
      ],
      redFlagPhrases: [
        `'Passion-driven culture' (often code for: underpaid)`,
        `'Mission first, comp second' (often code for: bad pay)`,
        `'Wear many hats' (often code for: chaos)`,
        `'High-energy startup' (often code for: extroverts wanted)`,
        `'Family feel' (often code for: poor boundaries)`,
      ],
      networking: `INFPs build through one-on-one depth. Skip mass events. Pick 8 people whose work you admire and engage with their work substantively (write to them, share something useful, comment thoughtfully). One real conversation per month with someone in your field is plenty. Career compounds at the speed of trust.`,
      weeks: [
        { label: `Week 1`, text: `Name your craft precisely. What do you do, for whom, and why does it matter.` },
        { label: `Week 2`, text: `Audit your rates. Compare to peers at your level (or above). Set new minimum in writing.` },
        { label: `Week 3`, text: `Inventory unfinished work. Pick the ONE worth shipping in the next 90 days.` },
        { label: `Week 4`, text: `Reach out to one peer or mentor with a thoughtful note. No ask.` },
        { label: `Week 5`, text: `Set a publishing cadence (weekly post, monthly piece, quarterly project). Stick to it.` },
        { label: `Week 6`, text: `Practice your rate aloud 10 times in front of a mirror. Yes, this matters.` },
        { label: `Week 7`, text: `Send one offer at the new rate. The first time is the hardest.` },
        { label: `Week 8`, text: `Publish the artifact from week 3.` },
        { label: `Week 9`, text: `Audit your client/project list. Identify bottom 20% to phase out.` },
        { label: `Week 10`, text: `Set boundaries around your deepest work time (when, where, how long).` },
        { label: `Week 11`, text: `Reach out to 2 people whose work you admire. Specific, useful, no ask.` },
        { label: `Week 12`, text: `Review the 90 days. What did you ship? What did you charge? Where do you want to be in 12 months?` },
      ],
      visionExercise: `Imagine reading the obituary of an artist who lived your dream career. Whose career do you most want it to be? Now look up that person's first 10 years. They were probably struggling exactly like you are. The gap is time + consistency. Both are available to you.`,
    },
  },
  ENFJ: {
    title: `ENFJ — The Guide`,
    subtitle: `Premium career insights tailored to your ENFJ profile`,
    careerDna: `You're a natural community builder and developer of people. ENFJs move teams, classrooms, and congregations in measurable ways. Your gift is organizing emotional energy toward a shared goal. Your risk: you can lose yourself inside that goal. Career mastery for you means learning when to hold the room and when to step out of it.`,
    matches: [
      { rank: `1`, role: `Enterprise Sales Executive / CRO`, fit: `91%`, salary: `$180K – $500K+` },
      { rank: `2`, role: `Chief People Officer / HR VP`, fit: `90%`, salary: `$180K – $500K` },
      { rank: `3`, role: `Nonprofit CEO / Foundation Leader`, fit: `89%`, salary: `$140K – $400K` },
      { rank: `4`, role: `Professor / School Leader`, fit: `87%`, salary: `$70K – $200K` },
      { rank: `5`, role: `Executive Coach / Leadership Developer`, fit: `86%`, salary: `$150K – $500K` },
      { rank: `6`, role: `Elected Official / Public Service Leader`, fit: `85%`, salary: `Variable` },
      { rank: `7`, role: `Talent Development Director`, fit: `84%`, salary: `$130K – $300K` },
    ],
    environment: `You thrive in mission-driven, relational cultures with visible impact and team-centered work. You wither in transactional, isolated, or purely analytical roles. Your environment isn't a luxury — it's your operating system.`,
    leadership: `You lead through inspiration and belief in people. Teams genuinely lift around you. The risk: over-identifying with their outcomes. The fix: protect your own energy as a leadership responsibility, not a luxury. You cannot pour from an empty pitcher.`,
    stages: [
      { label: `Years 1–7 — The Generalist Years`, text: `You'll excel at many things. Let yourself sample — you're gathering raw material.` },
      { label: `Years 8–15 — The Flagship Years`, text: `You'll build a signature program, platform, or organization that reflects your vision.` },
      { label: `Years 16+ — The Community Legacy Phase`, text: `You're a named voice in your field. Mentoring successors becomes part of the work.` },
    ],
    traps: [
      { title: `Saying yes too often`, text: `Every yes is a no to your deep work. Protect 10 hrs/week non-negotiably.` },
      { title: `Confusing approval with alignment`, text: `People can love you and still not be executing. Measure outcomes, not warmth.` },
      { title: `Avoiding necessary firings`, text: `A team of 'nice' underperformers costs you your best people.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Block 10 hours per week of deep, uninterrupted work. Treat like a medical appointment.` },
      { label: `Days 31–60`, text: `Define the one flagship initiative that will define the next 3 years of your career.` },
      { label: `Days 61–90`, text: `Have one hard conversation you've been avoiding. The cost of avoidance is already bigger than the cost of directness.` },
    ],
    premium: {
      executiveSummary: `You're a natural community builder and developer of people. ENFJs measurably lift the performance of every team they touch. Your career risk is over-identifying with the team's outcomes to the cost of your own. This report helps you build career capital that compounds for you, not just the people you serve.`,
      careerDna: [
        `You read rooms in real time and adjust to what people need. This is a leadership superpower in cultures that value engagement, mission, and people-first execution.`,
        `You give energy to teams, classrooms, and organizations until you're empty. Your career sustainability depends on protecting your reserves as fiercely as you protect others'.`,
        `The single move that 2-3x's ENFJ outcomes is owning a P&L or revenue line. ENFJs gravitate to support functions (HR, communications, education) where their gifts are visible but their compensation is capped. Move into roles with direct revenue or strategic ownership and your career trajectory transforms.`,
      ],
      strengths: [
        { title: `Inspirational communication`, text: `You make people believe and act. Invaluable in sales, leadership, and any role requiring rallying behavior.` },
        { title: `Empathy at scale`, text: `You can hold the needs of many at once without losing the individual. Rare in leadership.` },
        { title: `Coaching instinct`, text: `You see potential and pull it forward. Your reports become your career capital.` },
        { title: `Network compounding`, text: `You create networks that endure. People help you years after you've moved on.` },
      ],
      matches: [
        { rank: `1`, role: `Sales / Revenue Leader (CRO)`, fit: `92%`, why: `Why: Inspiring teams + revenue ownership = ENFJ at peak.

Typical day: Pipeline, exec selling, hiring, comp design.

Watch for: Quotas can wear; pick teams with realistic targets.`, comp: `Comp: $300K base + variable → $1M+

Target employers: Enterprise SaaS, B2B services, mid-cap tech.` },
        { rank: `2`, role: `Chief People Officer`, fit: `91%`, why: `Why: Strategic + relational + organizational at scale.

Typical day: Talent strategy, exec coaching, culture, comp.

Watch for: HR can be sidelined if CEO doesn't see it as strategic.`, comp: `Comp: $250K – $700K

Target employers: Late-stage startups, mid-cap tech, services firms.` },
        { rank: `3`, role: `Nonprofit CEO / Foundation Leader`, fit: `90%`, why: `Why: Mission, leadership, scale.

Typical day: Fundraising, programs, board, strategy.

Watch for: Fundraising-heavy; choose orgs with strong dev teams.`, comp: `Comp: $150K – $500K at established orgs

Target employers: Major foundations, healthcare nonprofits, education.` },
        { rank: `4`, role: `Executive / Leadership Coach`, fit: `89%`, why: `Why: Premium one-on-one work, audience leverage.

Typical day: Client sessions, programs, content, marketing.

Watch for: Building a coaching practice takes 5-7 years.`, comp: `Comp: $200K – $700K at scale

Target employers: Independent practice, boutique firms.` },
        { rank: `5`, role: `Professor / School Leader (Education)`, fit: `87%`, why: `Why: Teaching, mentoring, institutional leadership.

Typical day: Teaching, advising, administration.

Watch for: Compensation moderate; meaning is the return.`, comp: `Comp: $90K – $250K at top schools

Target employers: Universities, top private schools, education leadership.` },
        { rank: `6`, role: `Politician / Public Service Leader`, fit: `85%`, why: `Why: Direct civic impact, leadership, communication.

Typical day: Constituent service, policy, fundraising, campaigning.

Watch for: Political career has high variance and burnout risk.`, comp: `Comp: Variable — $80K – $400K

Target employers: Local, state, federal levels.` },
        { rank: `7`, role: `Talent Development / L&D Leader`, fit: `84%`, why: `Why: Building people-systems at scale.

Typical day: Curriculum design, exec development, succession planning.

Watch for: Pick orgs where L&D has executive sponsorship.`, comp: `Comp: $150K – $300K

Target employers: Mid-cap and late-stage tech, services firms.` },
        { rank: `8`, role: `Talk Show Host / Media Personality`, fit: `83%`, why: `Why: Public communication, audience leverage, premium fees.

Typical day: Show prep, interviews, content, brand building.

Watch for: Highly competitive; build audience first via owned channels.`, comp: `Comp: $100K – $5M+ depending on platform

Target employers: Major media networks, podcast platforms, indie media.` },
        { rank: `9`, role: `Pastor / Faith Community Leader`, fit: `82%`, why: `Why: Community, communication, meaning.

Typical day: Sermons, pastoral care, leadership, programs.

Watch for: Career path depends on tradition and context.`, comp: `Comp: $60K – $200K at established communities

Target employers: Churches, religious organizations, faith-based nonprofits.` },
        { rank: `10`, role: `Diplomatic Service / International Affairs Leader`, fit: `80%`, why: `Why: Cross-cultural communication, leadership, mission.

Typical day: Diplomacy, policy, communication, program management.

Watch for: Path is structured; entry is competitive.`, comp: `Comp: $100K – $250K (foreign service / NGO leadership)

Target employers: State Department, NGOs, international orgs.` },
      ],
      bestIndustries: [
        `Enterprise sales and revenue leadership`,
        `Mission-driven nonprofits and foundations`,
        `Education and institutional leadership`,
        `Executive coaching and leadership development`,
        `Public service and policy`,
      ],
      avoidIndustries: [
        `Highly transactional or quant-only roles`,
        `Solo specialist work with no team`,
        `Cultures where empathy is treated as weakness`,
      ],
      greenFlags: [
        `Mission-aligned culture`,
        `Direct human contact and team leadership`,
        `Clear connection between effort and impact`,
        `Recognition and appreciation built into culture`,
        `Equity / variable comp tied to people outcomes`,
      ],
      redFlags: [
        `Highly individualistic cultures with no team component`,
        `Roles with no direct people contact`,
        `Aggressive hierarchies that punish empathy`,
        `Cultures where 'soft skills' are seen as nice-to-have`,
        `Long sales cycles with no relational component`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$70K – $130K`, driver: `Build network and skills. Choose mission alignment over salary.` },
        { stage: `Years 4-7`, range: `$130K – $250K`, driver: `First leverage. Manage a team or own a revenue line.` },
        { stage: `Years 8-15`, range: `$250K – $500K`, driver: `Senior leadership. Comp jumps as you own outcomes.` },
        { stage: `Years 16-25`, range: `$400K – $1M+`, driver: `C-suite, partnership, or scaled practice.` },
        { stage: `Years 25+`, range: `$300K – $2M+`, driver: `Body of work compounds; advisory and board roles.` },
      ],
      leadershipStrengths: [
        `Rallying teams behind a mission`,
        `Developing rising talent`,
        `Reading and managing organizational dynamics`,
        `Communicating vision compellingly`,
      ],
      leadershipBlindspots: [
        `Conflict avoidance that lets problems compound`,
        `Confusing being liked with being effective`,
        `Over-investing emotionally in team members`,
        `Avoiding necessary firings`,
      ],
      leadershipScripts: [
        { label: `Holding someone accountable`, text: `'I care about this and I care about you. Here's what I'm seeing. Here's what needs to change in the next two weeks. How can I help?'` },
        { label: `Saying no to a request`, text: `'I want to support this. To do it well, I'd have to drop [other priority]. Which would you rather have me do?'` },
        { label: `Letting someone go`, text: `'This isn't working, and continuing will hurt both of us. Here's what we'll do, and here's how I'll support your transition.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Generalist Years`, intro: `You'll excel at many things. Sample broadly — you're gathering raw material.`, milestones: `Master one functional domain. Lead one team. Develop one external mentor.`, mistakes: `Saying yes too often. Avoiding hard conversations. Over-investing in problem employees.`, signals: `You're known for one thing. You can hold a team. You have a clear sponsor.` },
        { label: `Years 8-15 — The Flagship Years`, intro: `You build a signature program, platform, or organization that reflects your vision.`, milestones: `VP / SVP role. P&L or revenue ownership. External visibility.`, mistakes: `Holding on to operations you should delegate. Avoiding the strategic work. Burning out.`, signals: `You own significant business outcomes. You're recruited rather than applying. Your team is loyal.` },
        { label: `Years 16+ — The Community Legacy Phase`, intro: `You're a named voice in your field. Mentoring successors becomes part of the work.`, milestones: `C-suite, founder, or platform owner. Multiple income streams. Public reputation.`, mistakes: `Optimizing for prestige. Refusing to delegate. Carrying organizational dysfunction.`, signals: `Multiple revenue streams. Decision authority over resources. Younger leaders ask for your time.` },
      ],
      investSkills: [
        `Strategic thinking (yes, this is a skill — and your gap)`,
        `Financial literacy (P&L, comp, equity)`,
        `Hard-conversation muscle`,
        `Boundary-setting`,
        `Written executive communication`,
      ],
      deprioritizeSkills: [
        `Pure individual-contributor technical depth`,
        `Generic networking events`,
        `Productivity tool-hopping`,
        `Polishing presentations beyond clear`,
      ],
      negotiationOverview: `ENFJs negotiate poorly because the deal feels like a relationship transaction and you don't want to spoil it. The reframe: a fair deal preserves the relationship; an unfair one corrodes it. Your empathy is a negotiation asset — read what they actually need, then ask for what you need cleanly. Most ENFJs leave 20-30% on the table.`,
      negotiationScripts: [
        { label: `Asking for a promotion`, text: `'I've delivered [specific outcomes]. Based on that and benchmarks, I'd expect [target] role/comp. What does the path there look like?'` },
        { label: `Negotiating an offer`, text: `'I'm excited about this. The piece I'd want to revisit is [specific lever]. What flexibility do you have?'` },
      ],
      pivots: [
        { title: `Functional leader → CRO / Revenue Leader`, text: `Volunteer for projects with revenue ownership. Most CROs spent 3-5 years owning a number before the title.` },
        { title: `Internal HR / L&D → Executive Coach`, text: `Build a side practice. ENFJs make excellent coaches because of natural empathy.` },
        { title: `Operating leader → Founder`, text: `Pick a problem you've seen up close. ENFJ founders win with team-driven companies.` },
      ],
      traps: [
        { title: `Saying yes too often`, text: `Each yes drains your capacity for the work that matters.` },
        { title: `Confusing approval with alignment`, text: `People can love you and not be executing. Measure outcomes, not warmth.` },
        { title: `Avoiding necessary firings`, text: `A team of 'nice' underperformers costs you your best people.` },
        { title: `Neglecting strategic work`, text: `ENFJs default to people-management. Build strategic muscle deliberately.` },
        { title: `Carrying others' emotional weight`, text: `Empathy without limits is self-erasure. Schedule recovery.` },
        { title: `Underpricing your work`, text: `ENFJs in service roles chronically undercharge. Price like an outsider.` },
      ],
      redFlagPhrases: [
        `'Lone wolf culture' (no team, no fit)`,
        `'Highly competitive internal environment' (politics over collaboration)`,
        `'Quiet, heads-down culture' (no people-leverage)`,
        `'Mission-driven, demanding hours' (martyrdom expected)`,
        `'Highly matrixed organization' (no clear ownership)`,
      ],
      networking: `Your network is already strong; the move is to convert it into compounding capital. Pick 30-50 high-trust relationships and stay deliberately in touch (quarterly). Bring value without asking. Over a decade this builds an unparalleled professional Rolodex. ENFJs who curate become the go-to connector in their field.`,
      weeks: [
        { label: `Week 1`, text: `Block 10 hours/week of deep, uninterrupted work. Treat as inviolable.` },
        { label: `Week 2`, text: `Define the one flagship initiative for the next 12 months. Write it down.` },
        { label: `Week 3`, text: `Have one hard conversation you've been avoiding. Use the script above.` },
        { label: `Week 4`, text: `Audit your team. Identify the bottom 10% (perf or fit). Plan addressing it.` },
        { label: `Week 5`, text: `Reach out to 5 long-dormant contacts. Substantive note, no ask.` },
        { label: `Week 6`, text: `Identify the financial / strategic skill gap most blocking your trajectory. Find a course or mentor.` },
        { label: `Week 7`, text: `Volunteer for one project with revenue or P&L exposure.` },
        { label: `Week 8`, text: `Write your one-paragraph 'where I want to be in 5 years.' Comp, role, lifestyle.` },
        { label: `Week 9`, text: `Have a real conversation with your manager about that trajectory.` },
        { label: `Week 10`, text: `Identify a public-visibility move (writing, speaking, podcast). Commit publicly.` },
        { label: `Week 11`, text: `Negotiate something — a raise, scope, role. Practice the script first.` },
        { label: `Week 12`, text: `Review the 90 days. Adjust. Set the next plan with a finisher accountability partner.` },
      ],
      visionExercise: `Imagine your team's most senior alums in 20 years. What do they say about working for you? What do they wish they'd had? The answer is your management strategy AND the seed of your next company.`,
    },
  },
  ENFP: {
    title: `ENFP — The Dreamer`,
    subtitle: `Premium career insights tailored to your ENFP profile`,
    careerDna: `You're a possibility catalyst. Your enthusiasm is both your gift and your currency — it opens doors others have to knock on. ENFPs thrive in idea-rich, variety-filled roles and suffocate in repetitive ones. Building a career that channels your energy without burning through it is your main project.`,
    matches: [
      { rank: `1`, role: `Marketing / Brand Director`, fit: `91%`, salary: `$150K – $400K` },
      { rank: `2`, role: `Entrepreneur / Creative Founder`, fit: `90%`, salary: `Variable, high ceiling` },
      { rank: `3`, role: `Brand Strategist / Storyteller`, fit: `89%`, salary: `$130K – $320K` },
      { rank: `4`, role: `Journalist / Broadcaster / Podcaster`, fit: `86%`, salary: `$90K – $300K` },
      { rank: `5`, role: `Creative Teacher / Trainer`, fit: `85%`, salary: `$70K – $140K` },
      { rank: `6`, role: `Recruiter / Talent Scout`, fit: `84%`, salary: `$100K – $300K` },
      { rank: `7`, role: `Professional Speaker / Workshop Leader`, fit: `83%`, salary: `$100K – $500K+` },
    ],
    environment: `You need variety, autonomy, creative peers, and mission-driven teams. You lose energy in environments with heavy process or low interpersonal warmth. A boring ENFP is an underperforming ENFP — take your restlessness seriously as a career signal.`,
    leadership: `You lead as an energizer. People show up because you make showing up feel alive. The risk: you lose steam in the messy middle. The fix: build systems you don't have to rely on willpower for, and recruit one completion partner who finishes what you start.`,
    stages: [
      { label: `Years 1–7 — The Exploration Years`, text: `You'll try many paths. That breadth becomes your strategic advantage later.` },
      { label: `Years 8–15 — The Synthesis Years`, text: `Your wildly different experiences combine into something only you can offer.` },
      { label: `Years 16+ — The Mentor-Founder Phase`, text: `You build the kind of organization younger you wished existed.` },
    ],
    traps: [
      { title: `Shiny object syndrome`, text: `New is not always better. Stay with one bet for 12–18 months minimum.` },
      { title: `Admin neglect`, text: `Your unopened email is costing you money. Build a 30-min weekly admin ritual.` },
      { title: `Under-pricing joy-filled work`, text: `If it's fun, charge more, not less. People overpay for delight.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Commit to ONE 90-day bet. Write it down. Tell three people who will hold you to it.` },
      { label: `Days 31–60`, text: `Build a weekly admin rhythm — 30 minutes, same day, same time.` },
      { label: `Days 61–90`, text: `Hire one part-time operator or assistant. Your ROI will be visible in 60 days.` },
    ],
    premium: {
      executiveSummary: `You're a possibility catalyst — your enthusiasm opens doors others have to knock on. ENFPs have one of the highest career ceilings IF you can solve the ENFP paradox: finishing what you start. This report is your operating manual for converting energy into compounding leverage without burning out in the messy middle.`,
      careerDna: [
        `Your career edge is energy — yours is contagious. You make people excited about possibility. This is uniquely valuable in marketing, sales, founder roles, and creative leadership.`,
        `You're at your worst when work becomes routine. Variety is oxygen for you. Pick careers and projects that change shape every few months, not every few years.`,
        `The single move that transforms ENFP careers is partnering with an executor. Your highest leverage isn't being the most enthusiastic person in the room — it's being the most enthusiastic person + having the operator who turns enthusiasm into shipped product. Find them in year 5; protect them for life.`,
      ],
      strengths: [
        { title: `Energy and enthusiasm at scale`, text: `You move people. Invaluable in sales, fundraising, founder roles, leadership.` },
        { title: `Pattern recognition across people`, text: `You read motivations and possibilities others miss. Asset in talent-spotting and team building.` },
        { title: `Connection-making across domains`, text: `You spot synergies where peers see silos. Engine of marketing, creative, and entrepreneurial work.` },
        { title: `Comfort with ambiguity and risk`, text: `You move while others freeze. Decisive in early-stage and disruptive contexts.` },
      ],
      matches: [
        { rank: `1`, role: `Marketing / Brand Director (Senior)`, fit: `91%`, why: `Why: Storytelling + people + variety. ENFP playground.

Typical day: Brand strategy, campaign design, agency management, exec advising.

Watch for: Marketing can be vibe-driven; choose data-respecting environments.`, comp: `Comp: $150K – $400K at senior levels

Target employers: Top consumer brands, agencies, late-stage startups.` },
        { rank: `2`, role: `Founder / CEO (Consumer / Mission-driven)`, fit: `90%`, why: `Why: Energy + vision + people leverage. Many top founders are ENFPs.

Typical day: Vision, fundraising, sales, hiring, customer.

Watch for: Hire executors before product-market fit, not after.`, comp: `Comp: $0 – $100M+ outcome variance

Target employers: Consumer brands, mission-driven services, marketplaces.` },
        { rank: `3`, role: `Brand / Strategy Consultant (Independent)`, fit: `89%`, why: `Why: Variety + autonomy + premium fees.

Typical day: Client work, strategy, content, speaking.

Watch for: Sales is the bottleneck; budget time for it.`, comp: `Comp: $200K – $700K+ at established practice

Target employers: Independent or boutique partnerships.` },
        { rank: `4`, role: `Sales Leader (Enterprise / Strategic)`, fit: `87%`, why: `Why: High-energy people work + revenue leverage.

Typical day: Pipeline, exec selling, team building, deal strategy.

Watch for: Quotas grind ENFPs; pick teams with realistic targets and creative deal structures.`, comp: `Comp: $200K base + variable → $1M+

Target employers: Enterprise SaaS, B2B services, late-stage tech.` },
        { rank: `5`, role: `Journalist / Broadcaster / Podcaster`, fit: `86%`, why: `Why: Variety + people + storytelling.

Typical day: Reporting, interviewing, content production, audience building.

Watch for: Income lags audience; build runway in early years.`, comp: `Comp: $80K – $500K+ for established voices

Target employers: Major outlets, independent platforms, podcast networks.` },
        { rank: `6`, role: `Talent Scout / Senior Recruiter`, fit: `85%`, why: `Why: People leverage + variety + premium fees.

Typical day: Sourcing, interviewing, deal closing, client management.

Watch for: Cyclical industry; build durable client relationships.`, comp: `Comp: $120K – $400K+

Target employers: Executive search firms, in-house at growth companies.` },
        { rank: `7`, role: `Public Speaker / Workshop Leader`, fit: `84%`, why: `Why: Audience leverage + premium fees + variety.

Typical day: Speaking, workshop design, content, marketing.

Watch for: Building a speaking practice takes 5+ years.`, comp: `Comp: $200K – $1M+ for established speakers

Target employers: Independent practice, agency representation.` },
        { rank: `8`, role: `Creative Director / Agency Lead`, fit: `83%`, why: `Why: Vision + team + creative variety.

Typical day: Creative direction, client management, team leadership.

Watch for: Politics-heavy industry; choose firms with healthy cultures.`, comp: `Comp: $200K – $700K

Target employers: Top agencies, in-house at consumer brands.` },
        { rank: `9`, role: `Talent Manager / Booking Agent`, fit: `81%`, why: `Why: Deal-making, story-selling, relationship leverage.

Typical day: Client management, deal negotiation, BD.

Watch for: Cyclical and political; protect long client relationships.`, comp: `Comp: $120K – $500K+

Target employers: Top agencies, boutique firms.` },
        { rank: `10`, role: `Independent Coach / Workshop Practice`, fit: `78%`, why: `Why: Variety + autonomy + premium fees.

Typical day: Coaching, workshop facilitation, content.

Watch for: Build runway; income lags credibility 2-3 years.`, comp: `Comp: $120K – $400K at scale

Target employers: Independent practice, boutique partnerships.` },
      ],
      bestIndustries: [
        `Consumer / mission-driven brand and marketing`,
        `Founder / venture-backed startups (consumer, services)`,
        `Independent media and content (audience-driven)`,
        `Strategy and brand consulting`,
        `Enterprise sales (people-leverage roles)`,
      ],
      avoidIndustries: [
        `Routine specialist work with no novelty`,
        `Heavy-process bureaucracies`,
        `Roles with little human contact`,
      ],
      greenFlags: [
        `Variety and new problems weekly`,
        `Mission-aligned, energetic team`,
        `Outcomes evaluated, not hours`,
        `Permission to follow energy`,
        `Smart, opinionated colleagues`,
      ],
      redFlags: [
        `Routine, repetitive work`,
        `Heavy approval chains and process`,
        `Conflict-averse cultures`,
        `'Stay in your lane' management`,
        `Solo specialist roles`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$70K – $130K`, driver: `Multiple pivots are normal. Optimize for learning and exposure.` },
        { stage: `Years 4-7`, range: `$130K – $230K`, driver: `Specialty emerges. First income jump.` },
        { stage: `Years 8-15`, range: `$230K – $500K`, driver: `Synthesis pays. Senior leadership or independent practice.` },
        { stage: `Years 16-25`, range: `$400K – $1.5M+`, driver: `Founder, partner, or scaled practice.` },
        { stage: `Years 25+`, range: `$500K – $5M+`, driver: `Multiple income streams, advisory, equity outcomes.` },
      ],
      leadershipStrengths: [
        `Energizing teams toward bold goals`,
        `Recruiting talent through pure enthusiasm`,
        `Connecting disparate ideas into actionable strategy`,
        `Reading and adjusting to room dynamics`,
      ],
      leadershipBlindspots: [
        `Pivoting strategy too often (team whiplash)`,
        `Starting more than you can finish`,
        `Letting energy substitute for execution`,
        `Avoiding necessary hard conversations`,
      ],
      leadershipScripts: [
        { label: `Committing to direction`, text: `'We're locked on X for the next 6 months. I won't change it.'` },
        { label: `Holding the line`, text: `'I know you have a new idea. Let's table it for two weeks. If it still feels right then, we'll discuss.'` },
        { label: `Hard conversation`, text: `'I care about you AND this work. Here's what I'm seeing. Here's what needs to change in two weeks. How can I help?'` },
      ],
      stages: [
        { label: `Years 1-7 — The Exploration Years`, intro: `You'll try many paths. Each one teaches you. Don't apologize for breadth.`, milestones: `Master one craft. Build one finisher partnership. Ship one substantial public artifact.`, mistakes: `Pivoting every 12 months. Underrating execution. Saying yes to everything.`, signals: `You can describe your craft in one sentence. You have a body of work. You've completed one major project.` },
        { label: `Years 8-15 — The Synthesis Years`, intro: `Your varied experiences combine into something only you can offer.`, milestones: `Founder, senior brand role, or signature practice. Build a team. Develop public profile.`, mistakes: `Refusing to commit. Letting your finisher quit. Skipping operational basics.`, signals: `Inbound for what you're known for. Comp 3-5x year-7. You set terms.` },
        { label: `Years 16+ — The Mentor-Founder Phase`, intro: `You build the kind of company younger you wished existed.`, milestones: `Founder at scale, board member, or scaled independent practice.`, mistakes: `Diluting attention across too many bets. Skipping the 'how.' Burnout.`, signals: `Multiple income streams. Decision authority over capital. Younger ENFPs ask for your time.` },
      ],
      investSkills: [
        `Operational discipline (one system, one calendar, one weekly review)`,
        `Long-form writing (essays, decks, memos)`,
        `Recruiting and retaining executors`,
        `Storytelling for fundraising / sales / hiring`,
        `Negotiation and deal-making`,
      ],
      deprioritizeSkills: [
        `Generic productivity hacks`,
        `Polishing presentations beyond clear`,
        `Conference networking for its own sake`,
        `Becoming the deepest specialist in any one area`,
      ],
      negotiationOverview: `ENFPs talk too much in negotiations because silence feels uncomfortable. Practice silence after stating your number. The deal you'll regret is the one you oversold. Do the talking before the room — preparation beats charm.`,
      negotiationScripts: [
        { label: `Stating your rate`, text: `'For this scope, my rate is [target]. That includes [deliverables]. How does that land?'` },
        { label: `Closing without overselling`, text: `'Sounds like we're aligned. Let me put it in writing today; you confirm by Friday; we move next week.'` },
      ],
      pivots: [
        { title: `Generalist → Founder`, text: `Validate one wedge with paying customers. Hire executor before product-market fit.` },
        { title: `Marketing leader → Independent strategist`, text: `Build inbound through writing/speaking for 18 months while employed. Quit when 60% of salary covered.` },
        { title: `Operator → Coach / Speaker (hybrid)`, text: `Layer coaching/speaking on top of operating role. Hybrid practice 2-3x's income.` },
      ],
      traps: [
        { title: `Shiny object syndrome`, text: `New is not always better. Stay 12-18 months minimum on any committed project.` },
        { title: `Admin neglect`, text: `Your unopened email costs money. Build 30-min weekly admin rhythm.` },
        { title: `Underpricing joy-filled work`, text: `If it's fun, charge MORE, not less. People overpay for delight.` },
        { title: `Refusing to commit to a domain`, text: `Your career compounds when you stay. Pick one for 5+ years post-30.` },
        { title: `Underrating operators`, text: `The executor who ships your vision is your single biggest career asset. Pay, promote, protect.` },
        { title: `Chronic over-commitment`, text: `Each yes after the third one halves the previous yes's impact.` },
      ],
      redFlagPhrases: [
        `'Highly process-driven' (translation: bureaucratic)`,
        `'Long sales cycles' if you're not patient`,
        `'Strict hierarchy' (no autonomy)`,
        `'Detail-oriented' as primary requirement`,
        `'Stable, mature culture' (often code for: stagnant)`,
      ],
      networking: `Your network is already huge; the move is curation. Pick the 30 most valuable relationships from the 1,000 you have. Treat those 30 like family. The other 970 are still useful — just less important. Quality of touch beats quantity.`,
      weeks: [
        { label: `Week 1`, text: `List every project. Kill three. Pick ONE 90-day priority.` },
        { label: `Week 2`, text: `Identify your finisher candidate. Start the conversation.` },
        { label: `Week 3`, text: `Reach out to 5 ex-colleagues. Substantive update or offer. No ask.` },
        { label: `Week 4`, text: `Build a feedback loop on the priority — daily metric or weekly check-in.` },
        { label: `Week 5`, text: `Make one decision you've been deferring. Decide.` },
        { label: `Week 6`, text: `Block 4 hours/week deep work on the priority. Inviolable.` },
        { label: `Week 7`, text: `Make one public statement about the priority — post, deck, talk.` },
        { label: `Week 8`, text: `Re-engage 3 cold but valuable contacts. Bring something useful.` },
        { label: `Week 9`, text: `Hire or activate the finisher (even part-time).` },
        { label: `Week 10`, text: `Negotiate something. Practice silence first.` },
        { label: `Week 11`, text: `Audit your calendar. Cut 20% of low-value meetings.` },
        { label: `Week 12`, text: `Review 90 days. What did you finish? Set next plan.` },
      ],
      visionExercise: `Imagine yourself in 10 years. You're known for one thing. Write the one-sentence headline. Now: what 3 projects do you NOT start in the next year for that headline to be true? ENFP success is more about saying no than yes.`,
    },
  },
  ISTJ: {
    title: `ISTJ — The Inspector`,
    subtitle: `Premium career insights tailored to your ISTJ profile`,
    careerDna: `You're the institutional spine of organizations. Reliability compounded over decades becomes rare and deeply valuable — ISTJs often end up running the function everyone else depends on. Your risk is being so dependable that you become invisible in promotion cycles. Making your contribution visible is 80% of your career upside.`,
    matches: [
      { rank: `1`, role: `CFO / Corporate Controller`, fit: `93%`, salary: `$200K – $600K` },
      { rank: `2`, role: `Tax / Corporate Attorney`, fit: `91%`, salary: `$200K – $800K` },
      { rank: `3`, role: `Audit / Accounting Partner`, fit: `89%`, salary: `$200K – $600K` },
      { rank: `4`, role: `Operations / Supply Chain Director`, fit: `88%`, salary: `$140K – $350K` },
      { rank: `5`, role: `Judge / Senior Legal Administrator`, fit: `87%`, salary: `$130K – $250K` },
      { rank: `6`, role: `Military / Law Enforcement Leadership`, fit: `85%`, salary: `Variable` },
      { rank: `7`, role: `Program / Project Director (Complex Ops)`, fit: `84%`, salary: `$130K – $250K` },
    ],
    environment: `You perform at your best in environments with structure, clear expectations, earned progression, and respect for expertise. You struggle in chaotic startups or roles where norms shift weekly. Pick stability not because you're risk-averse — because it's where your strengths compound fastest.`,
    leadership: `You lead as a steward. You protect standards, people, and long-term outcomes. The risk: defending the old so well you miss the new. The fix: deliberately budget 10% of your time to exploring what's next. Stewardship without foresight becomes stagnation.`,
    stages: [
      { label: `Years 1–7 — The Fundamentals Phase`, text: `You'll master your craft methodically. Peers who flash out-earn you temporarily. You'll surpass most by year 10.` },
      { label: `Years 8–15 — The Indispensable Years`, text: `You become the person who holds the institution together. Your leverage peaks here.` },
      { label: `Years 16+ — The Institutional Leadership Phase`, text: `You run the function — or the company. Your name is synonymous with 'gets it done.'` },
    ],
    traps: [
      { title: `Under-promoting yourself`, text: `Your work is exceptional; say so. Others are.` },
      { title: `Resisting change too long`, text: `The cost of missed transitions is usually invisible until it's catastrophic.` },
      { title: `Isolating from newer professionals`, text: `Younger colleagues are your scouting network. Stay in their orbit.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Document the workflows that would break if you left. Share them upward.` },
      { label: `Days 31–60`, text: `Ask for one new responsibility outside your comfort zone.` },
      { label: `Days 61–90`, text: `Meet 5 peers outside your organization. Lateral networks are promotion insurance.` },
    ],
    premium: {
      executiveSummary: `You are the institutional spine of organizations. Reliability compounded over decades becomes rare and deeply valuable. ISTJs end up running the function everyone else depends on — but often miss the comp upside because they don't market themselves. This report is your operating manual for converting reliability into recognition and recognition into compensation.`,
      careerDna: [
        `You finish what you start. You honor commitments others forget. You build the systems that make organizations actually work. In a culture obsessed with novelty, you are the quiet leverage that makes novelty functional.`,
        `Your default mode is 'do it right, do it once, do it on time.' This is your edge in fields with stakes — finance, law, operations, healthcare. It's a liability in fields where speed beats accuracy.`,
        `The single career lever that transforms ISTJ outcomes is visibility. Your work speaks for itself only inside the room you're in. Most ISTJs are paid 15-20% below market for years because no one outside their immediate team knows what they do. Make your contribution legible upward and laterally.`,
      ],
      strengths: [
        { title: `Reliable execution`, text: `What you commit, you deliver. In a world of half-finished work, this is rare and priced accordingly.` },
        { title: `Memory and pattern stability`, text: `You see when this year's plan contradicts last year's. Invaluable in compliance, finance, and operations.` },
        { title: `Structured problem-solving`, text: `You don't reinvent the wheel; you fix it. Asset in process improvement and institutional building.` },
        { title: `Tolerance for repetition`, text: `You can do something correctly the 1,000th time. Most can't. This is the foundation of compounding skill.` },
      ],
      matches: [
        { rank: `1`, role: `CFO / Corporate Controller`, fit: `94%`, why: `Why: Numbers + integrity + structure. ISTJ at peak.

Typical day: Financial close, board reporting, audits, capital decisions.

Watch for: First-time CFOs underestimate the strategic side; build that muscle deliberately.`, comp: `Comp: $220K – $700K

Target employers: Mid-cap public, late-stage startups, services firms.` },
        { rank: `2`, role: `Tax / Corporate Attorney (Big Law / In-house)`, fit: `92%`, why: `Why: Detail + rigor + premium pay.

Typical day: Drafting, review, deal closings, compliance.

Watch for: Hours are punishing; choose firms with stronger work-life cultures if it matters.`, comp: `Comp: $220K – $1M+ at partner / senior in-house

Target employers: AmLaw firms, top corporations.` },
        { rank: `3`, role: `Audit / Accounting Partner (Big 4 / Mid-tier)`, fit: `90%`, why: `Why: Structure + relationship + premium fees.

Typical day: Audit management, client relationships, partner BD.

Watch for: Up-or-out is real; build sponsor relationships.`, comp: `Comp: $200K – $700K at partner

Target employers: Big 4, top mid-tier accounting firms.` },
        { rank: `4`, role: `Operations / Supply Chain Director (Senior)`, fit: `89%`, why: `Why: Systems thinking + execution at scale.

Typical day: Process optimization, vendor management, capacity planning.

Watch for: Avoid orgs where ops is a cost center, not a strategic function.`, comp: `Comp: $140K – $350K

Target employers: Manufacturing, e-commerce, healthcare, services.` },
        { rank: `5`, role: `Compliance / Risk Officer (Senior)`, fit: `88%`, why: `Why: Detail + structure + regulatory work.

Typical day: Policy, monitoring, audits, risk assessment.

Watch for: Career path is structured; specialty depth pays.`, comp: `Comp: $150K – $400K

Target employers: Financial services, healthcare, regulated industries.` },
        { rank: `6`, role: `Judge / Senior Legal Administrator`, fit: `87%`, why: `Why: Authority + structure + meaningful work.

Typical day: Case management, decisions, administration.

Watch for: Path is long; usually requires litigation experience first.`, comp: `Comp: $130K – $250K (jurisdiction-dependent)

Target employers: Federal / state courts, administrative law.` },
        { rank: `7`, role: `Project / Program Director (Complex Operations)`, fit: `86%`, why: `Why: Structure + execution at scale.

Typical day: Project planning, vendor management, stakeholder management.

Watch for: Pick orgs that respect PM as strategic, not administrative.`, comp: `Comp: $140K – $300K (PMP / PgMP often required)

Target employers: Defense, infrastructure, healthcare, large IT.` },
        { rank: `8`, role: `Military / Federal Agency Senior Officer`, fit: `84%`, why: `Why: Structure + mission + leadership.

Typical day: Command, strategy, training, operations.

Watch for: Career path is structured; pension benefits significant.`, comp: `Comp: Variable — $100K – $250K (federal pay scale)

Target employers: DoD, federal agencies, intelligence.` },
        { rank: `9`, role: `Banking / Private Wealth Advisor (Senior)`, fit: `82%`, why: `Why: Detail + relationship + premium fees.

Typical day: Portfolio management, client meetings, planning.

Watch for: Client book is your career capital; treat carefully.`, comp: `Comp: $200K – $700K (client-book dependent)

Target employers: Private banks, wealth management firms.` },
        { rank: `10`, role: `Real Estate / Investment Property Investor`, fit: `78%`, why: `Why: Long-horizon discipline + capital deployment.

Typical day: Acquisition, financing, asset management.

Watch for: Capital-intensive; build slowly and rigorously.`, comp: `Comp: Variable — $0 – $1M+/year

Target employers: Independent or small partnership.` },
      ],
      bestIndustries: [
        `Finance and accounting (audit, tax, controllership, CFO track)`,
        `Law (corporate, tax, regulatory)`,
        `Operations and supply chain at scale`,
        `Compliance and risk (regulated industries)`,
        `Government / federal service`,
      ],
      avoidIndustries: [
        `Highly creative or vibe-driven industries (advertising, fashion)`,
        `Early-stage chaotic startups`,
        `Roles requiring constant pivoting`,
      ],
      greenFlags: [
        `Clear expectations and structure`,
        `Earned progression based on results`,
        `Respect for expertise and tenure`,
        `Stable, well-managed culture`,
        `Outcomes-based evaluation`,
      ],
      redFlags: [
        `Constant strategy pivots`,
        `Vague expectations and shifting goals`,
        `Cultures that reward optics over substance`,
        `Disorganized leadership`,
        `Open-plan offices with constant interruption`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$70K – $130K`, driver: `Mastering fundamentals. Don't optimize for title; optimize for skill foundation.` },
        { stage: `Years 4-7`, range: `$130K – $220K`, driver: `Trust compounds. Promotions become regular.` },
        { stage: `Years 8-15`, range: `$220K – $450K`, driver: `Indispensable phase. Senior IC or director-level.` },
        { stage: `Years 16-25`, range: `$400K – $900K`, driver: `C-suite, partner, or institutional leader.` },
        { stage: `Years 25+`, range: `$300K – $1.5M+`, driver: `Board roles, advisory, equity portfolio.` },
      ],
      leadershipStrengths: [
        `Reliable execution at scale`,
        `Defending standards and quality`,
        `Building systems that outlast you`,
        `Mentoring through structure and patience`,
      ],
      leadershipBlindspots: [
        `Resistance to change you didn't initiate`,
        `Under-promoting yourself and your team`,
        `Discomfort with ambiguity`,
        `Tolerating inefficiency for the sake of stability`,
      ],
      leadershipScripts: [
        { label: `Pushing back on a bad plan`, text: `'I want this to succeed. Here's the risk I'm seeing in [specific element]. Here's what I'd recommend instead.'` },
        { label: `Promoting your team upward`, text: `'My team delivered [specific outcomes]. [Person] led [specific contribution]. I want to make sure leadership knows.'` },
        { label: `Managing change`, text: `'I see why we're moving to X. The pieces of [old system] worth preserving are [specific]. How do we keep those while adopting X?'` },
      ],
      stages: [
        { label: `Years 1-7 — The Fundamentals Phase`, intro: `You'll master your craft methodically. Some peers will flash out-earn you. You'll surpass most by year 10.`, milestones: `Master one technical domain. Earn one professional credential. Build one mentor relationship.`, mistakes: `Under-promoting yourself. Refusing the 'soft' work that earns visibility. Job-hopping for small raises.`, signals: `Senior leaders rely on you. Your work is referenced. You have a credential or specialty.` },
        { label: `Years 8-15 — The Indispensable Years`, intro: `You become the person who holds the institution together. Your leverage peaks here.`, milestones: `Function ownership, P&L responsibility, or partnership. External credibility.`, mistakes: `Resisting promotion to leadership. Hoarding institutional knowledge. Avoiding strategic conversations.`, signals: `You're recruited rather than applying. Comp doubles. Younger professionals seek your guidance.` },
        { label: `Years 16+ — The Institutional Leadership Phase`, intro: `You run the function — or the company. Your name is synonymous with 'gets it done.'`, milestones: `C-suite role, partner, or institutional leader. Board seats. Mentor pipeline.`, mistakes: `Resisting strategic transitions. Holding on to operations you should delegate. Missing the next wave.`, signals: `Multiple income streams. Decision authority. Lasting institutional influence.` },
      ],
      investSkills: [
        `Executive communication (memo writing, exec presentations)`,
        `Strategic thinking (deliberate practice — your gap)`,
        `Influence beyond authority`,
        `One non-traditional credential or thought-leadership move`,
        `Equity / capital allocation literacy`,
      ],
      deprioritizeSkills: [
        `Generic productivity hacks`,
        `Polishing artifacts beyond useful`,
        `Networking-for-networking's-sake`,
        `Mass-market personal branding`,
      ],
      negotiationOverview: `ISTJs negotiate poorly because asking feels like overstepping. Reframe: asking for fair pay reflects the value you've already delivered. Document your wins quarterly. Bring data, not feelings. Practice the ask aloud.`,
      negotiationScripts: [
        { label: `Asking for a raise`, text: `'Over the past 12 months I've delivered [specific outcomes]. Based on benchmarks, my comp should be at [target]. What would it take to get there?'` },
        { label: `Negotiating an offer`, text: `'For this scope, my expected comp is [target]. That's based on [data]. What flexibility do you have?'` },
      ],
      pivots: [
        { title: `Internal IC → Director / VP`, text: `Volunteer for cross-functional projects. Build sponsor relationships above your manager. Most ISTJs under-network internally.` },
        { title: `Public accounting → Industry CFO track`, text: `Move from audit/tax to industry FP&A or controllership in years 5-8. Most CFOs spent 8-12 years in industry.` },
        { title: `Operations leader → Independent consultant`, text: `Build domain reputation publicly (writing, speaking) for 2-3 years before leaving.` },
      ],
      traps: [
        { title: `Under-promoting yourself`, text: `Your work is exceptional. Say so. Others are.` },
        { title: `Resisting change too long`, text: `The cost of missed transitions is invisible until catastrophic.` },
        { title: `Isolating from younger professionals`, text: `They're your scouting network. Stay in their orbit.` },
        { title: `Hoarding institutional knowledge`, text: `Documented systems are leverage. Undocumented systems make you indispensable in the wrong way.` },
        { title: `Refusing to manage`, text: `The IC ceiling is real. Embrace management when the door opens.` },
        { title: `Tolerating dysfunctional bosses`, text: `ISTJs stay too long with bad managers out of loyalty. The cost is your trajectory.` },
      ],
      redFlagPhrases: [
        `'Move fast and break things' (no rigor)`,
        `'Highly fluid org structure' (vague accountability)`,
        `'Hire generalists' (no specialization)`,
        `'Optimize for speed over quality' (against your wiring)`,
        `'No standard processes' (you'll be the one building them — and not paid for it)`,
      ],
      networking: `ISTJs build deep, narrow networks. The move is to extend laterally — peers in your field at OTHER companies. One quarterly substantive note to 10 such peers. Over 10 years this gives you market intelligence and optionality nothing else does.`,
      weeks: [
        { label: `Week 1`, text: `Document the workflows that would break if you left. Share upward.` },
        { label: `Week 2`, text: `Ask for one new responsibility outside your comfort zone.` },
        { label: `Week 3`, text: `Identify 5 peers at other companies in your field. Reach out to one.` },
        { label: `Week 4`, text: `Track quantitative wins weekly. Make them legible.` },
        { label: `Week 5`, text: `Request a meeting with a skip-level to share metrics.` },
        { label: `Week 6`, text: `Identify your single largest skill gap toward your 5-year goal. Address it.` },
        { label: `Week 7`, text: `Audit your role against the 5 environment factors. Score honestly.` },
        { label: `Week 8`, text: `Write your 5-year career memo. Comp, role, lifestyle.` },
        { label: `Week 9`, text: `Reach out to 2 more peers at other companies.` },
        { label: `Week 10`, text: `Volunteer for one cross-functional project.` },
        { label: `Week 11`, text: `Practice asking for promotion or raise aloud. Schedule the ask.` },
        { label: `Week 12`, text: `Review the 90 days. Set next plan with a peer accountability partner.` },
      ],
      visionExercise: `Imagine yourself at retirement. You're proud of one specific thing you built. What was it? What did it require you to do this year that you've been avoiding? Start that this quarter.`,
    },
  },
  ISFJ: {
    title: `ISFJ — The Protector`,
    subtitle: `Premium career insights tailored to your ISFJ profile`,
    careerDna: `You're a quiet caretaker of organizations, teams, and clients. ISFJs build the relational fabric that holds institutions together — and are often underpaid because that work is invisible until it stops. Your career project is learning to price your care appropriately and stay visible without compromising your style.`,
    matches: [
      { rank: `1`, role: `Nurse / Healthcare Leader`, fit: `93%`, salary: `$90K – $250K` },
      { rank: `2`, role: `Elementary / Secondary School Principal`, fit: `88%`, salary: `$90K – $160K` },
      { rank: `3`, role: `Clinical Social Work Supervisor`, fit: `86%`, salary: `$80K – $140K` },
      { rank: `4`, role: `HR Manager / People Partner`, fit: `85%`, salary: `$90K – $180K` },
      { rank: `5`, role: `Executive Assistant / Chief of Staff (C-Suite)`, fit: `84%`, salary: `$90K – $200K` },
      { rank: `6`, role: `Client Success Director`, fit: `83%`, salary: `$110K – $250K` },
      { rank: `7`, role: `Librarian / Museum Curator`, fit: `80%`, salary: `$70K – $130K` },
    ],
    environment: `You thrive in stable environments with appreciation, clear teammates, and relational depth. You lose energy in cutthroat or ambiguous cultures. Stability is strategic for you; don't let peer pressure push you toward chaotic roles that drain your performance.`,
    leadership: `You lead as a caretaker — people feel protected and guided. The risk: being overlooked in promotion cycles because your work is felt more than seen. The fix: create visible metrics of contribution and share them upward quarterly.`,
    stages: [
      { label: `Years 1–7 — The Trust-Building Years`, text: `You'll earn your colleagues' deep loyalty. Let that compound; don't job-hop early.` },
      { label: `Years 8–15 — The Expertise Deepening Phase`, text: `You become the person the organization can't replace. Raises lag your value — ask for them.` },
      { label: `Years 16+ — The Mentor & Memory Years`, text: `You are the institution's memory. Senior advisory or leadership roles become natural.` },
    ],
    traps: [
      { title: `Self-sacrifice`, text: `Your care is valuable; don't give it away free.` },
      { title: `Undercharging`, text: `Most ISFJs are paid 15–20% below market. Research and renegotiate.` },
      { title: `Avoiding the spotlight`, text: `Invisible work is uncompensated work. Be visible quarterly, at minimum.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Track your quantitative wins weekly — retention rates, client NPS, issues resolved. Make them legible.` },
      { label: `Days 31–60`, text: `Request a meeting with your skip-level to share those metrics.` },
      { label: `Days 61–90`, text: `Name one boundary you'll hold. Practice it three times before it gets hard.` },
    ],
    premium: {
      executiveSummary: `You're the quiet caretaker of organizations, teams, and clients. ISFJs build the relational fabric that holds institutions together — and are routinely underpaid because that work becomes visible only when it stops. This report is your operating manual for pricing your care appropriately and staying visible without compromising your style.`,
      careerDna: [
        `You make people and organizations work better just by being there. ISFJs hold the unglamorous middle that lets everyone else shine. This is durable, valuable work — and chronically undervalued.`,
        `You're at your worst in cutthroat or chaotic cultures. You're at your best in stable institutions where loyalty is rewarded over time. Choose stability strategically; don't let peer pressure push you toward chaos.`,
        `The single move that transforms ISFJ careers is naming your contribution publicly. ISFJs do their best work invisibly — and get paid invisibly for it. Documentation, metrics, and quarterly self-promotion close 80% of the comp gap.`,
      ],
      strengths: [
        { title: `Practical empathy`, text: `You read what people need and quietly provide it. Asset in healthcare, education, client service, HR.` },
        { title: `Memory for individuals`, text: `You remember names, families, prior conversations. Builds trust no system can replicate.` },
        { title: `Detail-oriented care`, text: `You catch what others miss because you actually pay attention. Asset in patient care, client work, complex coordination.` },
        { title: `Sustained loyalty`, text: `You stay through hard times. In an era of churn, this is rare and trust-building.` },
      ],
      matches: [
        { rank: `1`, role: `Nurse / Healthcare Leader (Senior)`, fit: `94%`, why: `Why: Care + structure + meaningful work. ISFJ at peak.

Typical day: Patient care, team coordination, training, ops.

Watch for: Burnout is real; build recovery practices.`, comp: `Comp: $90K – $250K at senior / advanced practice

Target employers: Hospitals, specialty practices, healthcare leadership.` },
        { rank: `2`, role: `Elementary / Secondary School Principal`, fit: `89%`, why: `Why: Care + structure + community.

Typical day: Staff management, parent communication, instructional leadership.

Watch for: Politics-heavy; choose districts with strong cultures.`, comp: `Comp: $90K – $170K

Target employers: Public, charter, private K-12.` },
        { rank: `3`, role: `Clinical Social Work Supervisor`, fit: `87%`, why: `Why: Care + leadership + impact.

Typical day: Case oversight, supervision, program management.

Watch for: Compensation moderate; meaning is the return.`, comp: `Comp: $80K – $140K

Target employers: Hospitals, agencies, schools, community orgs.` },
        { rank: `4`, role: `HR Manager / People Partner (Senior)`, fit: `86%`, why: `Why: Care + structure + business partnership.

Typical day: Talent management, employee relations, comp/benefits.

Watch for: Choose orgs where HR has strategic seat at the table.`, comp: `Comp: $100K – $200K at senior level

Target employers: Mid-cap and late-stage tech, services firms.` },
        { rank: `5`, role: `Executive Assistant / Chief of Staff to C-suite`, fit: `85%`, why: `Why: Trust + execution + behind-scenes leverage.

Typical day: Calendar, communications, project management, exec partnership.

Watch for: Pick principals carefully; the relationship is everything.`, comp: `Comp: $100K – $250K at senior C-suite

Target employers: Late-stage startups, mid-cap companies, family offices.` },
        { rank: `6`, role: `Client Success Director`, fit: `84%`, why: `Why: Relationship + retention + revenue leverage.

Typical day: Client management, renewals, expansion, team leadership.

Watch for: Avoid orgs that treat CS as cost; choose ones that treat it as revenue.`, comp: `Comp: $130K – $300K

Target employers: Enterprise SaaS, B2B services.` },
        { rank: `7`, role: `Pediatrician / Family Practice Physician`, fit: `83%`, why: `Why: Care + medicine + long-term relationships.

Typical day: Patient visits, charting, family communication.

Watch for: Long training; pursue if medicine calls.`, comp: `Comp: $200K – $350K

Target employers: Private practice, hospital systems.` },
        { rank: `8`, role: `Curator / Librarian (Special Collections)`, fit: `80%`, why: `Why: Care + scholarship + preservation.

Typical day: Acquisition, programming, research support.

Watch for: Stable but moderate pay.`, comp: `Comp: $70K – $130K

Target employers: Major institutions, university libraries, archives.` },
        { rank: `9`, role: `Veterinary Practice Owner / Senior Vet`, fit: `79%`, why: `Why: Care + craft + ownership upside.

Typical day: Patient care, practice management, staff leadership.

Watch for: Practice ownership 2-3x's income; pursue deliberately.`, comp: `Comp: $120K – $400K with practice ownership

Target employers: Independent practice or partnership.` },
        { rank: `10`, role: `Estate / Trust / Family Office Administrator`, fit: `77%`, why: `Why: Care + detail + premium fees.

Typical day: Trust administration, family communications, planning.

Watch for: Long-tenure relationships are the career capital.`, comp: `Comp: $100K – $300K at senior level

Target employers: Family offices, trust companies, private banks.` },
      ],
      bestIndustries: [
        `Healthcare (clinical and leadership)`,
        `Education (K-12, higher ed administration)`,
        `Mission-driven nonprofits`,
        `Client success and account management`,
        `HR and people functions`,
      ],
      avoidIndustries: [
        `Cutthroat sales / commission-only roles`,
        `Aggressive corporate cultures with high turnover`,
        `Roles with no human contact`,
      ],
      greenFlags: [
        `Stable, well-managed institution`,
        `Appreciation built into the culture`,
        `Clear teammates and team rhythms`,
        `Long-tenure colleagues`,
        `Outcomes-based evaluation`,
      ],
      redFlags: [
        `High-turnover environments`,
        `Cultures that reward bluntness over kindness`,
        `Constantly shifting strategy`,
        `Lone-wolf cultures with no team`,
        `Politics-heavy promotion structures`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$55K – $90K`, driver: `Likely underpaid relative to value. Build credentials and visibility.` },
        { stage: `Years 4-7`, range: `$90K – $150K`, driver: `Trust compounds; comp catches up modestly.` },
        { stage: `Years 8-15`, range: `$150K – $300K`, driver: `Senior leadership phase. Comp jumps if you negotiate.` },
        { stage: `Years 16-25`, range: `$250K – $500K+`, driver: `C-suite, partner, or established practice.` },
        { stage: `Years 25+`, range: `$200K – $700K+`, driver: `Authority and longevity pay.` },
      ],
      leadershipStrengths: [
        `Building deeply loyal teams`,
        `Catching problems before they escalate`,
        `Mentoring through patience and care`,
        `Holding institutional memory`,
      ],
      leadershipBlindspots: [
        `Avoiding necessary firings`,
        `Self-sacrificing to the point of burnout`,
        `Under-promoting yourself and team`,
        `Discomfort with confrontation`,
      ],
      leadershipScripts: [
        { label: `Holding accountability`, text: `'I want this to work. Here's what I'm seeing. What do you need to do differently in the next two weeks?'` },
        { label: `Asking for resources`, text: `'For my team to deliver [outcome], we need [resources]. Without them, here's what we'd have to drop.'` },
        { label: `Promoting your team`, text: `'My team delivered [specific outcomes]. [Person] led [specific contribution]. I want leadership to know.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Trust-Building Years`, intro: `You'll earn deep colleague loyalty. Resist job-hopping early.`, milestones: `Master one specialty. Earn one credential. Build one mentor relationship.`, mistakes: `Under-promoting. Self-sacrificing. Avoiding visibility.`, signals: `Senior leaders rely on you. Younger colleagues seek your help. You have a credential or specialty.` },
        { label: `Years 8-15 — The Expertise Deepening Phase`, intro: `You become hard to replace. Comp lags value — ask for raises.`, milestones: `Function leadership, P&L exposure, or institutional credibility.`, mistakes: `Tolerating bad management out of loyalty. Hoarding knowledge. Avoiding strategic conversations.`, signals: `Recruited rather than applying. Comp meaningful jumps. Younger professionals view you as model.` },
        { label: `Years 16+ — The Mentor & Memory Years`, intro: `You're institutional memory. Senior advisory or leadership comes naturally.`, milestones: `C-suite role, founder, or platform owner.`, mistakes: `Refusing to delegate. Holding on to legacy practices. Missing the next wave.`, signals: `Multiple income streams. Decision authority. Mentees succeed.` },
      ],
      investSkills: [
        `Self-promotion and visible self-advocacy`,
        `Strategic thinking`,
        `Negotiation`,
        `Boundary-setting`,
        `One business-side skill (P&L, marketing, BD)`,
      ],
      deprioritizeSkills: [
        `Generic productivity systems`,
        `Polishing artifacts past 'clearly useful'`,
        `Mass-market networking`,
        `Becoming the most technical specialist`,
      ],
      negotiationOverview: `ISFJs negotiate poorly because asking feels selfish. Reframe: asking for fair compensation is honoring the value you've delivered to others. You undercharge because you over-give. Set rate before conversations. Practice aloud.`,
      negotiationScripts: [
        { label: `Asking for a raise`, text: `'In the last year I've contributed [outcomes]. The market for this work is [benchmark]. I'd like to bring my comp to [target].'` },
        { label: `Negotiating scope`, text: `'I'd love to take this on. To do it well, I'd need [resources / time]. Here's what I'd have to drop otherwise.'` },
      ],
      pivots: [
        { title: `Internal IC → Manager`, text: `Embrace the leadership track. ISFJ managers retain the highest team loyalty in any org.` },
        { title: `Generalist → Specialist`, text: `Pick one niche after year 5 and stay. Specialty depth dramatically increases comp.` },
        { title: `Service-side → Practice ownership`, text: `Many ISFJs (vets, dentists, therapists) 2-3x income by buying or starting practice.` },
      ],
      traps: [
        { title: `Self-sacrifice`, text: `Your care is valuable; don't give it free.` },
        { title: `Undercharging`, text: `Most ISFJs paid 15-20% below market. Research and renegotiate.` },
        { title: `Avoiding spotlight`, text: `Invisible work is uncompensated work. Be visible quarterly.` },
        { title: `Loyalty to dysfunction`, text: `Loyalty to mission ≠ loyalty to broken org. Leave when cost is your health.` },
        { title: `Refusing to manage`, text: `Your team would be lucky to have you. Stop resisting.` },
        { title: `Saying yes to keep peace`, text: `Each yes you didn't want is a no to the work that matters.` },
      ],
      redFlagPhrases: [
        `'Wear many hats' (no role definition)`,
        `'High-energy, fast-paced' (often code for: chaotic)`,
        `'Self-starter' with no support`,
        `'Fluid org structure' (vague accountability)`,
        `'Hire for hustle' (often code for: burnout)`,
      ],
      networking: `Build narrow and deep. Pick 15 colleagues you respect across your career and stay in real touch (annual lunch, quarterly check-in). Over 20 years this gives you optionality, market intel, and emotional support nothing else does.`,
      weeks: [
        { label: `Week 1`, text: `Track quantitative wins weekly. Retention, NPS, issues resolved. Make legible.` },
        { label: `Week 2`, text: `Request a meeting with skip-level to share metrics.` },
        { label: `Week 3`, text: `Name one boundary you'll hold. Practice 3 times before it gets hard.` },
        { label: `Week 4`, text: `Reach out to one ex-colleague. Substantive, no ask.` },
        { label: `Week 5`, text: `Identify the one skill gap most blocking your trajectory.` },
        { label: `Week 6`, text: `Have one hard conversation you've been avoiding.` },
        { label: `Week 7`, text: `Audit your rate / salary against benchmarks. Set new minimum.` },
        { label: `Week 8`, text: `Practice the ask for promotion or raise aloud.` },
        { label: `Week 9`, text: `Schedule the ask.` },
        { label: `Week 10`, text: `Reach out to 2 more long-term colleagues.` },
        { label: `Week 11`, text: `Audit your client / project list. Phase out bottom 20%.` },
        { label: `Week 12`, text: `Review 90 days. Set next plan.` },
      ],
      visionExercise: `Imagine your retirement gathering. The people you served most over 30 years are there. What would they say you protected for them? What would you say you under-protected for yourself? The answer is your boundary practice for the next decade.`,
    },
  },
  ESTJ: {
    title: `ESTJ — The Director`,
    subtitle: `Premium career insights tailored to your ESTJ profile`,
    careerDna: `You're an organizer of the world. ESTJs are execution machines and make up a disproportionate share of managers, military officers, and administrators. Your gift is turning chaos into order. Your risk is running so fast that you outrun the people who'd follow you. Learning when to slow down is your growth edge.`,
    matches: [
      { rank: `1`, role: `COO / Operations Executive`, fit: `93%`, salary: `$220K – $700K` },
      { rank: `2`, role: `General Counsel / Corporate Attorney`, fit: `91%`, salary: `$250K – $700K` },
      { rank: `3`, role: `Financial Services Senior Leader`, fit: `90%`, salary: `$200K – $600K` },
      { rank: `4`, role: `Senior Military / Government Executive`, fit: `88%`, salary: `Variable` },
      { rank: `5`, role: `Construction / Manufacturing Executive`, fit: `87%`, salary: `$180K – $400K` },
      { rank: `6`, role: `Healthcare / Education Administrator`, fit: `86%`, salary: `$160K – $400K` },
      { rank: `7`, role: `VP Sales / Enterprise Sales Leadership`, fit: `85%`, salary: `$200K – $500K` },
    ],
    environment: `You thrive in environments with clear hierarchy, accountable cultures, decisive leadership, and measurable KPIs. You struggle with ambiguity or consensus-over-output cultures. Choose employers who let you execute.`,
    leadership: `You lead directively. Your team always knows what's expected. The risk: steamrolling dissent until no one brings you bad news. The fix: build a structural devil's advocate into your cadence — a person, a meeting type, or a document section dedicated to pushback. Decisions improve when you can't squash the counterargument.`,
    stages: [
      { label: `Years 1–7 — The Reliability Phase`, text: `You'll earn trust by doing what you said you'd do, on time, at scale.` },
      { label: `Years 8–15 — The Function Leader Phase`, text: `You'll run a department or region. Operational excellence becomes your brand.` },
      { label: `Years 16+ — The Enterprise Leadership Phase`, text: `You run the company, division, or institution. You set the operating rhythm for everyone.` },
    ],
    traps: [
      { title: `Black-and-white thinking`, text: `The world operates in gray. Premature clarity costs you talent.` },
      { title: `Neglecting change management`, text: `'I decided' isn't 'they accepted.' Budget time for the people side.` },
      { title: `Micromanaging senior talent`, text: `Your A-players leave when you don't trust them. Delegate outcome, not method.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Name your top 3 KPIs. If your team can't recite them, simplify.` },
      { label: `Days 31–60`, text: `Cut 20% of low-value meetings in your calendar. Redirect the time to 1:1 with top talent.` },
      { label: `Days 61–90`, text: `Hire or engage a coach who specializes in senior-leader soft skills.` },
    ],
    premium: {
      executiveSummary: `You're an organizer of the world. ESTJs are execution machines and disproportionately make up management, military, and administrative leadership. Your career risk is running so fast you outrun the people who'd follow you. This report is your operating manual for converting velocity into compounding leverage without burning the team that gets you there.`,
      careerDna: [
        `You turn chaos into order. ESTJs build the systems, hierarchies, and institutions that make ambitious work executable. Your value compounds in environments that respect process and accountability.`,
        `Your default mode is decision + execution + measurement. This is gold in operations, military, finance, and any context with stakes. It's a liability in vibe-driven creative environments.`,
        `The single career lever that transforms ESTJ outcomes is learning to lead change you didn't initiate. ESTJs tolerate change well when they're driving it; less so when imposed. Your career ceiling depends on your flexibility in the second case as much as the first.`,
      ],
      strengths: [
        { title: `Decisiveness`, text: `You make calls and move. In a world of analysis paralysis, this is rare.` },
        { title: `Process and structure thinking`, text: `You design systems that scale. Asset in operations, finance, manufacturing, government.` },
        { title: `Resource allocation`, text: `You match people and budgets to outcomes. Asset in management at every level.` },
        { title: `Holding the line on standards`, text: `You enforce quality and accountability. Asset in regulated and high-stakes work.` },
      ],
      matches: [
        { rank: `1`, role: `COO / Operations Executive`, fit: `94%`, why: `Why: Execution + scale + leverage. ESTJ playground.

Typical day: Ops strategy, P&L, team management, exec partnership.

Watch for: Pick CEOs who actually trust ops; otherwise the role is administrative.`, comp: `Comp: $250K – $1M+

Target employers: Mid-cap and late-stage tech, services, manufacturing.` },
        { rank: `2`, role: `General Counsel / Senior Corporate Attorney`, fit: `92%`, why: `Why: Authority + structure + premium pay.

Typical day: Legal strategy, deal review, compliance, risk.

Watch for: Path is long; only pursue if structure and prestige matter.`, comp: `Comp: $300K – $1M+ at senior in-house / partner

Target employers: AmLaw firms, top in-house roles.` },
        { rank: `3`, role: `Financial Services Senior Leader (CFO / Head of Risk)`, fit: `91%`, why: `Why: Detail + scale + leadership.

Typical day: Reporting, capital, risk, regulatory.

Watch for: Regulated environments fit ESTJs; choose ones that move fast enough to be interesting.`, comp: `Comp: $300K – $1M+

Target employers: Banks, insurance, financial services firms.` },
        { rank: `4`, role: `Senior Military Officer / Federal Agency Leader`, fit: `89%`, why: `Why: Hierarchy + mission + leadership.

Typical day: Command, strategy, training, operations.

Watch for: Career path is structured; benefits compound.`, comp: `Comp: $130K – $300K (federal pay scale; pension significant)

Target employers: DoD, federal agencies, intelligence community.` },
        { rank: `5`, role: `Construction / Manufacturing Executive`, fit: `88%`, why: `Why: Operations + scale + tangible outputs.

Typical day: Project management, supply chain, ops, P&L.

Watch for: Industry can be cyclical; build through cycles.`, comp: `Comp: $180K – $500K+

Target employers: Major construction firms, manufacturers.` },
        { rank: `6`, role: `Healthcare / Education Administrator (Senior)`, fit: `87%`, why: `Why: Mission + execution at scale.

Typical day: Operations, finance, regulatory, leadership.

Watch for: Politics-heavy; choose institutions with strong cultures.`, comp: `Comp: $180K – $500K+

Target employers: Hospital systems, university administration, K-12 superintendency.` },
        { rank: `7`, role: `VP Sales / CRO (Process-driven)`, fit: `85%`, why: `Why: Quota responsibility + team leverage.

Typical day: Pipeline, exec selling, hiring, ops.

Watch for: Choose teams with realistic targets and clear playbooks.`, comp: `Comp: $200K + variable → $1M+

Target employers: Enterprise SaaS, B2B services.` },
        { rank: `8`, role: `Project / Program Director (Major Programs)`, fit: `84%`, why: `Why: Structure + execution at large scale.

Typical day: Project planning, vendor management, stakeholder leadership.

Watch for: Pick orgs that respect PM as strategic.`, comp: `Comp: $160K – $400K

Target employers: Defense, infrastructure, IT.` },
        { rank: `9`, role: `Compliance / Regulatory Officer (Senior)`, fit: `82%`, why: `Why: Detail + structure + regulatory work.

Typical day: Policy, monitoring, audits, leadership.

Watch for: Career path is structured; specialty depth pays.`, comp: `Comp: $180K – $500K+

Target employers: Financial services, healthcare, regulated industries.` },
        { rank: `10`, role: `Real Estate Developer / Senior Asset Manager`, fit: `80%`, why: `Why: Capital deployment + execution at scale.

Typical day: Acquisition, financing, asset management, ops.

Watch for: Capital-intensive; build through cycles.`, comp: `Comp: Variable — $200K – multi-million

Target employers: Real estate firms, REITs, family offices.` },
      ],
      bestIndustries: [
        `Operations and supply chain at scale`,
        `Finance (CFO track, controllership, risk)`,
        `Law (corporate, regulatory)`,
        `Government / federal service`,
        `Manufacturing and construction`,
      ],
      avoidIndustries: [
        `Vibe-driven creative industries`,
        `Early-stage chaotic startups`,
        `Roles requiring constant pivoting`,
      ],
      greenFlags: [
        `Clear hierarchy and accountability`,
        `Decisive leadership`,
        `Measurable KPIs`,
        `Process and standards respected`,
        `Earned progression`,
      ],
      redFlags: [
        `Consensus-only decision-making`,
        `Vague expectations and shifting goals`,
        `Cultures that punish directness`,
        `Unstable strategy`,
        `Vibe-driven evaluations`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$80K – $140K`, driver: `Building trust through visible reliability.` },
        { stage: `Years 4-7`, range: `$140K – $250K`, driver: `First leverage. Manage a team or own a P&L.` },
        { stage: `Years 8-15`, range: `$250K – $500K`, driver: `VP / SVP. Comp jumps as you own outcomes.` },
        { stage: `Years 16-25`, range: `$500K – $1.5M+`, driver: `C-suite or partner.` },
        { stage: `Years 25+`, range: `$500K – $5M+`, driver: `Board portfolios, advisory, equity.` },
      ],
      leadershipStrengths: [
        `Decisive direction-setting`,
        `Holding the line on accountability`,
        `Building structure and process`,
        `Driving execution at scale`,
      ],
      leadershipBlindspots: [
        `Steamrolling dissent`,
        `Black-and-white thinking`,
        `Underrating change management and emotional labor`,
        `Micromanaging senior talent`,
      ],
      leadershipScripts: [
        { label: `Inviting pushback`, text: `'I'm leaning toward X. What's the strongest argument against it that nobody's saying?'` },
        { label: `Delegating to senior talent`, text: `'You own the outcome. I'll be available for input but I won't direct the method.'` },
        { label: `Managing resistance to change`, text: `'I hear the concerns. Here's why we have to move; here's what we can preserve from the old way.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Reliability Phase`, intro: `You'll earn trust through visible execution. Promotions track results.`, milestones: `Manage a small team. Earn one credential or specialty. Build one mentor.`, mistakes: `Steamrolling peers. Job-hopping for $10K raises. Mistaking velocity for direction.`, signals: `Senior leaders give you hard problems first. You have a clear sponsor.` },
        { label: `Years 8-15 — The Function Leader Phase`, intro: `You'll run a department or region. Operational excellence becomes your brand.`, milestones: `VP / SVP role. P&L responsibility. External credibility.`, mistakes: `Holding on to operations. Steamrolling a successor. Skipping strategic work.`, signals: `Comp doubles. Recruited not applying. Your team is sticky.` },
        { label: `Years 16+ — The Enterprise Leadership Phase`, intro: `You run the company, division, or institution.`, milestones: `C-suite, founder, or institutional leader.`, mistakes: `Refusing to evolve. Becoming the bottleneck. Burning out by year 60.`, signals: `Multiple compounding income streams. Decision authority. Lasting influence.` },
      ],
      investSkills: [
        `Strategic thinking (your gap)`,
        `Influence beyond authority`,
        `Coaching and developing senior talent`,
        `Change management`,
        `Storytelling for boards / investors`,
      ],
      deprioritizeSkills: [
        `Operational tooling beyond fluency`,
        `Generic time-management`,
        `Polished public speaking beyond competent`,
        `Conference networking for its own sake`,
      ],
      negotiationOverview: `ESTJs negotiate well structurally and badly relationally. Your risk is winning the deal but losing the long-term relationship. Slow down. Acknowledge the other side's interest before pushing yours. The deals you'll regret are the ones you 'won' too publicly.`,
      negotiationScripts: [
        { label: `Compensation conversation`, text: `'For this scope and impact, my expected comp is [target]. Walk me through how you got to your number. There may be levers I'm not seeing.'` },
        { label: `Pushing back without burning the room`, text: `'I want this to work. Where I'm stuck is [issue]. What flexibility do you have on [specific lever]?'` },
      ],
      pivots: [
        { title: `Functional VP → COO / GM`, text: `Volunteer for cross-functional P&L exposure. Most COOs ran 2+ functions before the role.` },
        { title: `Industry insider → Operating Partner (PE)`, text: `Build operating reputation publicly. PE firms hire on signal.` },
        { title: `Corporate exec → Founder / CEO`, text: `Validate the wedge while employed. ESTJ founders win with structured execution; pick problems that need that.` },
      ],
      traps: [
        { title: `Black-and-white thinking`, text: `World operates in gray. Premature clarity costs talent.` },
        { title: `Neglecting change management`, text: `'I decided' isn't 'they accepted.' Budget time for the people side.` },
        { title: `Micromanaging senior talent`, text: `Your A-players leave when you don't trust them. Delegate outcome, not method.` },
        { title: `Steamrolling dissent`, text: `Decisions improve when counter-arguments survive. Build structural disagreement.` },
        { title: `Burning out top performers`, text: `Setting your pace as theirs costs you the best people.` },
        { title: `Mistaking authority for trust`, text: `Compliance is cheap. Trust compounds. Spend the time.` },
      ],
      redFlagPhrases: [
        `'Highly fluid org structure' (no accountability)`,
        `'Consensus-driven culture' (you can't decide)`,
        `'Move fast and break things' as policy (no rigor)`,
        `'Quietly confident leaders' (often code for: low ambition)`,
        `'Family-feel culture' (often code for: poor boundaries)`,
      ],
      networking: `Curate the network like a portfolio. 50-100 high-value relationships, touched quarterly. Bring value first. ESTJs who do this become the most-connected operators in their industry. Skip mass events; book substantive 1-on-1s.`,
      weeks: [
        { label: `Week 1`, text: `Name top 3 KPIs. If your team can't recite them, simplify.` },
        { label: `Week 2`, text: `Cut 20% of low-value meetings. Redirect time to 1-on-1s with top talent.` },
        { label: `Week 3`, text: `Hire or engage a senior-leader coach.` },
        { label: `Week 4`, text: `Identify your highest-leverage strategic project. Block time for it.` },
        { label: `Week 5`, text: `Have one hard conversation you've been avoiding.` },
        { label: `Week 6`, text: `Reach out to 5 long-dormant contacts. Substantive, no ask.` },
        { label: `Week 7`, text: `Volunteer for one project outside your function.` },
        { label: `Week 8`, text: `Audit your direct reports. Identify upgrades or coaching needs.` },
        { label: `Week 9`, text: `Make one external visibility move (writing, speaking, board work).` },
        { label: `Week 10`, text: `Practice the slow-down script with one team member.` },
        { label: `Week 11`, text: `Negotiate something. Lead with their interest first.` },
        { label: `Week 12`, text: `Review the 90 days. Set the next plan with a peer accountability partner.` },
      ],
      visionExercise: `Imagine your retirement. Two groups of people are there: those whose careers you accelerated, and those whose you didn't. Who's in each group? What do you wish you'd done differently? The answer is your management strategy for the next 10 years.`,
    },
  },
  ESFJ: {
    title: `ESFJ — The Caretaker`,
    subtitle: `Premium career insights tailored to your ESFJ profile`,
    careerDna: `You're a relationship manager of the world. ESFJs build deep networks that compound into career capital — your Rolodex is your asset. Your risk is prioritizing harmony over truth and losing strategic impact as a result. Learning to host hard conversations with grace is your single biggest career multiplier.`,
    matches: [
      { rank: `1`, role: `Sales Leader / Account Executive`, fit: `91%`, salary: `$150K – $500K+` },
      { rank: `2`, role: `Event / Hospitality Executive`, fit: `88%`, salary: `$120K – $300K` },
      { rank: `3`, role: `HR Director / People Leader`, fit: `87%`, salary: `$130K – $280K` },
      { rank: `4`, role: `Nursing Director / Clinic Manager`, fit: `86%`, salary: `$100K – $220K` },
      { rank: `5`, role: `Real Estate Broker / Principal Agent`, fit: `85%`, salary: `Variable, very high ceiling` },
      { rank: `6`, role: `Public Relations / Communications Director`, fit: `84%`, salary: `$110K – $250K` },
      { rank: `7`, role: `School Principal / Education Leader`, fit: `82%`, salary: `$80K – $160K` },
    ],
    environment: `You thrive in environments with social connection, clear norms, visible appreciation, and team-based work. You wither in isolated or purely analytical roles. Your network is your edge; work where networks compound.`,
    leadership: `You lead as a harmonizer. Your teams feel seen, celebrated, and aligned. The risk: conflict avoidance caps your strategic ceiling. The fix: write scripts for hard conversations and practice them before they're needed. Directness is a form of kindness when delivered with care.`,
    stages: [
      { label: `Years 1–7 — The Network-Building Years`, text: `You'll form relationships that pay you back for 20 years.` },
      { label: `Years 8–15 — The Trusted Role Phase`, text: `You become the person people bring problems to — and the person who solves them.` },
      { label: `Years 16+ — The Community Influence Phase`, text: `Your network becomes institutional. You make careers happen for others.` },
    ],
    traps: [
      { title: `Popularity over priority`, text: `Being liked is not the same as being effective. Pick priorities even when it costs you applause.` },
      { title: `Undercharging in service roles`, text: `People-work is valuable work. Price accordingly.` },
      { title: `Avoiding solo work`, text: `Strategic thinking happens alone. Build protected solo time.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Map your top 50 relationships. Identify the 10 most strategic; reach out to each.` },
      { label: `Days 31–60`, text: `Schedule three hard conversations you've been avoiding. Script each in advance.` },
      { label: `Days 61–90`, text: `Protect 5 hours per week of solo strategic work. Treat as a standing appointment.` },
    ],
    premium: {
      executiveSummary: `You're a relationship manager of the world. ESFJs build deep networks that compound into career capital — your Rolodex is your asset. Your career risk is prioritizing harmony over truth and losing strategic impact. This report is your operating manual for hosting hard conversations with grace, the single biggest career multiplier for your type.`,
      careerDna: [
        `Your career edge is people. ESFJs read social currents in real time and build communities of trust around themselves. In sales, leadership, and client work, this compounds for decades.`,
        `You're at your worst in isolated or analytical-only roles. You're at your best where networks matter. Choose careers that pay for relationships.`,
        `The single move that transforms ESFJ careers is learning to disappoint people without losing them. Most ESFJs sacrifice strategic priorities for popularity — and lose both. The ESFJs at the top of their fields said the hard things AND kept the relationships. You can do this; it just takes practice.`,
      ],
      strengths: [
        { title: `Reading social currents`, text: `You know what the room is feeling before they do. Asset in sales, leadership, and client work.` },
        { title: `Network compounding`, text: `You build durable relationships that last decades. Career capital compounds.` },
        { title: `Practical empathy`, text: `You make people feel cared for and act on their needs. Asset in healthcare, education, hospitality, services.` },
        { title: `Persistent follow-through`, text: `You remember commitments and deliver. Trust compounds.` },
      ],
      matches: [
        { rank: `1`, role: `Sales Leader / Account Executive (Senior)`, fit: `92%`, why: `Why: Network leverage + revenue. ESFJ at peak.

Typical day: Deal management, exec selling, team leadership.

Watch for: Quotas can grind; choose teams with realistic targets.`, comp: `Comp: $200K + variable → $700K+

Target employers: Enterprise SaaS, B2B services, late-stage tech.` },
        { rank: `2`, role: `Event / Hospitality Executive`, fit: `89%`, why: `Why: People + execution + relationship leverage.

Typical day: Event design, vendor management, client service.

Watch for: Industry hours can be tough; build seniority deliberately.`, comp: `Comp: $120K – $350K at executive level

Target employers: Major hotels, event firms, hospitality groups.` },
        { rank: `3`, role: `HR Director / People Leader`, fit: `87%`, why: `Why: Care + structure + business partnership.

Typical day: Talent management, employee relations, culture.

Watch for: Choose orgs where HR has strategic seat.`, comp: `Comp: $150K – $300K

Target employers: Mid-cap and late-stage tech, services firms.` },
        { rank: `4`, role: `Nursing Director / Clinic Manager`, fit: `86%`, why: `Why: Care + leadership + structure.

Typical day: Team management, ops, patient care leadership.

Watch for: Burnout risk; build recovery practices.`, comp: `Comp: $110K – $230K

Target employers: Hospitals, specialty practices, healthcare leadership.` },
        { rank: `5`, role: `Real Estate Broker / Principal Agent`, fit: `85%`, why: `Why: Network + sales + premium fees.

Typical day: Client management, deal closing, marketing.

Watch for: Network is your career; treat carefully.`, comp: `Comp: Variable — $100K – multi-million

Target employers: Top brokerages, independent practice.` },
        { rank: `6`, role: `Public Relations / Communications Director`, fit: `84%`, why: `Why: Storytelling + relationships + influence.

Typical day: Media strategy, exec communications, crisis comms.

Watch for: Choose orgs where PR has strategic seat.`, comp: `Comp: $150K – $350K

Target employers: Top firms, in-house at major brands.` },
        { rank: `7`, role: `School Principal / Education Leader`, fit: `83%`, why: `Why: Care + structure + community.

Typical day: Staff management, parent communication, instructional leadership.

Watch for: Politics-heavy; choose districts with healthy cultures.`, comp: `Comp: $90K – $180K

Target employers: Public, charter, private K-12.` },
        { rank: `8`, role: `Hospitality / Restaurant Group Senior Manager`, fit: `81%`, why: `Why: People leadership + ops + customer experience.

Typical day: Team management, customer service, ops.

Watch for: Industry hours; senior level is the goal.`, comp: `Comp: $80K – $250K at executive level

Target employers: Major hotel groups, restaurant chains, independent.` },
        { rank: `9`, role: `Fundraiser / Development Director (Major Gifts)`, fit: `80%`, why: `Why: Network leverage + premium relational work.

Typical day: Donor cultivation, ask conversations, stewardship.

Watch for: Track record of major gifts is the career capital.`, comp: `Comp: $100K – $300K at senior level

Target employers: Major nonprofits, universities, foundations.` },
        { rank: `10`, role: `Wedding / Event Planner (Senior / Owner)`, fit: `78%`, why: `Why: Care + execution + premium fees.

Typical day: Event design, vendor management, client service.

Watch for: Sales is the bottleneck; build referral network.`, comp: `Comp: Variable — $80K – $400K+

Target employers: Independent practice, boutique firms.` },
      ],
      bestIndustries: [
        `Enterprise sales and account management`,
        `Healthcare leadership and nursing`,
        `Hospitality and events`,
        `Real estate brokerage and development`,
        `Education leadership and HR`,
      ],
      avoidIndustries: [
        `Lone-wolf specialist roles`,
        `Highly analytical work with no human contact`,
        `Cutthroat individual-only sales cultures`,
      ],
      greenFlags: [
        `Social connection and team rhythms`,
        `Clear norms and expectations`,
        `Visible appreciation`,
        `Team-based work`,
        `Earned progression`,
      ],
      redFlags: [
        `Isolated or solo work`,
        `Cutthroat internal competition`,
        `Cultures that punish kindness`,
        `Vague expectations`,
        `Constant strategic pivots`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$60K – $100K`, driver: `Build network and skills.` },
        { stage: `Years 4-7`, range: `$100K – $180K`, driver: `Trust compounds. Promotions track results.` },
        { stage: `Years 8-15`, range: `$180K – $400K`, driver: `Senior leadership phase.` },
        { stage: `Years 16-25`, range: `$300K – $700K+`, driver: `Executive or principal practice.` },
        { stage: `Years 25+`, range: `$300K – $1.5M+`, driver: `Network dividends compound.` },
      ],
      leadershipStrengths: [
        `Building loyal teams`,
        `Reading and managing org dynamics`,
        `Mentoring rising talent`,
        `Maintaining team morale through hard times`,
      ],
      leadershipBlindspots: [
        `Avoiding hard conversations`,
        `Confusing being liked with being effective`,
        `Tolerating underperformance to keep peace`,
        `Self-sacrificing to keep team happy`,
      ],
      leadershipScripts: [
        { label: `Hard conversation`, text: `'I care about you AND the work. Here's what I'm seeing. What needs to change in two weeks?'` },
        { label: `Letting someone go`, text: `'This isn't working. Continuing hurts both of us. Here's how I'll support your transition.'` },
        { label: `Standing on a strategic priority`, text: `'I hear the concerns. Here's why we have to move forward. Here's how I'll support you through it.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Network-Building Years`, intro: `You'll form relationships that pay back for decades.`, milestones: `Master one specialty. Lead a small team. Build one mentor.`, mistakes: `Avoiding hard conversations. Self-sacrificing. Saying yes to keep peace.`, signals: `You're known for one specialty. Senior leaders rely on you. Network is meaningful.` },
        { label: `Years 8-15 — The Trusted Role Phase`, intro: `You become the person people bring problems to.`, milestones: `Senior leadership, P&L exposure, or independent practice.`, mistakes: `Tolerating underperformers. Holding on to operations. Avoiding strategic work.`, signals: `Recruited not applying. Comp doubles. Team is loyal.` },
        { label: `Years 16+ — The Community Influence Phase`, intro: `Your network becomes institutional.`, milestones: `C-suite, founder, or platform owner.`, mistakes: `Refusing to delegate. Refusing to evolve. Hoarding network as identity.`, signals: `Multiple income streams. Decision authority. You make careers happen for others.` },
      ],
      investSkills: [
        `Strategic thinking`,
        `Hard-conversation muscle`,
        `Boundary-setting`,
        `Financial and capital literacy`,
        `One business-side skill (P&L, marketing, BD)`,
      ],
      deprioritizeSkills: [
        `Generic productivity systems`,
        `Polishing presentations beyond clear`,
        `Conference attendance for its own sake`,
        `Becoming the deepest specialist`,
      ],
      negotiationOverview: `ESFJs negotiate poorly because the deal feels like it could damage the relationship. Reframe: a fair deal preserves the relationship; an unfair one corrodes. Practice asking. Lead with what they need; close with what you need.`,
      negotiationScripts: [
        { label: `Asking for a raise`, text: `'I've contributed [outcomes] to the team this year. Based on benchmarks, my comp should be at [target]. What's the path?'` },
        { label: `Negotiating an offer`, text: `'I'm excited about this. The piece I want to revisit is [lever]. What flexibility do you have?'` },
      ],
      pivots: [
        { title: `Account exec → Sales Leader`, text: `Volunteer for player-coach roles. Most VPs of Sales were AE first.` },
        { title: `HR / People → CHRO / VP`, text: `Build P&L partnership and exec sponsorship deliberately.` },
        { title: `Operating leader → Independent practice`, text: `ESFJ network often supports an independent practice; build for 18 months on the side first.` },
      ],
      traps: [
        { title: `Popularity over priority`, text: `Being liked isn't being effective.` },
        { title: `Undercharging in service roles`, text: `People-work is valuable. Price accordingly.` },
        { title: `Avoiding solo work`, text: `Strategic thinking happens alone. Build protected time.` },
        { title: `Tolerating underperformance`, text: `A team of 'nice' underperformers costs your best people.` },
        { title: `Self-sacrifice`, text: `Each yes you didn't want is a no to the work that matters.` },
        { title: `Refusing to disappoint`, text: `You will lose people who don't matter when you stand for what does. That's the trade.` },
      ],
      redFlagPhrases: [
        `'Lone wolf' culture (no team)`,
        `'Cutthroat internal competition'`,
        `'Heads-down individual contributor' as primary description`,
        `'Move fast and break things' (often code for: care doesn't matter)`,
        `'Highly competitive comp' (often code for: zero-sum culture)`,
      ],
      networking: `Your network is already strong; the move is curation and value creation. Pick top 50 relationships and stay deeply in touch. Bring value without asking. Over 20 years this becomes the most valuable career asset of any type.`,
      weeks: [
        { label: `Week 1`, text: `Map top 50 relationships. Identify 10 most strategic; reach out.` },
        { label: `Week 2`, text: `Schedule 3 hard conversations you've been avoiding. Script each.` },
        { label: `Week 3`, text: `Have the first hard conversation.` },
        { label: `Week 4`, text: `Protect 5 hours/week solo strategic work. Standing appointment.` },
        { label: `Week 5`, text: `Identify the financial/strategic skill gap most blocking trajectory.` },
        { label: `Week 6`, text: `Volunteer for one P&L or strategic project.` },
        { label: `Week 7`, text: `Reach out to 5 dormant contacts. Substantive, no ask.` },
        { label: `Week 8`, text: `Have hard conversation #2.` },
        { label: `Week 9`, text: `Practice ask for promotion / raise aloud.` },
        { label: `Week 10`, text: `Schedule the ask.` },
        { label: `Week 11`, text: `Audit team. Identify upgrades or coaching needs.` },
        { label: `Week 12`, text: `Review 90 days. Set next plan.` },
      ],
      visionExercise: `Imagine your retirement gathering. Look around — who's there? Now: who's NOT there because you couldn't say a hard truth, hold a hard line, or disappoint them? What's the cost of those absences? The answer is your hard-conversation practice for the next decade.`,
    },
  },
  ISTP: {
    title: `ISTP — The Craftsman`,
    subtitle: `Premium career insights tailored to your ISTP profile`,
    careerDna: `You're a hands-on problem solver. ISTPs thrive where other people freeze — when the machine's broken, the patient's crashing, or the plan's on fire. You're undervalued in office-only environments and undervalue yourself in meeting-heavy ones. Your career edge is finding roles that respect the physical and the tangible.`,
    matches: [
      { rank: `1`, role: `Mechanical / Electrical / Aerospace Engineer`, fit: `92%`, salary: `$130K – $300K` },
      { rank: `2`, role: `Commercial Pilot / Specialized Operator`, fit: `90%`, salary: `$150K – $400K` },
      { rank: `3`, role: `Surgeon / Specialized Physician`, fit: `89%`, salary: `$350K – $900K` },
      { rank: `4`, role: `Forensic Analyst / Investigator`, fit: `87%`, salary: `$90K – $180K` },
      { rank: `5`, role: `Trades / Hardware Entrepreneur`, fit: `86%`, salary: `Variable, high ceiling` },
      { rank: `6`, role: `Penetration Tester / Security Researcher`, fit: `85%`, salary: `$130K – $350K` },
      { rank: `7`, role: `Emergency Response / Tactical Leadership`, fit: `83%`, salary: `$100K – $200K` },
    ],
    environment: `You thrive with autonomy, variety, physical or tangible work, and environments where competence is visibly respected. You lose energy in pure-meeting cultures. Your role should let you fix something real regularly — even part of the week.`,
    leadership: `You lead as a master craftsperson — by example and demonstrated competence. The risk: disappearing behind the work. The fix: visible teaching. Make what's in your head legible to others through documentation, apprenticeship, or case studies. Your influence will multiply.`,
    stages: [
      { label: `Years 1–7 — The Tool-Mastery Phase`, text: `You'll develop deep technical chops. Collect master-tier skills before titles.` },
      { label: `Years 8–15 — The Signature Specialty Years`, text: `You pick one niche where few can match you. Rates rise sharply.` },
      { label: `Years 16+ — The Master-Craftsman / Owner Phase`, text: `You own the shop, the practice, or the specialty. You're the one other people call when they're stuck.` },
    ],
    traps: [
      { title: `Avoiding office politics`, text: `Your disdain for politics won't stop politics from affecting your career. Learn minimum viable navigation.` },
      { title: `Under-communicating wins`, text: `What's obvious to you is invisible to your boss. Share more.` },
      { title: `Isolating skills`, text: `Skills die without apprentices. Teaching preserves your specialty and your income.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Document three signature techniques in writing or video.` },
      { label: `Days 31–60`, text: `Publish one case study showing a problem you uniquely solved.` },
      { label: `Days 61–90`, text: `Take on one apprentice or mentee. Their growth becomes part of your brand.` },
    ],
    premium: {
      executiveSummary: `You're a hands-on problem solver. ISTPs thrive where others freeze — when the machine's broken, the patient's crashing, or the plan's on fire. Your career risk is being so good at doing the work that you never market it. This report is your operating manual for converting craft into career capital.`,
      careerDna: [
        `You learn through hands. ISTPs internalize systems by taking them apart. Your edge is in fields where physical or technical mastery matters and abstraction is just a stepping stone to action.`,
        `You're at your worst in office-only environments where talking about work is more important than doing it. You're at your best where competence is visible and respected. Choose roles that let you make something tangible.`,
        `The single move that transforms ISTP careers is teaching what you know. Most ISTPs hoard skill in their hands. Documented, taught, or productized expertise multiplies your income 3-5x — without sacrificing the craft you love.`,
      ],
      strengths: [
        { title: `Mechanical and systems intuition`, text: `You feel how systems work. Asset in engineering, surgery, security, trades.` },
        { title: `Crisis competence`, text: `You stay calm and effective when others freeze. Asset in emergency response, surgery, ops crises.` },
        { title: `Tool fluency`, text: `You learn new tools faster than peers. Asset in tech, manufacturing, specialized trades.` },
        { title: `Unsentimental analysis`, text: `You evaluate without ego. Asset in security, forensics, problem investigation.` },
      ],
      matches: [
        { rank: `1`, role: `Senior Engineer (Mechanical / Electrical / Aerospace)`, fit: `93%`, why: `Why: Hands-on technical work + design + premium pay.

Typical day: Design, prototyping, problem investigation, code review.

Watch for: Avoid pure-management tracks; you'll lose what you love.`, comp: `Comp: $140K – $400K at senior IC

Target employers: Aerospace, defense, hardware, EV, specialized manufacturing.` },
        { rank: `2`, role: `Commercial / Specialty Pilot`, fit: `91%`, why: `Why: Skill mastery + autonomy + premium pay.

Typical day: Flight operations, training, simulator.

Watch for: Path is structured; benefits compound with seniority.`, comp: `Comp: $150K – $400K at senior captain

Target employers: Major airlines, corporate aviation, specialty operators.` },
        { rank: `3`, role: `Surgeon / Specialized Physician`, fit: `90%`, why: `Why: Hands-on craft + crisis competence + premium pay.

Typical day: Procedures, consults, training, research.

Watch for: Long training path; pursue if surgery calls.`, comp: `Comp: $300K – $1M+

Target employers: Hospitals, specialty practices, academic medicine.` },
        { rank: `4`, role: `Forensic Analyst / Investigator`, fit: `88%`, why: `Why: Analytical + hands-on + meaningful work.

Typical day: Evidence analysis, case work, courtroom testimony.

Watch for: Career path is structured; specialty depth pays.`, comp: `Comp: $90K – $180K

Target employers: Law enforcement, private firms, specialty consulting.` },
        { rank: `5`, role: `Trades / Hardware Entrepreneur (Electrical, HVAC, Specialty)`, fit: `87%`, why: `Why: Craft + business ownership + premium fees.

Typical day: Service delivery, team management, business ops.

Watch for: Practice ownership 2-3x's income.`, comp: `Comp: Variable — $150K – $1M+ with practice

Target employers: Independent or partnership.` },
        { rank: `6`, role: `Penetration Tester / Security Researcher`, fit: `86%`, why: `Why: Adversarial problem-solving + premium pay.

Typical day: Pentesting, vulnerability research, reporting.

Watch for: Industry pays for results; build a public portfolio.`, comp: `Comp: $130K – $400K at senior

Target employers: Top security firms, in-house at major tech, research labs.` },
        { rank: `7`, role: `Emergency Response Leader (EMT / Fire Captain)`, fit: `84%`, why: `Why: Crisis competence + leadership + meaningful work.

Typical day: Emergency response, training, ops leadership.

Watch for: Path is structured; pension benefits significant.`, comp: `Comp: $80K – $200K at senior level

Target employers: Major fire/EMS departments, federal agencies.` },
        { rank: `8`, role: `Mechanic / Specialty Technician (Senior / Owner)`, fit: `82%`, why: `Why: Craft + business + customer base.

Typical day: Service delivery, diagnostics, business ops.

Watch for: Specialty (Porsche, vintage, specialty equipment) increases income substantially.`, comp: `Comp: Variable — $80K – $400K+ with shop

Target employers: Independent or partnership.` },
        { rank: `9`, role: `Stunt Performer / Adventure Sports Pro`, fit: `79%`, why: `Why: Skill mastery + variety + premium fees.

Typical day: Performance, training, choreography.

Watch for: Career has injury risk; build longevity strategy.`, comp: `Comp: Variable — $80K – $500K+

Target employers: Film/TV, sports, tour productions.` },
        { rank: `10`, role: `Drone / Robotics Engineer`, fit: `78%`, why: `Why: Hands-on + emerging field + premium pay.

Typical day: Hardware design, control systems, field testing.

Watch for: Field is moving fast; specialty depth matters.`, comp: `Comp: $130K – $350K

Target employers: Defense, agriculture, logistics, specialty robotics.` },
      ],
      bestIndustries: [
        `Engineering (mechanical, electrical, aerospace)`,
        `Specialty medicine and surgery`,
        `Trades and specialized manufacturing`,
        `Security and intelligence`,
        `Emergency services and federal agency operations`,
      ],
      avoidIndustries: [
        `Pure office / consulting roles`,
        `Sales-heavy customer-facing work`,
        `Bureaucratic administrative roles`,
      ],
      greenFlags: [
        `Hands-on, tangible work`,
        `Autonomy and minimal meetings`,
        `Competence visibly respected`,
        `Variety in problems`,
        `Quick feedback loops`,
      ],
      redFlags: [
        `Pure-meeting cultures`,
        `Forced socialization`,
        `Politics-heavy environments`,
        `Strict process with no autonomy`,
        `Customer-service rotation`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$70K – $130K`, driver: `Skill foundation. Choose roles with master-class colleagues.` },
        { stage: `Years 4-7`, range: `$130K – $230K`, driver: `Specialty emerges. First income jump.` },
        { stage: `Years 8-15`, range: `$230K – $450K`, driver: `Senior IC or specialty practice.` },
        { stage: `Years 16-25`, range: `$400K – $1M+`, driver: `Master craftsperson, owner, or institutional senior.` },
        { stage: `Years 25+`, range: `$300K – $1.5M+`, driver: `Specialty + ownership + reputation compound.` },
      ],
      leadershipStrengths: [
        `Leading by visible competence`,
        `Crisis decision-making`,
        `Mentoring through demonstration`,
        `Cutting through complexity to action`,
      ],
      leadershipBlindspots: [
        `Avoiding office politics to your detriment`,
        `Under-communicating wins`,
        `Discomfort with non-technical conversations`,
        `Isolating skills (not teaching successors)`,
      ],
      leadershipScripts: [
        { label: `Promoting your work upward`, text: `'Here's what I solved. Here's the impact in dollars/time/risk. Here's what's next.'` },
        { label: `Asking for resources`, text: `'For [outcome], I need [tool/headcount/time]. Without it, here's the cost.'` },
        { label: `Mentoring someone`, text: `'Here's how I'd approach this. Try it. Tell me where it broke.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Tool-Mastery Phase`, intro: `Develop deep technical chops. Collect master-tier skills before titles.`, milestones: `Master one specialty. Build a portfolio of solved problems. Find one mentor.`, mistakes: `Avoiding politics entirely. Under-communicating wins. Isolating from non-technical peers.`, signals: `Senior peers seek your help. You have one signature solved problem. Recruiters know your name.` },
        { label: `Years 8-15 — The Signature Specialty Phase`, intro: `Pick one niche where few can match you. Rates rise sharply.`, milestones: `Recognized specialist. Senior IC or owner. Comp jumps if you negotiate.`, mistakes: `Hoarding skills. Refusing to teach. Avoiding management when it would help.`, signals: `Inbound for your specialty. Premium rates. Younger pros seek your guidance.` },
        { label: `Years 16+ — The Master-Craftsman / Owner Phase`, intro: `You own the shop, practice, or specialty.`, milestones: `Owner, senior leader, or master practitioner. Multiple income streams.`, mistakes: `Refusing to delegate. Holding on to all the work. Ignoring business strategy.`, signals: `Multiple revenue streams. Decision authority. Apprentices succeed.` },
      ],
      investSkills: [
        `Teaching and documentation (your largest leverage gap)`,
        `One business-side skill (pricing, marketing, ops)`,
        `Self-promotion (visible portfolio)`,
        `Negotiation`,
        `One non-technical credential (MBA-lite, ops cert)`,
      ],
      deprioritizeSkills: [
        `Generic productivity systems`,
        `Polishing artifacts beyond useful`,
        `Mass-market networking`,
        `Pure-management training (unless you commit)`,
      ],
      negotiationOverview: `ISTPs negotiate poorly because they expect their work to speak for itself. It doesn't. Build a written portfolio. Bring numbers. Practice the ask aloud. The market will pay 30-50% more if you ask cleanly.`,
      negotiationScripts: [
        { label: `Stating value`, text: `'I've solved [problems] this year, saving / earning [dollars]. My rate / comp should be [target].'` },
        { label: `Pricing custom work`, text: `'For this scope, my rate is [target]. That includes [deliverables]. Here's why it's worth it.'` },
      ],
      pivots: [
        { title: `Senior IC → Practice / Shop owner`, text: `Owner economics 2-3x's income. Plan carefully — capital and customer base matter.` },
        { title: `Engineer → Founder / Specialty consultant`, text: `Build public portfolio for 12-24 months while employed.` },
        { title: `Technician → Industry expert / Trainer`, text: `Document and teach what you know. Multiplies income without sacrificing craft.` },
      ],
      traps: [
        { title: `Avoiding office politics`, text: `Your disdain won't stop politics from affecting your career. Learn minimum viable navigation.` },
        { title: `Under-communicating wins`, text: `What's obvious to you is invisible to your boss. Share more.` },
        { title: `Isolating skills`, text: `Skills die without apprentices. Teaching preserves your specialty and income.` },
        { title: `Refusing to charge premium`, text: `Master-tier work commands master-tier rates. Charge them.` },
        { title: `Hoarding institutional knowledge`, text: `Documented systems are leverage. Undocumented ones make you indispensable in the wrong way.` },
        { title: `Tolerating bad managers`, text: `ISTPs stay too long with bad managers because the work is interesting. The cost is your trajectory.` },
      ],
      redFlagPhrases: [
        `'Heavy customer rotation' (off-craft time)`,
        `'Highly collaborative open-plan' (no deep work)`,
        `'Politics-savvy' as a core requirement`,
        `'Wear many hats' (no specialization)`,
        `'Highly process-driven' (no autonomy)`,
      ],
      networking: `ISTPs hate networking but build deep peer respect. Identify 10 master-class peers in your field. Stay in real touch via shared problems and shop talk. Skip events; do collaborations. Over a decade this becomes your career-long advisory board.`,
      weeks: [
        { label: `Week 1`, text: `Document 3 signature techniques in writing or video.` },
        { label: `Week 2`, text: `Publish one case study showing a problem you uniquely solved.` },
        { label: `Week 3`, text: `Take on one apprentice or mentee.` },
        { label: `Week 4`, text: `Reach out to 3 master-class peers in your field.` },
        { label: `Week 5`, text: `Audit your rate / salary against benchmarks. Set new minimum.` },
        { label: `Week 6`, text: `Practice the ask for promotion or rate increase aloud.` },
        { label: `Week 7`, text: `Schedule the ask.` },
        { label: `Week 8`, text: `Identify your largest skill gap toward your 5-year goal.` },
        { label: `Week 9`, text: `Volunteer for one cross-functional or visible project.` },
        { label: `Week 10`, text: `Build the next 3 documentation pieces.` },
        { label: `Week 11`, text: `Identify one business-side skill to develop.` },
        { label: `Week 12`, text: `Review the 90 days. Set the next plan.` },
      ],
      visionExercise: `Imagine your career in 30 years. Apprentices you trained are now masters. What's the technique you taught them that no one else preserved? What did you have to be willing to teach openly to make that true? Start documenting that this quarter.`,
    },
  },
  ISFP: {
    title: `ISFP — The Artist`,
    subtitle: `Premium career insights tailored to your ISFP profile`,
    careerDna: `You're a sensory artist and authentic maker. ISFPs create work that resonates because it's genuine, not calculated. Your risk is undervaluing the business scaffolding that would make your craft sustainable. Learning to be an artist AND an entrepreneur is the whole career game for you.`,
    matches: [
      { rank: `1`, role: `Designer — Graphic / Interior / Product`, fit: `91%`, salary: `$90K – $250K` },
      { rank: `2`, role: `Photographer / Videographer / Creative Director`, fit: `88%`, salary: `Variable, high ceiling` },
      { rank: `3`, role: `Chef / Restaurateur`, fit: `86%`, salary: `Variable` },
      { rank: `4`, role: `Veterinarian / Animal Specialist`, fit: `85%`, salary: `$100K – $200K` },
      { rank: `5`, role: `Physical Therapist / Hands-on Healer`, fit: `84%`, salary: `$90K – $150K` },
      { rank: `6`, role: `Creative Studio Owner / Brand Director`, fit: `83%`, salary: `$150K – $400K` },
      { rank: `7`, role: `Jewelry / Craft / Maker Entrepreneur`, fit: `80%`, salary: `Variable` },
    ],
    environment: `You thrive in beautiful spaces, with autonomy, sensory richness, and supportive community. You wither in sterile or conflict-heavy environments. Your craft needs beauty to inhabit; pay for your environment like you'd pay for tools.`,
    leadership: `You lead by example. People catch your aesthetic sensibility and standards. The risk: avoiding the business structures that sustain your craft. The fix: install minimum viable business systems — bookkeeping, contracts, pricing — so the art can keep happening.`,
    stages: [
      { label: `Years 1–7 — The Style Exploration Years`, text: `You'll try many aesthetics and find your voice.` },
      { label: `Years 8–15 — The Signature Aesthetic Phase`, text: `Your work becomes recognizable. You move from taking jobs to choosing them.` },
      { label: `Years 16+ — The Brand / Studio Owner Phase`, text: `You own the operation. Your name has market value.` },
    ],
    traps: [
      { title: `Underpricing the craft`, text: `Your rate should match your years, not your feelings about the work.` },
      { title: `Avoiding client confrontation`, text: `Bad client terms outlive the discomfort of enforcing good ones.` },
      { title: `Financial blind spots`, text: `Artists who ignore finances end up producing less art.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Raise your rates by 25% on all new clients.` },
      { label: `Days 31–60`, text: `Define one signature visual or experiential style — in writing. Use it in marketing.` },
      { label: `Days 61–90`, text: `Install basic bookkeeping. Weekly 30-minute finance review becomes non-negotiable.` },
    ],
    premium: {
      executiveSummary: `You're a sensory artist and authentic maker. ISFPs create work that resonates because it's genuine, not calculated. Your career upside is real but capped without business scaffolding. This report is your operating manual for combining authentic craft with the business systems that let it sustain you.`,
      careerDna: [
        `You see and feel the world differently. ISFPs notice color, texture, gesture, and tone that others miss. This is your competitive advantage in design, food, fashion, art, and any aesthetic-driven field.`,
        `You're at your worst in conflict-heavy or sterile environments. You're at your best in beautiful spaces with autonomy and supportive community. Treat your environment as part of your tools.`,
        `The single move that transforms ISFP careers is installing minimum-viable business systems. Most ISFPs sabotage their craft by avoiding contracts, pricing, and admin. Those systems aren't artistic compromise — they're the scaffolding that lets the art happen sustainably.`,
      ],
      strengths: [
        { title: `Aesthetic perception`, text: `You see what others don't. Asset in design, food, art, fashion, photography.` },
        { title: `Hands-on creativity`, text: `You make things; you don't just imagine them. Asset in any craft.` },
        { title: `Authentic expression`, text: `Your work feels like you. Audiences and clients pay for that authenticity.` },
        { title: `Sensory empathy`, text: `You read mood and atmosphere. Asset in hospitality, therapy, healing arts.` },
      ],
      matches: [
        { rank: `1`, role: `Designer (Graphic / Interior / Product)`, fit: `92%`, why: `Why: Aesthetic + craft + premium fees.

Typical day: Design, client management, production.

Watch for: Build portfolio early; brand follows.`, comp: `Comp: $90K – $280K at senior / owner

Target employers: Top firms, agencies, independent practice.` },
        { rank: `2`, role: `Photographer / Videographer / Creative Director`, fit: `89%`, why: `Why: Visual craft + variety + autonomy.

Typical day: Shoots, editing, client management.

Watch for: Sales is the bottleneck.`, comp: `Comp: Variable — $80K – $500K+

Target employers: Independent practice, agencies, in-house.` },
        { rank: `3`, role: `Chef / Restaurant Owner`, fit: `87%`, why: `Why: Sensory craft + business + leadership.

Typical day: Menu development, service, team, ops.

Watch for: Industry hours brutal; pursue if cooking calls.`, comp: `Comp: Variable — $80K – $500K+ with restaurant ownership

Target employers: Independent or partnership.` },
        { rank: `4`, role: `Veterinarian / Animal Specialist`, fit: `86%`, why: `Why: Care + craft + autonomy.

Typical day: Patient care, surgery, client communication.

Watch for: Practice ownership 2x's income.`, comp: `Comp: $120K – $300K at senior / owner

Target employers: Private practice, specialty hospitals.` },
        { rank: `5`, role: `Physical Therapist / Hands-on Healer`, fit: `85%`, why: `Why: Care + craft + meaningful work.

Typical day: Patient care, treatment design, education.

Watch for: Practice ownership increases income.`, comp: `Comp: $90K – $180K at senior / owner

Target employers: Private practice, clinics, hospitals.` },
        { rank: `6`, role: `Creative Director / Senior Brand Lead`, fit: `83%`, why: `Why: Aesthetic + leadership + premium pay.

Typical day: Creative direction, client management, team.

Watch for: Politics-heavy industry; choose firms with healthy cultures.`, comp: `Comp: $180K – $500K+

Target employers: Top agencies, in-house at consumer brands.` },
        { rank: `7`, role: `Jewelry / Craft / Maker Entrepreneur`, fit: `81%`, why: `Why: Craft + business + brand.

Typical day: Design, production, marketing, sales.

Watch for: Online platforms (Etsy, Shopify) make scaling more accessible.`, comp: `Comp: Variable — $60K – $400K+ with brand

Target employers: Independent practice.` },
        { rank: `8`, role: `Aesthetician / Hair / Makeup Artist (Senior)`, fit: `79%`, why: `Why: Craft + clientele + premium fees.

Typical day: Service delivery, client management, education.

Watch for: Build clientele early; book follows.`, comp: `Comp: $80K – $300K+ at senior / owner

Target employers: Salons, independent practice.` },
        { rank: `9`, role: `Florist / Event Designer (Senior / Owner)`, fit: `78%`, why: `Why: Aesthetic + business + premium fees.

Typical day: Design, ops, client service.

Watch for: Wedding industry pays well; build referrals.`, comp: `Comp: Variable — $80K – $300K+

Target employers: Independent or partnership.` },
        { rank: `10`, role: `Yoga / Movement Instructor (Senior / Studio Owner)`, fit: `76%`, why: `Why: Hands-on + meaningful + autonomy.

Typical day: Teaching, programming, retreats.

Watch for: Studio ownership transforms income.`, comp: `Comp: Variable — $60K – $300K+ with studio

Target employers: Independent or studio.` },
      ],
      bestIndustries: [
        `Design (graphic, interior, product, fashion)`,
        `Visual media (photography, video, creative direction)`,
        `Hospitality and food (chef, restaurant ownership)`,
        `Healing arts (PT, vet, aesthetics)`,
        `Independent maker / craft brands`,
      ],
      avoidIndustries: [
        `Cutthroat sales / commission-only roles`,
        `Aggressive corporate finance`,
        `Politically heavy administrative work`,
      ],
      greenFlags: [
        `Beautiful, sensory-rich workspace`,
        `Autonomy and creative control`,
        `Supportive community of makers`,
        `Flexible schedules`,
        `Permission to work in your style`,
      ],
      redFlags: [
        `Conflict-heavy office cultures`,
        `Sterile environments`,
        `Forced extroversion`,
        `Heavy administrative requirements`,
        `Cultures that punish quietness`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$50K – $90K`, driver: `Build portfolio and skill. Underpaid is normal early.` },
        { stage: `Years 4-7`, range: `$90K – $160K`, driver: `Specialty emerges. First income jump if you charge.` },
        { stage: `Years 8-15`, range: `$160K – $350K`, driver: `Signature style compounds. Premium fees.` },
        { stage: `Years 16-25`, range: `$300K – $700K+`, driver: `Owner economics. Authority pays.` },
        { stage: `Years 25+`, range: `$300K – $1M+`, driver: `Body of work and brand compound.` },
      ],
      leadershipStrengths: [
        `Lead by aesthetic example`,
        `Create supportive maker communities`,
        `Cultivate craft in junior talent`,
        `Hold the standard of beauty / quality`,
      ],
      leadershipBlindspots: [
        `Avoiding business scaffolding`,
        `Conflict avoidance with clients`,
        `Underrating administrative work`,
        `Personalizing professional disagreements`,
      ],
      leadershipScripts: [
        { label: `Setting client expectations`, text: `'Here's what I'll deliver. Here's what I won't. Here's the timeline. Sign here.'` },
        { label: `Holding the standard`, text: `'I won't release this until [quality criterion]. Here's why it matters to the outcome.'` },
        { label: `Saying no to a client`, text: `'This isn't right for me. Here's who would be better. Best of luck.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Style Exploration Years`, intro: `You'll try many aesthetics. Your voice emerges through trying.`, milestones: `Build a portfolio. Find one mentor. Develop one signature.`, mistakes: `Underpricing chronically. Avoiding business basics. Personalizing rejection.`, signals: `Recognizable style. Repeat clients. You can charge above hobbyist rates.` },
        { label: `Years 8-15 — The Signature Aesthetic Phase`, intro: `Your work becomes recognizably yours. You move from taking jobs to choosing them.`, milestones: `Brand, studio, or named practice. Premium fees. External recognition.`, mistakes: `Avoiding business scaffolding past breaking. Tolerating bad clients. Underpricing premium work.`, signals: `Inbound clients. Premium rates. People know your work without you.` },
        { label: `Years 16+ — The Brand / Studio Owner Phase`, intro: `You own the operation. Your name has market value.`, milestones: `Studio, brand, or scaled practice. Body of work.`, mistakes: `Refusing to delegate. Holding on to admin. Burning out from over-giving.`, signals: `Multiple income streams. Decision authority. Apprentices follow your style.` },
      ],
      investSkills: [
        `Pricing your work (the highest-leverage skill for ISFPs)`,
        `Contracts and basic legal literacy`,
        `One marketing or audience-building skill`,
        `Bookkeeping fundamentals`,
        `Boundary-setting with clients`,
      ],
      deprioritizeSkills: [
        `Generic productivity systems`,
        `Mass-market networking`,
        `Pure technical depth in non-craft areas`,
        `Polishing artifacts past useful`,
      ],
      negotiationOverview: `ISFPs hate negotiating because it feels transactional. Reframe: negotiating well honors your craft. You are not asking for charity; you are pricing the value you create. Set rates in writing before conversations. Practice the number aloud.`,
      negotiationScripts: [
        { label: `Stating your rate`, text: `'My rate for this scope is [target]. That includes [specifics].' (No qualifiers.)` },
        { label: `Pushing back on lowballing`, text: `'To do this work to the standard I want, I'd need [target]. If that's not workable, I'd recommend [alternative].'` },
      ],
      pivots: [
        { title: `Day-job designer → Independent practice`, text: `Build clientele on the side for 18-24 months.` },
        { title: `Generalist → Specialist (one aesthetic / one niche)`, text: `Specialty depth dramatically increases premium fees.` },
        { title: `Solo maker → Studio / brand`, text: `Add help, then systems. ISFPs who scale do so deliberately.` },
      ],
      traps: [
        { title: `Pricing too low`, text: `Your rate should match years, not your feelings.` },
        { title: `Avoiding client confrontation`, text: `Bad client terms outlive the discomfort of enforcing good ones.` },
        { title: `Financial blind spots`, text: `Artists who ignore finances produce less art.` },
        { title: `Personalizing rejection`, text: `A 'no' on the work isn't a 'no' on you.` },
        { title: `Tolerating exploitative clients`, text: `The friendliest aren't always the best clients.` },
        { title: `Refusing to scale`, text: `Solo capacity caps income. Add help when ready.` },
      ],
      redFlagPhrases: [
        `'Lots of revisions included' (scope-creep code)`,
        `'Work-for-hire across all uses' (rights grab)`,
        `'High-volume, fast-turn' (against your wiring)`,
        `'Start-up wages with promise of upside' (often code for: underpaid)`,
        `'High-energy team culture' (extrovert default)`,
      ],
      networking: `Build through shared craft. Pick 8-10 makers whose work you admire and engage with their work substantively. Comment, share, collaborate. Over a decade this becomes a community of mutual referral and growth.`,
      weeks: [
        { label: `Week 1`, text: `Raise rates 25% on all new clients.` },
        { label: `Week 2`, text: `Define one signature style in writing. Use in marketing.` },
        { label: `Week 3`, text: `Install basic bookkeeping. Weekly 30-min finance review.` },
        { label: `Week 4`, text: `Reach out to 3 makers you admire. Substantive note.` },
        { label: `Week 5`, text: `Set one boundary with a current client (scope, hours, communication).` },
        { label: `Week 6`, text: `Practice the new rate aloud 10 times before next negotiation.` },
        { label: `Week 7`, text: `Send first offer at new rate. The first time is hardest.` },
        { label: `Week 8`, text: `Audit client list. Phase out bottom 20%.` },
        { label: `Week 9`, text: `Build one piece of marketing collateral (portfolio update, post, talk).` },
        { label: `Week 10`, text: `Reach out to 2 more makers.` },
        { label: `Week 11`, text: `Set up basic contracts template. Use on next deal.` },
        { label: `Week 12`, text: `Review 90 days. Set next plan.` },
      ],
      visionExercise: `Imagine reading the obituary of a maker who lived your dream career. Whose career do you most want it to be? Now: their first 10 years were exactly like yours. The gap is time and consistency. Both are available.`,
    },
  },
  ESTP: {
    title: `ESTP — The Daredevil`,
    subtitle: `Premium career insights tailored to your ESTP profile`,
    careerDna: `You're an action-first operator. ESTPs thrive where others freeze and close deals others wouldn't attempt. Your natural edge is in high-variance environments where speed and presence matter more than consensus. Your career risk is burning goodwill faster than you build it. Long-term relationships are your hidden multiplier.`,
    matches: [
      { rank: `1`, role: `Enterprise Sales Executive`, fit: `92%`, salary: `$200K – $700K+` },
      { rank: `2`, role: `Entrepreneur — Sales / Real Estate / Hospitality`, fit: `91%`, salary: `Variable, very high ceiling` },
      { rank: `3`, role: `Trader — Equities / Commodities / Crypto`, fit: `90%`, salary: `Variable, very high ceiling` },
      { rank: `4`, role: `Emergency / First Responder Leadership`, fit: `86%`, salary: `$100K – $200K` },
      { rank: `5`, role: `Professional Athlete / Coach`, fit: `85%`, salary: `Variable` },
      { rank: `6`, role: `Event Producer / Promoter`, fit: `83%`, salary: `$100K – $300K` },
      { rank: `7`, role: `Marketing Director (High-Energy Industries)`, fit: `82%`, salary: `$130K – $300K` },
    ],
    environment: `You thrive in action-rich, results-measured, competitive, and visible environments. You suffocate in slow, process-heavy ones. Choose industries where speed pays.`,
    leadership: `You lead as a charismatic doer. People follow because you move. The risk: shortcutting process in ways that eventually catch up. The fix: hire or partner with a disciplined #2 who installs the scaffolding your speed bypasses. Your execution plus their systems is a force.`,
    stages: [
      { label: `Years 1–7 — The Hustle Phase`, text: `You'll outwork peers, learn fast, make and lose money.` },
      { label: `Years 8–15 — The Scaling Phase`, text: `Raw effort gets replaced by leverage. You build teams or books of business that produce without you in the room.` },
      { label: `Years 16+ — The Portfolio Phase`, text: `You diversify your bets. Your income has multiple sources, all of which compound.` },
    ],
    traps: [
      { title: `Burning goodwill`, text: `The person you cut off in year 3 remembers it in year 10.` },
      { title: `Neglecting long-term systems`, text: `Fast-twitch careers need slow-twitch infrastructure. Build both.` },
      { title: `Impulsive pivots`, text: `Staying with a compounding bet outperforms chasing a new hot one.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Close three new major deals. Document each playbook for future you.` },
      { label: `Days 31–60`, text: `Build one repeatable system — sales script, onboarding flow, or reporting cadence.` },
      { label: `Days 61–90`, text: `Hire an operator. Your hours should shift from closing to leveraging.` },
    ],
    premium: {
      executiveSummary: `You're an action-first operator. ESTPs thrive where others freeze and close deals others wouldn't attempt. Your career ceiling is high — but only if you can solve the ESTP paradox: building durable assets while moving at your speed. This report is your operating manual for compounding velocity into long-term wealth.`,
      careerDna: [
        `Your edge is speed. ESTPs make decisions in seconds that others deliberate for weeks. In high-variance environments — sales, trading, real estate, emergency response — this is rocket fuel.`,
        `You're at your worst in slow, process-heavy organizations. You're at your best where action is rewarded and feedback is immediate. Choose industries that move at your speed.`,
        `The single move that transforms ESTP careers is hiring an executor early. Your action-orientation creates revenue; an executor turns revenue into compounding business. Without that complement, ESTP careers cap at hustle. With it, they explode.`,
      ],
      strengths: [
        { title: `Decisive action`, text: `You move while others freeze. Asset in sales, trading, emergency response, ops crises.` },
        { title: `Reading rooms in real time`, text: `You sense interest, resistance, deal momentum. Asset in negotiation and closing.` },
        { title: `Risk tolerance`, text: `You make calls others avoid. Asset in trading, entrepreneurship, real estate.` },
        { title: `Physical presence and energy`, text: `You move and people respond. Asset in any audience or customer-facing role.` },
      ],
      matches: [
        { rank: `1`, role: `Enterprise Sales Executive / Senior AE`, fit: `93%`, why: `Why: High variance + premium pay + action.

Typical day: Pipeline, exec selling, deal closing.

Watch for: Choose teams with realistic targets.`, comp: `Comp: $200K + variable → $1M+

Target employers: Enterprise SaaS, B2B services, late-stage tech.` },
        { rank: `2`, role: `Entrepreneur / Founder (Sales / Real Estate / Hospitality)`, fit: `92%`, why: `Why: Highest ceiling for ESTP wiring.

Typical day: Sales, ops, deal-making, team building.

Watch for: Hire executors early.`, comp: `Comp: Variable — $0 – $50M+ outcome

Target employers: Independent or partnership.` },
        { rank: `3`, role: `Trader (Equities / Commodities / Crypto)`, fit: `91%`, why: `Why: Speed + risk tolerance + premium pay.

Typical day: Position management, risk, market reading.

Watch for: Discipline matters more than instinct over time.`, comp: `Comp: Variable — $200K – multi-million

Target employers: Prop firms, hedge funds, independent.` },
        { rank: `4`, role: `Real Estate Investor / Developer`, fit: `88%`, why: `Why: Deal-making + capital deployment + scale.

Typical day: Acquisition, financing, development, ops.

Watch for: Capital-intensive; build through cycles.`, comp: `Comp: Variable — $200K – multi-million

Target employers: Independent or small partnership.` },
        { rank: `5`, role: `Emergency / First Responder Senior Leader`, fit: `86%`, why: `Why: Crisis competence + leadership + meaningful work.

Typical day: Command, training, ops.

Watch for: Path is structured.`, comp: `Comp: $80K – $200K

Target employers: Major fire/EMS, federal agencies.` },
        { rank: `6`, role: `Athlete / Coach / Sports Industry Senior`, fit: `85%`, why: `Why: Competition + performance + audience.

Typical day: Performance, coaching, business.

Watch for: Career has performance window; build longevity.`, comp: `Comp: Variable — $80K – multi-million

Target employers: Major sports organizations, independent.` },
        { rank: `7`, role: `Event Producer / Promoter (Senior / Owner)`, fit: `83%`, why: `Why: Action + variety + premium fees.

Typical day: Event design, deal-making, ops.

Watch for: Industry can be cyclical; build durable client relationships.`, comp: `Comp: Variable — $100K – $700K+

Target employers: Independent or boutique.` },
        { rank: `8`, role: `Marketing Director (High-Energy Industries)`, fit: `82%`, why: `Why: Energy + audience + revenue leverage.

Typical day: Brand, campaigns, exec advising.

Watch for: Choose data-respecting environments.`, comp: `Comp: $150K – $400K

Target employers: Sports, hospitality, fashion, consumer.` },
        { rank: `9`, role: `Police / Federal Agent (Senior)`, fit: `81%`, why: `Why: Action + structure + meaningful work.

Typical day: Investigation, ops, leadership.

Watch for: Path is structured; pension significant.`, comp: `Comp: $80K – $200K (federal pay)

Target employers: Federal agencies, major departments.` },
        { rank: `10`, role: `Personal Trainer / Fitness Studio Owner`, fit: `78%`, why: `Why: Action + clientele + ownership.

Typical day: Training, programming, ops.

Watch for: Studio ownership transforms income.`, comp: `Comp: Variable — $60K – $400K+ with studio

Target employers: Independent or studio.` },
      ],
      bestIndustries: [
        `Enterprise sales and revenue`,
        `Real estate investment and development`,
        `Trading (equities, commodities, crypto)`,
        `Sports and athletic performance`,
        `Emergency services and federal agency operations`,
      ],
      avoidIndustries: [
        `Slow-moving traditional bureaucracies`,
        `Pure analytical roles with no human contact`,
        `Long, ambiguous research timelines`,
      ],
      greenFlags: [
        `Action-rich, results-measured cultures`,
        `Clear, immediate feedback`,
        `Competitive peer environment`,
        `Variable comp tied to outcomes`,
        `Visible stakes`,
      ],
      redFlags: [
        `Slow, consensus-driven decisions`,
        `Heavy approval cycles`,
        `Pure office culture with no action`,
        `Rigid daily routines`,
        `Cultures that punish risk-taking`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$70K – $130K + variable`, driver: `Hustle phase. Build skills and book.` },
        { stage: `Years 4-7`, range: `$130K – $280K + variable`, driver: `Specialty emerges. Variable comp scales.` },
        { stage: `Years 8-15`, range: `$280K – $700K+`, driver: `Senior leadership or scaled practice.` },
        { stage: `Years 16-25`, range: `$500K – $3M+`, driver: `Founder, partner, or scaled investor.` },
        { stage: `Years 25+`, range: `$500K – multi-million`, driver: `Multiple income streams, equity outcomes.` },
      ],
      leadershipStrengths: [
        `Decisive action under pressure`,
        `Energizing teams toward bold goals`,
        `Closing deals others can't`,
        `Reading and managing momentum`,
      ],
      leadershipBlindspots: [
        `Shortcutting process`,
        `Burning goodwill for short-term wins`,
        `Neglecting long-term systems`,
        `Impulsive pivots`,
      ],
      leadershipScripts: [
        { label: `Slowing down before decisions`, text: `'I'm tempted to move on this. Let me sleep on it. We'll decide tomorrow.' (Counters your default.)` },
        { label: `Building durable relationships`, text: `'I want to keep working with you long-term. Here's what I need; here's what I'll deliver.' (Frames the deal as the start of a relationship, not a transaction.)` },
        { label: `Empowering an executor`, text: `'You own the systems. I'll bring the deals. Decide on operations as you see fit.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Hustle Phase`, intro: `You'll outwork peers, learn fast, make and lose money.`, milestones: `Build a book of business. Develop one specialty. Find one mentor.`, mistakes: `Burning relationships in deals. Skipping fundamentals. Mistaking activity for productivity.`, signals: `Quota crushing. Recognized by name. You have a reputation that opens doors.` },
        { label: `Years 8-15 — The Scaling Phase`, intro: `Raw effort gets replaced by leverage. You build teams or books that produce without you in the room.`, milestones: `Senior leader, founder, or scaled investor. Equity meaningful.`, mistakes: `Refusing to hire executors. Skipping systems. Burning out top performers.`, signals: `Multiple revenue streams emerging. You hire rather than apply. Comp 3-5x year-7.` },
        { label: `Years 16+ — The Portfolio Phase`, intro: `You diversify your bets. Income has multiple sources, all compounding.`, milestones: `Founder at scale, principal, or scaled investor. Multiple income streams.`, mistakes: `Diluting attention. Skipping risk management. Burning relationships.`, signals: `Multiple compounding income streams. Decision authority over capital. You make markets.` },
      ],
      investSkills: [
        `Long-term thinking and discipline`,
        `Hiring and managing executors`,
        `Capital allocation and investment literacy`,
        `Risk management`,
        `One business-side skill (P&L, finance, ops)`,
      ],
      deprioritizeSkills: [
        `Generic productivity systems`,
        `Polishing presentations beyond clear`,
        `Conference networking for its own sake`,
        `Becoming the deepest specialist`,
      ],
      negotiationOverview: `ESTPs are excellent natural negotiators. Your risk is overplaying your hand and damaging the long-term relationship. The best ESTPs do hard pushing privately, finalize in writing, and protect the other side's dignity. The deals you'll regret are the ones you 'won' too publicly.`,
      negotiationScripts: [
        { label: `Closing`, text: `'Sounds like we're aligned on [terms]. Let me put it in writing today. You confirm by Friday. We move next week.'` },
        { label: `Pushing back without burning room`, text: `'I want this to work. Where I'm stuck is [issue]. What flexibility do you have on [lever]?'` },
      ],
      pivots: [
        { title: `Top sales rep → Founder`, text: `Validate one wedge with paying customers. Hire executor before product-market fit.` },
        { title: `Top performer → Investor`, text: `Build investment track record on the side. Most successful sales-to-investor pivots happen years 12-20.` },
        { title: `Operator → Industry investor / advisor`, text: `Build public reputation. Most ESTPs underestimate their long-term advisory value.` },
      ],
      traps: [
        { title: `Burning goodwill`, text: `The peer you cut off in year 3 remembers it in year 10.` },
        { title: `Neglecting long-term systems`, text: `Fast-twitch careers need slow-twitch infrastructure.` },
        { title: `Impulsive pivots`, text: `Compounding bets beat new hot ones.` },
        { title: `Refusing to hire executors`, text: `Solo ESTP capacity caps income; partnered ESTPs compound.` },
        { title: `Mistaking activity for productivity`, text: `Closing 100 small deals isn't building a business.` },
        { title: `Burning out top performers`, text: `Setting your pace as theirs costs you the best people.` },
      ],
      redFlagPhrases: [
        `'Highly process-driven' (slow)`,
        `'Long sales cycles' if you're not patient`,
        `'Strict approval hierarchy' (no autonomy)`,
        `'Detail-oriented' as primary requirement`,
        `'Stable, mature culture' (often code for: stagnant)`,
      ],
      networking: `ESTPs build the broadest networks but the shallowest ones. The move is curating top 50 deeply. Touch quarterly. Bring value first. Over 10 years this becomes the most valuable career asset.`,
      weeks: [
        { label: `Week 1`, text: `Close 3 new major deals. Document each playbook for future you.` },
        { label: `Week 2`, text: `Build one repeatable system — sales script, onboarding flow, reporting cadence.` },
        { label: `Week 3`, text: `Hire an operator (even part-time).` },
        { label: `Week 4`, text: `List top 50 relationships. Reach out to 5 with value, no ask.` },
        { label: `Week 5`, text: `Audit your wins. Identify the playbook that works most reliably.` },
        { label: `Week 6`, text: `Block 4 hours/week for strategic thinking. Inviolable.` },
        { label: `Week 7`, text: `Make one decision you've been deferring.` },
        { label: `Week 8`, text: `Make one external visibility move (writing, speaking, podcast).` },
        { label: `Week 9`, text: `Reach out to 5 dormant contacts.` },
        { label: `Week 10`, text: `Negotiate something durable (multi-year, equity, strategic).` },
        { label: `Week 11`, text: `Audit your physical health. Sleep, nutrition, recovery.` },
        { label: `Week 12`, text: `Review 90 days. Set next plan with executor accountability.` },
      ],
      visionExercise: `Imagine your portfolio in 20 years. Which 3 bets compounded? Which 5 were noise? Now: what would have to be true this quarter to start the 3 that compound? Most ESTPs already know — the exercise is committing to start.`,
    },
  },
  ESFP: {
    title: `ESFP — The Performer`,
    subtitle: `Premium career insights tailored to your ESFP profile`,
    careerDna: `You're a present-moment performer. ESFPs generate energy in rooms other people drain. Your career sweet spot is live, audience-facing, high-touch roles. Your risk is mistaking charisma for strategy — you can out-charm your way past year 5, but years 10+ reward planning and infrastructure, too.`,
    matches: [
      { rank: `1`, role: `Performer / Entertainer / Creator`, fit: `90%`, salary: `Variable, very high ceiling` },
      { rank: `2`, role: `Retail / Hospitality Leader`, fit: `88%`, salary: `$100K – $300K` },
      { rank: `3`, role: `Event Planner / Experiential Producer`, fit: `86%`, salary: `$80K – $200K` },
      { rank: `4`, role: `Social Media / Content Creator`, fit: `84%`, salary: `Variable, very high ceiling` },
      { rank: `5`, role: `Fitness Coach / Studio Owner`, fit: `83%`, salary: `Variable` },
      { rank: `6`, role: `Flight Attendant / Travel Industry Leader`, fit: `82%`, salary: `$70K – $160K` },
      { rank: `7`, role: `Fundraiser / Community Officer`, fit: `80%`, salary: `$80K – $180K` },
    ],
    environment: `You thrive with live interaction, variety, appreciation, and movement. You wilt in isolated or repetitive roles. Your environment is your fuel; optimize ruthlessly.`,
    leadership: `You lead as an energizer. People feel the room lift when you walk in. The risk: avoiding long-term planning because it feels dull. The fix: install a quarterly planning ritual — one day every 90 days, same as rent. Charisma without planning tops out. Charisma with planning compounds.`,
    stages: [
      { label: `Years 1–7 — The Broad Exposure Years`, text: `You'll try many stages, roles, and audiences. Every one teaches you presence.` },
      { label: `Years 8–15 — The Signature Presence Phase`, text: `You become recognizable. People book you specifically.` },
      { label: `Years 16+ — The Brand Owner Phase`, text: `You own the show, studio, or platform. Your brand outlives your appearances.` },
    ],
    traps: [
      { title: `Avoiding financial planning`, text: `Volatile income demands disciplined savings. Past you will thank future you.` },
      { title: `Over-committing and burning out`, text: `Every yes costs energy. Price your yesses accordingly.` },
      { title: `Undercharging for charisma`, text: `What comes easy to you commands premium rates in the market.` },
    ],
    plan: [
      { label: `Days 1–30`, text: `Set a quarterly revenue target with specific numbers. Write it where you'll see it.` },
      { label: `Days 31–60`, text: `Hire a part-time admin or bookkeeper. Even 5 hrs/week buys back 20.` },
      { label: `Days 61–90`, text: `Book one flagship gig that stretches you. Your next level requires a next-level stage.` },
    ],
    premium: {
      executiveSummary: `You're a present-moment performer. ESFPs generate energy in rooms others drain. Your career sweet spot is live, audience-facing, high-touch roles. Your career risk is mistaking charisma for strategy — you can out-charm year 5, but year 10+ rewards planning. This report is your operating manual for combining presence with infrastructure.`,
      careerDna: [
        `Your edge is presence. ESFPs make moments memorable. In sales, hospitality, performance, and creator economies, this is real, durable competitive advantage.`,
        `You're at your worst in isolated, repetitive, or routine work. You're at your best in live, varied, audience-facing roles. Choose careers that pay for energy.`,
        `The single move that transforms ESFP careers is installing planning rituals. Your charisma compounds when paired with quarterly planning, financial systems, and one accountability partner. Without those, ESFP careers cap. With them, they explode.`,
      ],
      strengths: [
        { title: `Live presence`, text: `You make moments memorable. Asset in performance, sales, hospitality, creators.` },
        { title: `Reading audiences`, text: `You feel the room and adjust. Asset in any audience-facing role.` },
        { title: `Energy generation`, text: `You create motivation in others. Asset in coaching, fitness, sales leadership.` },
        { title: `Adaptability in real time`, text: `You roll with what shows up. Asset in events, hospitality, ops crises.` },
      ],
      matches: [
        { rank: `1`, role: `Performer / Entertainer / Independent Creator`, fit: `90%`, why: `Why: Energy + audience + premium fees.

Typical day: Performance, content, audience building.

Watch for: Income lags audience; build runway.`, comp: `Comp: Variable — $50K – multi-million

Target employers: Independent practice, agency representation.` },
        { rank: `2`, role: `Retail / Hospitality Senior Leader`, fit: `88%`, why: `Why: People + operations + premium pay at senior level.

Typical day: Ops leadership, customer experience, team management.

Watch for: Path is structured at top brands.`, comp: `Comp: $120K – $400K at executive level

Target employers: Major hotels, restaurants, retail.` },
        { rank: `3`, role: `Event Planner / Experiential Producer`, fit: `87%`, why: `Why: Live work + variety + premium fees.

Typical day: Event design, vendor management, client service.

Watch for: Industry hours can be tough; build through cycles.`, comp: `Comp: $80K – $300K at senior / owner

Target employers: Independent practice, boutique firms, in-house at major brands.` },
        { rank: `4`, role: `Social Media / Content Creator (Audience-driven)`, fit: `85%`, why: `Why: Audience leverage + multiple income streams.

Typical day: Content production, brand partnerships, monetization.

Watch for: Income lags audience by 1-3 years.`, comp: `Comp: Variable — $0 – multi-million

Target employers: Major platforms, agencies, independent.` },
        { rank: `5`, role: `Fitness / Wellness Coach (Senior / Studio Owner)`, fit: `84%`, why: `Why: Live work + clientele + ownership.

Typical day: Training, programming, ops.

Watch for: Studio ownership transforms income.`, comp: `Comp: Variable — $80K – $400K+ with studio

Target employers: Independent practice, studio, gym.` },
        { rank: `6`, role: `Flight Attendant / Travel Industry Senior Leader`, fit: `82%`, why: `Why: People + variety + travel.

Typical day: Service delivery, training, ops leadership.

Watch for: Career has lifestyle benefits and burnout risks.`, comp: `Comp: $80K – $180K at senior level

Target employers: Major airlines, hospitality groups.` },
        { rank: `7`, role: `Fundraiser / Community Officer (Senior)`, fit: `80%`, why: `Why: Network leverage + premium relational work.

Typical day: Donor cultivation, ask conversations, community.

Watch for: Track record of major gifts is the career capital.`, comp: `Comp: $100K – $250K

Target employers: Major nonprofits, universities, foundations.` },
        { rank: `8`, role: `Sales Leader (High-Touch / Premium Brands)`, fit: `83%`, why: `Why: Energy + revenue + audience.

Typical day: Pipeline, exec selling, team leadership.

Watch for: Choose teams with realistic targets.`, comp: `Comp: $150K + variable → $500K+

Target employers: Premium consumer brands, hospitality, services.` },
        { rank: `9`, role: `Hairstylist / Aesthetician (Senior / Salon Owner)`, fit: `78%`, why: `Why: Hands-on + clientele + ownership.

Typical day: Service delivery, client management.

Watch for: Build clientele early; book follows.`, comp: `Comp: Variable — $80K – $400K+ at senior / owner

Target employers: Salons, independent practice.` },
        { rank: `10`, role: `Tour / Experience Guide (Senior / Owner)`, fit: `76%`, why: `Why: Live + variety + niche premium.

Typical day: Tour design, group leadership, business ops.

Watch for: Niche specialty (food, art, history) increases premium fees.`, comp: `Comp: $60K – $250K with established business

Target employers: Independent or boutique partnership.` },
      ],
      bestIndustries: [
        `Hospitality and retail at scale`,
        `Performance and audience-driven content`,
        `Event production and experience design`,
        `Fitness, wellness, and personal services`,
        `Fundraising and major-gifts development`,
      ],
      avoidIndustries: [
        `Pure analytical roles with no human contact`,
        `Long, ambiguous research timelines`,
        `Heavy administrative bureaucracies`,
      ],
      greenFlags: [
        `Live audience-facing work`,
        `Variety and movement`,
        `Visible appreciation and recognition`,
        `Clear, immediate feedback`,
        `Mission or brand alignment`,
      ],
      redFlags: [
        `Isolated work`,
        `Routine repetitive tasks`,
        `Long approval cycles`,
        `Heavy administrative requirements`,
        `Cultures that punish charisma`,
      ],
      compTrajectory: [
        { stage: `Years 1-3`, range: `$50K – $100K + variable`, driver: `Build skill, audience, and clientele.` },
        { stage: `Years 4-7`, range: `$100K – $200K + variable`, driver: `Specialty emerges. Variable comp scales.` },
        { stage: `Years 8-15`, range: `$200K – $500K+`, driver: `Senior leadership or scaled practice.` },
        { stage: `Years 16-25`, range: `$300K – $1M+`, driver: `Brand owner, principal, or scaled creator.` },
        { stage: `Years 25+`, range: `$300K – multi-million`, driver: `Body of work and brand compound.` },
      ],
      leadershipStrengths: [
        `Energizing teams in real time`,
        `Holding rooms through hard moments`,
        `Recruiting through pure presence`,
        `Reading and adjusting to morale`,
      ],
      leadershipBlindspots: [
        `Avoiding long-term planning`,
        `Skipping financial discipline`,
        `Over-committing and burning out`,
        `Conflict avoidance`,
      ],
      leadershipScripts: [
        { label: `Quarterly planning`, text: `'On the first Friday of every quarter, I plan the next 90 days. Same time, same place.' (Forces structure.)` },
        { label: `Financial discipline`, text: `'I save X% of every check before I spend anything. Non-negotiable.'` },
        { label: `Saying no`, text: `'I want to be there. I can't be there. Here's who could.'` },
      ],
      stages: [
        { label: `Years 1-7 — The Broad Exposure Years`, intro: `You'll try many stages, roles, and audiences.`, milestones: `Master one craft. Build one mentor relationship. Develop one signature.`, mistakes: `Spending faster than earning. Avoiding planning. Saying yes to everything.`, signals: `You have a recognizable presence. Repeat audience or clientele. Modest savings.` },
        { label: `Years 8-15 — The Signature Presence Phase`, intro: `You become recognizable. People book you specifically.`, milestones: `Senior brand role, scaled practice, or owner. Premium fees.`, mistakes: `Refusing to plan financially. Burning out. Over-committing.`, signals: `Inbound for your specific work. Premium rates. Younger talent looks up to you.` },
        { label: `Years 16+ — The Brand Owner Phase`, intro: `You own the show, studio, or platform. Brand outlives appearances.`, milestones: `Studio, brand, or scaled practice. Multiple income streams.`, mistakes: `Refusing to delegate. Holding on to all spotlight. Burning out by 60.`, signals: `Multiple compounding income streams. Brand has equity. Apprentices succeed.` },
      ],
      investSkills: [
        `Quarterly and annual planning rituals`,
        `Financial discipline and savings systems`,
        `Boundary-setting (especially around energy)`,
        `One business-side skill (marketing, ops, finance)`,
        `Long-term relationship-tending`,
      ],
      deprioritizeSkills: [
        `Generic productivity tool-hopping`,
        `Polishing artifacts past useful`,
        `Mass-market networking`,
        `Becoming the deepest specialist`,
      ],
      negotiationOverview: `ESFPs negotiate poorly because the deal feels like it could break the warmth. Reframe: a fair deal preserves the warmth; an unfair one destroys it. Set rates in writing before conversations. Practice the number aloud.`,
      negotiationScripts: [
        { label: `Stating your rate`, text: `'For this scope, my rate is [target]. That's because [value delivered].'` },
        { label: `Closing without overselling`, text: `'Sounds like we're a fit. Let me confirm in writing today. You confirm by Friday.'` },
      ],
      pivots: [
        { title: `Performer / employee → Owner / brand`, text: `Build audience and brand on the side. Quit when income covers 70%.` },
        { title: `Generalist → Niche specialist`, text: `Pick one signature for 5+ years. Specialty depth raises rates dramatically.` },
        { title: `Solo creator → Scaled brand`, text: `Add help, then systems. ESFPs who scale do so deliberately.` },
      ],
      traps: [
        { title: `Avoiding financial planning`, text: `Volatile income demands disciplined savings.` },
        { title: `Over-committing and burning out`, text: `Each yes costs energy. Price your yesses.` },
        { title: `Undercharging for charisma`, text: `What comes easy commands premium rates.` },
        { title: `Refusing to plan long-term`, text: `Charisma without strategy caps.` },
        { title: `Personalizing rejection`, text: `Audience 'no' isn't life 'no.' Separate.` },
        { title: `Tolerating exploitative deals`, text: `Fair contracts build durable careers.` },
      ],
      redFlagPhrases: [
        `'Heavy back-office admin' (against your wiring)`,
        `'Routine monthly cycles' (boring)`,
        `'Highly analytical' as primary description`,
        `'Lone-wolf culture' (no audience)`,
        `'Stable, mature' (often code for: stagnant)`,
      ],
      networking: `Your network is huge but shallow. Pick top 50 from your wide circle and treat them like family. Touch quarterly with substance. Over a decade this becomes career capital that audiences alone can't replace.`,
      weeks: [
        { label: `Week 1`, text: `Set quarterly revenue target. Write it where you'll see it daily.` },
        { label: `Week 2`, text: `Hire part-time admin or bookkeeper. Even 5 hrs/week buys 20.` },
        { label: `Week 3`, text: `Book one flagship gig that stretches you.` },
        { label: `Week 4`, text: `Reach out to 5 dormant contacts. Substantive, no ask.` },
        { label: `Week 5`, text: `Audit your finances. Set up automatic savings/tax.` },
        { label: `Week 6`, text: `Block 2 hours/week solo planning. Standing appointment.` },
        { label: `Week 7`, text: `Identify the one skill gap most blocking trajectory.` },
        { label: `Week 8`, text: `Make one external visibility move (post, talk, podcast).` },
        { label: `Week 9`, text: `Renegotiate one underpriced contract.` },
        { label: `Week 10`, text: `Hire executor or accountability partner.` },
        { label: `Week 11`, text: `Set boundaries around energy (when you say yes, when no).` },
        { label: `Week 12`, text: `Review 90 days. Set next quarter.` },
      ],
      visionExercise: `Imagine your career in 30 years. Audiences you served are now leaders themselves. What did your work give them? What did you have to be willing to NOT do this year for that to be true? Start by saying no to one thing this week.`,
    },
  },
};

export function getCareerReport(type: string): CareerReport | undefined {
  return careerReports[type];
}