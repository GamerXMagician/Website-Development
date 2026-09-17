/* ============================================================================
   SUPABASE CLIENT INITIALIZATION
   Configure Supabase for contact form submissions
   ============================================================================ */

// Supabase configuration - Load from environment or use these values
const SUPABASE_URL = 'https://grdlpybkqxkrewqyuvzl.supabase.co';
// IMPORTANT: Set this in your .env file before deploying
// Do not commit sensitive keys to version control
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZGxweWJrcXhrcmV3cXl1dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MzUyNDIsImV4cCI6MjEwNTIxMTI0Mn0.xseu2-S2za6Jv8JSps4jYM_QmbMm2k8bL5NoCR-NvuQ';

// Simple Supabase client (without external library)
class SupabaseClient {
  constructor(url, anonKey) {
    this.url = url;
    this.anonKey = anonKey;
  }

  async insert(table, data) {
    try {
      const response = await fetch(`${this.url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.anonKey,
          'Authorization': `Bearer ${this.anonKey}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
  }
}

// Initialize Supabase client
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in form handler
window.supabase = supabase;

