import React from 'react';
import { FaSave } from "react-icons/fa";

export default function FilterSection({
    data, setData, concelhos, availableEscolas, anos_letivos, anos_escolares,
    saveAnoLetivoId, setSaveAnoLetivoId,
    handleSave, handleCancel, processing
}) {
    return (
        <div className="card-3d rounded-3xl py-6 animate-card-in">
            <div className="flex flex-col gap-6 px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <FilterSelect
                        label="Ano Letivo"
                        options={anos_letivos}
                        value={data.ano_letivo_id}
                        onChange={e => setData('ano_letivo_id', e.target.value)}
                    />
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
                        label="Ano Escolar"
                        options={anos_escolares}
                        value={data.ano_escolar_id}
                        onChange={e => setData('ano_escolar_id', e.target.value)}
                    />
                </div>

                <div className="flex items-end justify-end border-t border-white/40 pt-4 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Guardar em novo ano letivo</label>
                        <select
                            value={saveAnoLetivoId}
                            onChange={e => setSaveAnoLetivoId(e.target.value)}
                            className="glass-input rounded-xl py-2 pl-3 pr-8 text-sm appearance-none"
                        >
                            <option value="">Selecione</option>
                            {anos_letivos.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100/60 transition text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={processing || !data.escola_id || !saveAnoLetivoId}
                        className={`px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition text-sm ${(!data.escola_id || !saveAnoLetivoId) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.97]'}`}
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
                className={`glass-input rounded-xl block w-full p-2.5 text-sm text-gray-800 appearance-none transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            >
                <option value="">Selecione</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.nome || opt.name}</option>
                ))}
            </select>
        </div>
    );
}
