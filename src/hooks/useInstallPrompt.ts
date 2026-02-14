import { useEffect, useState } from "react";

type DeferredPrompt = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function useInstallPrompt() {
    const [deferred, setDeferred] = useState<DeferredPrompt | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferred(e as DeferredPrompt);
        };

        const onAppInstalled = () => {
            setIsInstalled(true);
            setDeferred(null);
        };

        // Om den redan är installerad (vissa browsers)
        if (window.matchMedia?.("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as any);
        window.addEventListener("appinstalled", onAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as any);
            window.removeEventListener("appinstalled", onAppInstalled);
        };
    }, []);

    const canInstall = !!deferred && !isInstalled;

    const install = async () => {
        if (!deferred) return;
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "accepted") {
            setDeferred(null);
            setIsInstalled(true);
        }
    };

    return { canInstall, install, isInstalled };
}
