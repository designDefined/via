const stateManage = `const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");
const [gender, setGender] = useState<Gender|null>(null);
const [age, setAge] = useState<number>(-1); // -1 for empty state
`;

const complicated = `export const SaveHomeworkMessageParser = {
  title: z.string().parse,
  commonFiles: FileStored.array().parse,
  commonFilesAdded: FileRaw.array().optional().parse,
  aiPrompt: MessageReservationAIPrompt.parse,
  commonClassContent: z.string().parse,
  commonHomeworkTitle: z.string().parse,
  commonHomeworkContent: z.string().parse,
  commonHomeworkAverage: z.string().parse,
  commonHomeworkPerfectScore: z.string().parse,
  userRows: [
    {
      isTarget: z.boolean().parse,
      userId: ID.SPACE_USER.parse,
      username: SPACE_USER_TEXT.USERNAME.LENIENT.parse,
      userProfileGetUri: z.string().parse,
      score: z.string().parse,
      attitude: z.string().parse,
      files: FileStored.array().parse,
      comment: z.string().parse,
      generatedContent: z.string().parse,
      aiState: RESERVATION_AI_STATE.parse,
      isConfirmed: z.boolean().parse,
    },
  ],
};`;

export const others = {
  stateManage,
  complicated,
};
