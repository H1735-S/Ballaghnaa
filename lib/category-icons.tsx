import {
  Construction, Waves, Trash2, Droplets, Zap,
  Building2, TreePine, Volume2, Landmark, HelpCircle,
} from "lucide-react";

export interface CategoryMeta {
  icon: React.ElementType;
  bgClass: string;   
  iconClass: string; 
}


export const categoryMetaMap: Record<string, CategoryMeta> = {
  "الطرق والإنارة":          { icon: Construction, bgClass: "bg-yellow-500/10",   iconClass: "text-yellow-500"   },
  "Roads & Lighting":        { icon: Construction, bgClass: "bg-yellow-500/10",   iconClass: "text-yellow-500"   },
  "الصرف الصحي":             { icon: Waves,        bgClass: "bg-yellow-500/10",    iconClass: "text-yellow-500"    },
  "Sewage & Drainage":       { icon: Waves,        bgClass: "bg-yellow-500/10",    iconClass: "text-yellow-500"    },
  "النظافة والقمامة":         { icon: Trash2,       bgClass: "bg-yellow-500/10",   iconClass: "text-yellow-500"   },
  "Waste & Cleanliness":     { icon: Trash2,       bgClass: "bg-yellow-500/10",   iconClass: "text-yellow-500"   },
  "مياه الشرب":               { icon: Droplets,     bgClass: "bg-yellow-500/10",    iconClass: "text-yellow-500"    },
  "Drinking Water":          { icon: Droplets,     bgClass: "bg-yellow-500/10",    iconClass: "text-yellow-500"    },
  "الكهرباء":                 { icon: Zap,          bgClass: "bg-yellow-500/10",  iconClass: "text-yellow-500"  },
  "Electricity":             { icon: Zap,          bgClass: "bg-yellow-500/10",  iconClass: "text-yellow-500"  },
  "البناء المخالف":           { icon: Building2,    bgClass: "bg-yellow-500/10",     iconClass: "text-yellow-500"     },
  "Illegal Construction":    { icon: Building2,    bgClass: "bg-yellow-500/10",     iconClass: "text-yellow-500"     },
  "الحدائق والمناطق الخضراء": { icon: TreePine,     bgClass: "bg-yellow-500/10", iconClass: "text-yellow-500" },
  "Parks & Green Areas":     { icon: TreePine,     bgClass: "bg-yellow-500/10", iconClass: "text-yellow-500" },
  "الضوضاء والتلوث":          { icon: Volume2,      bgClass: "bg-yellow-500/10",  iconClass: "text-yellow-500"  },
  "Noise & Pollution":       { icon: Volume2,      bgClass: "bg-yellow-500/10",  iconClass: "text-yellow-500"  },
  "الخدمات الحكومية":         { icon: Landmark,     bgClass: "bg-yellow-500/10",   iconClass: "text-yellow-500"   },
  "Government Services":     { icon: Landmark,     bgClass: "bg-yellow-500/10",   iconClass: "text-yellow-500"   },
};

export const fallbackMeta: CategoryMeta = {
  icon: HelpCircle,
  bgClass: "bg-muted",
  iconClass: "text-muted-foreground",
};

export function getCategoryMeta(name: string): CategoryMeta {
  return categoryMetaMap[name] ?? fallbackMeta;
}


export function CategoryIcon({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const meta = getCategoryMeta(name);
  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconDim = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className={`${dim} rounded-xl ${meta.bgClass} flex items-center justify-center shrink-0`}>
      <meta.icon className={`${iconDim} ${meta.iconClass}`} />
    </div>
  );
}
