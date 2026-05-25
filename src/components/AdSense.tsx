import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const AdSense = () => {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (e) {
            console.error("AdSense push error", e);
        }
    }, []);

    return (
        <div className="w-full flex justify-center my-6 overflow-hidden min-h-[100px] bg-secondary/5 rounded-sm">
            <ins
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '250px' }}
                data-ad-client="ca-pub-6019225094257811"
                data-ad-slot="1521267126"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};

export default AdSense;
