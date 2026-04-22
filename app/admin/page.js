'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Upload, Plus, Trash2, Save, ChefHat } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPage() {
  const [form, setForm] = useState({
    slug: '', country_ge: '', country_en: '', country_code: '',
    category: '', difficulty_ge: '', difficulty_en: '', prep_time: '',
    title_ge: '', title_en: '', description_ge: '', description_en: '',
  });
  const [ingredients, setIngredients] = useState([{ ge: '', en: '' }]);
  const [instructions, setInstructions] = useState([{ ge: '', en: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      let imageUrl = '';
      if (imageFile) {
        const img = new Image();
        img.src = imagePreview;
        await new Promise((res) => (img.onload = res));
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.getContext('2d').drawImage(img, 0, 0, 800, 600);
        const webpBlob = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.85));
        const webpFile = new File([webpBlob], `${form.slug}.webp`, { type: 'image/webp' });
        const { error: uploadError } = await supabase.storage
          .from('recipe-images').upload(webpFile.name, webpFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('recipe-images').getPublicUrl(webpFile.name);
        imageUrl = urlData.publicUrl;
      }
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({ ...form, prep_time: parseInt(form.prep_time), image_url: imageUrl })
        .select().single();
      if (recipeError) throw recipeError;
      await supabase.from('ingredients').insert(
        ingredients.map((ing, i) => ({ recipe_id: recipe.id, text_ge: ing.ge, text_en: ing.en, order_index: i }))
      );
      await supabase.from('instructions').insert(
        instructions.map((ins, i) => ({ recipe_id: recipe.id, text_ge: ins.ge, text_en: ins.en, step_number: i + 1 }))
      );
      setMessage('✅ რეცეპტი წარმატებით დაემატა!');
      setForm({ slug: '', country_ge: '', country_en: '', country_code: '', category: '', difficulty_ge: '', difficulty_en: '', prep_time: '', title_ge: '', title_en: '', description_ge: '', description_en: '' });
      setIngredients([{ ge: '', en: '' }]);
      setInstructions([{ ge: '', en: '' }]);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setMessage(`❌ შეცდომა: ${err.message}`);
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
            <h2 className="text-xl font-semibold text-[#1a120a] mb-5">სურათი</h2>
            <div className="flex gap-6 items-start">
              <label className="flex-1 flex flex-col items-center justify-center h-40 border-2 border-dashed border-[#f5e6cc] rounded-xl cursor-pointer hover:border-[#c1704a] transition-colors bg-[#fdf6ec]">
                <Upload size={24} className="text-[#c1704a] mb-2" />
                <span className="text-sm text-[#7a6452]">სურათის ატვირთვა</span>
                <span className="text-xs text-[#7a6452]/60 mt-1">ავტომატურად კონვერტირდება WebP-ად</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && <div className="w-40 h-40 rounded-xl overflow-hidden shrink-0"><img src={imagePreview} alt="preview" className="w-full h-full object-cover" /></div>}
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
            <h2 className="text-xl font-semibold text-[#1a120a] mb-5">მომზადების ნაბიჯები</h2>
            <div className="space-y-4">
              {instructions.map((ins, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xs text-[#2d5a27] font-medium w-5 mt-3">{i+1}.</span>
                  <div className="flex-1 space-y-2">
                    <textarea className={inputClass} rows={2} placeholder="ქართულად" value={ins.ge} onChange={e => { const u=[...instructions]; u[i].ge=e.target.value; setInstructions(u); }} />
                    <textarea className={inputClass} rows={2} placeholder="English" value={ins.en} onChange={e => { const u=[...instructions]; u[i].en=e.target.value; setInstructions(u); }} />
                  </div>
                  <button onClick={() => setInstructions(instructions.filter((_,idx)=>idx!==i))} className="text-rose-400 hover:text-rose-600 mt-3"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setInstructions([...instructions, {ge:'',en:''}])} className="flex items-center gap-2 text-sm text-[#2d5a27] mt-2"><Plus size={16} /> ნაბიჯის დამატება</button>
            </div>
          </div>
          {message && <div className={`p-4 rounded-xl text-sm ${message.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{message}</div>}
          <button onClick={handleSubmit} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-[#c1704a] hover:bg-[#9a4f2a] disabled:opacity-50 text-white rounded-xl font-medium transition-all">
            <Save size={18} />
            {loading ? 'ინახება...' : 'რეცეპტის შენახვა'}
          </button>
        </div>
      </div>
    </div>
  );
}