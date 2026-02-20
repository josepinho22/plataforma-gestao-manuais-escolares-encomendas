import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import BookCard from '@/Components/BookCard';
import FilterSection from '@/Components/FilterSection';

export default function BooksLists({ auth, catalog = [], concelhos = [], escolas = [], anos_letivos = [], anos_escolares = [], disciplinas = [], ano_letivo_vigente_id = null }) {
    const [currentList, setCurrentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // 1. Estado para a Disciplina Selecionada
    const [selectedDisciplina, setSelectedDisciplina] = useState(""); 
    
    const [showSuccessModal, setShowSuccessModal] = useState(false); 

    const { data, setData, post, processing, transform } = useForm({
        concelho: '',
        escola_id: '',
        ano_letivo_id: '',
        ano_escolar_id: '',
        items: [],
    });

    // 2. Disciplinas vindas do backend 
    const disciplinasOrdenadas = useMemo(() => {
        return disciplinas || [];
    }, [disciplinas]);

    // 3. Definir ano letivo vigente como padrão ao carregar
    useEffect(() => {
        if (ano_letivo_vigente_id && !data.ano_letivo_id) {
            setData('ano_letivo_id', ano_letivo_vigente_id);
        }
    }, [ano_letivo_vigente_id]);

    // 4. Lógica de Filtragem Combinada 
    const filteredCatalog = catalog.filter(book => {
        if (!book || !book.id) return false;

        const matchesSearch = book.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             book.isbn?.includes(searchTerm);
        
        const matchesDisciplina = selectedDisciplina === "" || 
                                 book.disciplina?.nome === selectedDisciplina;

        return matchesSearch && matchesDisciplina;
    });

    useEffect(() => {
        if (data.escola_id && data.ano_letivo_id && data.ano_escolar_id) {
            setCurrentList([]);
            axios.get(route('api.lista.manuais'), {
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
                console.error("❌ Erro ao carregar lista:", err);
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

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === 'catalog' && destination.droppableId === 'currentList') {
            const item = filteredCatalog[source.index];
            if (!item || !item.id) return;

            const itensParaAdicionar = [item];

            // Se arrastar MANUAL, buscar o CADERNO_ATIVIDADES correspondente
            if (item.tipo === 'MANUAL' && item.disciplina_id) {
                const caderno = catalog.find(livro =>
                    livro.tipo === 'CADERNO_ATIVIDADES' &&
                    livro.disciplina_id === item.disciplina_id &&
                    livro.ano_escolar_id === item.ano_escolar_id
                );
                if (caderno) itensParaAdicionar.push(caderno);
            }

            // Se arrastar CADERNO_ATIVIDADES, buscar o MANUAL correspondente
            if (item.tipo === 'CADERNO_ATIVIDADES' && item.disciplina_id) {
                const manual = catalog.find(livro =>
                    livro.tipo === 'MANUAL' &&
                    livro.disciplina_id === item.disciplina_id &&
                    livro.ano_escolar_id === item.ano_escolar_id
                );
                if (manual) itensParaAdicionar.push(manual);
            }

            setCurrentList(prev => {
                const novosItens = itensParaAdicionar.filter(
                    novoItem => !prev.find(i => i.id === novoItem.id)
                );
                return [...prev, ...novosItens];
            });
        }
    };

    const handleCancel = () => {
        setData({
            concelho: '',
            escola_id: '',
            ano_letivo_id: ano_letivo_vigente_id || '',
            ano_escolar_id: '',
            items: [],
        });
        setCurrentList([]);
        setSearchTerm('');
        setSelectedDisciplina('');
    };

    const handleSave = () => {
        const itemsIds = currentList.map(item => item.id);
        transform((formData) => ({
            ...formData,
            ano_letivo_id: ano_letivo_vigente_id,
            items: itemsIds
        }));

        post(route('manuais-lists.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 3000);
                // Atualizar o filtro para refletir o ano vigente após salvar
                if (data.ano_letivo_id !== ano_letivo_vigente_id) {
                    setData('ano_letivo_id', ano_letivo_vigente_id);
                }
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gerir Listas" />
            <div className="-m-8 min-h-screen bg-gray-50/80 font-sans flex flex-col">
             <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 py-8 space-y-6">

                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gerir Listas de Manuais</h1>
                    <p className="text-sm text-gray-500/80 mt-1 font-medium">Selecione a escola e o ano para gerir a lista de manuais.</p>
                </div>

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
                            <span className="font-bold text-lg">Lista Salva com Sucesso!</span>
                        </div>
                    </div>
                )}

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* LISTA ATUAL */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-extrabold text-gray-700 tracking-tight">Lista Atual ({currentList.length})</h3>
                            <Droppable droppableId="currentList">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`p-4 rounded-2xl border-2 border-dashed min-h-[500px] transition-colors
                                            ${snapshot.isDraggingOver ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50/80 border-gray-200'}`}
                                    >
                                        {currentList.length > 0 ? (
                                            currentList.map((item, index) => (
                                                <BookCard
                                                    key={`list-item-${item.id}-${index}`}
                                                    item={item}
                                                    index={index}
                                                    isRemovable
                                                    onRemove={() => setCurrentList(prev => prev.filter((_, i) => i !== index))}
                                                    draggablePrefix="list-"
                                                />
                                            ))
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

                        {/* CATÁLOGO COM FILTROS */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <h3 className="text-sm font-extrabold text-gray-700 tracking-tight">Catálogo de Livros</h3>

                                <div className="flex flex-1 w-full sm:w-auto gap-2">
                                    {/* Select de Disciplinas */}
                                    <select
                                        value={selectedDisciplina}
                                        onChange={(e) => setSelectedDisciplina(e.target.value)}
                                        className="w-1/3 glass-input rounded-xl py-2 px-3 text-sm appearance-none"
                                    >
                                        <option value="">Disciplinas</option>
                                        {disciplinasOrdenadas.map(disc => (
                                            <option key={disc.id} value={disc.nome}>{disc.nome}</option>
                                        ))}
                                    </select>

                                    {/* Input de Pesquisa */}
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="text"
                                            placeholder="Pesquisar..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="glass-input w-full pl-9 pr-4 py-2 rounded-xl text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Droppable droppableId="catalog">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="card-3d p-4 rounded-2xl h-[500px] overflow-y-auto space-y-2 custom-scrollbar">
                                        {filteredCatalog.length > 0 ? (
                                            filteredCatalog.map((item, index) => (
                                                <BookCard
                                                    key={`cat-${item.id}`}
                                                    item={item}
                                                    index={index}
                                                    draggablePrefix="catalog-"
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-10 text-gray-400 text-sm">
                                                Nenhum livro encontrado.
                                            </div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                    </div>
                </DragDropContext>
             </div>
            </div>
        </AuthenticatedLayout>
    );
}