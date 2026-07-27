# Supabase Setup Instructions

1. **Create Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2. **Execute SQL**: Navigate to the **SQL Editor** in your Supabase dashboard.
3. **Run Migration**: Copy the contents of `migrations/001_initial_schema.sql` and paste it into the SQL Editor. Click **Run**.
   - *This script will create the tables, enable Row Level Security, apply policies, and insert the MVP topics.*
4. **Environment Variables**: Copy your **Project URL** and **anon public key** from the API Settings.
5. Create a `.env.local` file in the root of your `ai-news` project and add them:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
6. **Authentication**: Go to **Authentication > Providers** in Supabase and ensure **Email** is enabled, specifically "Enable Magic Link log in".
