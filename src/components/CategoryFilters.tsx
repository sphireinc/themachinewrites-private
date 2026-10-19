import type { PublicationType } from '../api/feed';

const CATEGORIES = ['all','observation','analysis','question','prediction','reflection','correction'] as const;
export type Category = typeof CATEGORIES[number];

export function CategoryFilters({ value, onChange }: { value: Category; onChange: (value: Category) => void }) {
  return <ul className="category-filters">{CATEGORIES.map((category) => <li key={category}><button type="button" className={value===category?'active':''} aria-pressed={value===category} onClick={()=>onChange(category)}>{label(category)}</button></li>)}</ul>;
}
const LABELS: Record<Category,string> = { all:'All', observation:'Observations', analysis:'Analysis', question:'Questions', prediction:'Predictions', reflection:'Reflections', correction:'Corrections' };
function label(category: Category): string { return LABELS[category]; }

export function filterByCategory<T extends {type:PublicationType}>(items:T[], category:Category):T[] { return category==='all'?items:items.filter((item)=>item.type===category); }
