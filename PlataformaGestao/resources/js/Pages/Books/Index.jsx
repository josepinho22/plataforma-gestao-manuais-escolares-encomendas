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
    const [showSuccessModal, setShowSuccessModal] = useState(false); 

    const { data, setData, post, processing, transform } = useForm({
        concelho: '',
        escola_id: '',
        ano_letivo_id: '',
        ano_escolar_id: '',
        items: [],
    });

    useEffect(() => {
    console.log('🔄 useEffect executado - Carregando lista...');
    console.log('Filtros:', { escola_id: data.escola_id, ano_letivo_id: data.ano_letivo_id, ano_escolar_id: data.ano_escolar_id });

    if (data.escola_id && data.ano_letivo_id && data.ano_escolar_id) {
        console.log('✅ Todos os filtros preenchidos, buscando lista...');
        setCurrentList([]);

        axios.get(route('api.lista.books'), {
            params: {
                escola_id: data.escola_id,
                ano_letivo_id: data.ano_letivo_id,
                ano_escolar_id: data.ano_escolar_id
            }
        })
        .then(res => {
            console.log('📦 Resposta da API:', res.data);
            const novaLista = Array.isArray(res.data) ? res.data : [];
            console.log('📋 Lista carregada:', novaLista.length, 'itens');
            setCurrentList(novaLista);
        })
        .catch(err => {
            console.error("❌ Erro ao carregar lista:", err);
            setCurrentList([]);
        });
    } else {
        console.log('⚠️ Filtros incompletos, lista vazia');
        setCurrentList([]);
    }
}, [data.escola_id, data.ano_letivo_id, data.ano_escolar_id]);

    const availableEscolas = useMemo(() => {
        if (!data.concelho) return [];
        return escolas.filter(escola => String(escola.concelho_id) === String(data.concelho));
    }, [data.concelho, escolas]);

    const filteredCatalog = catalog.filter(book => {
        // Validar se o item tem ID e título válidos
        if (!book || !book.id) {
            console.warn('⚠️ Item inválido no catálogo:', book);
            return false;
        }
        return book.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'catalog' && destination.droppableId === 'currentList') {
        const item = filteredCatalog[source.index];

        // Validar se o item existe e tem ID válido
        if (!item || !item.id) {
            console.error('❌ Item inválido ao arrastar:', { index: source.index, item });
            return;
        }

        const itensParaAdicionar = [item];

        // Se for um MANUAL, procurar o CADERNO correspondente
        if (item.tipo === 'MANUAL' && item.disciplina_id) {
            const caderno = catalog.find(livro =>
                livro.tipo === 'CADERNO_ATIVIDADES' &&
                livro.disciplina_id === item.disciplina_id &&
                livro.ano_escolar_id === item.ano_escolar_id
            );

            if (caderno) {
                console.log('📚 Caderno correspondente encontrado:', caderno.titulo);
                itensParaAdicionar.push(caderno);
            }
        }

        // Adicionar os itens que não existem na lista
        setCurrentList(prev => {
            const novosItens = itensParaAdicionar.filter(
                novoItem => !prev.find(i => i.id === novoItem.id)
            );

            if (novosItens.length > 0) {
                console.log('✅ Adicionando itens:', novosItens.map(i => i.titulo));
                return [...prev, ...novosItens];
            } else {
                console.log('⚠️ Todos os itens já existem na lista');
                return prev;
            }
        });
    }
};

    const handleCancel = () => {
    console.log('🔄 Cancelar - Recarregando lista original...');
    // Recarregar a lista original do banco de dados
    if (data.escola_id && data.ano_letivo_id && data.ano_escolar_id) {
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
            console.log('✅ Lista original recarregada');
        })
        .catch(err => {
            console.error("❌ Erro ao recarregar lista:", err);
        });
    } else {
        // Se não há filtros selecionados, apenas limpa a lista
        setCurrentList([]);
    }
};

    const handleSave = () => {
    console.log('=== handleSave chamado ===');
    console.log('data:', data);
    console.log('currentList:', currentList);

    const itemsIds = currentList.map(item => item.id);
    console.log('items (IDs):', itemsIds);

    // Usar transform ANTES de post para modificar os dados
    transform((formData) => {
        console.log('🔧 Transform - data recebido:', formData);
        const transformed = {
            ...formData,
            items: itemsIds
        };
        console.log('🔧 Transform - data transformado:', transformed);
        return transformed;
    });

    console.log('Chamando post...');

    // Agora chamar post
    post(route('book-lists.store'), {
        preserveScroll: true,
        onSuccess: (response) => {
            console.log('✅ Sucesso!', response);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        },
        onError: (errors) => {
            console.error('❌ Erro ao salvar:', errors);
            alert('Erro ao salvar a lista. Verifique o console para mais detalhes.');
        },
        onFinish: () => {
            console.log('=== Requisição finalizada ===');
        }
    });
};

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gerir Listas" />
            <div className="space-y-6">
                
                <FilterSection
                    data={data}
                    setData={setData}
                    concelhos={concelhos}
                    availableEscolas={availableEscolas}
                    anos_letivos={anos_letivos}
                    anos_escolares={anos_escolares}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    processing={processing}
                />

                {/* Modal de Sucesso */}
                {showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce pointer-events-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-bold text-lg">Lista Salva com Sucesso!</span>
                        </div>
                    </div>
                )}

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
                                draggablePrefix="list-"
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
                                            <BookCard
                                                key={`cat-${item.id}`}
                                                item={item}
                                                index={index}
                                                draggablePrefix="catalog-"
                                            />
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