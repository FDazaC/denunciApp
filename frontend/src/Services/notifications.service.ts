import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const CHANNEL_ID = "denunciapp-status-updates";

async function createNotificationChannel() {
    if (!Capacitor.isNativePlatform()) return;

    try {
        await LocalNotifications.createChannel({
            id: CHANNEL_ID,
            name: "Actualizaciones de reportes",
            description: "Notificaciones cuando cambia el estado de un reporte",
            importance: 4,
            visibility: 1,
        });
    } catch (error) {
        console.warn("No se pudo crear el canal de notificaciones", error);
    }
}

export async function requestNotificationPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") return true;
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }

        return false;
    }

    try {
        const permission = await LocalNotifications.requestPermissions();
        const granted = permission.display === "granted";

        if (granted) {
            await createNotificationChannel();
        }

        return granted;
    } catch (error) {
        console.warn("Error solicitando permiso de notificación", error);
        return false;
    }
}

export async function sendLocalNotification(title: string, body: string) {
    if (Capacitor.isNativePlatform()) {
        try {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: Math.floor(Date.now() % 100000),
                        title,
                        body,
                        channelId: CHANNEL_ID,
                        schedule: { at: new Date(Date.now() + 100) },
                        extra: { type: "status-update" },
                    },
                ],
            });
        } catch (error) {
            console.warn("Error agendando notificación nativa", error);
        }

        return;
    }

    if (typeof window !== "undefined" && "Notification" in window) {
        try {
            if (Notification.permission === "granted") {
                new Notification(title, { body });
            }
        } catch (error) {
            console.warn("Error mostrando notificación web", error);
        }
    }
}
