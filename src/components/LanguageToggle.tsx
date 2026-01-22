import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted/80 border border-border">
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
          language === 'en'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={cn(
          "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200",
          language === 'bn'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        বাং
      </button>
    </div>
  );
};

export default LanguageToggle;
