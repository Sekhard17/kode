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
    Row,
    Column,
} from '@react-email/components';

interface OrderItem {
    productName: string;
    size: string;
    quantity: number;
    unitPriceClp: number;
    lineTotalClp: number;
}

interface OrderConfirmationEmailProps {
    customerName: string;
    orderNumber: string;
    items: OrderItem[];
    subtotalClp: number;
    shippingPriceClp: number;
    discountClp: number;
    totalClp: number;
    shipAddress: string;
    shipCity: string;
    shipRegion: string;
    logoUrl?: string;
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

export function OrderConfirmationEmail({
    customerName,
    orderNumber,
    items,
    subtotalClp,
    shippingPriceClp,
    discountClp,
    totalClp,
    shipAddress,
    shipCity,
    shipRegion,
    logoUrl,
}: OrderConfirmationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Confirmación de pedido {orderNumber}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        {logoUrl && (
                            <Img src={logoUrl} alt="KODE" width={120} height={40} style={logo} />
                        )}
                    </Section>

                    {/* Title */}
                    <Heading style={h1}>¡Gracias por tu compra, {customerName}!</Heading>
                    <Text style={heroText}>
                        Tu pedido <strong>#{orderNumber}</strong> ha sido recibido y está siendo procesado.
                    </Text>

                    <Hr style={hr} />

                    {/* Order Items */}
                    <Section>
                        <Heading as="h2" style={h2}>Resumen del Pedido</Heading>
                        {items.map((item, index) => (
                            <Row key={index} style={itemRow}>
                                <Column style={itemDetails}>
                                    <Text style={itemName}>{item.productName}</Text>
                                    <Text style={itemMeta}>
                                        Talla: {item.size} × {item.quantity}
                                    </Text>
                                </Column>
                                <Column style={itemPrice}>
                                    <Text style={priceText}>{formatPrice(item.lineTotalClp)}</Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={hr} />

                    {/* Totals */}
                    <Section style={totalsSection}>
                        <Row>
                            <Column style={totalLabel}>Subtotal</Column>
                            <Column style={totalValue}>{formatPrice(subtotalClp)}</Column>
                        </Row>
                        <Row>
                            <Column style={totalLabel}>Envío</Column>
                            <Column style={totalValue}>
                                {shippingPriceClp === 0 ? 'Gratis' : formatPrice(shippingPriceClp)}
                            </Column>
                        </Row>
                        {discountClp > 0 && (
                            <Row>
                                <Column style={totalLabel}>Descuento</Column>
                                <Column style={{ ...totalValue, color: '#16a34a' }}>
                                    -{formatPrice(discountClp)}
                                </Column>
                            </Row>
                        )}
                        <Hr style={hr} />
                        <Row>
                            <Column style={{ ...totalLabel, fontWeight: 'bold', fontSize: '18px' }}>
                                Total
                            </Column>
                            <Column style={{ ...totalValue, fontWeight: 'bold', fontSize: '18px' }}>
                                {formatPrice(totalClp)}
                            </Column>
                        </Row>
                    </Section>

                    <Hr style={hr} />

                    {/* Shipping Address */}
                    <Section>
                        <Heading as="h2" style={h2}>Dirección de Envío</Heading>
                        <Text style={addressText}>
                            {shipAddress}<br />
                            {shipCity}, {shipRegion}
                        </Text>
                    </Section>

                    <Hr style={hr} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            Te enviaremos un email cuando tu pedido sea despachado.
                        </Text>
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
    marginBottom: '32px',
};

const logo: React.CSSProperties = {
    margin: '0 auto',
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

const itemRow: React.CSSProperties = {
    marginBottom: '12px',
};

const itemDetails: React.CSSProperties = {
    width: '70%',
};

const itemName: React.CSSProperties = {
    color: '#1a1a1a',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 4px',
};

const itemMeta: React.CSSProperties = {
    color: '#718096',
    fontSize: '13px',
    margin: '0',
};

const itemPrice: React.CSSProperties = {
    width: '30%',
    textAlign: 'right',
};

const priceText: React.CSSProperties = {
    color: '#1a1a1a',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0',
};

const totalsSection: React.CSSProperties = {
    padding: '0 0 8px',
};

const totalLabel: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '14px',
    width: '70%',
    padding: '4px 0',
};

const totalValue: React.CSSProperties = {
    color: '#1a1a1a',
    fontSize: '14px',
    width: '30%',
    textAlign: 'right',
    padding: '4px 0',
};

const addressText: React.CSSProperties = {
    color: '#4a5568',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0',
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

export default OrderConfirmationEmail;
