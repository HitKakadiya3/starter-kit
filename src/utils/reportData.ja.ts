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
    summary: "あなたは、深い分析的思考と長期的なビジョンを兼ね備えた、先見の明のある戦略家です。複雑な問題を独力で解決することに長け、自らに最高水準の卓越性を課します。",
    turbulentScore: 35,
    whoYouAre: {
      howYouThink: "あなたはシステムやパターンで物事を考え、常に数手先を読んでいます。複雑な情報を整理するためのフレームワークを、あなたの心は自然に構築します。",
      howYouProcess: "あなたは情報を論理と戦略的関連性でフィルタリングし、目標にそぐわないものは切り捨て、合致するものは深く分析します。",
      howYouDecide: "あなたは客観的な分析と長期的な結果に基づいて意思決定を行い、感情的な圧力や社会的な期待に流されることはほとんどありません。",
      whatMotivates: "熟達、知的な挑戦、そして能力の追求。システムを理解し、改善したいという欲求があなたを突き動かします。",
      whatDrains: "反復作業、感情的なドラマ、マイクロマネジメント、そして凡庸さが許される環境。",
      howOthersSeeYou: "他者はあなたを自信に満ち、有能で、時には威圧的だと見ています。あなたの静かな集中力は、無関心と誤解されることがあります。",
      underStress: "過度に批判的になったり、完全に引きこもったり、自分や他者の無能さ（と認識したもの）に固執したりすることがあります。",
      socialSettings: "大人数の集まりよりも、小規模で有意義な会話を好みます。社会的なつながりにおいては、広さよりも深さを重視します。",
      atWork: "戦略的計画や独立した問題解決が求められる役割で優れた能力を発揮します。自律性を好み、不必要な官僚主義に抵抗します。",
      learningStyle: "理論的なフレームワーク、独立した研究、そして概念をより大きなシステムに結びつけることを通じて最もよく学びます。"
    },
    strengths: [
      { title: "戦略的ビジョン", description: "大局を見て、数手先を計画する能力" },
      { title: "分析の深さ", description: "複雑な問題を論理的に分解する卓越したスキル" },
      { title: "独立性", description: "一人で働き、困難な決断を下すことに抵抗がない" },
      { title: "決断力", description: "一度決めた目標を粘り強く追求する" },
      { title: "革新性", description: "改善されたシステムを構想し、構築する天性の能力" },
      { title: "高い基準", description: "卓越性へのコミットメントが、並外れた成果を生み出す" }
    ],
    growthAreas: [
      { title: "感情表現", description: "信頼できる人々と感情を共有し、弱さを見せる練習をする" },
      { title: "他者への忍耐", description: "誰もがあなたと同じ速さで処理するわけではありません。異なるスピードを受け入れる余地を持ちましょう" },
      { title: "権限委譲", description: "たとえアプローチが異なっていても、他者がタスクを処理できると信じる" },
      { title: "社会的なつながり", description: "知的な刺激を超えた人間関係にも投資する" },
      { title: "完璧主義", description: "「これで十分」が本当に十分な時を見極める" },
      { title: "今この瞬間", description: "常に未来を計画するのではなく、今この瞬間にいることを練習する" }
    ],
    relationships: {
      howYouConnect: "あなたは知的な深さと共有されたビジョンを通じてつながります。あなたの思考に挑戦し、独立性を尊重してくれるパートナーを高く評価します。",
      conflictStyle: "対立には論理的にアプローチし、感情が高ぶると苦労することがあります。表面的な感情に対処するよりも、根本原因を解決することを好みます。",
      emotionalNeeds: "独立性のための空間、知的な刺激、そしてあなたの率直さを個人的に受け取らないパートナーが必要です。",
      compatibleTypes: ["ENFP", "ENTP", "INFJ", "ENTJ"]
    },
    career: {
      bestFitCareers: ["ソフトウェアアーキテクト", "戦略コンサルタント", "研究科学者", "投資アナリスト", "システムエンジニア", "データサイエンティスト"],
      leadershipStyle: "高い基準を設定し、卓越性を期待するビジョンを持ったリーダー。能力と戦略的な方向性で人々を導きます。",
      teamRole: "設計者 — あなたは青写真を描き、他の人々が実行すると信じます。",
      idealEnvironment: "自律的で、知的に刺激的で、官僚主義が最小限で効率が最大限の環境。",
      flexVsStructured: "柔軟な手法で達成できる構造化された目標を好みます — 目的地を定義し、自分の道を選びます。",
      remoteVsCollaborative: "リモートワークや独立した作業環境で能力を発揮し、必要なときには集中した共同作業を行います。",
      environmentNote: "INTJは、年功序列よりも能力を重視し、知的な挑戦を提供し、実行における自律性と共に明確な目標が与えられる環境で最高のパフォーマンスを発揮します。"
    },
    growthRoadmap: {
      week1: "自分の自動的な判断を観察しましょう。誰かのアイデアを退けていることに気づいたら、一旦停止し、それについて純粋な質問を一つしてみてください。",
      week2: "毎日一人に感謝の気持ちを伝える練習をしましょう。その人が何をしたか、それがあなたにどう影響したかについて、具体的な言葉を使います。",
      week3: "今週、委任できるタスクを一つ特定します。正確なプロセスではなく、望ましい結果を伝えることに焦点を当てます。",
      week4: "社会的に自分のコンフォートゾーンの外にある目標を一つ設定します。イベントに参加したり、新しい連絡先に手を差し伸べたり、既存の関係を深めたりします。",
      dailyExercises: [
        "5分間の内省ジャーナル：今日誰かについて感謝したことを一つ書く",
        "一つの会話で、自分の返答を計画せずにアクティブリスニングを実践する",
        "問題解決から10分間休憩し、純粋に楽しめることをする",
        "最近連絡を取っていない人にメッセージを送る"
      ]
    },
    insightCards: {
      coreStrength: "戦略的熟達 — 他者が見逃す可能性を見出し、それを達成するためのシステムを構築します",
      communicationStyle: "直接的、簡潔、そして論理主導。世間話よりも実質を好みます",
      careerFit: "独立した分析、長期計画、システム設計を必要とする役割",
      relationshipStyle: "相互の尊重と知的なつながりに基づいて築かれる、深く忠実な絆"
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
    summary: `「${type}」であるあなたは、世界をどのように捉え、他者とどう関わるかを決定づける、特有の認知機能の組み合わせを持っています。あなたの生まれ持った傾向は、思考、コミュニケーション、人間関係の構築において、独自のアプローチを生み出します。`,
    growthRoadmap: {
      ...base.growthRoadmap,
      dailyExercises: base.growthRoadmap.dailyExercises,
    },
    insightCards: {
      coreStrength: `あなたの「${type}」としてのユニークな特性の組み合わせは、他者が賞賛するような生まれながらの能力を与えてくれます`,
      communicationStyle: `あなたの「${type}」としてのコミュニケーションスタイルは、あなたらしいつながり方を反映しています`,
      careerFit: `あなたの「${type}」としての強みや自然な好みに合ったキャリア`,
      relationshipStyle: `あなたは「${type}」としての人間関係へのアプローチを通じて、有意義なつながりを築きます`
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