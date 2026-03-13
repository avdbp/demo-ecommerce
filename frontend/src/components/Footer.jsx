import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-sans text-lg font-bold mb-2 text-neutral-400">Floristería Roquetes</h3>
            <p className="text-neutral-400 text-sm">Demo Ecommerce · Flores y plantas en Barcelona</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/plantas" className="text-neutral-400 hover:text-white text-sm transition-colors">Plantas</Link>
            <Link to="/flores" className="text-neutral-400 hover:text-white text-sm transition-colors">Flores</Link>
            <a href="#contacto" className="text-neutral-400 hover:text-white text-sm transition-colors">Contacto</a>
          </div>
          <div className="text-neutral-300 text-sm">
            <p>Carrer de Provensals 159</p>
            <p>Barcelona</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-600 text-center text-neutral-400 text-sm">
          © 2024 Floristería
        </div>
      </div>
    </footer>
  )
}
