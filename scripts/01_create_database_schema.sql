-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  birth_latitude DECIMAL(10, 8),
  birth_longitude DECIMAL(11, 8),
  timezone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create birth_charts table
CREATE TABLE public.birth_charts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  chart_data JSONB NOT NULL, -- Store calculated planetary positions
  interpretation TEXT, -- AI-generated interpretation
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_horoscopes table
CREATE TABLE public.daily_horoscopes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compatibility_reports table
CREATE TABLE public.compatibility_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  report_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Create user_friends table
CREATE TABLE public.user_friends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Create astro_events table (for tracking planetary events)
CREATE TABLE public.astro_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'new_moon', 'full_moon', 'mercury_retrograde', etc.
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  impact_level INTEGER CHECK (impact_level >= 1 AND impact_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compatibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astro_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Birth charts policies
CREATE POLICY "Users can view own birth chart" ON public.birth_charts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own birth chart" ON public.birth_charts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own birth chart" ON public.birth_charts
  FOR UPDATE USING (auth.uid() = user_id);

-- Daily horoscopes policies
CREATE POLICY "Users can view own horoscopes" ON public.daily_horoscopes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own horoscopes" ON public.daily_horoscopes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Compatibility reports policies
CREATE POLICY "Users can view their compatibility reports" ON public.compatibility_reports
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create compatibility reports" ON public.compatibility_reports
  FOR INSERT WITH CHECK (auth.uid() = user1_id);

-- User friends policies
CREATE POLICY "Users can view their friendships" ON public.user_friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" ON public.user_friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships" ON public.user_friends
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Astro events policies (public read access)
CREATE POLICY "Anyone can view astro events" ON public.astro_events
  FOR SELECT USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_birth_charts_user_id ON public.birth_charts(user_id);
CREATE INDEX idx_daily_horoscopes_user_date ON public.daily_horoscopes(user_id, date);
CREATE INDEX idx_compatibility_reports_users ON public.compatibility_reports(user1_id, user2_id);
CREATE INDEX idx_user_friends_user_id ON public.user_friends(user_id);
CREATE INDEX idx_astro_events_date ON public.astro_events(event_date);
