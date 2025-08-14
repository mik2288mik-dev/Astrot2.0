-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  photo_url TEXT,
  language_code TEXT DEFAULT 'ru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create birth_charts table
CREATE TABLE IF NOT EXISTS public.birth_charts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT,
  chart_data JSONB,
  interpretation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_horoscopes table
CREATE TABLE IF NOT EXISTS public.daily_horoscopes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create compatibility_reports table
CREATE TABLE IF NOT EXISTS public.compatibility_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_name TEXT,
  user2_birth_data JSONB,
  compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  report_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create astro_events table
CREATE TABLE IF NOT EXISTS public.astro_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astro_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own birth charts" ON public.birth_charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own birth charts" ON public.birth_charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own birth charts" ON public.birth_charts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own horoscopes" ON public.daily_horoscopes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own horoscopes" ON public.daily_horoscopes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own compatibility reports" ON public.compatibility_reports
  FOR SELECT USING (auth.uid() = user1_id);

CREATE POLICY "Users can insert own compatibility reports" ON public.compatibility_reports
  FOR INSERT WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "Everyone can view astro events" ON public.astro_events
  FOR SELECT TO authenticated USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, telegram_id, first_name, last_name, username, photo_url)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'telegram_id')::BIGINT,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'photo_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample astro events
INSERT INTO public.astro_events (event_type, event_date, title, description) VALUES
('new_moon', CURRENT_DATE + INTERVAL '3 days', 'Новолуние в Козероге', 'Время для новых начинаний и постановки целей'),
('full_moon', CURRENT_DATE + INTERVAL '17 days', 'Полнолуние в Раке', 'Период эмоциональной кульминации и завершения дел'),
('mercury_retrograde', CURRENT_DATE + INTERVAL '10 days', 'Ретроградный Меркурий', 'Будьте осторожны с коммуникациями и техникой');
