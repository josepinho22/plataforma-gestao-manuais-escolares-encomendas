import React from 'react';
import { FaSave } from "react-icons/fa";

export default function FilterSection({ 
    data, setData, concelhos, availableEscolas, anos_letivos, anos_escolares, handleSave, processing 
}) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <FilterSelect 
                        label="Concelho" 
                        options={concelhos} 
                        value={data.concelho}
                        onChange={e => setData(prev => ({ ...prev, concelho: e.target.value, escola_id: '' }))}
                    />
                    <FilterSelect 
                        label="Escola / Agrupamento" 
                        options={availableEscolas} 
                        value={data.escola_id}
                        onChange={e => setData('escola_id', e.target.value)}
                        disabled={!data.concelho}
                    />
                    <FilterSelect 
                        label="Ano Letivo" 
                        options={anos_letivos} 
                        value={data.ano_letivo_id}
                        onChange={e => setData('ano_letivo_id', e.target.value)}
                    />
                    <FilterSelect 
                        label="Ano Escolar" 
                        options={anos_escolares} 
                        value={data.ano_escolar_id}
                        onChange={e => setData('ano_escolar_id', e.target.value)}
                    />
                </div>
                
                <div className="flex justify-end border-t pt-4 gap-2">
                     <button className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={processing || !data.escola_id}
                        className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg ${!data.escola_id ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 shadow-gray-100'}`}
                    >
                        <FaSave /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTE LOCAL ---
function FilterSelect({ label, value, onChange, options, disabled }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{label}</label>
            <select 
                value={value} 
                onChange={onChange} 
                disabled={disabled}
                className={`bg-gray-50 border-gray-100 text-gray-900 text-sm rounded-xl block w-full p-2.5 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            >
                <option value="">Selecione</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.nome || opt.name}</option>
                ))}
            </select>
        </div>
    );
}