import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Contacto | X+M² arquitectos',
  description: 'Estudio y Taller de Arquitectura - X+M² arquitectos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="architectural-lines">
          <div className="line line-h"></div>
          <div className="line line-v"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
