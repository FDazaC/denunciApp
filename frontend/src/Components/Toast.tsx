import React, { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }: { message: string | null; type?: "info" | "success" | "error"; onClose?: () => void; }) {
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(() => {
            onClose?.();
        }, 3500);

        return () => clearTimeout(t);
    }, [message, onClose]);

    if (!message) return null;

    const baseStyle: React.CSSProperties = {
        position: "fixed",
        right: "16px",
        bottom: "24px",
        zIndex: 9999,
        padding: "10px 14px",
        borderRadius: 8,
        color: "#fff",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        maxWidth: "320px",
    };

    const palette: Record<string, string> = {
        info: "#3b82f6",
        success: "#10b981",
        error: "#ef4444",
    };

    return (
        <div style={{ ...baseStyle, background: palette[type] || palette.info }} onClick={onClose}>
            {message}
        </div>
    );
}
