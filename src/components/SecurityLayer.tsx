import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const SecurityLayer = ({ children }: { children: React.ReactNode }) => {
    const devtoolsWarningShown = useRef(false);
    const { isAdmin } = useAuth();

    useEffect(() => {
        // Se for admin, não aplicar as restrições
        if (isAdmin) {
            console.log("[Security] Admin detectado, ignorando protecções de conteúdo.");
            return;
        }

        // =============================================
        // 1. Bloquear Clique Direito (Menu de Contexto)
        // =============================================
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // =============================================
        // 2. Bloquear Atalhos de Teclado
        // =============================================
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCtrlOrMeta = e.ctrlKey || e.metaKey;

            // F12
            if (e.key === "F12") {
                e.preventDefault();
                toast.error("Acesso negado às Ferramentas de Programador.");
            }

            // Ctrl + U (Ver Fonte)
            if (isCtrlOrMeta && e.key.toLowerCase() === "u") {
                e.preventDefault();
                toast.error("Acesso à fonte da página desativado por segurança.");
            }

            // Ctrl + Shift + I / J (Inspecionar)
            if (isCtrlOrMeta && e.shiftKey && (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) {
                e.preventDefault();
                toast.error("Inspecção de elementos bloqueada.");
            }

            // Ctrl + Shift + C (Pick element)
            if (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === "c") {
                e.preventDefault();
                toast.error("Inspecção de elementos bloqueada.");
            }

            // Ctrl + S (Guardar página)
            if (isCtrlOrMeta && e.key.toLowerCase() === "s") {
                e.preventDefault();
                toast.error("Não é permitido guardar cópias locais deste site.");
            }

            // Ctrl + A (Selecionar tudo)
            if (isCtrlOrMeta && e.key.toLowerCase() === "a") {
                const target = e.target as HTMLElement;
                if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    toast.warning("A selecção de conteúdo editorial não é permitida.");
                }
            }

            // Ctrl + C (Cópia)
            if (isCtrlOrMeta && e.key.toLowerCase() === "c") {
                const target = e.target as HTMLElement;
                if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    toast.warning("A cópia de conteúdo editorial não é permitida.");
                }
            }

            // Ctrl + P (Imprimir)
            if (isCtrlOrMeta && e.key.toLowerCase() === "p") {
                e.preventDefault();
                toast.error("A impressão desta página não é permitida.");
            }
        };

        // =============================================
        // 3. Bloquear Eventos de Cópia/Corte/Selectall
        // =============================================
        const handleCopy = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
                e.preventDefault();
                // Substituir clipboard com mensagem de protecção
                e.clipboardData?.setData("text/plain", "Conteúdo Protegido — Angola Sem Filtros");
                toast.error("O conteúdo deste portal está protegido contra cópia.");
            }
        };

        const handleCut = (e: ClipboardEvent) => {
            e.preventDefault();
        };

        const handleSelectStart = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
                e.preventDefault();
            }
        };

        // =============================================
        // 4. Bloquear Drag & Drop de conteúdo
        // =============================================
        const handleDragStart = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
                e.preventDefault();
            }
        };

        // =============================================
        // 5. Dissuasão de Capturas (Visibility/Blur)
        // =============================================
        const handleVisibilityChange = () => {
            if (document.hidden) {
                navigator.clipboard?.writeText("Conteúdo Protegido - Sem Filtros").catch(() => { });
            }
        };

        // =============================================
        // 6. Forçar user-select: none em TODOS os elementos
        // =============================================
        const enforceUserSelectNone = () => {
            // Forçar no body
            document.body.style.setProperty("user-select", "none", "important");
            document.body.style.setProperty("-webkit-user-select", "none", "important");
            document.body.style.setProperty("-webkit-touch-callout", "none", "important");

            // Verificar designMode
            if (document.designMode === "on") {
                document.designMode = "off";
                console.warn("Segurança: designMode foi desactivado.");
            }

            // Limpar qualquer selecção activa
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
                // Verificar se a selecção não é dentro de input/textarea
                const anchorNode = selection.anchorNode;
                const parentEl = anchorNode?.parentElement;
                if (parentEl && parentEl.tagName !== "INPUT" && parentEl.tagName !== "TEXTAREA") {
                    selection.removeAllRanges();
                }
            }
        };

        // =============================================
        // 7. Detecção de DevTools (múltiplas técnicas não-intrusivas)
        // =============================================
        const detectDevTools = () => {
            let devtoolsOpen = false;

            // Técnica 1: Diferença entre outerWidth/innerWidth ou outerHeight/innerHeight
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;

            if (widthThreshold || heightThreshold) {
                devtoolsOpen = true;
            }

            // Técnica 2: Detecção via console.log com getter (REMOVIDO por ser pesado e instável)
            // Mantendo apenas a detecção por redimensionamento

            if (devtoolsOpen && !devtoolsWarningShown.current) {
                devtoolsWarningShown.current = true;
                toast.error(
                    "Ferramentas de Programador detectadas. O conteúdo está protegido.",
                    { id: "devtools-detected", duration: 8000 }
                );
                // Reforçar protecções
                enforceUserSelectNone();
            }

            if (!devtoolsOpen) {
                devtoolsWarningShown.current = false;
            }
        };

        // =============================================
        // 8. MutationObserver Alargado — detectar injecção de styles
        // =============================================
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Detectar mudanças de atributo style em qualquer elemento
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    const target = mutation.target as HTMLElement;
                    const computedStyle = window.getComputedStyle(target);
                    if (
                        computedStyle.userSelect === "text" ||
                        computedStyle.userSelect === "auto" ||
                        computedStyle.userSelect === "all" ||
                        target.style.userSelect === "text" ||
                        target.style.userSelect === "auto" ||
                        target.style.userSelect === "all" ||
                        (target.style as any).webkitUserSelect === "text" ||
                        (target.style as any).webkitUserSelect === "auto"
                    ) {
                        target.style.setProperty("user-select", "none", "important");
                        target.style.setProperty("-webkit-user-select", "none", "important");
                        console.warn("Segurança: Tentativa de remoção de bloqueio de selecção detectada em:", target.tagName);
                    }
                }

                // Detectar adição de novos nós (style tags, link tags)
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const el = node as HTMLElement;
                            // Verificar se é um style tag ou link tag injectado
                            // IMPORTANTE: Ignorar o nosso próprio style tag para evitar loops
                            if (el.id === "sf-security-layer") return;

                            if (el.tagName === "STYLE" || (el.tagName === "LINK" && el.getAttribute("rel") === "stylesheet")) {
                                // Verificar se o style contém user-select overrides que permitem cópia
                                if (el.tagName === "STYLE" && el.textContent) {
                                    const content = el.textContent.toLowerCase();
                                    if (
                                        content.includes("user-select") &&
                                        (content.includes("text") || content.includes("auto") || content.includes("all"))
                                    ) {
                                        el.remove();
                                        console.warn("Segurança: Style tag externo com permissões de selecção removido.");
                                    }
                                }
                            }

                            // Verificar user-select no novo elemento
                            if (el.style && (
                                el.style.userSelect === "text" ||
                                el.style.userSelect === "auto" ||
                                el.style.userSelect === "all"
                            )) {
                                el.style.setProperty("user-select", "none", "important");
                                el.style.setProperty("-webkit-user-select", "none", "important");
                            }
                        }
                    });
                }
            });
        });

        // Observar todo o documento, não apenas o body
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["style"],
            childList: true,
            subtree: true,
        });

        // =============================================
        // 9. Injectar style tag de protecção persistente
        // =============================================
        const securityStyle = document.createElement("style");
        securityStyle.id = "sf-security-layer";
        securityStyle.textContent = `
            *, *::before, *::after {
                user-select: none !important;
                -webkit-user-select: none !important;
                -webkit-touch-callout: none !important;
            }
            input, textarea, [contenteditable="true"] {
                user-select: text !important;
                -webkit-user-select: text !important;
            }
            img, video, canvas, svg {
                pointer-events: none !important;
                -webkit-user-drag: none !important;
            }
            @media print {
                body {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(securityStyle);

        // =============================================
        // 10. Re-enforcement periódico (cada 2000ms - mais leve)
        // =============================================
        const enforcementInterval = setInterval(() => {
            enforceUserSelectNone();

            // Garantir que o nosso style tag de segurança ainda existe e é o último
            const existingStyle = document.getElementById("sf-security-layer");
            if (!existingStyle) {
                // Foi removido — re-injectar
                document.head.appendChild(securityStyle);
            } else if (existingStyle.parentNode && existingStyle.nextSibling) {
                // Mover para o final do head para ter prioridade apenas se houver muitos outros styles
                document.head.appendChild(existingStyle);
            }
        }, 2000);

        // Detecção de DevTools a cada 5 segundos (bem mais leve)
        const devtoolsInterval = setInterval(detectDevTools, 5000);

        // =============================================
        // 11. Sobrescrever getSelection para limitar resultados
        // =============================================
        const originalGetSelection = window.getSelection;
        const patchedGetSelection = function (this: Window) {
            const selection = originalGetSelection.call(this);
            if (selection && selection.toString().length > 0) {
                const anchorNode = selection.anchorNode;
                const parentEl = anchorNode?.parentElement;
                if (parentEl && parentEl.tagName !== "INPUT" && parentEl.tagName !== "TEXTAREA") {
                    setTimeout(() => selection.removeAllRanges(), 0);
                }
            }
            return selection;
        };
        Object.defineProperty(window, "getSelection", {
            value: patchedGetSelection,
            writable: false,
            configurable: true,
        });

        // =============================================
        // Adicionar todos os Event Listeners
        // =============================================
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("cut", handleCut);
        document.addEventListener("selectstart", handleSelectStart);
        document.addEventListener("dragstart", handleDragStart);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Execução inicial
        enforceUserSelectNone();

        // =============================================
        // Cleanup
        // =============================================
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("cut", handleCut);
            document.removeEventListener("selectstart", handleSelectStart);
            document.removeEventListener("dragstart", handleDragStart);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            observer.disconnect();
            clearInterval(enforcementInterval);
            clearInterval(devtoolsInterval);
            securityStyle.remove();

            // Limpar estilos injetados no body
            document.body.style.removeProperty("user-select");
            document.body.style.removeProperty("-webkit-user-select");
            document.body.style.removeProperty("-webkit-touch-callout");

            // Restaurar getSelection original
            Object.defineProperty(window, "getSelection", {
                value: originalGetSelection,
                writable: true,
                configurable: true,
            });
        };
    }, [isAdmin]);

    return <>{children}</>;
};

export default SecurityLayer;
