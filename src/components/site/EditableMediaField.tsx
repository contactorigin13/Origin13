import { useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
export function EditableMediaField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error('Please choose a file under 10 MB.'); return; }
    setBusy(true);
    const path = `website/${crypto.randomUUID()}.${file.name.split('.').pop() || 'png'}`;
    const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { contentType: file.type });
    if (error) toast.error(error.message); else onChange(`storage:${path}`);
    setBusy(false);
  };
  return <div className="space-y-3">
    <Input id={id} value={value} onChange={e => onChange(e.target.value)} placeholder="Image URL or uploaded photo" />
    {value && !value.startsWith('storage:') && <img src={value} alt="Current image" className="h-28 max-w-full object-contain" />}
    <Button asChild variant="outline"><label className="cursor-pointer"><Upload className="h-4 w-4" />{busy ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) upload(file); }} /></label></Button>
  </div>;
}
