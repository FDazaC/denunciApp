import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";

export interface DeviceLocation {
    lat: number;
    lng: number;
}

async function mediaToFile(media: any, fallbackName: string): Promise<File> {
    const source =
        media.webPath ?? media.path ?? media.uri ?? null;

    if (!source) {
        throw new Error("No se pudo leer la imagen seleccionada");
    }

    const needsConvert =
        source.startsWith("file://") ||
        source.startsWith("/") ||
        source.startsWith("content://");

    const fetchUrl = needsConvert ? Capacitor.convertFileSrc(source) : source;

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`fetch imagen falló: ${response.status}`);

    const blob = await response.blob();
    const ext = media.format ?? blob.type.split("/")[1] ?? "jpg";

    return new File(
        [blob],
        `${fallbackName}.${ext === "jpeg" ? "jpg" : ext}`,
        { type: blob.type || "image/jpeg" }
    );
}

function isGranted(value: string | null | undefined): boolean {
    return value === "granted" || value === "limited";
}

async function ensureCameraPermission(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    let camStatus: string | null = null;
    try {
        const check = await Camera.checkPermissions();
        camStatus = check.camera ?? null;
    } catch {
    }

    if (isGranted(camStatus)) return;

    try {
        const req = await Camera.requestPermissions({ permissions: ["camera"] });
        camStatus = req.camera ?? null;
    } catch (e) {
        throw new Error("No se pudo solicitar permiso de cámara");
    }

    if (!isGranted(camStatus)) {
        throw new Error(
            "Permiso de cámara denegado. Habilítalo en Ajustes → Aplicaciones → denunciApp → Permisos."
        );
    }
}

async function ensurePhotosPermission(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    let photosStatus: string | null = null;
    try {
        const check = await Camera.checkPermissions();
        photosStatus = check.photos ?? (check as any).storage ?? null;
    } catch {
    }

    if (isGranted(photosStatus)) return;

    try {
        const req = await Camera.requestPermissions({ permissions: ["photos"] });
        photosStatus = req.photos ?? (req as any).storage ?? null;
    } catch (e) {
        throw new Error("No se pudo solicitar permiso de galería");
    }

    if (!isGranted(photosStatus)) {
        throw new Error(
            "Permiso de galería denegado. Habilítalo en Ajustes → Aplicaciones → denunciApp → Permisos."
        );
    }
}

export async function requestLocationPermission(): Promise<boolean> {
    try {
        if (!Capacitor.isNativePlatform()) return true;

        let locStatus: string | null = null;
        try {
            const check = await Geolocation.checkPermissions();
            locStatus = check.location ?? null;
        } catch {
        }

        if (isGranted(locStatus)) return true;

        if (locStatus === "denied") return false;

        let reqStatus: string | null = null;
        try {
            const req = await Geolocation.requestPermissions({ permissions: ["location"] });
            reqStatus = req.location ?? null;
        } catch {
        }

        await new Promise<void>((resolve) => setTimeout(resolve, 300));

        try {
            const recheck = await Geolocation.checkPermissions();
            const recheckStatus = recheck.location ?? null;
            if (isGranted(recheckStatus)) return true;
            if (recheckStatus === "denied") return false;
        } catch {
        }

        if (reqStatus === "prompt" || reqStatus === null) return true;

        return reqStatus !== "denied";
    } catch {
        return false;
    }
}

export async function getCurrentDeviceLocation(): Promise<DeviceLocation | null> {
    try {
        if (Capacitor.isNativePlatform()) {
            const ok = await requestLocationPermission();
            if (!ok) return null;
        }

        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
        });

        return {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
    } catch (error) {
        console.warn("No se pudo obtener la ubicación actual", error);
        return null;
    }
}

export async function takeReportPhoto(): Promise<File> {
    await ensureCameraPermission();

    const photo = await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        correctOrientation: true,
        saveToGallery: false,
    });

    return mediaToFile(photo, `reporte-camara-${Date.now()}`);
}

export async function chooseReportPhoto(): Promise<File> {
    await ensurePhotosPermission();

    const photo = await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        correctOrientation: true,
    });

    return mediaToFile(photo, `reporte-galeria-${Date.now()}`);
}


export async function requestAllPermissions() {
    let camera: string | null = null;
    let photos: string | null = null;
    let location: string | null = null;

    try {
        if (!Capacitor.isNativePlatform()) {
            camera = "granted";
            photos = "granted";
        } else {
            const check = await Camera.checkPermissions();
            camera = check.camera ?? null;
            photos = check.photos ?? (check as any).storage ?? null;

            if (!isGranted(camera)) {
                const req = await Camera.requestPermissions({ permissions: ["camera"] });
                camera = req.camera ?? null;
            }
            if (!isGranted(photos)) {
                const req = await Camera.requestPermissions({ permissions: ["photos"] });
                photos = req.photos ?? (req as any).storage ?? null;
            }
        }
    } catch {
    }

    try {
        if (!Capacitor.isNativePlatform()) {
            location = "prompt";
        } else {
            const check = await Geolocation.checkPermissions();
            location = check.location ?? null;

            if (!isGranted(location)) {
                const req = await Geolocation.requestPermissions({ permissions: ["location"] });
                location = req.location ?? null;
            }
        }
    } catch {
    }

    return {
        camera,
        photos,
        location,
        ok: isGranted(location) || location === "prompt",
        details: {
            hasCam: isGranted(camera),
            hasPhotos: isGranted(photos),
            hasLocation: isGranted(location) || location === "prompt",
        },
    };
}