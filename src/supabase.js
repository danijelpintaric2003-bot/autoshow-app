import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwyxlzamnvtdcbpptjgp.supabase.co'
const supabaseKey = 'sb_publishable_reOc4bkbiKoAhiIZcg3Vsw_eTDZUkHO'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)