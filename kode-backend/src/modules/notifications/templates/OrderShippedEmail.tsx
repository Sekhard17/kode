import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Button,
} from '@react-email/components';

interface OrderShippedEmailProps {
    customerName: string;
    orderNumber: string;
    trackingCode?: string;
    trackingUrl?: string;
    carrierName?: string;
    logoUrl?: string;
}

export function OrderShippedEmail({
    customerName,
    orderNumber,
    trackingCode,
    trackingUrl,
    carrierName = 'el courier',
    logoUrl,
}: OrderShippedEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>¡Tu pedido {orderNumber} está en camino!</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        {logoUrl && (
                            <Img src={logoUrl} alt="KODE" width={120} height={40} style={logo} />
                        )}
                    </Section>

                    {/* Icon */}
                    <Section style={iconSection}>
                        <Text style={iconText}>📦</Text>
                    </Section>

                    {/* Title */}
                    <Heading style={h1}>¡Tu pedido está en camino!</Heading>
                    <Text style={heroText}>
                        Hola {customerName}, tu pedido <strong>#{orderNumber}</strong> ha sido
                        despachado y va camino a tu dirección.
                    </Text>

                    <Hr style={hr} />

                    {/* Tracking Info */}
                    {trackingCode && (
                        <Section style={trackingSection}>
                            <Heading as="h2" style={h2}>Información de Seguimiento</Heading>
                            <Text style={trackingInfo}>
                                <strong>Courier:</strong> {carrierName}
                            </Text>
                            <Text style={trackingInfo}>
                                <strong>Código de seguimiento:</strong> {trackingCode}
                            </Text>
                            {trackingUrl && (
                                <Button href={trackingUrl} style={button}>
                                    Rastrear Pedido
                                </Button>
                            )}
                        </Section>
                    )}

                    {!trackingCode && (
                        <Section style={trackingSection}>
                            <Text style={heroText}>
                                Pronto recibirás información de seguimiento de tu envío.
                            </Text>
                        </Section>
                    )}

                    <Hr style={hr} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            ¿Tienes preguntas sobre tu envío? Contáctanos en{' '}
                            <Link href="mailto:soporte@kode.cl" style={link}>
                                soporte@kode.cl
                            </Link>
                        </Text>
                        <Text style={footerCopy}>© 2026 KODE. Todos los derechos reservados.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main: React.CSSProperties = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container: React.CSSProperties = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
    borderRadius: '8px',
};

const header: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '16px',
};

const logo: React.CSSProperties = {
    margin: '0 auto',
};

const iconSection: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '16px',
};

const iconText: React.CSSProperties = {
    fontSize: '48px',
    margin: '0',
};

const h1: React.CSSProperties = {
    color: '#1a1a1a',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 0 16px',
};

const h2: React.CSSProperties = {
    color: '#1a1a1a',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px',
};

const heroText: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '16px',
    textAlign: 'center',
    margin: '0 0 32px',
};

const hr: React.CSSProperties = {
    borderColor: '#e2e8f0',
    margin: '24px 0',
};

const trackingSection: React.CSSProperties = {
    textAlign: 'center',
    padding: '16px 0',
};

const trackingInfo: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '14px',
    margin: '0 0 8px',
};

const button: React.CSSProperties = {
    backgroundColor: '#f97316',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 24px',
    marginTop: '16px',
};

const footer: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '32px',
};

const footerText: React.CSSProperties = {
    color: '#718096',
    fontSize: '14px',
    margin: '0 0 8px',
};

const footerCopy: React.CSSProperties = {
    color: '#a0aec0',
    fontSize: '12px',
    marginTop: '24px',
};

const link: React.CSSProperties = {
    color: '#f97316',
    textDecoration: 'underline',
};

export default OrderShippedEmail;
