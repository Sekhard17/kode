'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-black border-t border-zinc-900 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="mb-6 block">
                            <span className="text-3xl font-black italic tracking-tighter text-white">KODE<span className="text-orange-500">.</span></span>
                        </Link>
                        <p className="text-zinc-500 max-w-xs mb-8 text-sm leading-relaxed">
                            Moda urbana premium con actitud. Vestimos a la nueva generación con prendas de alta calidad y diseño minimalista.
                        </p>
                        <div className="flex space-x-6">
                            <Instagram className="h-5 w-5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Twitter className="h-5 w-5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                            <Facebook className="h-5 w-5 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Navegación</h4>
                        <ul className="space-y-4 text-sm font-medium text-zinc-500">
                            <li><Link href="/tienda" className="hover:text-white transition-colors">Todo los productos</Link></li>
                            <li><Link href="/tienda?categorySlug=polerones" className="hover:text-white transition-colors">Polerones</Link></li>
                            <li><Link href="/tienda?categorySlug=poleras" className="hover:text-white transition-colors">Poleras</Link></li>
                            <li><Link href="/tienda?categorySlug=pantalones" className="hover:text-white transition-colors">Pantalones</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Ayuda</h4>
                        <ul className="space-y-4 text-sm font-medium text-zinc-500">
                            <li className="hover:text-white transition-colors cursor-pointer">Seguimiento de Orden</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Preguntas Frecuentes</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Envíos y Retornos</li>
                            <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                soporte@kode.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    <p>© {new Date().getFullYear()} KODE CL. Todos los derechos reservados.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="cursor-pointer hover:text-white">Privacidad</span>
                        <span className="cursor-pointer hover:text-white">Términos</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
