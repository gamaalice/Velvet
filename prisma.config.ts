import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url: 'postgresql://neondb_owner:npg_Q1cJmKSW3lVd@ep-floral-moon-avzr2qts-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require',
  },
})