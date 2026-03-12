import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-playfair text-2xl font-semibold mb-2">Floristería</h3>
            <p className="text-green-light/90 text-sm">Flores y plantas con alma, desde Barcelona</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/plantas" className="text-green-light/90 hover:text-white transition-colors">
              Plantas
            </Link>
            <Link to="/flores" className="text-green-light/90 hover:text-white transition-colors">
              Flores
            </Link>
            <a href="#contacto" className="text-green-light/90 hover:text-white transition-colors">
              Contacto
            </a>
          </div>
          <div className="text-green-light/90 text-sm">
            <p>Carrer de Provensals 159</p>
            <p>Barcelona</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-mid/30 text-center text-green-light/80 text-sm">
          © 2024 Floristería
        </div>
      </div>
    </footer>
  )
}
