import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface VerificationEmailProps {
    customerName?: string;
    code: string;
    expiresInMinutes?: number;
}

export function VerificationEmail({
    customerName = 'Usuario',
    code,
    expiresInMinutes = 10,
}: VerificationEmailProps) {
    // Split code into individual digits for premium display
    const codeDigits = code.split('');

    return (
        <Html>
            <Head>
                <style>
                    {`
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    `}
                </style>
            </Head>
            <Preview>Tu código de verificación KODE: {code}</Preview>
            <Body style={main}>
                {/* Outer glow effect background */}
                <div style={glowBackground} />

                <Container style={container}>
                    {/* Header with Logo */}
                    <Section style={header}>
                        {/* KODE Logo - Styled text for maximum email compatibility */}
                        <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                            <tr>
                                <td style={logoContainer}>
                                    <Text style={logoText}>KODE</Text>
                                </td>
                            </tr>
                        </table>
                        <Text style={tagline}>Decode your Style</Text>
                    </Section>

                    {/* Decorative line */}
                    <div style={gradientLine} />

                    {/* Main content */}
                    <Section style={mainContent}>
                        <Heading style={h1}>Verifica tu cuenta</Heading>
                        <Text style={heroText}>
                            Usa el siguiente código para completar tu registro en KODE.
                        </Text>

                        {/* Premium OTP Code Display */}
                        <Section style={codeSection}>
                            <table cellPadding="0" cellSpacing="0" style={codeTable}>
                                <tr>
                                    {codeDigits.map((digit, index) => (
                                        <React.Fragment key={index}>
                                            <td style={codeDigitCell}>
                                                <div style={codeDigitBox}>
                                                    <Text style={codeDigitText}>{digit}</Text>
                                                </div>
                                            </td>
                                            {index === 2 && (
                                                <td style={codeSeparator}>
                                                    <div style={separatorDot} />
                                                </td>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </table>
                        </Section>

                        {/* Timer badge */}
                        <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto 32px' }}>
                            <tr>
                                <td style={timerBadge}>
                                    <span style={timerIcon}>⏱️</span>
                                    <Text style={timerText}>
                                        Expira en <strong style={timerStrong}>{expiresInMinutes} minutos</strong>
                                    </Text>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    {/* Decorative divider */}
                    <Hr style={hr} />

                    {/* Security Notice */}
                    <Section style={securitySection}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                            <tr>
                                <td style={securityIconCell}>
                                    <div style={securityIconBox}>🔐</div>
                                </td>
                                <td style={securityContentCell}>
                                    <Text style={securityTitle}>Mantén tu cuenta segura</Text>
                                    <Text style={securityText}>
                                        Nunca compartas este código. KODE jamás te pedirá tu código por teléfono, SMS o redes sociales.
                                    </Text>
                                </td>
                            </tr>
                        </table>
                    </Section>

                    {/* Help section */}
                    <Section style={helpSection}>
                        <Text style={helpText}>
                            ¿No solicitaste este código? Puedes ignorar este mensaje de forma segura.
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Hr style={hr} />
                    <Section style={footer}>
                        <Text style={footerLogo}>KODE</Text>
                        <Text style={footerCopy}>
                            © 2026 KODE. Todos los derechos reservados.
                        </Text>
                        <Text style={footerAddress}>
                            Osorno, Chile
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// ============ STYLES ============

const main: React.CSSProperties = {
    backgroundColor: '#0a0a0a',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '0',
};

const glowBackground: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
};

const container: React.CSSProperties = {
    backgroundColor: '#111111',
    margin: '0 auto',
    padding: '0',
    maxWidth: '520px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    overflow: 'hidden',
};

const header: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 40px 24px',
    background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, transparent 100%)',
};

const logoContainer: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)',
    border: '1px solid rgba(249, 115, 22, 0.2)',
};

const logoText: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '6px',
    margin: '0',
};

const tagline: React.CSSProperties = {
    fontSize: '12px',
    color: '#737373',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    margin: '16px 0 0',
};

const gradientLine: React.CSSProperties = {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)',
    margin: '0 40px',
};

const mainContent: React.CSSProperties = {
    padding: '32px 40px',
};

const h1: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: '700',
    textAlign: 'center',
    margin: '0 0 20px',
    letterSpacing: '-0.5px',
};


const heroText: React.CSSProperties = {
    color: '#737373',
    fontSize: '14px',
    textAlign: 'center',
    margin: '0 0 32px',
    lineHeight: '1.6',
};

const codeSection: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '24px',
};

const codeTable: React.CSSProperties = {
    margin: '0 auto',
    borderSpacing: '0',
};

const codeDigitCell: React.CSSProperties = {
    padding: '0 4px',
};

const codeDigitBox: React.CSSProperties = {
    width: '52px',
    height: '64px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '2px solid #f97316',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
};

const codeDigitText: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: '"SF Mono", "Monaco", "Inconsolata", monospace',
    margin: '0',
    lineHeight: '64px',
};

const codeSeparator: React.CSSProperties = {
    padding: '0 8px',
    verticalAlign: 'middle',
};

const separatorDot: React.CSSProperties = {
    width: '8px',
    height: '8px',
    backgroundColor: '#404040',
    borderRadius: '50%',
    margin: '0 auto',
};

const timerBadge: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: '100px',
    border: '1px solid rgba(249, 115, 22, 0.2)',
};

const timerIcon: React.CSSProperties = {
    fontSize: '14px',
};

const timerText: React.CSSProperties = {
    color: '#a3a3a3',
    fontSize: '13px',
    margin: '0',
};

const timerStrong: React.CSSProperties = {
    color: '#f97316',
    fontWeight: '600',
};

const hr: React.CSSProperties = {
    borderColor: '#1f1f1f',
    borderStyle: 'solid',
    borderWidth: '1px 0 0 0',
    margin: '0 40px',
};

const securitySection: React.CSSProperties = {
    padding: '24px 40px',
    backgroundColor: 'rgba(249, 115, 22, 0.03)',
};

const securityIconCell: React.CSSProperties = {
    verticalAlign: 'top',
    paddingRight: '16px',
    width: '48px',
};

const securityIconBox: React.CSSProperties = {
    width: '44px',
    height: '44px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '1px solid #262626',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: '20px',
    lineHeight: '44px',
};

const securityContentCell: React.CSSProperties = {
    verticalAlign: 'top',
};

const securityTitle: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 4px',
};

const securityText: React.CSSProperties = {
    color: '#737373',
    fontSize: '13px',
    margin: '0',
    lineHeight: '1.5',
};

const helpSection: React.CSSProperties = {
    padding: '20px 40px',
    textAlign: 'center',
};

const helpText: React.CSSProperties = {
    color: '#525252',
    fontSize: '12px',
    margin: '0',
    fontStyle: 'italic',
};

const footer: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 40px 40px',
    backgroundColor: '#0d0d0d',
};

const footerLogo: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#404040',
    letterSpacing: '4px',
    margin: '0 0 16px',
};



const footerCopy: React.CSSProperties = {
    color: '#404040',
    fontSize: '11px',
    margin: '0 0 4px',
};

const footerAddress: React.CSSProperties = {
    color: '#333333',
    fontSize: '11px',
    margin: '0',
};

export default VerificationEmail;
