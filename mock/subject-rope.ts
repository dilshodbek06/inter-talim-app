export type SubjectKey =
  | "informatika"
  | "rus-tili"
  | "ona-tili"
  | "adabiyot"
  | "ingliz-tili"
  | "fizika"
  | "kimyo"
  | "biologiya"
  | "tarix"
  | "geografiya";

export type SubjectQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
};

export const SUBJECTS: {
  key: SubjectKey;
  label: string;
  description: string;
  accent: string;
}[] = [
  {
    key: "informatika",
    label: "Informatika",
    description: "Dasturlash va kompyuter asoslari",
    accent: "from-sky-500 to-blue-600",
  },
  {
    key: "rus-tili",
    label: "Rus tili",
    description: "Grammatika va so'z turkumlari",
    accent: "from-rose-500 to-red-600",
  },
  {
    key: "ona-tili",
    label: "Ona tili",
    description: "Til qoidalari va tuzilishi",
    accent: "from-amber-500 to-orange-500",
  },
  {
    key: "adabiyot",
    label: "Adabiyot",
    description: "Asar va badiiy tushunchalar",
    accent: "from-fuchsia-500 to-pink-600",
  },
  {
    key: "ingliz-tili",
    label: "Ingliz tili",
    description: "Lug'at va tarjima",
    accent: "from-emerald-500 to-green-600",
  },
  {
    key: "fizika",
    label: "Fizika",
    description: "Kattaliklar va birliklar",
    accent: "from-indigo-500 to-blue-700",
  },
  {
    key: "kimyo",
    label: "Kimyo",
    description: "Modda va reaksiya",
    accent: "from-lime-500 to-emerald-600",
  },
  {
    key: "biologiya",
    label: "Biologiya",
    description: "Tirik organizmlar asoslari",
    accent: "from-teal-500 to-cyan-600",
  },
  {
    key: "tarix",
    label: "Tarix",
    description: "Davrlar va tushunchalar",
    accent: "from-stone-500 to-amber-700",
  },
  {
    key: "geografiya",
    label: "Geografiya",
    description: "Yer va tabiat atamalari",
    accent: "from-cyan-500 to-sky-600",
  },
];

const subjectLoaders: Record<SubjectKey, () => Promise<SubjectQuestion[]>> = {
  informatika: () =>
    import("@/mock/subject-rope/informatika.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  "rus-tili": () =>
    import("@/mock/subject-rope/rus-tili.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  "ona-tili": () =>
    import("@/mock/subject-rope/ona-tili.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  adabiyot: () =>
    import("@/mock/subject-rope/adabiyot.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  "ingliz-tili": () =>
    import("@/mock/subject-rope/ingliz-tili.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  fizika: () =>
    import("@/mock/subject-rope/fizika.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  kimyo: () =>
    import("@/mock/subject-rope/kimyo.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  biologiya: () =>
    import("@/mock/subject-rope/biologiya.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  tarix: () =>
    import("@/mock/subject-rope/tarix.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
  geografiya: () =>
    import("@/mock/subject-rope/geografiya.json").then(
      (mod) => mod.default as SubjectQuestion[],
    ),
};

const subjectCache = new Map<SubjectKey, SubjectQuestion[]>();

export const loadSubjectQuestions = async (subjectKey: SubjectKey) => {
  const cached = subjectCache.get(subjectKey);
  if (cached) return cached;
  const loader = subjectLoaders[subjectKey];
  const data = loader ? await loader() : [];
  subjectCache.set(subjectKey, data);
  return data;
};
