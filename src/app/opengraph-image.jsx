import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mentari Wedding — Planned to Perfection';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#050505',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    fontFamily: 'serif',
                }}
            >
                {/* Gold ambient glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(206,177,117,0.06) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />

                {/* Top line */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(206,177,117,0.4), transparent)',
                }} />
                {/* Bottom line */}
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(206,177,117,0.4), transparent)',
                }} />
                {/* Left line */}
                <div style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0,
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, rgba(206,177,117,0.4), transparent)',
                }} />
                {/* Right line */}
                <div style={{
                    position: 'absolute',
                    top: 0, bottom: 0, right: 0,
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, rgba(206,177,117,0.4), transparent)',
                }} />

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                    {/* Tag */}
                    <p style={{
                        fontSize: '11px',
                        letterSpacing: '6px',
                        textTransform: 'uppercase',
                        color: 'rgba(206,177,117,0.6)',
                        marginBottom: '32px',
                        fontFamily: 'sans-serif',
                        fontWeight: 300,
                    }}>
                        — Wedding Organizer · Sukabumi —
                    </p>

                    {/* Main title */}
                    <h1 style={{
                        fontSize: '72px',
                        fontWeight: 300,
                        color: '#FAFAFA',
                        lineHeight: 1.05,
                        textAlign: 'center',
                        margin: 0,
                        marginBottom: '8px',
                    }}>
                        Mentari Wedding
                    </h1>

                    {/* Italic subtitle */}
                    <p style={{
                        fontSize: '36px',
                        fontWeight: 300,
                        fontStyle: 'italic',
                        background: 'linear-gradient(to right, #E8D399, #CEB175, #B59554)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        margin: 0,
                        marginBottom: '40px',
                    }}>
                        Planned to Perfection
                    </p>

                    {/* Divider */}
                    <div style={{
                        width: '80px',
                        height: '1px',
                        background: 'linear-gradient(to right, transparent, rgba(206,177,117,0.5), transparent)',
                        marginBottom: '32px',
                    }} />

                    {/* Tagline */}
                    <p style={{
                        fontSize: '13px',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.25)',
                        fontFamily: 'sans-serif',
                        fontWeight: 300,
                        margin: 0,
                    }}>
                        By Inquiry Only · Est. 2019
                    </p>
                </div>
            </div>
        ),
        { ...size }
    );
}
