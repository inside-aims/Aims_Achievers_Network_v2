// ── Types ─────────────────────────────────────────────────────────────────────

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface NominationSubmission {
  id: string;
  categoryId: string;
  eventId: string;

  // Nominee
  nomineeName: string;
  nomineePhone?: string;
  nomineeDepartment?: string;
  nomineeYear?: string;
  nomineeProgram?: string;
  avatarUrl?: string;

  // Nominator
  nominatorName: string;
  nominatorEmail: string;
  nominatorPhone?: string;
  nominatorRelationship: string;

  // Details
  nominationReason: string;
  achievements?: string;

  status: SubmissionStatus;
  createdAt: string; // ISO string
}

export interface NominationCategory {
  id: string;
  name: string;
  categoryCode: string;
  submissions: NominationSubmission[];
}

export interface NominationEvent {
  id: string;
  title: string;
  status: string;
  eventCode: string;
  categories: NominationCategory[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function countByStatus(
  events: NominationEvent[],
  status?: SubmissionStatus,
): number {
  return events
    .flatMap((e) => e.categories)
    .flatMap((c) => c.submissions)
    .filter((s) => (status ? s.status === status : true)).length;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_NOMINATIONS: NominationEvent[] = [
  // ── Event 1: FAST Excellence Awards (live) ──────────────────────────────────
  {
    id: "evt-1",
    title: "FAST Excellence Awards 2025",
    status: "live",
    eventCode: "FA",
    categories: [
      {
        id: "cat-1",
        name: "Best Developer",
        categoryCode: "BDV",
        submissions: [
          {
            id: "sub-1",
            categoryId: "cat-1",
            eventId: "evt-1",
            nomineeName: "Elikem Tetteh",
            nomineePhone: "0241234567",
            nomineeDepartment: "Computer Science",
            nomineeYear: "3",
            nomineeProgram: "BSc. Computer Science",
            nominatorName: "Dr. Kofi Asante",
            nominatorEmail: "k.asante@ktu.edu.gh",
            nominatorPhone: "0209876543",
            nominatorRelationship: "Lecturer",
            nominationReason:
              "Elikem consistently delivers high-quality software solutions and has led two major student projects that were adopted by the faculty. His passion for clean code and mentoring peers makes him a standout candidate.",
            achievements:
              "Built the Faculty Attendance System used by 400+ students. Winner of the 2024 KTU Hackathon. Contributed to two open-source libraries.",
            status: "pending",
            createdAt: "2025-05-10T09:15:00Z",
          },
          {
            id: "sub-2",
            categoryId: "cat-1",
            eventId: "evt-1",
            nomineeName: "Akua Serwaa",
            nomineePhone: "0557654321",
            nomineeDepartment: "Computer Science",
            nomineeYear: "4",
            nomineeProgram: "BSc. Computer Science",
            nominatorName: "Nana Ama Boateng",
            nominatorEmail: "nboateng@student.ktu.edu.gh",
            nominatorRelationship: "Classmate",
            nominationReason:
              "Akua single-handedly built and deployed the department's event portal. She is always first to help juniors debug code and her final-year project is the most polished I have seen in four years.",
            status: "pending",
            createdAt: "2025-05-11T14:30:00Z",
          },
          {
            id: "sub-3",
            categoryId: "cat-1",
            eventId: "evt-1",
            nomineeName: "Bernard Asumadu",
            nomineePhone: "0261112233",
            nomineeDepartment: "Computer Science",
            nomineeYear: "3",
            nomineeProgram: "BSc. Information Technology",
            nominatorName: "Prof. Yaw Darko",
            nominatorEmail: "y.darko@ktu.edu.gh",
            nominatorPhone: "0204455667",
            nominatorRelationship: "Supervisor",
            nominationReason:
              "Bernard showed exceptional skill during his internship and returned to mentor 15 students in mobile development. His GitHub profile is one of the most active in the department.",
            achievements: "Interned at Hubtel. Published a Flutter package with 200+ likes.",
            status: "approved",
            createdAt: "2025-05-08T10:00:00Z",
          },
          {
            id: "sub-4",
            categoryId: "cat-1",
            eventId: "evt-1",
            nomineeName: "Comfort Osei-Bonsu",
            nomineePhone: "0278899001",
            nomineeDepartment: "Computer Science",
            nomineeYear: "2",
            nomineeProgram: "BSc. Computer Science",
            nominatorName: "James Owusu",
            nominatorEmail: "james.o@ktu.edu.gh",
            nominatorRelationship: "Teaching Assistant",
            nominationReason:
              "A second-year student competing with fourth-years - Comfort's grasp of algorithms is remarkable and she won our internal coding competition twice.",
            status: "rejected",
            createdAt: "2025-05-07T08:45:00Z",
          },
        ],
      },
      {
        id: "cat-2",
        name: "Best Lecturer",
        categoryCode: "BLC",
        submissions: [
          {
            id: "sub-5",
            categoryId: "cat-2",
            eventId: "evt-1",
            nomineeName: "Dr. Abena Mensah-Bonsu",
            nomineeDepartment: "Mathematics",
            nominatorName: "Samuel Aidoo",
            nominatorEmail: "s.aidoo@student.ktu.edu.gh",
            nominatorRelationship: "Student",
            nominationReason:
              "Dr. Mensah-Bonsu makes calculus accessible. Her recorded lectures have been shared across three universities and she holds extra revision sessions at no charge. Students genuinely look forward to her class.",
            achievements:
              "Published 6 peer-reviewed papers. Recipient of the 2023 KTU Teaching Excellence award.",
            status: "pending",
            createdAt: "2025-05-12T11:00:00Z",
          },
          {
            id: "sub-6",
            categoryId: "cat-2",
            eventId: "evt-1",
            nomineeName: "Mr. Richmond Asante",
            nomineeDepartment: "Networking",
            nominatorName: "Efua Ampofo",
            nominatorEmail: "e.ampofo@student.ktu.edu.gh",
            nominatorRelationship: "Student",
            nominationReason:
              "Mr. Asante brings real-world networking experience into every lecture. He personally arranged lab equipment donations from Cisco and got five students placed as Cisco interns.",
            status: "approved",
            createdAt: "2025-05-06T16:20:00Z",
          },
        ],
      },
      {
        id: "cat-3",
        name: "Best Final Year",
        categoryCode: "BFY",
        submissions: [
          {
            id: "sub-7",
            categoryId: "cat-3",
            eventId: "evt-1",
            nomineeName: "Kweku Acheampong",
            nomineePhone: "0244001122",
            nomineeDepartment: "Computer Science",
            nomineeYear: "4",
            nomineeProgram: "BSc. Computer Science",
            nominatorName: "Ms. Rashida Osei",
            nominatorEmail: "r.osei@ktu.edu.gh",
            nominatorPhone: "0206677889",
            nominatorRelationship: "Academic Advisor",
            nominationReason:
              "Kweku maintained a first-class GPA throughout all four years while holding the position of SRC Tech Director. His thesis on predictive systems for smallholder farmers is already being piloted in Ashanti Region.",
            achievements:
              "First Class Honours. SRC Tech Director 2024–2025. Best Thesis nominee at Faculty Level.",
            status: "pending",
            createdAt: "2025-05-13T07:30:00Z",
          },
        ],
      },
    ],
  },

  // ── Event 2: FOE Engineering Awards (closed) ─────────────────────────────────
  {
    id: "evt-2",
    title: "FOE Engineering Awards 2025",
    status: "closed",
    eventCode: "FE",
    categories: [
      {
        id: "cat-5",
        name: "Best Engineer",
        categoryCode: "BEN",
        submissions: [
          {
            id: "sub-8",
            categoryId: "cat-5",
            eventId: "evt-2",
            nomineeName: "Yaw Darko Jnr.",
            nomineePhone: "0243344556",
            nomineeDepartment: "Electrical Engineering",
            nomineeYear: "4",
            nomineeProgram: "BSc. Electrical & Electronic Engineering",
            nominatorName: "Prof. Samuel Quaye",
            nominatorEmail: "s.quaye@knust.edu.gh",
            nominatorPhone: "0208899001",
            nominatorRelationship: "Department Head",
            nominationReason:
              "Yaw designed a low-cost solar inverter for rural communities as his thesis and attracted a GHS 50,000 grant from the Ghana Energy Commission. He is the definition of applied engineering.",
            achievements:
              "Ghana Energy Commission Grant 2025. Best Engineering Thesis, KNUST. Patent pending for solar inverter design.",
            status: "approved",
            createdAt: "2025-03-20T09:00:00Z",
          },
          {
            id: "sub-9",
            categoryId: "cat-5",
            eventId: "evt-2",
            nomineeName: "Akosua Frempong",
            nomineePhone: "0274455667",
            nomineeDepartment: "Civil Engineering",
            nomineeYear: "4",
            nomineeProgram: "BSc. Civil Engineering",
            nominatorName: "Dr. Ama Boateng",
            nominatorEmail: "a.boateng@knust.edu.gh",
            nominatorRelationship: "Thesis Supervisor",
            nominationReason:
              "Akosua's structural analysis work on low-cost housing is being reviewed by the Ministry of Housing. She represented KNUST at the Pan-African Engineering Summit in Nairobi.",
            achievements:
              "Pan-African Engineering Summit delegate. Ministry of Housing collaboration.",
            status: "approved",
            createdAt: "2025-03-18T13:45:00Z",
          },
        ],
      },
      {
        id: "cat-6",
        name: "Best Project",
        categoryCode: "BPJ",
        submissions: [
          {
            id: "sub-10",
            categoryId: "cat-6",
            eventId: "evt-2",
            nomineeName: "Team AgroTech",
            nomineeDepartment: "Agricultural Engineering",
            nominatorName: "Dr. Fiifi Mensah",
            nominatorEmail: "f.mensah@knust.edu.gh",
            nominatorRelationship: "Project Supervisor",
            nominationReason:
              "Team AgroTech built a precision irrigation system using low-cost sensors that reduced water usage by 40% in pilot farms. The project won the national STEM Olympiad.",
            achievements: "National STEM Olympiad 2025 winners. Partnered with Agri-Ghana NGO.",
            status: "approved",
            createdAt: "2025-03-15T10:30:00Z",
          },
          {
            id: "sub-11",
            categoryId: "cat-6",
            eventId: "evt-2",
            nomineeName: "Team BioEnergy",
            nomineeDepartment: "Chemical Engineering",
            nominatorName: "Ms. Adwoa Poku",
            nominatorEmail: "a.poku@knust.edu.gh",
            nominatorRelationship: "Lab Supervisor",
            nominationReason:
              "The team converted organic waste into usable biogas for the KNUST canteen, cutting fuel costs by 30%. Simple, effective and scalable.",
            status: "rejected",
            createdAt: "2025-03-14T15:00:00Z",
          },
        ],
      },
    ],
  },

  // ── Event 3: FBMS Business Awards (live) ────────────────────────────────────
  {
    id: "evt-3",
    title: "FBMS Business Awards 2025",
    status: "live",
    eventCode: "FB",
    categories: [
      {
        id: "cat-7",
        name: "Best Entrepreneur",
        categoryCode: "BEN",
        submissions: [
          {
            id: "sub-12",
            categoryId: "cat-7",
            eventId: "evt-3",
            nomineeName: "Adwoa Asante",
            nomineePhone: "0249900112",
            nomineeDepartment: "Business Administration",
            nomineeYear: "3",
            nomineeProgram: "BSc. Business Administration",
            nominatorName: "Mr. Kwame Yeboah",
            nominatorEmail: "k.yeboah@ug.edu.gh",
            nominatorPhone: "0203344556",
            nominatorRelationship: "Business Mentor",
            nominationReason:
              "Adwoa founded CampusStitch, a student-led tailoring startup that now employs 12 seamstresses and ships across Accra. She turned a GHS 500 DUNS micro-grant into a GHS 40,000 monthly revenue business.",
            achievements:
              "DUNS Micro-Grant winner. UG Young Entrepreneur of the Year 2024. Featured in Business Day Ghana.",
            status: "pending",
            createdAt: "2025-06-01T08:00:00Z",
          },
          {
            id: "sub-13",
            categoryId: "cat-7",
            eventId: "evt-3",
            nomineeName: "Kwame Bediako",
            nomineePhone: "0268877665",
            nomineeDepartment: "Accounting",
            nomineeYear: "4",
            nomineeProgram: "BSc. Accounting",
            nominatorName: "Ama Sarpong",
            nominatorEmail: "ama.s@student.ug.edu.gh",
            nominatorRelationship: "Business Partner",
            nominationReason:
              "Kwame co-founded a campus delivery app that processes over 200 orders a day. He also runs free financial literacy workshops for first-year students every semester.",
            status: "pending",
            createdAt: "2025-06-02T11:20:00Z",
          },
          {
            id: "sub-14",
            categoryId: "cat-7",
            eventId: "evt-3",
            nomineeName: "Ama Yeboah",
            nomineePhone: "0506655443",
            nomineeDepartment: "Marketing",
            nomineeYear: "3",
            nomineeProgram: "BSc. Marketing",
            nominatorName: "Dr. Seth Ofori",
            nominatorEmail: "s.ofori@ug.edu.gh",
            nominatorRelationship: "Lecturer",
            nominationReason:
              "Ama built a social-media marketing agency from her dorm room and now manages accounts for three SMEs in Accra. Her campaigns generated over GHS 200,000 in client revenue last year.",
            achievements: "Managing Director, AYM Agency. Google Digital Skills certified.",
            status: "approved",
            createdAt: "2025-05-30T09:45:00Z",
          },
        ],
      },
      {
        id: "cat-8",
        name: "Best Marketer",
        categoryCode: "BMK",
        submissions: [
          {
            id: "sub-15",
            categoryId: "cat-8",
            eventId: "evt-3",
            nomineeName: "Fiifi Oppong",
            nomineePhone: "0244556677",
            nomineeDepartment: "Marketing",
            nomineeYear: "4",
            nomineeProgram: "BSc. Marketing",
            nominatorName: "Prof. Abena Osei",
            nominatorEmail: "a.osei@ug.edu.gh",
            nominatorPhone: "0501122334",
            nominatorRelationship: "Department Head",
            nominationReason:
              "Fiifi's brand strategy for a local chocolate company helped them double their market share in six months. He also founded the UG Marketing Club and grew it to 300 members.",
            achievements:
              "UG Marketing Club Founder. Chartered Institute of Marketing (CIM) Student Award 2025.",
            status: "pending",
            createdAt: "2025-06-03T14:00:00Z",
          },
          {
            id: "sub-16",
            categoryId: "cat-8",
            eventId: "evt-3",
            nomineeName: "Nana Ama Boadu",
            nomineePhone: "0277788990",
            nomineeDepartment: "Marketing",
            nomineeYear: "3",
            nomineeProgram: "BSc. Marketing",
            nominatorName: "Kofi Asante",
            nominatorEmail: "kofi.a@student.ug.edu.gh",
            nominatorRelationship: "Classmate",
            nominationReason:
              "Nana Ama organised the largest inter-faculty marketing competition at UG this year and single-handedly secured four corporate sponsors. Her creativity in digital marketing is unmatched among students.",
            status: "rejected",
            createdAt: "2025-05-29T16:30:00Z",
          },
        ],
      },
    ],
  },
];
