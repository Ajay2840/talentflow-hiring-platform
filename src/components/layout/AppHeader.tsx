import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function AppHeader() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const jobs = useLiveQuery(() => db.jobs.toArray());
  const candidates = useLiveQuery(() => db.candidates.toArray());

  const suggestions = useMemo(() => {
    const q = query.trim().replace(/^@/, '').toLowerCase();
    if (q.length < 2) return [] as { label: string; sub: string; to: string; kind: 'job' | 'candidate' }[];
    const jobMatches = (jobs || [])
      .filter(j => j.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map(j => ({ label: j.title, sub: 'Job', to: `/jobs/${j.id}`, kind: 'job' as const }));
    const candMatches = (candidates || [])
      .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 5)
      .map(c => ({ label: c.name, sub: c.email, to: `/candidates/${c.id}`, kind: 'candidate' as const }));
    return [...jobMatches, ...candMatches];
  }, [query, jobs, candidates]);

  useEffect(() => {
    setOpen(suggestions.length > 0);
    setActiveIndex(0);
  }, [suggestions]);

  const notifItems = useMemo(() => {
    const items: { id: string; title: string; subtitle: string; to: string }[] = [];
    // recent candidates
    (candidates || [])
      .slice(0, 5)
      .forEach(c => items.push({
        id: `cand-${c.id}`,
        title: c.name,
        subtitle: 'New/updated candidate',
        to: `/candidates/${c.id}`
      }));
    // recent jobs
    (jobs || [])
      .slice(0, 5)
      .forEach(j => items.push({
        id: `job-${j.id}`,
        title: j.title,
        subtitle: 'Job activity',
        to: `/jobs/${j.id}`
      }));
    return items.slice(0, 6);
  }, [jobs, candidates]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && open) {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, Math.max(0, suggestions.length - 1)));
      return;
    }
    if (e.key === 'ArrowUp' && open) {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      const value = query.trim();
      if (!value) return;
      if (open && suggestions[activeIndex]) {
        navigate(suggestions[activeIndex].to);
        setOpen(false);
        return;
      }
      if (value.startsWith('@')) {
        const q = encodeURIComponent(value.slice(1));
        navigate(`/candidates?q=${q}`);
      } else {
        const q = encodeURIComponent(value);
        navigate(`/jobs?q=${q}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <SidebarTrigger />
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md" ref={containerRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs, candidates..."
            className="pl-9 bg-background border-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {open && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-background shadow-md">
              {suggestions.map((s, idx) => (
                <button
                  key={`${s.kind}-${s.to}`}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-secondary/50 ${idx === activeIndex ? 'bg-secondary/30' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => { e.preventDefault(); navigate(s.to); setOpen(false); }}
                >
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{s.sub}</span>
                </button>
              ))}
              {suggestions.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {notifItems.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent key={location.pathname + location.search} align="end" className="w-80 p-0">
            <div className="px-3 py-2 border-b text-sm font-medium">Notifications</div>
            {notifItems.length === 0 ? (
              <div className="px-3 py-6 text-sm text-muted-foreground">You're all caught up.</div>
            ) : (
              <div className="max-h-80 overflow-auto">
                {notifItems.map((n) => (
                  <button
                    key={n.id}
                    className="w-full text-left px-3 py-2 hover:bg-accent focus:bg-accent outline-none"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(n.to);
                      // keep open for fast multi-select; content remounts via key above
                      setNotifOpen(true);
                    }}
                  >
                    <div className="text-sm font-medium leading-none">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.subtitle}</div>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
        
      </div>
    </header>
  );
}
