import { pgTable, serial, text, timestamp, integer, json, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  careerLevel: integer('career_level').default(1),
  xp: integer('xp').default(0),
  prestigeAi: integer('prestige_ai').default(0),
  prestigeFullstack: integer('prestige_fullstack').default(0),
  prestigeDevops: integer('prestige_devops').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const careerProfiles = pgTable('career_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(), // one profile per user
  rawCvText: text('raw_cv_text'),
  careerLevel: integer('career_level').default(1),
  rolePath: text('role_path'),
  skillScore: integer('skill_score').default(0),
  experienceScore: integer('experience_score').default(0),
  projectScore: integer('project_score').default(0),
  industryReadiness: integer('industry_readiness').default(0),
  xpGained: integer('xp_gained').default(0),
  strengths: json('strengths').$type<string[]>().default([]),
  weaknesses: json('weaknesses').$type<string[]>().default([]),
  topSkills: json('top_skills').$type<string[]>().default([]),
  recommendations: json('recommendations').$type<string[]>().default([]),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userSkills = pgTable(
  'user_skills',
  {
    id:         serial('id').primaryKey(),
    userId:     integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    skillId:    text('skill_id').notNull(),
    unlockedAt: timestamp('unlocked_at').defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex('user_skills_user_skill_idx').on(t.userId, t.skillId),
  })
);

export type RoadmapMonth = {
  month:       number
  title:       string
  topics:      string[]
  project:     string
  milestone:   string
}

export const roadmaps = pgTable('roadmaps', {
  id:          serial('id').primaryKey(),
  userId:      integer('user_id')
                 .notNull()
                 .references(() => users.id, { onDelete: 'cascade' }),
  goal:        text('goal').notNull(),
  targetRole:  text('target_role'),
  duration:    integer('duration_months').notNull(),
  months:      json('months').$type<RoadmapMonth[]>().default([]),
  createdAt:   timestamp('created_at').defaultNow(),
})

export const roadmapProgress = pgTable('roadmap_progress', {
  id:         serial('id').primaryKey(),
  roadmapId:  integer('roadmap_id')
                .notNull()
                .references(() => roadmaps.id, { onDelete: 'cascade' }),
  userId:     integer('user_id')
                .notNull()
                .references(() => users.id, { onDelete: 'cascade' }),
  monthIndex: integer('month_index').notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
}, (t) => ({
  uniq: uniqueIndex('roadmap_progress_uniq').on(t.roadmapId, t.monthIndex),
}))

export type CompanyPrediction = {
  company:     string
  match:       number        // 0–100
  verdict:     string        // 'Strong Match' | 'Possible' | 'Reach'
  reasons:     string[]      // why you match
  gaps:        string[]      // what's holding you back
  tip:         string        // one specific action to improve this match
}

export const internshipPredictions = pgTable('internship_predictions', {
  id:           serial('id').primaryKey(),
  userId:       integer('user_id')
                  .notNull()
                  .references(() => users.id, { onDelete: 'cascade' }),
  gpa:          text('gpa'),
  targetRole:   text('target_role').notNull(),
  extraSkills:  json('extra_skills').$type<string[]>().default([]),
  companies:    json('companies').$type<CompanyPrediction[]>().default([]),
  createdAt:    timestamp('created_at').defaultNow(),
})
