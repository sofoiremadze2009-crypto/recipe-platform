
'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Upload, Plus, Trash2, Save, ChefHat, Image } from 'lucide-react';

const supabase = createClient(
  'https://bprjjnhsejfudktgpwmt.supabase.co',
  'sb_publishable_Xn68wkiqRhq0fJ7Ajud_rQ_JtjhHwQa'
);

async function uploadImage(file, slug, suffix = '') {
  const img = new window.Image();
  const preview = URL.createObjectURL(file);
  img.src = preview;
  await new Promise((res) => (img.onload = res));
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  canvas.getContext('2d').drawImage(img, 0, 0, 800, 600);
  const webpBlob = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.85));
  const fileName = `${slug}${suffix}-${Date.now()}.webp`;
  const webpFile = new File([webpBlob], fileName, { type: 'image/webp' });
  const { error } = await supabase.storage.from('recipe-images').upload(fileName, webpFile, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('recipe-images').getPublicUrl(fileName);
  URL.revokeObjectURL(preview);
  return data.publicUrl;
}

export default function AdminPage() {
  const [form, setForm] = useState({
    slug: '', country_ge: '', country_en: '', country_code: '',
    category: '', difficulty_ge: '', difficulty_en: '', prep_time: '',
    title_ge: '', title_en: '', description_ge: '', description_en: '',
  });
  const [ingredients, setIngredients] = useState([{ ge: '', en: '' }]);
  const [instructions, setInstructions] = useState([{ ge: '', en: '', image_url: '', image_file: null, image_preview: null }]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleStepImageChange = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...instructions];
    updated[i].image_file = file;
    updated[i].image_preview = URL.createObjectURL(file);
    updated[i].image_url = '';
    setInstructions(updated);
  };

  const handleSubmit = async () => {
    if (!form.slug) { setMessage('გთხოვ Slug (URL) შეიყვანე!'); return; }
    setLoading(true);
    setMessage('');
    try {
      let mainImageUrl = '';
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile, form.slug, '-main');
      }
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({ ...form, prep_time: parseInt(form.prep_time) || 0, image_url: mainImageUrl })
        .select().single();
      if (recipeError) throw recipeError;
      await supabase.from('ingredients').insert(
        ingredients.filter(i => i.ge || i.en).map((ing, i) => ({
          recipe_id: recipe.id, text_ge: ing.ge, text_en: ing.en, order_index: i
        }))
      );
      const instructionRows = await Promise.all(
        instructions.filter(ins => ins.ge || ins.en).map(async (ins, i) => {
          let stepImageUrl = ins.image_url || '';
          if (ins.image_file) {
            stepImageUrl = await uploadImage(ins.image_file, form.slug, `-step${i + 1}`);
          }
          return { recipe_id: recipe.id, text_ge: ins.ge, text_en: ins.en, step_number: i + 1, image_url: stepImageUrl || null };
        })
      );
      await supabase.from('instructions').insert(instructionRows);
      setMessage('✅ რეცეპტი წარმატებით დაემატა!');
      setForm({ slug: '', country_ge: '', country_en: '', country_code: '', category: '', difficulty_ge: '', difficulty_en: '', prep_time: '', title_ge: '', title_en: '', description_ge: '', description_en: '' });
      setIngredients([{ ge: '', en: '' }]);
      setInstructions([{ ge: '', en: '', image_url: '', image_file: null, image_preview: null }]);
      setMainImageFile(null);
      setMainImagePreview(null);
    } catch (err) {
      setMessage(`შეცდომა: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#f5e6cc] bg-white text-sm text-[#1a120a] focus:outline-none focus:border-[#c1704a] transition-colors";
  const labelClass = "block text-xs font-medium text-[#7a6452] uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-[#fdf6ec] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#c1704a] rounded-full flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-[#1a120a]">ადმინ პანელი</h1>
            <p className="text-sm text-[#7a6452]">ახალი რეცეპტის დამატება</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a120a] mb-5">ძირითადი ინფო</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[['slug','Slug (URL)','khinkali'],['prep_time','დრო (წუთი)','90'],['country_ge','ქვეყანა (ქართ.)','საქართველო'],['country_en','ქვეყანა (ინგლ.)','Georgia'],['country_code','ქვეყნის კოდი','GE']].map(([key, label, ph]) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input className={inputClass} placeholder={ph} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
                </div>
              ))}
              <div>
                <label className={labelClass}>კატეგორია</label>
                <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="">აირჩიე</option>
                  {['soup','pasta','dumplings','curry','street-food'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>სირთულე (ქართ.)</label>
                <select className={inputClass} value={form.difficulty_ge} onChange={e => setForm({...form, difficulty_ge: e.target.value})}>
                  <option value="">აირჩიე</option>
                  <option value="მარტივი">მარტივი</option>
                  <option value="საშუალო">საშუალო</option>
                  <option value="რთული">რთული</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>სირთულე (ინგლ.)</label>
                <select className={inputClass} value={form.difficulty_en} onChange={e => setForm({...form, difficulty_en: e.target.value})}>
                  <option value="">აირჩიე</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a120a] mb-5">სათაური და აღწერა</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>სათაური (ქართ.)</label><input className={inputClass} value={form.title_ge} onChange={e => setForm({...form, title_ge: e.target.value})} /></div>
                <div><label className={labelClass}>სათაური (ინგლ.)</label><input className={inputClass} value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
              </div>
              <div><label className={labelClass}>აღწერა (ქართ.)</label><textarea className={inputClass} rows={3} value={form.description_ge} onChange={e => setForm({...form, description_ge: e.target.value})} /></div>
              <div><label className={labelClass}>აღწერა (ინგლ.)</label><textarea className={inputClass} rows={3} value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} /></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a120a] mb-2">მთავარი სურათი</h2>
            <p className="text-xs text-[#7a6452] mb-4">ატვირთული ფოტო Supabase-ზე შეინახება — კომპიუტერიდან წაშლის შემდეგაც საიტზე დარჩება</p>
            <div className="flex gap-6 items-start">
              <label className="flex-1 flex flex-col items-center justify-center h-40 border-2 border-dashed border-[#f5e6cc] rounded-xl cursor-pointer hover:border-[#c1704a] transition-colors bg-[#fdf6ec]">
                <Upload size={24} className="text-[#c1704a] mb-2" />
                <span className="text-sm text-[#7a6452]">კომპიუტერიდან ატვირთვა</span>
                <span className="text-xs text-[#7a6452]/60 mt-1">JPG, PNG → ავტომატურად WebP-ად</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
              </label>
              {mainImagePreview && (
                <div className="w-40 h-40 rounded-xl overflow-hidden shrink-0">
                  <img src={mainImagePreview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a120a] mb-5">ინგრედიენტები</h2>
            <div className="space-y-3">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <span className="text-xs text-[#c1704a] font-medium w-5">{i+1}.</span>
                  <input className={`${inputClass} flex-1`} placeholder="ქართულად" value={ing.ge} onChange={e => { const u=[...ingredients]; u[i].ge=e.target.value; setIngredients(u); }} />
                  <input className={`${inputClass} flex-1`} placeholder="English" value={ing.en} onChange={e => { const u=[...ingredients]; u[i].en=e.target.value; setIngredients(u); }} />
                  <button onClick={() => setIngredients(ingredients.filter((_,idx)=>idx!==i))} className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setIngredients([...ingredients, {ge:'',en:''}])} className="flex items-center gap-2 text-sm text-[#c1704a] mt-2"><Plus size={16} /> ინგრედიენტის დამატება</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1a120a] mb-2">მომზადების ნაბიჯები</h2>
            <p className="text-xs text-[#7a6452] mb-5">თითოეული ნაბიჯისთვის შეგიძლია ფოტო ატვირთო კომპიუტერიდან ან URL ჩასვა</p>
            <div className="space-y-6">
              {instructions.map((ins, i) => (
                <div key={i} className="border border-[#f5e6cc] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#c1704a]">ნაბიჯი {i+1}</span>
                    <button onClick={() => setInstructions(instructions.filter((_,idx)=>idx!==i))} className="text-rose-400 hover:text-rose-600"><Trash2 size={16} /></button>
                  </div>
                  <div className="space-y-3">
                    <textarea className={inputClass} rows={2} placeholder="ქართულად" value={ins.ge} onChange={e => { const u=[...instructions]; u[i].ge=e.target.value; setInstructions(u); }} />
                    <textarea className={inputClass} rows={2} placeholder="English" value={ins.en} onChange={e => { const u=[...instructions]; u[i].en=e.target.value; setInstructions(u); }} />
                    <div className="flex gap-3 items-center pt-1">
                      <label className="flex items-center gap-2 px-4 py-2 bg-[#f5e6cc] hover:bg-[#edc87a]/40 rounded-xl cursor-pointer transition-colors text-sm text-[#7a6452] shrink-0">
                        <Upload size={14} className="text-[#c1704a]" />
                        ფოტო
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleStepImageChange(e, i)} />
                      </label>
                      <input
                        className={inputClass}
                        placeholder="ან URL ჩასვი"
                        value={ins.image_url}
                        onChange={e => { const u=[...instructions]; u[i].image_url=e.target.value; u[i].image_file=null; u[i].image_preview=null; setInstructions(u); }}
                      />
                      {(ins.image_preview || ins.image_url) && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img src={ins.image_preview || ins.image_url} alt="step" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setInstructions([...instructions, {ge:'',en:'',image_url:'',image_file:null,image_preview:null}])} className="flex items-center gap-2 text-sm text-[#2d5a27] mt-2"><Plus size={16} /> ნაბიჯის დამატება</button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {message}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-[#c1704a] hover:bg-[#9a4f2a] disabled:opacity-50 text-white rounded-xl font-medium transition-all">
            <Save size={18} />
            {loading ? 'ინახება... გთხოვ დაიცადე' : 'რეცეპტის შენახვა'}
          </button>
        </div>
      </div>
    </div>
  );
}