interface Props {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ open, title = "Confirmar", message, onConfirm, onCancel }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-700 mb-4">{message}</p>

                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Eliminar</button>
                </div>
            </div>
        </div>
    );
}
