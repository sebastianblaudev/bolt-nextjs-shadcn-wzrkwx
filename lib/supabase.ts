"use client";

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://zqnhlotyavtnjtlljtad.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxbmhsb3R5YXZ0bmp0bGxqdGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzODQxNzQsImV4cCI6MjA0Njk2MDE3NH0.F1gp3kvLr8u679e021kNbuJmC791TAkkvZgizVFywQA';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);