import { Draggable } from '@hello-pangea/dnd';
import { FaGripVertical, FaTrash, FaExclamationTriangle } from "react-icons/fa";

function getStatusFromAlerta(statusAlerta) {
    if (statusAlerta === 0) {
        return { bg: 'bg-green-50 border-green-200', icon: 'text-green-400', title: 'Atualizado' };
    } else if (statusAlerta === 1) {
        return { bg: 'bg-orange-50 border-yellow-200', icon: 'text-orange-400', title: 'Atualizado há 1 ano letivo' };
    }
    return { bg: 'bg-red-100 border-red-400', icon: 'text-red-600', title: 'Desatualizado' };
}

export default function BookCard({ item, index, isRemovable, onRemove, onPriceChange, showUpdateAlert, draggablePrefix = '' }) {
    const status = showUpdateAlert ? getStatusFromAlerta(item.status_alerta) : null;
    return (
        <Draggable draggableId={`${draggablePrefix}${item.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`relative overflow-hidden p-4 mb-3 rounded-xl border transition-all flex items-center justify-between group
                        ${snapshot.isDragging
                            ? 'shadow-2xl border-blue-500 scale-105 z-50 bg-white'
                            : status
                                ? `${status.bg} shadow-sm`
                                : 'bg-white shadow-sm border-gray-200 hover:border-blue-300'
                        }`}
                    title={status?.title}
                >
                    {status && (
                        <div className="absolute -right-3 -bottom-3 opacity-10">
                            <FaExclamationTriangle className={status.icon} size={64} />
                        </div>
                    )}
                    <div className="relative z-10 flex items-center gap-3">
                        <FaGripVertical className="text-gray-300 group-hover:text-blue-400 transition-colors" />

                        <div>
                            <p className="font-bold text-gray-800 text-sm leading-tight">
                                {item.titulo || item.school_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                                {item.year}
                            </p>
                            {isRemovable && onPriceChange ? (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-xs text-blue-600 font-bold">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={item.preco ?? ''}
                                        onChange={(e) => onPriceChange(index, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="w-20 text-xs text-blue-600 font-bold border border-gray-200 rounded-md px-2 py-0.5 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                </div>
                            ) : (
                                item.preco != null && (
                                    <p className="text-xs text-blue-600 font-bold mt-0.5">
                                        €{parseFloat(item.preco).toFixed(2)}
                                    </p>
                                )
                            )}
                        </div>
                    </div>

                    {isRemovable && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onRemove();
                            }}
                            className="relative z-10 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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