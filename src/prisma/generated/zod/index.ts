import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValue: z.ZodType<Prisma.JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(JsonValue)),
  z.lazy(() => z.record(JsonValue)),
]);

export type JsonValueType = z.infer<typeof JsonValue>;

export const NullableJsonValue = z
  .union([JsonValue, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValue: z.ZodType<Prisma.InputJsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(InputJsonValue.nullable())),
  z.lazy(() => z.record(InputJsonValue.nullable())),
]);

export type InputJsonValueType = z.infer<typeof InputJsonValue>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const AnnouncementScalarFieldEnumSchema = z.enum(['id','value','show','contestId']);

export const ChatScalarFieldEnumSchema = z.enum(['id','message','userId','creationDate','updateDate']);

export const ContestProblemScalarFieldEnumSchema = z.enum(['contestId','problemId']);

export const ContestScalarFieldEnumSchema = z.enum(['id','name','mode','gradingMode','timeStart','timeEnd','announce']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((v) => transformJsonNull(v));

export const ProblemScalarFieldEnumSchema = z.enum(['id','name','sname','score','timeLimit','memoryLimit','show','recentShowTime','case','rating','examples']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const RefreshTokenScalarFieldEnumSchema = z.enum(['id','userId','jwtId','used','expiryDate','creationDate','updateDate']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const SubmissionScalarFieldEnumSchema = z.enum(['id','userId','problemId','result','score','timeUsed','status','errmsg','contestId','sourceCode','language','creationDate','updateDate','public']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserContestScalarFieldEnumSchema = z.enum(['userId','contestId','rank','ratingAfterUpdate']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','showName','email','password','role','rating','creationDate','updateDate']);

export const ContestGradingModeSchema = z.enum(['acm','classic']);

export type ContestGradingModeType = `${z.infer<typeof ContestGradingModeSchema>}`

export const ContestModeSchema = z.enum(['rated','unrated']);

export type ContestModeType = `${z.infer<typeof ContestModeSchema>}`

export const SubmissionStatusSchema = z.enum(['waiting','grading','accept','reject']);

export type SubmissionStatusType = `${z.infer<typeof SubmissionStatusSchema>}`

export const UserRoleSchema = z.enum(['user','admin']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ANNOUNCEMENT SCHEMA
/////////////////////////////////////////

export const AnnouncementSchema = z.object({
  id: z.number().int(),
  value: NullableJsonValue.optional(),
  show: z.boolean().nullable(),
  contestId: z.number().int().nullable(),
})

export type Announcement = z.infer<typeof AnnouncementSchema>

/////////////////////////////////////////
// CHAT SCHEMA
/////////////////////////////////////////

export const ChatSchema = z.object({
  id: z.number().int(),
  message: z.string(),
  userId: z.number().int(),
  creationDate: z.coerce.date().nullable(),
  updateDate: z.coerce.date().nullable(),
})

export type Chat = z.infer<typeof ChatSchema>

/////////////////////////////////////////
// CONTEST SCHEMA
/////////////////////////////////////////

export const ContestSchema = z.object({
  mode: ContestModeSchema,
  gradingMode: ContestGradingModeSchema,
  id: z.number().int(),
  name: z.string().nullable(),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().nullable(),
})

export type Contest = z.infer<typeof ContestSchema>

/////////////////////////////////////////
// CONTEST PROBLEM SCHEMA
/////////////////////////////////////////

export const ContestProblemSchema = z.object({
  contestId: z.number().int(),
  problemId: z.number().int(),
})

export type ContestProblem = z.infer<typeof ContestProblemSchema>

/////////////////////////////////////////
// PROBLEM SCHEMA
/////////////////////////////////////////

export const ProblemSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  sname: z.string().nullable(),
  score: z.number().int().nullable(),
  timeLimit: z.number().int().nullable(),
  memoryLimit: z.number().int().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().nullable(),
  case: z.string().nullable(),
  rating: z.number().int().nullable(),
  examples: NullableJsonValue.optional(),
})

export type Problem = z.infer<typeof ProblemSchema>

/////////////////////////////////////////
// REFRESH TOKEN SCHEMA
/////////////////////////////////////////

export const RefreshTokenSchema = z.object({
  id: z.string(),
  userId: z.number().int().nullable(),
  jwtId: z.string().nullable(),
  used: z.boolean().nullable(),
  expiryDate: z.coerce.date().nullable(),
  creationDate: z.coerce.date().nullable(),
  updateDate: z.coerce.date().nullable(),
})

export type RefreshToken = z.infer<typeof RefreshTokenSchema>

/////////////////////////////////////////
// SUBMISSION SCHEMA
/////////////////////////////////////////

export const SubmissionSchema = z.object({
  status: SubmissionStatusSchema,
  id: z.number().int(),
  userId: z.number().int(),
  problemId: z.number().int().nullable(),
  result: z.string().nullable(),
  score: z.number().int().nullable(),
  timeUsed: z.number().int().nullable(),
  errmsg: z.string().nullable(),
  contestId: z.number().int().nullable(),
  sourceCode: z.string().nullable(),
  language: z.string().nullable(),
  creationDate: z.coerce.date().nullable(),
  updateDate: z.coerce.date().nullable(),
  public: z.boolean().nullable(),
})

export type Submission = z.infer<typeof SubmissionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.number().int(),
  username: z.string(),
  showName: z.string(),
  email: z.string().nullable(),
  password: z.string(),
  rating: z.number().int().nullable(),
  creationDate: z.coerce.date().nullable(),
  updateDate: z.coerce.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER CONTEST SCHEMA
/////////////////////////////////////////

export const UserContestSchema = z.object({
  userId: z.number().int(),
  contestId: z.number().int(),
  rank: z.number().int().nullable(),
  ratingAfterUpdate: z.number().int().nullable(),
})

export type UserContest = z.infer<typeof UserContestSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ANNOUNCEMENT
//------------------------------------------------------

export const AnnouncementSelectSchema: z.ZodType<Prisma.AnnouncementSelect> = z.object({
  id: z.boolean().optional(),
  value: z.boolean().optional(),
  show: z.boolean().optional(),
  contestId: z.boolean().optional(),
}).strict()

// CHAT
//------------------------------------------------------

export const ChatIncludeSchema: z.ZodType<Prisma.ChatInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ChatArgsSchema: z.ZodType<Prisma.ChatArgs> = z.object({
  select: z.lazy(() => ChatSelectSchema).optional(),
  include: z.lazy(() => ChatIncludeSchema).optional(),
}).strict();

export const ChatSelectSchema: z.ZodType<Prisma.ChatSelect> = z.object({
  id: z.boolean().optional(),
  message: z.boolean().optional(),
  userId: z.boolean().optional(),
  creationDate: z.boolean().optional(),
  updateDate: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// CONTEST
//------------------------------------------------------

export const ContestIncludeSchema: z.ZodType<Prisma.ContestInclude> = z.object({
  contestProblem: z.union([z.boolean(),z.lazy(() => ContestProblemFindManyArgsSchema)]).optional(),
  userContest: z.union([z.boolean(),z.lazy(() => UserContestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContestCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ContestArgsSchema: z.ZodType<Prisma.ContestArgs> = z.object({
  select: z.lazy(() => ContestSelectSchema).optional(),
  include: z.lazy(() => ContestIncludeSchema).optional(),
}).strict();

export const ContestCountOutputTypeArgsSchema: z.ZodType<Prisma.ContestCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ContestCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ContestCountOutputTypeSelectSchema: z.ZodType<Prisma.ContestCountOutputTypeSelect> = z.object({
  contestProblem: z.boolean().optional(),
  userContest: z.boolean().optional(),
}).strict();

export const ContestSelectSchema: z.ZodType<Prisma.ContestSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  mode: z.boolean().optional(),
  gradingMode: z.boolean().optional(),
  timeStart: z.boolean().optional(),
  timeEnd: z.boolean().optional(),
  announce: z.boolean().optional(),
  contestProblem: z.union([z.boolean(),z.lazy(() => ContestProblemFindManyArgsSchema)]).optional(),
  userContest: z.union([z.boolean(),z.lazy(() => UserContestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContestCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTEST PROBLEM
//------------------------------------------------------

export const ContestProblemIncludeSchema: z.ZodType<Prisma.ContestProblemInclude> = z.object({
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
}).strict()

export const ContestProblemArgsSchema: z.ZodType<Prisma.ContestProblemArgs> = z.object({
  select: z.lazy(() => ContestProblemSelectSchema).optional(),
  include: z.lazy(() => ContestProblemIncludeSchema).optional(),
}).strict();

export const ContestProblemSelectSchema: z.ZodType<Prisma.ContestProblemSelect> = z.object({
  contestId: z.boolean().optional(),
  problemId: z.boolean().optional(),
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
}).strict()

// PROBLEM
//------------------------------------------------------

export const ProblemIncludeSchema: z.ZodType<Prisma.ProblemInclude> = z.object({
  contestProblem: z.union([z.boolean(),z.lazy(() => ContestProblemFindManyArgsSchema)]).optional(),
  submission: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProblemCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProblemArgsSchema: z.ZodType<Prisma.ProblemArgs> = z.object({
  select: z.lazy(() => ProblemSelectSchema).optional(),
  include: z.lazy(() => ProblemIncludeSchema).optional(),
}).strict();

export const ProblemCountOutputTypeArgsSchema: z.ZodType<Prisma.ProblemCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ProblemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProblemCountOutputTypeSelectSchema: z.ZodType<Prisma.ProblemCountOutputTypeSelect> = z.object({
  contestProblem: z.boolean().optional(),
  submission: z.boolean().optional(),
}).strict();

export const ProblemSelectSchema: z.ZodType<Prisma.ProblemSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  sname: z.boolean().optional(),
  score: z.boolean().optional(),
  timeLimit: z.boolean().optional(),
  memoryLimit: z.boolean().optional(),
  show: z.boolean().optional(),
  recentShowTime: z.boolean().optional(),
  case: z.boolean().optional(),
  rating: z.boolean().optional(),
  examples: z.boolean().optional(),
  contestProblem: z.union([z.boolean(),z.lazy(() => ContestProblemFindManyArgsSchema)]).optional(),
  submission: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProblemCountOutputTypeArgsSchema)]).optional(),
}).strict()

// REFRESH TOKEN
//------------------------------------------------------

export const RefreshTokenSelectSchema: z.ZodType<Prisma.RefreshTokenSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  jwtId: z.boolean().optional(),
  used: z.boolean().optional(),
  expiryDate: z.boolean().optional(),
  creationDate: z.boolean().optional(),
  updateDate: z.boolean().optional(),
}).strict()

// SUBMISSION
//------------------------------------------------------

export const SubmissionIncludeSchema: z.ZodType<Prisma.SubmissionInclude> = z.object({
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SubmissionArgsSchema: z.ZodType<Prisma.SubmissionArgs> = z.object({
  select: z.lazy(() => SubmissionSelectSchema).optional(),
  include: z.lazy(() => SubmissionIncludeSchema).optional(),
}).strict();

export const SubmissionSelectSchema: z.ZodType<Prisma.SubmissionSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  problemId: z.boolean().optional(),
  result: z.boolean().optional(),
  score: z.boolean().optional(),
  timeUsed: z.boolean().optional(),
  status: z.boolean().optional(),
  errmsg: z.boolean().optional(),
  contestId: z.boolean().optional(),
  sourceCode: z.boolean().optional(),
  language: z.boolean().optional(),
  creationDate: z.boolean().optional(),
  updateDate: z.boolean().optional(),
  public: z.boolean().optional(),
  problem: z.union([z.boolean(),z.lazy(() => ProblemArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  chat: z.union([z.boolean(),z.lazy(() => ChatFindManyArgsSchema)]).optional(),
  submission: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  userContest: z.union([z.boolean(),z.lazy(() => UserContestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  chat: z.boolean().optional(),
  submission: z.boolean().optional(),
  userContest: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  showName: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  role: z.boolean().optional(),
  rating: z.boolean().optional(),
  creationDate: z.boolean().optional(),
  updateDate: z.boolean().optional(),
  chat: z.union([z.boolean(),z.lazy(() => ChatFindManyArgsSchema)]).optional(),
  submission: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  userContest: z.union([z.boolean(),z.lazy(() => UserContestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER CONTEST
//------------------------------------------------------

export const UserContestIncludeSchema: z.ZodType<Prisma.UserContestInclude> = z.object({
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const UserContestArgsSchema: z.ZodType<Prisma.UserContestArgs> = z.object({
  select: z.lazy(() => UserContestSelectSchema).optional(),
  include: z.lazy(() => UserContestIncludeSchema).optional(),
}).strict();

export const UserContestSelectSchema: z.ZodType<Prisma.UserContestSelect> = z.object({
  userId: z.boolean().optional(),
  contestId: z.boolean().optional(),
  rank: z.boolean().optional(),
  ratingAfterUpdate: z.boolean().optional(),
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AnnouncementWhereInputSchema: z.ZodType<Prisma.AnnouncementWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AnnouncementWhereInputSchema),z.lazy(() => AnnouncementWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AnnouncementWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AnnouncementWhereInputSchema),z.lazy(() => AnnouncementWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  value: z.lazy(() => JsonNullableFilterSchema).optional(),
  show: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  contestId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const AnnouncementOrderByWithRelationInputSchema: z.ZodType<Prisma.AnnouncementOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AnnouncementWhereUniqueInputSchema: z.ZodType<Prisma.AnnouncementWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const AnnouncementOrderByWithAggregationInputSchema: z.ZodType<Prisma.AnnouncementOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AnnouncementCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AnnouncementAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AnnouncementMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AnnouncementMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AnnouncementSumOrderByAggregateInputSchema).optional()
}).strict();

export const AnnouncementScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AnnouncementScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AnnouncementScalarWhereWithAggregatesInputSchema),z.lazy(() => AnnouncementScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AnnouncementScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AnnouncementScalarWhereWithAggregatesInputSchema),z.lazy(() => AnnouncementScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  value: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  show: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  contestId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const ChatWhereInputSchema: z.ZodType<Prisma.ChatWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChatWhereInputSchema),z.lazy(() => ChatWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChatWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChatWhereInputSchema),z.lazy(() => ChatWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ChatOrderByWithRelationInputSchema: z.ZodType<Prisma.ChatOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ChatWhereUniqueInputSchema: z.ZodType<Prisma.ChatWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const ChatOrderByWithAggregationInputSchema: z.ZodType<Prisma.ChatOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ChatCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ChatAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ChatMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ChatMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ChatSumOrderByAggregateInputSchema).optional()
}).strict();

export const ChatScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ChatScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ChatScalarWhereWithAggregatesInputSchema),z.lazy(() => ChatScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChatScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChatScalarWhereWithAggregatesInputSchema),z.lazy(() => ChatScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  message: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ContestWhereInputSchema: z.ZodType<Prisma.ContestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContestWhereInputSchema),z.lazy(() => ContestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestWhereInputSchema),z.lazy(() => ContestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  mode: z.union([ z.lazy(() => EnumContestModeFilterSchema),z.lazy(() => ContestModeSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => EnumContestGradingModeFilterSchema),z.lazy(() => ContestGradingModeSchema) ]).optional(),
  timeStart: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  timeEnd: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  announce: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemListRelationFilterSchema).optional(),
  userContest: z.lazy(() => UserContestListRelationFilterSchema).optional()
}).strict();

export const ContestOrderByWithRelationInputSchema: z.ZodType<Prisma.ContestOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mode: z.lazy(() => SortOrderSchema).optional(),
  gradingMode: z.lazy(() => SortOrderSchema).optional(),
  timeStart: z.lazy(() => SortOrderSchema).optional(),
  timeEnd: z.lazy(() => SortOrderSchema).optional(),
  announce: z.lazy(() => SortOrderSchema).optional(),
  contestProblem: z.lazy(() => ContestProblemOrderByRelationAggregateInputSchema).optional(),
  userContest: z.lazy(() => UserContestOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ContestWhereUniqueInputSchema: z.ZodType<Prisma.ContestWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const ContestOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContestOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mode: z.lazy(() => SortOrderSchema).optional(),
  gradingMode: z.lazy(() => SortOrderSchema).optional(),
  timeStart: z.lazy(() => SortOrderSchema).optional(),
  timeEnd: z.lazy(() => SortOrderSchema).optional(),
  announce: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContestCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContestAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContestMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContestSumOrderByAggregateInputSchema).optional()
}).strict();

export const ContestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContestScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  mode: z.union([ z.lazy(() => EnumContestModeWithAggregatesFilterSchema),z.lazy(() => ContestModeSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => EnumContestGradingModeWithAggregatesFilterSchema),z.lazy(() => ContestGradingModeSchema) ]).optional(),
  timeStart: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  timeEnd: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  announce: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ContestProblemWhereInputSchema: z.ZodType<Prisma.ContestProblemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContestProblemWhereInputSchema),z.lazy(() => ContestProblemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestProblemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestProblemWhereInputSchema),z.lazy(() => ContestProblemWhereInputSchema).array() ]).optional(),
  contestId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contest: z.union([ z.lazy(() => ContestRelationFilterSchema),z.lazy(() => ContestWhereInputSchema) ]).optional(),
  problem: z.union([ z.lazy(() => ProblemRelationFilterSchema),z.lazy(() => ProblemWhereInputSchema) ]).optional(),
}).strict();

export const ContestProblemOrderByWithRelationInputSchema: z.ZodType<Prisma.ContestProblemOrderByWithRelationInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  contest: z.lazy(() => ContestOrderByWithRelationInputSchema).optional(),
  problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional()
}).strict();

export const ContestProblemWhereUniqueInputSchema: z.ZodType<Prisma.ContestProblemWhereUniqueInput> = z.object({
  contestId_problemId: z.lazy(() => ContestProblemContestIdProblemIdCompoundUniqueInputSchema).optional()
}).strict();

export const ContestProblemOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContestProblemOrderByWithAggregationInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContestProblemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContestProblemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContestProblemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContestProblemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContestProblemSumOrderByAggregateInputSchema).optional()
}).strict();

export const ContestProblemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContestProblemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContestProblemScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestProblemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestProblemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestProblemScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestProblemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  contestId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ProblemWhereInputSchema: z.ZodType<Prisma.ProblemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemWhereInputSchema),z.lazy(() => ProblemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemWhereInputSchema),z.lazy(() => ProblemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  timeLimit: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  memoryLimit: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  show: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  recentShowTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  case: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  rating: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  examples: z.lazy(() => JsonNullableFilterSchema).optional(),
  contestProblem: z.lazy(() => ContestProblemListRelationFilterSchema).optional(),
  submission: z.lazy(() => SubmissionListRelationFilterSchema).optional()
}).strict();

export const ProblemOrderByWithRelationInputSchema: z.ZodType<Prisma.ProblemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sname: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  recentShowTime: z.lazy(() => SortOrderSchema).optional(),
  case: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  examples: z.lazy(() => SortOrderSchema).optional(),
  contestProblem: z.lazy(() => ContestProblemOrderByRelationAggregateInputSchema).optional(),
  submission: z.lazy(() => SubmissionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProblemWhereUniqueInputSchema: z.ZodType<Prisma.ProblemWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const ProblemOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProblemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sname: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  recentShowTime: z.lazy(() => SortOrderSchema).optional(),
  case: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  examples: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProblemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProblemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProblemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProblemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProblemSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProblemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProblemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema),z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema),z.lazy(() => ProblemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sname: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  timeLimit: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  memoryLimit: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  show: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  recentShowTime: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  case: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  rating: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  examples: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional()
}).strict();

export const RefreshTokenWhereInputSchema: z.ZodType<Prisma.RefreshTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RefreshTokenWhereInputSchema),z.lazy(() => RefreshTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RefreshTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RefreshTokenWhereInputSchema),z.lazy(() => RefreshTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  jwtId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  used: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const RefreshTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.RefreshTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  jwtId: z.lazy(() => SortOrderSchema).optional(),
  used: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenWhereUniqueInputSchema: z.ZodType<Prisma.RefreshTokenWhereUniqueInput> = z.object({
  id: z.string().optional()
}).strict();

export const RefreshTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.RefreshTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  jwtId: z.lazy(() => SortOrderSchema).optional(),
  used: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RefreshTokenCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RefreshTokenAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RefreshTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RefreshTokenMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RefreshTokenSumOrderByAggregateInputSchema).optional()
}).strict();

export const RefreshTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RefreshTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  jwtId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  used: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  expiryDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SubmissionWhereInputSchema: z.ZodType<Prisma.SubmissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubmissionWhereInputSchema),z.lazy(() => SubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionWhereInputSchema),z.lazy(() => SubmissionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  result: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  timeUsed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumSubmissionStatusFilterSchema),z.lazy(() => SubmissionStatusSchema) ]).optional(),
  errmsg: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contestId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  sourceCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  public: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  problem: z.union([ z.lazy(() => ProblemRelationFilterSchema),z.lazy(() => ProblemWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.SubmissionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errmsg: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  sourceCode: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  public: z.lazy(() => SortOrderSchema).optional(),
  problem: z.lazy(() => ProblemOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SubmissionWhereUniqueInputSchema: z.ZodType<Prisma.SubmissionWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const SubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubmissionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errmsg: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  sourceCode: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  public: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SubmissionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SubmissionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SubmissionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SubmissionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SubmissionSumOrderByAggregateInputSchema).optional()
}).strict();

export const SubmissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubmissionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  result: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  timeUsed: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumSubmissionStatusWithAggregatesFilterSchema),z.lazy(() => SubmissionStatusSchema) ]).optional(),
  errmsg: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  contestId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  sourceCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  public: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  showName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  rating: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  chat: z.lazy(() => ChatListRelationFilterSchema).optional(),
  submission: z.lazy(() => SubmissionListRelationFilterSchema).optional(),
  userContest: z.lazy(() => UserContestListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  showName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  chat: z.lazy(() => ChatOrderByRelationAggregateInputSchema).optional(),
  submission: z.lazy(() => SubmissionOrderByRelationAggregateInputSchema).optional(),
  userContest: z.lazy(() => UserContestOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.object({
  id: z.number().int().optional(),
  username: z.string().optional(),
  showName: z.string().optional(),
  email: z.string().optional()
}).strict();

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  showName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  showName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  rating: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const UserContestWhereInputSchema: z.ZodType<Prisma.UserContestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserContestWhereInputSchema),z.lazy(() => UserContestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserContestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserContestWhereInputSchema),z.lazy(() => UserContestWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contestId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rank: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  contest: z.union([ z.lazy(() => ContestRelationFilterSchema),z.lazy(() => ContestWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const UserContestOrderByWithRelationInputSchema: z.ZodType<Prisma.UserContestOrderByWithRelationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional(),
  contest: z.lazy(() => ContestOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const UserContestWhereUniqueInputSchema: z.ZodType<Prisma.UserContestWhereUniqueInput> = z.object({
  userId_contestId: z.lazy(() => UserContestUserIdContestIdCompoundUniqueInputSchema).optional()
}).strict();

export const UserContestOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserContestOrderByWithAggregationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserContestCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserContestAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserContestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserContestMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserContestSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserContestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserContestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserContestScalarWhereWithAggregatesInputSchema),z.lazy(() => UserContestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserContestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserContestScalarWhereWithAggregatesInputSchema),z.lazy(() => UserContestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  contestId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  rank: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const AnnouncementCreateInputSchema: z.ZodType<Prisma.AnnouncementCreateInput> = z.object({
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.boolean().optional().nullable(),
  contestId: z.number().int().optional().nullable()
}).strict();

export const AnnouncementUncheckedCreateInputSchema: z.ZodType<Prisma.AnnouncementUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.boolean().optional().nullable(),
  contestId: z.number().int().optional().nullable()
}).strict();

export const AnnouncementUpdateInputSchema: z.ZodType<Prisma.AnnouncementUpdateInput> = z.object({
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AnnouncementUncheckedUpdateInputSchema: z.ZodType<Prisma.AnnouncementUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AnnouncementCreateManyInputSchema: z.ZodType<Prisma.AnnouncementCreateManyInput> = z.object({
  id: z.number().int().optional(),
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.boolean().optional().nullable(),
  contestId: z.number().int().optional().nullable()
}).strict();

export const AnnouncementUpdateManyMutationInputSchema: z.ZodType<Prisma.AnnouncementUpdateManyMutationInput> = z.object({
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AnnouncementUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AnnouncementUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  show: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ChatCreateInputSchema: z.ZodType<Prisma.ChatCreateInput> = z.object({
  message: z.string(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutChatInputSchema)
}).strict();

export const ChatUncheckedCreateInputSchema: z.ZodType<Prisma.ChatUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  message: z.string(),
  userId: z.number().int(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const ChatUpdateInputSchema: z.ZodType<Prisma.ChatUpdateInput> = z.object({
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutChatNestedInputSchema).optional()
}).strict();

export const ChatUncheckedUpdateInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ChatCreateManyInputSchema: z.ZodType<Prisma.ChatCreateManyInput> = z.object({
  id: z.number().int().optional(),
  message: z.string(),
  userId: z.number().int(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const ChatUpdateManyMutationInputSchema: z.ZodType<Prisma.ChatUpdateManyMutationInput> = z.object({
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ChatUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContestCreateInputSchema: z.ZodType<Prisma.ContestCreateInput> = z.object({
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemCreateNestedManyWithoutContestInputSchema).optional(),
  userContest: z.lazy(() => UserContestCreateNestedManyWithoutContestInputSchema).optional()
}).strict();

export const ContestUncheckedCreateInputSchema: z.ZodType<Prisma.ContestUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemUncheckedCreateNestedManyWithoutContestInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedCreateNestedManyWithoutContestInputSchema).optional()
}).strict();

export const ContestUpdateInputSchema: z.ZodType<Prisma.ContestUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemUpdateManyWithoutContestNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUpdateManyWithoutContestNestedInputSchema).optional()
}).strict();

export const ContestUncheckedUpdateInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemUncheckedUpdateManyWithoutContestNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedUpdateManyWithoutContestNestedInputSchema).optional()
}).strict();

export const ContestCreateManyInputSchema: z.ZodType<Prisma.ContestCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable()
}).strict();

export const ContestUpdateManyMutationInputSchema: z.ZodType<Prisma.ContestUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContestProblemCreateInputSchema: z.ZodType<Prisma.ContestProblemCreateInput> = z.object({
  contest: z.lazy(() => ContestCreateNestedOneWithoutContestProblemInputSchema),
  problem: z.lazy(() => ProblemCreateNestedOneWithoutContestProblemInputSchema)
}).strict();

export const ContestProblemUncheckedCreateInputSchema: z.ZodType<Prisma.ContestProblemUncheckedCreateInput> = z.object({
  contestId: z.number().int(),
  problemId: z.number().int()
}).strict();

export const ContestProblemUpdateInputSchema: z.ZodType<Prisma.ContestProblemUpdateInput> = z.object({
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutContestProblemNestedInputSchema).optional(),
  problem: z.lazy(() => ProblemUpdateOneRequiredWithoutContestProblemNestedInputSchema).optional()
}).strict();

export const ContestProblemUncheckedUpdateInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateInput> = z.object({
  contestId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContestProblemCreateManyInputSchema: z.ZodType<Prisma.ContestProblemCreateManyInput> = z.object({
  contestId: z.number().int(),
  problemId: z.number().int()
}).strict();

export const ContestProblemUpdateManyMutationInputSchema: z.ZodType<Prisma.ContestProblemUpdateManyMutationInput> = z.object({
}).strict();

export const ContestProblemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateManyInput> = z.object({
  contestId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProblemCreateInputSchema: z.ZodType<Prisma.ProblemCreateInput> = z.object({
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemCreateNestedManyWithoutProblemInputSchema).optional(),
  submission: z.lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUncheckedCreateInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemUncheckedCreateNestedManyWithoutProblemInputSchema).optional(),
  submission: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUpdateInputSchema: z.ZodType<Prisma.ProblemUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemUpdateManyWithoutProblemNestedInputSchema).optional(),
  submission: z.lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemUncheckedUpdateInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemUncheckedUpdateManyWithoutProblemNestedInputSchema).optional(),
  submission: z.lazy(() => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemCreateManyInputSchema: z.ZodType<Prisma.ProblemCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
}).strict();

export const ProblemUpdateManyMutationInputSchema: z.ZodType<Prisma.ProblemUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
}).strict();

export const ProblemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
}).strict();

export const RefreshTokenCreateInputSchema: z.ZodType<Prisma.RefreshTokenCreateInput> = z.object({
  id: z.string(),
  userId: z.number().int().optional().nullable(),
  jwtId: z.string().optional().nullable(),
  used: z.boolean().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const RefreshTokenUncheckedCreateInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedCreateInput> = z.object({
  id: z.string(),
  userId: z.number().int().optional().nullable(),
  jwtId: z.string().optional().nullable(),
  used: z.boolean().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const RefreshTokenUpdateInputSchema: z.ZodType<Prisma.RefreshTokenUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jwtId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  used: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jwtId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  used: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenCreateManyInputSchema: z.ZodType<Prisma.RefreshTokenCreateManyInput> = z.object({
  id: z.string(),
  userId: z.number().int().optional().nullable(),
  jwtId: z.string().optional().nullable(),
  used: z.boolean().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const RefreshTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.RefreshTokenUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jwtId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  used: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jwtId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  used: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiryDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubmissionCreateInputSchema: z.ZodType<Prisma.SubmissionCreateInput> = z.object({
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable(),
  problem: z.lazy(() => ProblemCreateNestedOneWithoutSubmissionInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSubmissionInputSchema)
}).strict();

export const SubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  problemId: z.number().int().optional().nullable(),
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable()
}).strict();

export const SubmissionUpdateInputSchema: z.ZodType<Prisma.SubmissionUpdateInput> = z.object({
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  problem: z.lazy(() => ProblemUpdateOneWithoutSubmissionNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSubmissionNestedInputSchema).optional()
}).strict();

export const SubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubmissionCreateManyInputSchema: z.ZodType<Prisma.SubmissionCreateManyInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  problemId: z.number().int().optional().nullable(),
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable()
}).strict();

export const SubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.SubmissionUpdateManyMutationInput> = z.object({
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  chat: z.lazy(() => ChatCreateNestedManyWithoutUserInputSchema).optional(),
  submission: z.lazy(() => SubmissionCreateNestedManyWithoutUserInputSchema).optional(),
  userContest: z.lazy(() => UserContestCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  chat: z.lazy(() => ChatUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  submission: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  chat: z.lazy(() => ChatUpdateManyWithoutUserNestedInputSchema).optional(),
  submission: z.lazy(() => SubmissionUpdateManyWithoutUserNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  chat: z.lazy(() => ChatUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  submission: z.lazy(() => SubmissionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserContestCreateInputSchema: z.ZodType<Prisma.UserContestCreateInput> = z.object({
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable(),
  contest: z.lazy(() => ContestCreateNestedOneWithoutUserContestInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutUserContestInputSchema)
}).strict();

export const UserContestUncheckedCreateInputSchema: z.ZodType<Prisma.UserContestUncheckedCreateInput> = z.object({
  userId: z.number().int(),
  contestId: z.number().int(),
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable()
}).strict();

export const UserContestUpdateInputSchema: z.ZodType<Prisma.UserContestUpdateInput> = z.object({
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutUserContestNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserContestNestedInputSchema).optional()
}).strict();

export const UserContestUncheckedUpdateInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateInput> = z.object({
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contestId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserContestCreateManyInputSchema: z.ZodType<Prisma.UserContestCreateManyInput> = z.object({
  userId: z.number().int(),
  contestId: z.number().int(),
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable()
}).strict();

export const UserContestUpdateManyMutationInputSchema: z.ZodType<Prisma.UserContestUpdateManyMutationInput> = z.object({
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserContestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateManyInput> = z.object({
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contestId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AnnouncementCountOrderByAggregateInputSchema: z.ZodType<Prisma.AnnouncementCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AnnouncementAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AnnouncementAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AnnouncementMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AnnouncementMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AnnouncementMinOrderByAggregateInputSchema: z.ZodType<Prisma.AnnouncementMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AnnouncementSumOrderByAggregateInputSchema: z.ZodType<Prisma.AnnouncementSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ChatCountOrderByAggregateInputSchema: z.ZodType<Prisma.ChatCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ChatAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ChatMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatMinOrderByAggregateInputSchema: z.ZodType<Prisma.ChatMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChatSumOrderByAggregateInputSchema: z.ZodType<Prisma.ChatSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumContestModeFilterSchema: z.ZodType<Prisma.EnumContestModeFilter> = z.object({
  equals: z.lazy(() => ContestModeSchema).optional(),
  in: z.lazy(() => ContestModeSchema).array().optional(),
  notIn: z.lazy(() => ContestModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => NestedEnumContestModeFilterSchema) ]).optional(),
}).strict();

export const EnumContestGradingModeFilterSchema: z.ZodType<Prisma.EnumContestGradingModeFilter> = z.object({
  equals: z.lazy(() => ContestGradingModeSchema).optional(),
  in: z.lazy(() => ContestGradingModeSchema).array().optional(),
  notIn: z.lazy(() => ContestGradingModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => NestedEnumContestGradingModeFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ContestProblemListRelationFilterSchema: z.ZodType<Prisma.ContestProblemListRelationFilter> = z.object({
  every: z.lazy(() => ContestProblemWhereInputSchema).optional(),
  some: z.lazy(() => ContestProblemWhereInputSchema).optional(),
  none: z.lazy(() => ContestProblemWhereInputSchema).optional()
}).strict();

export const UserContestListRelationFilterSchema: z.ZodType<Prisma.UserContestListRelationFilter> = z.object({
  every: z.lazy(() => UserContestWhereInputSchema).optional(),
  some: z.lazy(() => UserContestWhereInputSchema).optional(),
  none: z.lazy(() => UserContestWhereInputSchema).optional()
}).strict();

export const ContestProblemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContestProblemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserContestOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserContestOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContestCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mode: z.lazy(() => SortOrderSchema).optional(),
  gradingMode: z.lazy(() => SortOrderSchema).optional(),
  timeStart: z.lazy(() => SortOrderSchema).optional(),
  timeEnd: z.lazy(() => SortOrderSchema).optional(),
  announce: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContestAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContestMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mode: z.lazy(() => SortOrderSchema).optional(),
  gradingMode: z.lazy(() => SortOrderSchema).optional(),
  timeStart: z.lazy(() => SortOrderSchema).optional(),
  timeEnd: z.lazy(() => SortOrderSchema).optional(),
  announce: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContestMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  mode: z.lazy(() => SortOrderSchema).optional(),
  gradingMode: z.lazy(() => SortOrderSchema).optional(),
  timeStart: z.lazy(() => SortOrderSchema).optional(),
  timeEnd: z.lazy(() => SortOrderSchema).optional(),
  announce: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContestSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const EnumContestModeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumContestModeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContestModeSchema).optional(),
  in: z.lazy(() => ContestModeSchema).array().optional(),
  notIn: z.lazy(() => ContestModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => NestedEnumContestModeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContestModeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContestModeFilterSchema).optional()
}).strict();

export const EnumContestGradingModeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumContestGradingModeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContestGradingModeSchema).optional(),
  in: z.lazy(() => ContestGradingModeSchema).array().optional(),
  notIn: z.lazy(() => ContestGradingModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => NestedEnumContestGradingModeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContestGradingModeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContestGradingModeFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const ContestRelationFilterSchema: z.ZodType<Prisma.ContestRelationFilter> = z.object({
  is: z.lazy(() => ContestWhereInputSchema).optional(),
  isNot: z.lazy(() => ContestWhereInputSchema).optional()
}).strict();

export const ProblemRelationFilterSchema: z.ZodType<Prisma.ProblemRelationFilter> = z.object({
  is: z.lazy(() => ProblemWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProblemWhereInputSchema).optional().nullable()
}).strict();

export const ContestProblemContestIdProblemIdCompoundUniqueInputSchema: z.ZodType<Prisma.ContestProblemContestIdProblemIdCompoundUniqueInput> = z.object({
  contestId: z.number(),
  problemId: z.number()
}).strict();

export const ContestProblemCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContestProblemCountOrderByAggregateInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestProblemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContestProblemAvgOrderByAggregateInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestProblemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContestProblemMaxOrderByAggregateInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestProblemMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContestProblemMinOrderByAggregateInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContestProblemSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContestProblemSumOrderByAggregateInput> = z.object({
  contestId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const SubmissionListRelationFilterSchema: z.ZodType<Prisma.SubmissionListRelationFilter> = z.object({
  every: z.lazy(() => SubmissionWhereInputSchema).optional(),
  some: z.lazy(() => SubmissionWhereInputSchema).optional(),
  none: z.lazy(() => SubmissionWhereInputSchema).optional()
}).strict();

export const SubmissionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SubmissionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sname: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  recentShowTime: z.lazy(() => SortOrderSchema).optional(),
  case: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  examples: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sname: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  recentShowTime: z.lazy(() => SortOrderSchema).optional(),
  case: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  sname: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  show: z.lazy(() => SortOrderSchema).optional(),
  recentShowTime: z.lazy(() => SortOrderSchema).optional(),
  case: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProblemSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProblemSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeLimit: z.lazy(() => SortOrderSchema).optional(),
  memoryLimit: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const RefreshTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  jwtId: z.lazy(() => SortOrderSchema).optional(),
  used: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  jwtId: z.lazy(() => SortOrderSchema).optional(),
  used: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  jwtId: z.lazy(() => SortOrderSchema).optional(),
  used: z.lazy(() => SortOrderSchema).optional(),
  expiryDate: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenSumOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSubmissionStatusFilterSchema: z.ZodType<Prisma.EnumSubmissionStatusFilter> = z.object({
  equals: z.lazy(() => SubmissionStatusSchema).optional(),
  in: z.lazy(() => SubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => NestedEnumSubmissionStatusFilterSchema) ]).optional(),
}).strict();

export const SubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errmsg: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  sourceCode: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  public: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubmissionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errmsg: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  sourceCode: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  public: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  errmsg: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  sourceCode: z.lazy(() => SortOrderSchema).optional(),
  language: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional(),
  public: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SubmissionSumOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  problemId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  timeUsed: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumSubmissionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSubmissionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SubmissionStatusSchema).optional(),
  in: z.lazy(() => SubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => NestedEnumSubmissionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSubmissionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSubmissionStatusFilterSchema).optional()
}).strict();

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const ChatListRelationFilterSchema: z.ZodType<Prisma.ChatListRelationFilter> = z.object({
  every: z.lazy(() => ChatWhereInputSchema).optional(),
  some: z.lazy(() => ChatWhereInputSchema).optional(),
  none: z.lazy(() => ChatWhereInputSchema).optional()
}).strict();

export const ChatOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ChatOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  showName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  showName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  showName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  creationDate: z.lazy(() => SortOrderSchema).optional(),
  updateDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const UserContestUserIdContestIdCompoundUniqueInputSchema: z.ZodType<Prisma.UserContestUserIdContestIdCompoundUniqueInput> = z.object({
  userId: z.number(),
  contestId: z.number()
}).strict();

export const UserContestCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserContestCountOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserContestAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserContestAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserContestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserContestMaxOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserContestMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserContestMinOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserContestSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserContestSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  contestId: z.lazy(() => SortOrderSchema).optional(),
  rank: z.lazy(() => SortOrderSchema).optional(),
  ratingAfterUpdate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserCreateNestedOneWithoutChatInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutChatInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutChatInputSchema),z.lazy(() => UserUncheckedCreateWithoutChatInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutChatInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateOneRequiredWithoutChatNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutChatNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutChatInputSchema),z.lazy(() => UserUncheckedCreateWithoutChatInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutChatInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutChatInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutChatInputSchema),z.lazy(() => UserUncheckedUpdateWithoutChatInputSchema) ]).optional(),
}).strict();

export const ContestProblemCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutContestInputSchema),z.lazy(() => ContestProblemCreateWithoutContestInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyContestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserContestCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.UserContestCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutContestInputSchema),z.lazy(() => UserContestCreateWithoutContestInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyContestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContestProblemUncheckedCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUncheckedCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutContestInputSchema),z.lazy(() => ContestProblemCreateWithoutContestInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyContestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserContestUncheckedCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.UserContestUncheckedCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutContestInputSchema),z.lazy(() => UserContestCreateWithoutContestInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyContestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumContestModeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumContestModeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ContestModeSchema).optional()
}).strict();

export const EnumContestGradingModeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumContestGradingModeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ContestGradingModeSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ContestProblemUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.ContestProblemUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutContestInputSchema),z.lazy(() => ContestProblemCreateWithoutContestInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyContestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestProblemUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => ContestProblemUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestProblemScalarWhereInputSchema),z.lazy(() => ContestProblemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserContestUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.UserContestUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutContestInputSchema),z.lazy(() => UserContestCreateWithoutContestInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserContestUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => UserContestUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyContestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserContestUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => UserContestUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserContestUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => UserContestUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserContestScalarWhereInputSchema),z.lazy(() => UserContestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContestProblemUncheckedUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutContestInputSchema),z.lazy(() => ContestProblemCreateWithoutContestInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyContestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestProblemUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => ContestProblemUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestProblemScalarWhereInputSchema),z.lazy(() => ContestProblemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserContestUncheckedUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutContestInputSchema),z.lazy(() => UserContestCreateWithoutContestInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserContestUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => UserContestUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyContestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserContestUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => UserContestUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserContestUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => UserContestUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserContestScalarWhereInputSchema),z.lazy(() => UserContestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContestCreateNestedOneWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestCreateNestedOneWithoutContestProblemInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutContestProblemInputSchema),z.lazy(() => ContestUncheckedCreateWithoutContestProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutContestProblemInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional()
}).strict();

export const ProblemCreateNestedOneWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutContestProblemInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutContestProblemInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutContestProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutContestProblemInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional()
}).strict();

export const ContestUpdateOneRequiredWithoutContestProblemNestedInputSchema: z.ZodType<Prisma.ContestUpdateOneRequiredWithoutContestProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutContestProblemInputSchema),z.lazy(() => ContestUncheckedCreateWithoutContestProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutContestProblemInputSchema).optional(),
  upsert: z.lazy(() => ContestUpsertWithoutContestProblemInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContestUpdateWithoutContestProblemInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutContestProblemInputSchema) ]).optional(),
}).strict();

export const ProblemUpdateOneRequiredWithoutContestProblemNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneRequiredWithoutContestProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutContestProblemInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutContestProblemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutContestProblemInputSchema).optional(),
  upsert: z.lazy(() => ProblemUpsertWithoutContestProblemInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProblemUpdateWithoutContestProblemInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutContestProblemInputSchema) ]).optional(),
}).strict();

export const ContestProblemCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemCreateNestedManyWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateWithoutProblemInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyProblemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SubmissionCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionCreateNestedManyWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutProblemInputSchema),z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContestProblemUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUncheckedCreateNestedManyWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateWithoutProblemInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyProblemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutProblemInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutProblemInputSchema),z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const ContestProblemUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ContestProblemUpdateManyWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateWithoutProblemInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyProblemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestProblemUpdateManyWithWhereWithoutProblemInputSchema),z.lazy(() => ContestProblemUpdateManyWithWhereWithoutProblemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestProblemScalarWhereInputSchema),z.lazy(() => ContestProblemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubmissionUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutProblemInputSchema),z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContestProblemUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateManyWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateWithoutProblemInputSchema).array(),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema),z.lazy(() => ContestProblemCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ContestProblemUpsertWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContestProblemCreateManyProblemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestProblemWhereUniqueInputSchema),z.lazy(() => ContestProblemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => ContestProblemUpdateWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestProblemUpdateManyWithWhereWithoutProblemInputSchema),z.lazy(() => ContestProblemUpdateManyWithWhereWithoutProblemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestProblemScalarWhereInputSchema),z.lazy(() => ContestProblemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutProblemNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutProblemInputSchema),z.lazy(() => SubmissionCreateWithoutProblemInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutProblemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyProblemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutProblemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProblemCreateNestedOneWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemCreateNestedOneWithoutSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutSubmissionInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutSubmissionInputSchema).optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutSubmissionInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubmissionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const EnumSubmissionStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSubmissionStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SubmissionStatusSchema).optional()
}).strict();

export const ProblemUpdateOneWithoutSubmissionNestedInputSchema: z.ZodType<Prisma.ProblemUpdateOneWithoutSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProblemCreateWithoutSubmissionInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProblemCreateOrConnectWithoutSubmissionInputSchema).optional(),
  upsert: z.lazy(() => ProblemUpsertWithoutSubmissionInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => ProblemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProblemUpdateWithoutSubmissionInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutSubmissionInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutSubmissionNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubmissionInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSubmissionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutSubmissionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubmissionInputSchema) ]).optional(),
}).strict();

export const ChatCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ChatCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ChatCreateWithoutUserInputSchema),z.lazy(() => ChatCreateWithoutUserInputSchema).array(),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChatCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SubmissionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SubmissionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutUserInputSchema),z.lazy(() => SubmissionCreateWithoutUserInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserContestCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserContestCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutUserInputSchema),z.lazy(() => UserContestCreateWithoutUserInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ChatUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ChatUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ChatCreateWithoutUserInputSchema),z.lazy(() => ChatCreateWithoutUserInputSchema).array(),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChatCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SubmissionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutUserInputSchema),z.lazy(() => SubmissionCreateWithoutUserInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserContestUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserContestUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutUserInputSchema),z.lazy(() => UserContestCreateWithoutUserInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional()
}).strict();

export const ChatUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ChatUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChatCreateWithoutUserInputSchema),z.lazy(() => ChatCreateWithoutUserInputSchema).array(),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ChatUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChatUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChatCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ChatUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChatUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ChatUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ChatUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ChatScalarWhereInputSchema),z.lazy(() => ChatScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubmissionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutUserInputSchema),z.lazy(() => SubmissionCreateWithoutUserInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserContestUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserContestUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutUserInputSchema),z.lazy(() => UserContestCreateWithoutUserInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserContestUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserContestUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserContestUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserContestUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserContestUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserContestUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserContestScalarWhereInputSchema),z.lazy(() => UserContestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChatUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChatCreateWithoutUserInputSchema),z.lazy(() => ChatCreateWithoutUserInputSchema).array(),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChatCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ChatUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChatUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChatCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ChatWhereUniqueInputSchema),z.lazy(() => ChatWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ChatUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChatUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ChatUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ChatUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ChatScalarWhereInputSchema),z.lazy(() => ChatScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SubmissionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutUserInputSchema),z.lazy(() => SubmissionCreateWithoutUserInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SubmissionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserContestUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserContestCreateWithoutUserInputSchema),z.lazy(() => UserContestCreateWithoutUserInputSchema).array(),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserContestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserContestUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserContestUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserContestCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserContestWhereUniqueInputSchema),z.lazy(() => UserContestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserContestUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserContestUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserContestUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserContestUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserContestScalarWhereInputSchema),z.lazy(() => UserContestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContestCreateNestedOneWithoutUserContestInputSchema: z.ZodType<Prisma.ContestCreateNestedOneWithoutUserContestInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutUserContestInputSchema),z.lazy(() => ContestUncheckedCreateWithoutUserContestInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutUserContestInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutUserContestInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserContestInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserContestInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserContestInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserContestInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ContestUpdateOneRequiredWithoutUserContestNestedInputSchema: z.ZodType<Prisma.ContestUpdateOneRequiredWithoutUserContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutUserContestInputSchema),z.lazy(() => ContestUncheckedCreateWithoutUserContestInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutUserContestInputSchema).optional(),
  upsert: z.lazy(() => ContestUpsertWithoutUserContestInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContestUpdateWithoutUserContestInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutUserContestInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutUserContestNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserContestInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserContestInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserContestInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserContestInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutUserContestInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserContestInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValue.optional().nullable(),
  array_starts_with: InputJsonValue.optional().nullable(),
  array_ends_with: InputJsonValue.optional().nullable(),
  lt: InputJsonValue.optional(),
  lte: InputJsonValue.optional(),
  gt: InputJsonValue.optional(),
  gte: InputJsonValue.optional(),
  not: z.union([ InputJsonValue,z.lazy(() => JsonNullValueFilterSchema) ]).optional(),
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumContestModeFilterSchema: z.ZodType<Prisma.NestedEnumContestModeFilter> = z.object({
  equals: z.lazy(() => ContestModeSchema).optional(),
  in: z.lazy(() => ContestModeSchema).array().optional(),
  notIn: z.lazy(() => ContestModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => NestedEnumContestModeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumContestGradingModeFilterSchema: z.ZodType<Prisma.NestedEnumContestGradingModeFilter> = z.object({
  equals: z.lazy(() => ContestGradingModeSchema).optional(),
  in: z.lazy(() => ContestGradingModeSchema).array().optional(),
  notIn: z.lazy(() => ContestGradingModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => NestedEnumContestGradingModeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedEnumContestModeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumContestModeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContestModeSchema).optional(),
  in: z.lazy(() => ContestModeSchema).array().optional(),
  notIn: z.lazy(() => ContestModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => NestedEnumContestModeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContestModeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContestModeFilterSchema).optional()
}).strict();

export const NestedEnumContestGradingModeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumContestGradingModeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ContestGradingModeSchema).optional(),
  in: z.lazy(() => ContestGradingModeSchema).array().optional(),
  notIn: z.lazy(() => ContestGradingModeSchema).array().optional(),
  not: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => NestedEnumContestGradingModeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumContestGradingModeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumContestGradingModeFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumSubmissionStatusFilterSchema: z.ZodType<Prisma.NestedEnumSubmissionStatusFilter> = z.object({
  equals: z.lazy(() => SubmissionStatusSchema).optional(),
  in: z.lazy(() => SubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => NestedEnumSubmissionStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSubmissionStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSubmissionStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SubmissionStatusSchema).optional(),
  in: z.lazy(() => SubmissionStatusSchema).array().optional(),
  notIn: z.lazy(() => SubmissionStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => NestedEnumSubmissionStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSubmissionStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSubmissionStatusFilterSchema).optional()
}).strict();

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const UserCreateWithoutChatInputSchema: z.ZodType<Prisma.UserCreateWithoutChatInput> = z.object({
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  submission: z.lazy(() => SubmissionCreateNestedManyWithoutUserInputSchema).optional(),
  userContest: z.lazy(() => UserContestCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutChatInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutChatInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  submission: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutChatInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutChatInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutChatInputSchema),z.lazy(() => UserUncheckedCreateWithoutChatInputSchema) ]),
}).strict();

export const UserUpsertWithoutChatInputSchema: z.ZodType<Prisma.UserUpsertWithoutChatInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutChatInputSchema),z.lazy(() => UserUncheckedUpdateWithoutChatInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutChatInputSchema),z.lazy(() => UserUncheckedCreateWithoutChatInputSchema) ]),
}).strict();

export const UserUpdateWithoutChatInputSchema: z.ZodType<Prisma.UserUpdateWithoutChatInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submission: z.lazy(() => SubmissionUpdateManyWithoutUserNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutChatInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutChatInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submission: z.lazy(() => SubmissionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ContestProblemCreateWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemCreateWithoutContestInput> = z.object({
  problem: z.lazy(() => ProblemCreateNestedOneWithoutContestProblemInputSchema)
}).strict();

export const ContestProblemUncheckedCreateWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUncheckedCreateWithoutContestInput> = z.object({
  problemId: z.number().int()
}).strict();

export const ContestProblemCreateOrConnectWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemCreateOrConnectWithoutContestInput> = z.object({
  where: z.lazy(() => ContestProblemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema) ]),
}).strict();

export const ContestProblemCreateManyContestInputEnvelopeSchema: z.ZodType<Prisma.ContestProblemCreateManyContestInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContestProblemCreateManyContestInputSchema),z.lazy(() => ContestProblemCreateManyContestInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserContestCreateWithoutContestInputSchema: z.ZodType<Prisma.UserContestCreateWithoutContestInput> = z.object({
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserContestInputSchema)
}).strict();

export const UserContestUncheckedCreateWithoutContestInputSchema: z.ZodType<Prisma.UserContestUncheckedCreateWithoutContestInput> = z.object({
  userId: z.number().int(),
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable()
}).strict();

export const UserContestCreateOrConnectWithoutContestInputSchema: z.ZodType<Prisma.UserContestCreateOrConnectWithoutContestInput> = z.object({
  where: z.lazy(() => UserContestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserContestCreateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema) ]),
}).strict();

export const UserContestCreateManyContestInputEnvelopeSchema: z.ZodType<Prisma.UserContestCreateManyContestInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserContestCreateManyContestInputSchema),z.lazy(() => UserContestCreateManyContestInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ContestProblemUpsertWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUpsertWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => ContestProblemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContestProblemUpdateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedUpdateWithoutContestInputSchema) ]),
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutContestInputSchema) ]),
}).strict();

export const ContestProblemUpdateWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUpdateWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => ContestProblemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContestProblemUpdateWithoutContestInputSchema),z.lazy(() => ContestProblemUncheckedUpdateWithoutContestInputSchema) ]),
}).strict();

export const ContestProblemUpdateManyWithWhereWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUpdateManyWithWhereWithoutContestInput> = z.object({
  where: z.lazy(() => ContestProblemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContestProblemUpdateManyMutationInputSchema),z.lazy(() => ContestProblemUncheckedUpdateManyWithoutContestProblemInputSchema) ]),
}).strict();

export const ContestProblemScalarWhereInputSchema: z.ZodType<Prisma.ContestProblemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContestProblemScalarWhereInputSchema),z.lazy(() => ContestProblemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestProblemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestProblemScalarWhereInputSchema),z.lazy(() => ContestProblemScalarWhereInputSchema).array() ]).optional(),
  contestId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const UserContestUpsertWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.UserContestUpsertWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => UserContestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserContestUpdateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedUpdateWithoutContestInputSchema) ]),
  create: z.union([ z.lazy(() => UserContestCreateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutContestInputSchema) ]),
}).strict();

export const UserContestUpdateWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.UserContestUpdateWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => UserContestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserContestUpdateWithoutContestInputSchema),z.lazy(() => UserContestUncheckedUpdateWithoutContestInputSchema) ]),
}).strict();

export const UserContestUpdateManyWithWhereWithoutContestInputSchema: z.ZodType<Prisma.UserContestUpdateManyWithWhereWithoutContestInput> = z.object({
  where: z.lazy(() => UserContestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserContestUpdateManyMutationInputSchema),z.lazy(() => UserContestUncheckedUpdateManyWithoutUserContestInputSchema) ]),
}).strict();

export const UserContestScalarWhereInputSchema: z.ZodType<Prisma.UserContestScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserContestScalarWhereInputSchema),z.lazy(() => UserContestScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserContestScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserContestScalarWhereInputSchema),z.lazy(() => UserContestScalarWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contestId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rank: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const ContestCreateWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestCreateWithoutContestProblemInput> = z.object({
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable(),
  userContest: z.lazy(() => UserContestCreateNestedManyWithoutContestInputSchema).optional()
}).strict();

export const ContestUncheckedCreateWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestUncheckedCreateWithoutContestProblemInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable(),
  userContest: z.lazy(() => UserContestUncheckedCreateNestedManyWithoutContestInputSchema).optional()
}).strict();

export const ContestCreateOrConnectWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestCreateOrConnectWithoutContestProblemInput> = z.object({
  where: z.lazy(() => ContestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestCreateWithoutContestProblemInputSchema),z.lazy(() => ContestUncheckedCreateWithoutContestProblemInputSchema) ]),
}).strict();

export const ProblemCreateWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemCreateWithoutContestProblemInput> = z.object({
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  submission: z.lazy(() => SubmissionCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUncheckedCreateWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutContestProblemInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  submission: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemCreateOrConnectWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutContestProblemInput> = z.object({
  where: z.lazy(() => ProblemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProblemCreateWithoutContestProblemInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutContestProblemInputSchema) ]),
}).strict();

export const ContestUpsertWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestUpsertWithoutContestProblemInput> = z.object({
  update: z.union([ z.lazy(() => ContestUpdateWithoutContestProblemInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutContestProblemInputSchema) ]),
  create: z.union([ z.lazy(() => ContestCreateWithoutContestProblemInputSchema),z.lazy(() => ContestUncheckedCreateWithoutContestProblemInputSchema) ]),
}).strict();

export const ContestUpdateWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestUpdateWithoutContestProblemInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userContest: z.lazy(() => UserContestUpdateManyWithoutContestNestedInputSchema).optional()
}).strict();

export const ContestUncheckedUpdateWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateWithoutContestProblemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userContest: z.lazy(() => UserContestUncheckedUpdateManyWithoutContestNestedInputSchema).optional()
}).strict();

export const ProblemUpsertWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutContestProblemInput> = z.object({
  update: z.union([ z.lazy(() => ProblemUpdateWithoutContestProblemInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutContestProblemInputSchema) ]),
  create: z.union([ z.lazy(() => ProblemCreateWithoutContestProblemInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutContestProblemInputSchema) ]),
}).strict();

export const ProblemUpdateWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutContestProblemInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  submission: z.lazy(() => SubmissionUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemUncheckedUpdateWithoutContestProblemInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutContestProblemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  submission: z.lazy(() => SubmissionUncheckedUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ContestProblemCreateWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemCreateWithoutProblemInput> = z.object({
  contest: z.lazy(() => ContestCreateNestedOneWithoutContestProblemInputSchema)
}).strict();

export const ContestProblemUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUncheckedCreateWithoutProblemInput> = z.object({
  contestId: z.number().int()
}).strict();

export const ContestProblemCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemCreateOrConnectWithoutProblemInput> = z.object({
  where: z.lazy(() => ContestProblemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const ContestProblemCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.ContestProblemCreateManyProblemInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContestProblemCreateManyProblemInputSchema),z.lazy(() => ContestProblemCreateManyProblemInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SubmissionCreateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutProblemInput> = z.object({
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutSubmissionInputSchema)
}).strict();

export const SubmissionUncheckedCreateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutProblemInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable()
}).strict();

export const SubmissionCreateOrConnectWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutProblemInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const SubmissionCreateManyProblemInputEnvelopeSchema: z.ZodType<Prisma.SubmissionCreateManyProblemInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SubmissionCreateManyProblemInputSchema),z.lazy(() => SubmissionCreateManyProblemInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ContestProblemUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUpsertWithWhereUniqueWithoutProblemInput> = z.object({
  where: z.lazy(() => ContestProblemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContestProblemUpdateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedUpdateWithoutProblemInputSchema) ]),
  create: z.union([ z.lazy(() => ContestProblemCreateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const ContestProblemUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUpdateWithWhereUniqueWithoutProblemInput> = z.object({
  where: z.lazy(() => ContestProblemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContestProblemUpdateWithoutProblemInputSchema),z.lazy(() => ContestProblemUncheckedUpdateWithoutProblemInputSchema) ]),
}).strict();

export const ContestProblemUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUpdateManyWithWhereWithoutProblemInput> = z.object({
  where: z.lazy(() => ContestProblemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContestProblemUpdateManyMutationInputSchema),z.lazy(() => ContestProblemUncheckedUpdateManyWithoutContestProblemInputSchema) ]),
}).strict();

export const SubmissionUpsertWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutProblemInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SubmissionUpdateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutProblemInputSchema) ]),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutProblemInputSchema) ]),
}).strict();

export const SubmissionUpdateWithWhereUniqueWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutProblemInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateWithoutProblemInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutProblemInputSchema) ]),
}).strict();

export const SubmissionUpdateManyWithWhereWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutProblemInput> = z.object({
  where: z.lazy(() => SubmissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateManyMutationInputSchema),z.lazy(() => SubmissionUncheckedUpdateManyWithoutSubmissionInputSchema) ]),
}).strict();

export const SubmissionScalarWhereInputSchema: z.ZodType<Prisma.SubmissionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  problemId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  result: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  timeUsed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  status: z.union([ z.lazy(() => EnumSubmissionStatusFilterSchema),z.lazy(() => SubmissionStatusSchema) ]).optional(),
  errmsg: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contestId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  sourceCode: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  language: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  public: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
}).strict();

export const ProblemCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemCreateWithoutSubmissionInput> = z.object({
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemUncheckedCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemUncheckedCreateWithoutSubmissionInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  sname: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeLimit: z.number().int().optional().nullable(),
  memoryLimit: z.number().int().optional().nullable(),
  show: z.boolean(),
  recentShowTime: z.coerce.date().optional().nullable(),
  case: z.string().optional().nullable(),
  rating: z.number().int().optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemUncheckedCreateNestedManyWithoutProblemInputSchema).optional()
}).strict();

export const ProblemCreateOrConnectWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemCreateOrConnectWithoutSubmissionInput> = z.object({
  where: z.lazy(() => ProblemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProblemCreateWithoutSubmissionInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutSubmissionInputSchema) ]),
}).strict();

export const UserCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.UserCreateWithoutSubmissionInput> = z.object({
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  chat: z.lazy(() => ChatCreateNestedManyWithoutUserInputSchema).optional(),
  userContest: z.lazy(() => UserContestCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSubmissionInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  chat: z.lazy(() => ChatUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSubmissionInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSubmissionInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionInputSchema) ]),
}).strict();

export const ProblemUpsertWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemUpsertWithoutSubmissionInput> = z.object({
  update: z.union([ z.lazy(() => ProblemUpdateWithoutSubmissionInputSchema),z.lazy(() => ProblemUncheckedUpdateWithoutSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => ProblemCreateWithoutSubmissionInputSchema),z.lazy(() => ProblemUncheckedCreateWithoutSubmissionInputSchema) ]),
}).strict();

export const ProblemUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemUpdateWithoutSubmissionInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const ProblemUncheckedUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.ProblemUncheckedUpdateWithoutSubmissionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  memoryLimit: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  show: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  recentShowTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  case: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  examples: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValue ]).optional(),
  contestProblem: z.lazy(() => ContestProblemUncheckedUpdateManyWithoutProblemNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutSubmissionInputSchema: z.ZodType<Prisma.UserUpsertWithoutSubmissionInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSubmissionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionInputSchema) ]),
}).strict();

export const UserUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.UserUpdateWithoutSubmissionInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  chat: z.lazy(() => ChatUpdateManyWithoutUserNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSubmissionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  chat: z.lazy(() => ChatUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  userContest: z.lazy(() => UserContestUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ChatCreateWithoutUserInputSchema: z.ZodType<Prisma.ChatCreateWithoutUserInput> = z.object({
  message: z.string(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const ChatUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ChatUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  message: z.string(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const ChatCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ChatCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ChatWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChatCreateWithoutUserInputSchema),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ChatCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ChatCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ChatCreateManyUserInputSchema),z.lazy(() => ChatCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SubmissionCreateWithoutUserInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutUserInput> = z.object({
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable(),
  problem: z.lazy(() => ProblemCreateNestedOneWithoutSubmissionInputSchema).optional()
}).strict();

export const SubmissionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int().optional().nullable(),
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable()
}).strict();

export const SubmissionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SubmissionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SubmissionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SubmissionCreateManyUserInputSchema),z.lazy(() => SubmissionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserContestCreateWithoutUserInputSchema: z.ZodType<Prisma.UserContestCreateWithoutUserInput> = z.object({
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable(),
  contest: z.lazy(() => ContestCreateNestedOneWithoutUserContestInputSchema)
}).strict();

export const UserContestUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserContestUncheckedCreateWithoutUserInput> = z.object({
  contestId: z.number().int(),
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable()
}).strict();

export const UserContestCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserContestCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserContestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserContestCreateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserContestCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserContestCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserContestCreateManyUserInputSchema),z.lazy(() => UserContestCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ChatUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ChatUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ChatWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ChatUpdateWithoutUserInputSchema),z.lazy(() => ChatUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ChatCreateWithoutUserInputSchema),z.lazy(() => ChatUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ChatUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ChatUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ChatWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ChatUpdateWithoutUserInputSchema),z.lazy(() => ChatUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ChatUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ChatUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ChatScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ChatUpdateManyMutationInputSchema),z.lazy(() => ChatUncheckedUpdateManyWithoutChatInputSchema) ]),
}).strict();

export const ChatScalarWhereInputSchema: z.ZodType<Prisma.ChatScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChatScalarWhereInputSchema),z.lazy(() => ChatScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChatScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChatScalarWhereInputSchema),z.lazy(() => ChatScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creationDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updateDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SubmissionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SubmissionUpdateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SubmissionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateWithoutUserInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SubmissionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SubmissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateManyMutationInputSchema),z.lazy(() => SubmissionUncheckedUpdateManyWithoutSubmissionInputSchema) ]),
}).strict();

export const UserContestUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserContestUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserContestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserContestUpdateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserContestCreateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserContestUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserContestUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserContestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserContestUpdateWithoutUserInputSchema),z.lazy(() => UserContestUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserContestUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserContestUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserContestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserContestUpdateManyMutationInputSchema),z.lazy(() => UserContestUncheckedUpdateManyWithoutUserContestInputSchema) ]),
}).strict();

export const ContestCreateWithoutUserContestInputSchema: z.ZodType<Prisma.ContestCreateWithoutUserContestInput> = z.object({
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemCreateNestedManyWithoutContestInputSchema).optional()
}).strict();

export const ContestUncheckedCreateWithoutUserContestInputSchema: z.ZodType<Prisma.ContestUncheckedCreateWithoutUserContestInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  mode: z.lazy(() => ContestModeSchema),
  gradingMode: z.lazy(() => ContestGradingModeSchema),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  announce: z.string().optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemUncheckedCreateNestedManyWithoutContestInputSchema).optional()
}).strict();

export const ContestCreateOrConnectWithoutUserContestInputSchema: z.ZodType<Prisma.ContestCreateOrConnectWithoutUserContestInput> = z.object({
  where: z.lazy(() => ContestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestCreateWithoutUserContestInputSchema),z.lazy(() => ContestUncheckedCreateWithoutUserContestInputSchema) ]),
}).strict();

export const UserCreateWithoutUserContestInputSchema: z.ZodType<Prisma.UserCreateWithoutUserContestInput> = z.object({
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  chat: z.lazy(() => ChatCreateNestedManyWithoutUserInputSchema).optional(),
  submission: z.lazy(() => SubmissionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUserContestInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserContestInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  showName: z.string(),
  email: z.string().optional().nullable(),
  password: z.string(),
  role: z.lazy(() => UserRoleSchema),
  rating: z.number().int().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  chat: z.lazy(() => ChatUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  submission: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUserContestInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserContestInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserContestInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserContestInputSchema) ]),
}).strict();

export const ContestUpsertWithoutUserContestInputSchema: z.ZodType<Prisma.ContestUpsertWithoutUserContestInput> = z.object({
  update: z.union([ z.lazy(() => ContestUpdateWithoutUserContestInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutUserContestInputSchema) ]),
  create: z.union([ z.lazy(() => ContestCreateWithoutUserContestInputSchema),z.lazy(() => ContestUncheckedCreateWithoutUserContestInputSchema) ]),
}).strict();

export const ContestUpdateWithoutUserContestInputSchema: z.ZodType<Prisma.ContestUpdateWithoutUserContestInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemUpdateManyWithoutContestNestedInputSchema).optional()
}).strict();

export const ContestUncheckedUpdateWithoutUserContestInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateWithoutUserContestInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mode: z.union([ z.lazy(() => ContestModeSchema),z.lazy(() => EnumContestModeFieldUpdateOperationsInputSchema) ]).optional(),
  gradingMode: z.union([ z.lazy(() => ContestGradingModeSchema),z.lazy(() => EnumContestGradingModeFieldUpdateOperationsInputSchema) ]).optional(),
  timeStart: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timeEnd: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  announce: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestProblem: z.lazy(() => ContestProblemUncheckedUpdateManyWithoutContestNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutUserContestInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserContestInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserContestInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserContestInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserContestInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserContestInputSchema) ]),
}).strict();

export const UserUpdateWithoutUserContestInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserContestInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  chat: z.lazy(() => ChatUpdateManyWithoutUserNestedInputSchema).optional(),
  submission: z.lazy(() => SubmissionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUserContestInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserContestInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  showName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  chat: z.lazy(() => ChatUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  submission: z.lazy(() => SubmissionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ContestProblemCreateManyContestInputSchema: z.ZodType<Prisma.ContestProblemCreateManyContestInput> = z.object({
  problemId: z.number().int()
}).strict();

export const UserContestCreateManyContestInputSchema: z.ZodType<Prisma.UserContestCreateManyContestInput> = z.object({
  userId: z.number().int(),
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable()
}).strict();

export const ContestProblemUpdateWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUpdateWithoutContestInput> = z.object({
  problem: z.lazy(() => ProblemUpdateOneRequiredWithoutContestProblemNestedInputSchema).optional()
}).strict();

export const ContestProblemUncheckedUpdateWithoutContestInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateWithoutContestInput> = z.object({
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContestProblemUncheckedUpdateManyWithoutContestProblemInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateManyWithoutContestProblemInput> = z.object({
  problemId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserContestUpdateWithoutContestInputSchema: z.ZodType<Prisma.UserContestUpdateWithoutContestInput> = z.object({
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserContestNestedInputSchema).optional()
}).strict();

export const UserContestUncheckedUpdateWithoutContestInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateWithoutContestInput> = z.object({
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserContestUncheckedUpdateManyWithoutUserContestInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateManyWithoutUserContestInput> = z.object({
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContestProblemCreateManyProblemInputSchema: z.ZodType<Prisma.ContestProblemCreateManyProblemInput> = z.object({
  contestId: z.number().int()
}).strict();

export const SubmissionCreateManyProblemInputSchema: z.ZodType<Prisma.SubmissionCreateManyProblemInput> = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable()
}).strict();

export const ContestProblemUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUpdateWithoutProblemInput> = z.object({
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutContestProblemNestedInputSchema).optional()
}).strict();

export const ContestProblemUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.ContestProblemUncheckedUpdateWithoutProblemInput> = z.object({
  contestId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SubmissionUpdateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutProblemInput> = z.object({
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSubmissionNestedInputSchema).optional()
}).strict();

export const SubmissionUncheckedUpdateWithoutProblemInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutProblemInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubmissionUncheckedUpdateManyWithoutSubmissionInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutSubmissionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ChatCreateManyUserInputSchema: z.ZodType<Prisma.ChatCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  message: z.string(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable()
}).strict();

export const SubmissionCreateManyUserInputSchema: z.ZodType<Prisma.SubmissionCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  problemId: z.number().int().optional().nullable(),
  result: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  timeUsed: z.number().int().optional().nullable(),
  status: z.lazy(() => SubmissionStatusSchema),
  errmsg: z.string().optional().nullable(),
  contestId: z.number().int().optional().nullable(),
  sourceCode: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  creationDate: z.coerce.date().optional().nullable(),
  updateDate: z.coerce.date().optional().nullable(),
  public: z.boolean().optional().nullable()
}).strict();

export const UserContestCreateManyUserInputSchema: z.ZodType<Prisma.UserContestCreateManyUserInput> = z.object({
  contestId: z.number().int(),
  rank: z.number().int().optional().nullable(),
  ratingAfterUpdate: z.number().int().optional().nullable()
}).strict();

export const ChatUpdateWithoutUserInputSchema: z.ZodType<Prisma.ChatUpdateWithoutUserInput> = z.object({
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ChatUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ChatUncheckedUpdateManyWithoutChatInputSchema: z.ZodType<Prisma.ChatUncheckedUpdateManyWithoutChatInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SubmissionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutUserInput> = z.object({
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  problem: z.lazy(() => ProblemUpdateOneWithoutSubmissionNestedInputSchema).optional()
}).strict();

export const SubmissionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  problemId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timeUsed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.lazy(() => SubmissionStatusSchema),z.lazy(() => EnumSubmissionStatusFieldUpdateOperationsInputSchema) ]).optional(),
  errmsg: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contestId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  creationDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updateDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  public: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserContestUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserContestUpdateWithoutUserInput> = z.object({
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutUserContestNestedInputSchema).optional()
}).strict();

export const UserContestUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserContestUncheckedUpdateWithoutUserInput> = z.object({
  contestId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rank: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ratingAfterUpdate: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AnnouncementFindFirstArgsSchema: z.ZodType<Prisma.AnnouncementFindFirstArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereInputSchema.optional(),
  orderBy: z.union([ AnnouncementOrderByWithRelationInputSchema.array(),AnnouncementOrderByWithRelationInputSchema ]).optional(),
  cursor: AnnouncementWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AnnouncementScalarFieldEnumSchema.array().optional(),
}).strict()

export const AnnouncementFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AnnouncementFindFirstOrThrowArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereInputSchema.optional(),
  orderBy: z.union([ AnnouncementOrderByWithRelationInputSchema.array(),AnnouncementOrderByWithRelationInputSchema ]).optional(),
  cursor: AnnouncementWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AnnouncementScalarFieldEnumSchema.array().optional(),
}).strict()

export const AnnouncementFindManyArgsSchema: z.ZodType<Prisma.AnnouncementFindManyArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereInputSchema.optional(),
  orderBy: z.union([ AnnouncementOrderByWithRelationInputSchema.array(),AnnouncementOrderByWithRelationInputSchema ]).optional(),
  cursor: AnnouncementWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: AnnouncementScalarFieldEnumSchema.array().optional(),
}).strict()

export const AnnouncementAggregateArgsSchema: z.ZodType<Prisma.AnnouncementAggregateArgs> = z.object({
  where: AnnouncementWhereInputSchema.optional(),
  orderBy: z.union([ AnnouncementOrderByWithRelationInputSchema.array(),AnnouncementOrderByWithRelationInputSchema ]).optional(),
  cursor: AnnouncementWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AnnouncementGroupByArgsSchema: z.ZodType<Prisma.AnnouncementGroupByArgs> = z.object({
  where: AnnouncementWhereInputSchema.optional(),
  orderBy: z.union([ AnnouncementOrderByWithAggregationInputSchema.array(),AnnouncementOrderByWithAggregationInputSchema ]).optional(),
  by: AnnouncementScalarFieldEnumSchema.array(),
  having: AnnouncementScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const AnnouncementFindUniqueArgsSchema: z.ZodType<Prisma.AnnouncementFindUniqueArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereUniqueInputSchema,
}).strict()

export const AnnouncementFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AnnouncementFindUniqueOrThrowArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereUniqueInputSchema,
}).strict()

export const ChatFindFirstArgsSchema: z.ZodType<Prisma.ChatFindFirstArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ChatScalarFieldEnumSchema.array().optional(),
}).strict()

export const ChatFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ChatFindFirstOrThrowArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ChatScalarFieldEnumSchema.array().optional(),
}).strict()

export const ChatFindManyArgsSchema: z.ZodType<Prisma.ChatFindManyArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ChatScalarFieldEnumSchema.array().optional(),
}).strict()

export const ChatAggregateArgsSchema: z.ZodType<Prisma.ChatAggregateArgs> = z.object({
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithRelationInputSchema.array(),ChatOrderByWithRelationInputSchema ]).optional(),
  cursor: ChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ChatGroupByArgsSchema: z.ZodType<Prisma.ChatGroupByArgs> = z.object({
  where: ChatWhereInputSchema.optional(),
  orderBy: z.union([ ChatOrderByWithAggregationInputSchema.array(),ChatOrderByWithAggregationInputSchema ]).optional(),
  by: ChatScalarFieldEnumSchema.array(),
  having: ChatScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ChatFindUniqueArgsSchema: z.ZodType<Prisma.ChatFindUniqueArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ChatFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ChatFindUniqueOrThrowArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ContestFindFirstArgsSchema: z.ZodType<Prisma.ContestFindFirstArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ContestScalarFieldEnumSchema.array().optional(),
}).strict()

export const ContestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContestFindFirstOrThrowArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ContestScalarFieldEnumSchema.array().optional(),
}).strict()

export const ContestFindManyArgsSchema: z.ZodType<Prisma.ContestFindManyArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ContestScalarFieldEnumSchema.array().optional(),
}).strict()

export const ContestAggregateArgsSchema: z.ZodType<Prisma.ContestAggregateArgs> = z.object({
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ContestGroupByArgsSchema: z.ZodType<Prisma.ContestGroupByArgs> = z.object({
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithAggregationInputSchema.array(),ContestOrderByWithAggregationInputSchema ]).optional(),
  by: ContestScalarFieldEnumSchema.array(),
  having: ContestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ContestFindUniqueArgsSchema: z.ZodType<Prisma.ContestFindUniqueArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
}).strict()

export const ContestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContestFindUniqueOrThrowArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
}).strict()

export const ContestProblemFindFirstArgsSchema: z.ZodType<Prisma.ContestProblemFindFirstArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereInputSchema.optional(),
  orderBy: z.union([ ContestProblemOrderByWithRelationInputSchema.array(),ContestProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ContestProblemScalarFieldEnumSchema.array().optional(),
}).strict()

export const ContestProblemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContestProblemFindFirstOrThrowArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereInputSchema.optional(),
  orderBy: z.union([ ContestProblemOrderByWithRelationInputSchema.array(),ContestProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ContestProblemScalarFieldEnumSchema.array().optional(),
}).strict()

export const ContestProblemFindManyArgsSchema: z.ZodType<Prisma.ContestProblemFindManyArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereInputSchema.optional(),
  orderBy: z.union([ ContestProblemOrderByWithRelationInputSchema.array(),ContestProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ContestProblemScalarFieldEnumSchema.array().optional(),
}).strict()

export const ContestProblemAggregateArgsSchema: z.ZodType<Prisma.ContestProblemAggregateArgs> = z.object({
  where: ContestProblemWhereInputSchema.optional(),
  orderBy: z.union([ ContestProblemOrderByWithRelationInputSchema.array(),ContestProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ContestProblemGroupByArgsSchema: z.ZodType<Prisma.ContestProblemGroupByArgs> = z.object({
  where: ContestProblemWhereInputSchema.optional(),
  orderBy: z.union([ ContestProblemOrderByWithAggregationInputSchema.array(),ContestProblemOrderByWithAggregationInputSchema ]).optional(),
  by: ContestProblemScalarFieldEnumSchema.array(),
  having: ContestProblemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ContestProblemFindUniqueArgsSchema: z.ZodType<Prisma.ContestProblemFindUniqueArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereUniqueInputSchema,
}).strict()

export const ContestProblemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContestProblemFindUniqueOrThrowArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereUniqueInputSchema,
}).strict()

export const ProblemFindFirstArgsSchema: z.ZodType<Prisma.ProblemFindFirstArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ProblemScalarFieldEnumSchema.array().optional(),
}).strict()

export const ProblemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProblemFindFirstOrThrowArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ProblemScalarFieldEnumSchema.array().optional(),
}).strict()

export const ProblemFindManyArgsSchema: z.ZodType<Prisma.ProblemFindManyArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ProblemScalarFieldEnumSchema.array().optional(),
}).strict()

export const ProblemAggregateArgsSchema: z.ZodType<Prisma.ProblemAggregateArgs> = z.object({
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithRelationInputSchema.array(),ProblemOrderByWithRelationInputSchema ]).optional(),
  cursor: ProblemWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ProblemGroupByArgsSchema: z.ZodType<Prisma.ProblemGroupByArgs> = z.object({
  where: ProblemWhereInputSchema.optional(),
  orderBy: z.union([ ProblemOrderByWithAggregationInputSchema.array(),ProblemOrderByWithAggregationInputSchema ]).optional(),
  by: ProblemScalarFieldEnumSchema.array(),
  having: ProblemScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ProblemFindUniqueArgsSchema: z.ZodType<Prisma.ProblemFindUniqueArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
}).strict()

export const ProblemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProblemFindUniqueOrThrowArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
}).strict()

export const RefreshTokenFindFirstArgsSchema: z.ZodType<Prisma.RefreshTokenFindFirstArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: RefreshTokenScalarFieldEnumSchema.array().optional(),
}).strict()

export const RefreshTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RefreshTokenFindFirstOrThrowArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: RefreshTokenScalarFieldEnumSchema.array().optional(),
}).strict()

export const RefreshTokenFindManyArgsSchema: z.ZodType<Prisma.RefreshTokenFindManyArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: RefreshTokenScalarFieldEnumSchema.array().optional(),
}).strict()

export const RefreshTokenAggregateArgsSchema: z.ZodType<Prisma.RefreshTokenAggregateArgs> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const RefreshTokenGroupByArgsSchema: z.ZodType<Prisma.RefreshTokenGroupByArgs> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithAggregationInputSchema.array(),RefreshTokenOrderByWithAggregationInputSchema ]).optional(),
  by: RefreshTokenScalarFieldEnumSchema.array(),
  having: RefreshTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const RefreshTokenFindUniqueArgsSchema: z.ZodType<Prisma.RefreshTokenFindUniqueArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereUniqueInputSchema,
}).strict()

export const RefreshTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RefreshTokenFindUniqueOrThrowArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereUniqueInputSchema,
}).strict()

export const SubmissionFindFirstArgsSchema: z.ZodType<Prisma.SubmissionFindFirstArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SubmissionScalarFieldEnumSchema.array().optional(),
}).strict()

export const SubmissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubmissionFindFirstOrThrowArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SubmissionScalarFieldEnumSchema.array().optional(),
}).strict()

export const SubmissionFindManyArgsSchema: z.ZodType<Prisma.SubmissionFindManyArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SubmissionScalarFieldEnumSchema.array().optional(),
}).strict()

export const SubmissionAggregateArgsSchema: z.ZodType<Prisma.SubmissionAggregateArgs> = z.object({
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SubmissionGroupByArgsSchema: z.ZodType<Prisma.SubmissionGroupByArgs> = z.object({
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithAggregationInputSchema.array(),SubmissionOrderByWithAggregationInputSchema ]).optional(),
  by: SubmissionScalarFieldEnumSchema.array(),
  having: SubmissionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SubmissionFindUniqueArgsSchema: z.ZodType<Prisma.SubmissionFindUniqueArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
}).strict()

export const SubmissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubmissionFindUniqueOrThrowArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
}).strict()

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserContestFindFirstArgsSchema: z.ZodType<Prisma.UserContestFindFirstArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereInputSchema.optional(),
  orderBy: z.union([ UserContestOrderByWithRelationInputSchema.array(),UserContestOrderByWithRelationInputSchema ]).optional(),
  cursor: UserContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserContestScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserContestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserContestFindFirstOrThrowArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereInputSchema.optional(),
  orderBy: z.union([ UserContestOrderByWithRelationInputSchema.array(),UserContestOrderByWithRelationInputSchema ]).optional(),
  cursor: UserContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserContestScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserContestFindManyArgsSchema: z.ZodType<Prisma.UserContestFindManyArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereInputSchema.optional(),
  orderBy: z.union([ UserContestOrderByWithRelationInputSchema.array(),UserContestOrderByWithRelationInputSchema ]).optional(),
  cursor: UserContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserContestScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserContestAggregateArgsSchema: z.ZodType<Prisma.UserContestAggregateArgs> = z.object({
  where: UserContestWhereInputSchema.optional(),
  orderBy: z.union([ UserContestOrderByWithRelationInputSchema.array(),UserContestOrderByWithRelationInputSchema ]).optional(),
  cursor: UserContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserContestGroupByArgsSchema: z.ZodType<Prisma.UserContestGroupByArgs> = z.object({
  where: UserContestWhereInputSchema.optional(),
  orderBy: z.union([ UserContestOrderByWithAggregationInputSchema.array(),UserContestOrderByWithAggregationInputSchema ]).optional(),
  by: UserContestScalarFieldEnumSchema.array(),
  having: UserContestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserContestFindUniqueArgsSchema: z.ZodType<Prisma.UserContestFindUniqueArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereUniqueInputSchema,
}).strict()

export const UserContestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserContestFindUniqueOrThrowArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereUniqueInputSchema,
}).strict()

export const AnnouncementCreateArgsSchema: z.ZodType<Prisma.AnnouncementCreateArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  data: z.union([ AnnouncementCreateInputSchema,AnnouncementUncheckedCreateInputSchema ]),
}).strict()

export const AnnouncementUpsertArgsSchema: z.ZodType<Prisma.AnnouncementUpsertArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereUniqueInputSchema,
  create: z.union([ AnnouncementCreateInputSchema,AnnouncementUncheckedCreateInputSchema ]),
  update: z.union([ AnnouncementUpdateInputSchema,AnnouncementUncheckedUpdateInputSchema ]),
}).strict()

export const AnnouncementCreateManyArgsSchema: z.ZodType<Prisma.AnnouncementCreateManyArgs> = z.object({
  data: z.union([ AnnouncementCreateManyInputSchema,AnnouncementCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const AnnouncementDeleteArgsSchema: z.ZodType<Prisma.AnnouncementDeleteArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  where: AnnouncementWhereUniqueInputSchema,
}).strict()

export const AnnouncementUpdateArgsSchema: z.ZodType<Prisma.AnnouncementUpdateArgs> = z.object({
  select: AnnouncementSelectSchema.optional(),
  data: z.union([ AnnouncementUpdateInputSchema,AnnouncementUncheckedUpdateInputSchema ]),
  where: AnnouncementWhereUniqueInputSchema,
}).strict()

export const AnnouncementUpdateManyArgsSchema: z.ZodType<Prisma.AnnouncementUpdateManyArgs> = z.object({
  data: z.union([ AnnouncementUpdateManyMutationInputSchema,AnnouncementUncheckedUpdateManyInputSchema ]),
  where: AnnouncementWhereInputSchema.optional(),
}).strict()

export const AnnouncementDeleteManyArgsSchema: z.ZodType<Prisma.AnnouncementDeleteManyArgs> = z.object({
  where: AnnouncementWhereInputSchema.optional(),
}).strict()

export const ChatCreateArgsSchema: z.ZodType<Prisma.ChatCreateArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  data: z.union([ ChatCreateInputSchema,ChatUncheckedCreateInputSchema ]),
}).strict()

export const ChatUpsertArgsSchema: z.ZodType<Prisma.ChatUpsertArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
  create: z.union([ ChatCreateInputSchema,ChatUncheckedCreateInputSchema ]),
  update: z.union([ ChatUpdateInputSchema,ChatUncheckedUpdateInputSchema ]),
}).strict()

export const ChatCreateManyArgsSchema: z.ZodType<Prisma.ChatCreateManyArgs> = z.object({
  data: z.union([ ChatCreateManyInputSchema,ChatCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ChatDeleteArgsSchema: z.ZodType<Prisma.ChatDeleteArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ChatUpdateArgsSchema: z.ZodType<Prisma.ChatUpdateArgs> = z.object({
  select: ChatSelectSchema.optional(),
  include: ChatIncludeSchema.optional(),
  data: z.union([ ChatUpdateInputSchema,ChatUncheckedUpdateInputSchema ]),
  where: ChatWhereUniqueInputSchema,
}).strict()

export const ChatUpdateManyArgsSchema: z.ZodType<Prisma.ChatUpdateManyArgs> = z.object({
  data: z.union([ ChatUpdateManyMutationInputSchema,ChatUncheckedUpdateManyInputSchema ]),
  where: ChatWhereInputSchema.optional(),
}).strict()

export const ChatDeleteManyArgsSchema: z.ZodType<Prisma.ChatDeleteManyArgs> = z.object({
  where: ChatWhereInputSchema.optional(),
}).strict()

export const ContestCreateArgsSchema: z.ZodType<Prisma.ContestCreateArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  data: z.union([ ContestCreateInputSchema,ContestUncheckedCreateInputSchema ]),
}).strict()

export const ContestUpsertArgsSchema: z.ZodType<Prisma.ContestUpsertArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
  create: z.union([ ContestCreateInputSchema,ContestUncheckedCreateInputSchema ]),
  update: z.union([ ContestUpdateInputSchema,ContestUncheckedUpdateInputSchema ]),
}).strict()

export const ContestCreateManyArgsSchema: z.ZodType<Prisma.ContestCreateManyArgs> = z.object({
  data: z.union([ ContestCreateManyInputSchema,ContestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ContestDeleteArgsSchema: z.ZodType<Prisma.ContestDeleteArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
}).strict()

export const ContestUpdateArgsSchema: z.ZodType<Prisma.ContestUpdateArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  data: z.union([ ContestUpdateInputSchema,ContestUncheckedUpdateInputSchema ]),
  where: ContestWhereUniqueInputSchema,
}).strict()

export const ContestUpdateManyArgsSchema: z.ZodType<Prisma.ContestUpdateManyArgs> = z.object({
  data: z.union([ ContestUpdateManyMutationInputSchema,ContestUncheckedUpdateManyInputSchema ]),
  where: ContestWhereInputSchema.optional(),
}).strict()

export const ContestDeleteManyArgsSchema: z.ZodType<Prisma.ContestDeleteManyArgs> = z.object({
  where: ContestWhereInputSchema.optional(),
}).strict()

export const ContestProblemCreateArgsSchema: z.ZodType<Prisma.ContestProblemCreateArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  data: z.union([ ContestProblemCreateInputSchema,ContestProblemUncheckedCreateInputSchema ]),
}).strict()

export const ContestProblemUpsertArgsSchema: z.ZodType<Prisma.ContestProblemUpsertArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereUniqueInputSchema,
  create: z.union([ ContestProblemCreateInputSchema,ContestProblemUncheckedCreateInputSchema ]),
  update: z.union([ ContestProblemUpdateInputSchema,ContestProblemUncheckedUpdateInputSchema ]),
}).strict()

export const ContestProblemCreateManyArgsSchema: z.ZodType<Prisma.ContestProblemCreateManyArgs> = z.object({
  data: z.union([ ContestProblemCreateManyInputSchema,ContestProblemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ContestProblemDeleteArgsSchema: z.ZodType<Prisma.ContestProblemDeleteArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  where: ContestProblemWhereUniqueInputSchema,
}).strict()

export const ContestProblemUpdateArgsSchema: z.ZodType<Prisma.ContestProblemUpdateArgs> = z.object({
  select: ContestProblemSelectSchema.optional(),
  include: ContestProblemIncludeSchema.optional(),
  data: z.union([ ContestProblemUpdateInputSchema,ContestProblemUncheckedUpdateInputSchema ]),
  where: ContestProblemWhereUniqueInputSchema,
}).strict()

export const ContestProblemUpdateManyArgsSchema: z.ZodType<Prisma.ContestProblemUpdateManyArgs> = z.object({
  data: z.union([ ContestProblemUpdateManyMutationInputSchema,ContestProblemUncheckedUpdateManyInputSchema ]),
  where: ContestProblemWhereInputSchema.optional(),
}).strict()

export const ContestProblemDeleteManyArgsSchema: z.ZodType<Prisma.ContestProblemDeleteManyArgs> = z.object({
  where: ContestProblemWhereInputSchema.optional(),
}).strict()

export const ProblemCreateArgsSchema: z.ZodType<Prisma.ProblemCreateArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  data: z.union([ ProblemCreateInputSchema,ProblemUncheckedCreateInputSchema ]),
}).strict()

export const ProblemUpsertArgsSchema: z.ZodType<Prisma.ProblemUpsertArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
  create: z.union([ ProblemCreateInputSchema,ProblemUncheckedCreateInputSchema ]),
  update: z.union([ ProblemUpdateInputSchema,ProblemUncheckedUpdateInputSchema ]),
}).strict()

export const ProblemCreateManyArgsSchema: z.ZodType<Prisma.ProblemCreateManyArgs> = z.object({
  data: z.union([ ProblemCreateManyInputSchema,ProblemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ProblemDeleteArgsSchema: z.ZodType<Prisma.ProblemDeleteArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  where: ProblemWhereUniqueInputSchema,
}).strict()

export const ProblemUpdateArgsSchema: z.ZodType<Prisma.ProblemUpdateArgs> = z.object({
  select: ProblemSelectSchema.optional(),
  include: ProblemIncludeSchema.optional(),
  data: z.union([ ProblemUpdateInputSchema,ProblemUncheckedUpdateInputSchema ]),
  where: ProblemWhereUniqueInputSchema,
}).strict()

export const ProblemUpdateManyArgsSchema: z.ZodType<Prisma.ProblemUpdateManyArgs> = z.object({
  data: z.union([ ProblemUpdateManyMutationInputSchema,ProblemUncheckedUpdateManyInputSchema ]),
  where: ProblemWhereInputSchema.optional(),
}).strict()

export const ProblemDeleteManyArgsSchema: z.ZodType<Prisma.ProblemDeleteManyArgs> = z.object({
  where: ProblemWhereInputSchema.optional(),
}).strict()

export const RefreshTokenCreateArgsSchema: z.ZodType<Prisma.RefreshTokenCreateArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  data: z.union([ RefreshTokenCreateInputSchema,RefreshTokenUncheckedCreateInputSchema ]),
}).strict()

export const RefreshTokenUpsertArgsSchema: z.ZodType<Prisma.RefreshTokenUpsertArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereUniqueInputSchema,
  create: z.union([ RefreshTokenCreateInputSchema,RefreshTokenUncheckedCreateInputSchema ]),
  update: z.union([ RefreshTokenUpdateInputSchema,RefreshTokenUncheckedUpdateInputSchema ]),
}).strict()

export const RefreshTokenCreateManyArgsSchema: z.ZodType<Prisma.RefreshTokenCreateManyArgs> = z.object({
  data: z.union([ RefreshTokenCreateManyInputSchema,RefreshTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const RefreshTokenDeleteArgsSchema: z.ZodType<Prisma.RefreshTokenDeleteArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  where: RefreshTokenWhereUniqueInputSchema,
}).strict()

export const RefreshTokenUpdateArgsSchema: z.ZodType<Prisma.RefreshTokenUpdateArgs> = z.object({
  select: RefreshTokenSelectSchema.optional(),
  data: z.union([ RefreshTokenUpdateInputSchema,RefreshTokenUncheckedUpdateInputSchema ]),
  where: RefreshTokenWhereUniqueInputSchema,
}).strict()

export const RefreshTokenUpdateManyArgsSchema: z.ZodType<Prisma.RefreshTokenUpdateManyArgs> = z.object({
  data: z.union([ RefreshTokenUpdateManyMutationInputSchema,RefreshTokenUncheckedUpdateManyInputSchema ]),
  where: RefreshTokenWhereInputSchema.optional(),
}).strict()

export const RefreshTokenDeleteManyArgsSchema: z.ZodType<Prisma.RefreshTokenDeleteManyArgs> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
}).strict()

export const SubmissionCreateArgsSchema: z.ZodType<Prisma.SubmissionCreateArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  data: z.union([ SubmissionCreateInputSchema,SubmissionUncheckedCreateInputSchema ]),
}).strict()

export const SubmissionUpsertArgsSchema: z.ZodType<Prisma.SubmissionUpsertArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
  create: z.union([ SubmissionCreateInputSchema,SubmissionUncheckedCreateInputSchema ]),
  update: z.union([ SubmissionUpdateInputSchema,SubmissionUncheckedUpdateInputSchema ]),
}).strict()

export const SubmissionCreateManyArgsSchema: z.ZodType<Prisma.SubmissionCreateManyArgs> = z.object({
  data: z.union([ SubmissionCreateManyInputSchema,SubmissionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const SubmissionDeleteArgsSchema: z.ZodType<Prisma.SubmissionDeleteArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
}).strict()

export const SubmissionUpdateArgsSchema: z.ZodType<Prisma.SubmissionUpdateArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  data: z.union([ SubmissionUpdateInputSchema,SubmissionUncheckedUpdateInputSchema ]),
  where: SubmissionWhereUniqueInputSchema,
}).strict()

export const SubmissionUpdateManyArgsSchema: z.ZodType<Prisma.SubmissionUpdateManyArgs> = z.object({
  data: z.union([ SubmissionUpdateManyMutationInputSchema,SubmissionUncheckedUpdateManyInputSchema ]),
  where: SubmissionWhereInputSchema.optional(),
}).strict()

export const SubmissionDeleteManyArgsSchema: z.ZodType<Prisma.SubmissionDeleteManyArgs> = z.object({
  where: SubmissionWhereInputSchema.optional(),
}).strict()

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict()

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict()

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict()

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict()

export const UserContestCreateArgsSchema: z.ZodType<Prisma.UserContestCreateArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  data: z.union([ UserContestCreateInputSchema,UserContestUncheckedCreateInputSchema ]),
}).strict()

export const UserContestUpsertArgsSchema: z.ZodType<Prisma.UserContestUpsertArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereUniqueInputSchema,
  create: z.union([ UserContestCreateInputSchema,UserContestUncheckedCreateInputSchema ]),
  update: z.union([ UserContestUpdateInputSchema,UserContestUncheckedUpdateInputSchema ]),
}).strict()

export const UserContestCreateManyArgsSchema: z.ZodType<Prisma.UserContestCreateManyArgs> = z.object({
  data: z.union([ UserContestCreateManyInputSchema,UserContestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const UserContestDeleteArgsSchema: z.ZodType<Prisma.UserContestDeleteArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  where: UserContestWhereUniqueInputSchema,
}).strict()

export const UserContestUpdateArgsSchema: z.ZodType<Prisma.UserContestUpdateArgs> = z.object({
  select: UserContestSelectSchema.optional(),
  include: UserContestIncludeSchema.optional(),
  data: z.union([ UserContestUpdateInputSchema,UserContestUncheckedUpdateInputSchema ]),
  where: UserContestWhereUniqueInputSchema,
}).strict()

export const UserContestUpdateManyArgsSchema: z.ZodType<Prisma.UserContestUpdateManyArgs> = z.object({
  data: z.union([ UserContestUpdateManyMutationInputSchema,UserContestUncheckedUpdateManyInputSchema ]),
  where: UserContestWhereInputSchema.optional(),
}).strict()

export const UserContestDeleteManyArgsSchema: z.ZodType<Prisma.UserContestDeleteManyArgs> = z.object({
  where: UserContestWhereInputSchema.optional(),
}).strict()