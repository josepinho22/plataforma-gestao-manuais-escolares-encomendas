import { Draggable } from '@hello-pangea/dnd';
import { FaGripVertical, FaTrash } from "react-icons/fa";

export default function BookCard({ item, index, isRemovable, onRemove }) {
    return (
        <Draggable draggableId={String(item.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-4 mb-3 rounded-xl border transition-all flex items-center justify-between group 
                        ${snapshot.isDragging ? 'shadow-2xl border-blue-500 scale-105 z-50' : 'shadow-sm border-gray-200 hover:border-blue-300'}`}
                >
                    <div className="flex items-center gap-3">
                        {/* Ícone de arrastar (os 6 pontinhos da imagem) */}
                        <FaGripVertical className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                        
                        <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">
                                {item.titulo || item.school_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                                {item.year}
                            </p>
                            {item.preco && (
                                <p className="text-xs text-blue-600 font-bold mt-0.5">
                                    €{parseFloat(item.preco).toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Botão de remoção (X vermelho) */}
                    {isRemovable && (
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Remover da lista"
                        >
                            <FaTrash size={14} />
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
}