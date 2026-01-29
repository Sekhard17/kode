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
} from '@react-email/components';

interface PaymentApprovedEmailProps {
    customerName: string;
    orderNumber: string;
    totalClp: number;
    paymentMethod?: string;
    logoUrl?: string;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

export function PaymentApprovedEmail({
    customerName,
    orderNumber,
    totalClp,
    paymentMethod = 'Flow',
    logoUrl,
}: PaymentApprovedEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Pago confirmado para pedido {orderNumber}</Preview>
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
                        <Text style={iconText}>✅</Text>
                    </Section>

                    {/* Title */}
                    <Heading style={h1}>¡Pago Confirmado!</Heading>
                    <Text style={heroText}>
                        Hola {customerName}, hemos recibido tu pago correctamente.
                    </Text>

                    <Hr style={hr} />

                    {/* Payment Details */}
                    <Section style={detailsSection}>
                        <Text style={detailRow}>
                            <strong>Número de pedido:</strong> #{orderNumber}
                        </Text>
                        <Text style={detailRow}>
                            <strong>Monto pagado:</strong> {formatPrice(totalClp)}
                        </Text>
                        <Text style={detailRow}>
                            <strong>Método de pago:</strong> {paymentMethod}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    {/* Next Steps */}
                    <Section>
                        <Heading as="h2" style={h2}>¿Qué sigue?</Heading>
                        <Text style={infoText}>
                            Estamos preparando tu pedido con mucho cuidado. Te avisaremos cuando
                            sea despachado para que puedas rastrearlo.
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            ¿Tienes preguntas? Contáctanos en{' '}
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
    textAlign: 'center',
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

const detailsSection: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '20px',
};

const detailRow: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '14px',
    margin: '0 0 8px',
};

const infoText: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '14px',
    textAlign: 'center',
    lineHeight: '1.6',
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

export default PaymentApprovedEmail;
