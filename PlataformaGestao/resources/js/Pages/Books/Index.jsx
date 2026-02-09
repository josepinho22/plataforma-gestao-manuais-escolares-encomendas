import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

import BookCard from '@/Components/BookCard';
import FilterSection from '@/Components/FilterSection';

export default function BooksLists({ auth, catalog = [], concelhos = [], escolas = [], anos_letivos = [], anos_escolares = [] }) {
    const [currentList, setCurrentList] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 

    const { data, setData, post, processing } = useForm({
        concelho: '',
        escola_id: '',
        ano_letivo_id: '',
        ano_escolar_id: '',
        items: [],
    });

    useEffect(() => {
    if (data.escola_id && data.ano_letivo_id && data.ano_escolar_id) {
        setCurrentList([]); 
        
        axios.get(route('api.lista.books'), { 
            params: { 
                escola_id: data.escola_id,
                ano_letivo_id: data.ano_letivo_id,
                ano_escolar_id: data.ano_escolar_id 
            } 
        })
        .then(res => {
            const novaLista = Array.isArray(res.data) ? res.data : [];
            setCurrentList(novaLista);
        })
        .catch(err => {
            console.error("Erro:", err);
            setCurrentList([]);
        });
    } else {
        setCurrentList([]);
    }
}, [data.escola_id, data.ano_letivo_id, data.ano_escolar_id]);

    const availableEscolas = useMemo(() => {
        if (!data.concelho) return [];
        return escolas.filter(escola => String(escola.concelho_id) === String(data.concelho));
    }, [data.concelho, escolas]);

    const filteredCatalog = catalog.filter(book => 
        book.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'catalog' && destination.droppableId === 'currentList') {
        const item = filteredCatalog[source.index];
        if (!currentList.find(i => i.id === item.id)) {
            setCurrentList(prev => [...prev, item]);
        }
    }
};

    const handleSave = () => {
    post(route('book-lists.store'), {
        data: {
            ...data,
            items: currentList.map(item => item.id) 
        },
        preserveScroll: true,
        onSuccess: () => {
            alert('Lista Salva com Sucesso!');
        },
    });
};

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gerir Listas" />
            <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
                
                <FilterSection 
                    data={data}
                    setData={setData}
                    concelhos={concelhos}
                    availableEscolas={availableEscolas}
                    anos_letivos={anos_letivos}
                    anos_escolares={anos_escolares}
                    handleSave={handleSave}
                    processing={processing}
                />

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LISTA ATUAL */}
<div className="space-y-4">
    <h3 className="font-bold text-gray-700">Lista Atual ({currentList.length})</h3>
    <Droppable droppableId="currentList">
        {(provided, snapshot) => (
            <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className={`p-4 rounded-2xl border-2 border-dashed min-h-[500px] transition-colors 
                    ${snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
            >
               
                {currentList && currentList.length > 0 ? (
                    currentList.map((item, index) => {
                       
                        if (!item || !item.id) return null;
                        
                        return (
                            <BookCard 
                                key={`list-item-${item.id}-${index}`}
                                item={item} 
                                index={index} 
                                isRemovable 
                                onRemove={() => setCurrentList(prev => prev.filter((_, i) => i !== index))} 
                            />
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <p className="text-sm italic">Arraste livros do catálogo para aqui</p>
                    </div>
                )}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
</div>

                        {/* CATÁLOGO */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-gray-700">Catálogo de Livros</h3>
                                <div className="relative w-64">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Pesquisar..." 
                                        value={searchTerm} 
                                        onChange={e => setSearchTerm(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-black focus:border-black" 
                                    />
                                </div>
                            </div>
                            <Droppable droppableId="catalog">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-[500px] overflow-y-auto space-y-2">
                                        {filteredCatalog.map((item, index) => (
                                            <BookCard key={`cat-${item.id}`} item={item} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
            </div>
        </AuthenticatedLayout>
    );
}