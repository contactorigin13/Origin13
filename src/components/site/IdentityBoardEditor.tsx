import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditableMediaField } from './EditableMediaField';
import { parseIdentityBoard } from '@/lib/portfolio-content';
import type { IdentityBoard } from '@/data/studio';
export function IdentityBoardEditor({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const board = parseIdentityBoard(value, undefined);
  const save = (next: IdentityBoard) => onChange(JSON.stringify(next));
  if (!board) return <p className="text-destructive">This board could not be loaded.</p>;
  if (board.type === 'palette') return <div className="grid gap-4 sm:grid-cols-2">{board.colors.map((color, index) => <div key={index} className="space-y-3 border-l border-border pl-4">
    {(['name', 'hex', 'role'] as const).map(key => <div key={key}><Label htmlFor={`${id}-${index}-${key}`}>{key === 'hex' ? 'Colour' : key === 'role' ? 'Role' : 'Name'}</Label><Input id={`${id}-${index}-${key}`} type={key === 'hex' ? 'color' : 'text'} value={color[key]} onChange={e => save({ ...board, colors: board.colors.map((c, i) => i === index ? { ...c, [key]: e.target.value } : c) })} /></div>)}
  </div>)}</div>;
  return <div className="space-y-4 border-l border-border pl-4">
    {(['family', 'sample', 'stack'] as const).map(key => <div key={key}><Label htmlFor={`${id}-${key}`}>{key === 'family' ? 'Typeface name' : key === 'sample' ? 'Large wordmark text' : 'Typeface family'}</Label><Input id={`${id}-${key}`} value={board.display[key]} onChange={e => save({ ...board, display: { ...board.display, [key]: e.target.value } })} /></div>)}
    <Label htmlFor={`${id}-weight`}>Typeface weight</Label><Input id={`${id}-weight`} type="number" min={100} max={1000} value={board.display.weight} onChange={e => save({ ...board, display: { ...board.display, weight: Number(e.target.value) } })} />
    <Label htmlFor={`${id}-image`}>Exact wordmark image</Label><EditableMediaField id={`${id}-image`} value={board.display.image ?? ''} onChange={image => save({ ...board, display: { ...board.display, image } })} />
    {(['family', 'stack', 'sample'] as const).map(key => <div key={key}><Label htmlFor={`${id}-text-${key}`}>Supporting text — {key}</Label><Input id={`${id}-text-${key}`} value={board.text[key]} onChange={e => save({ ...board, text: { ...board.text, [key]: e.target.value } })} /></div>)}
    {(['ink', 'paper', 'accent'] as const).map(key => <div key={key}><Label htmlFor={`${id}-${key}`}>{key === 'ink' ? 'Text colour' : key === 'paper' ? 'Background colour' : 'Accent colour'}</Label><Input id={`${id}-${key}`} type="color" value={board[key]} onChange={e => save({ ...board, [key]: e.target.value })} /></div>)}
  </div>;
}
