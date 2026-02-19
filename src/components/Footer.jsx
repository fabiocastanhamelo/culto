import ShimmerButton from './ui/ShimmerButton'

export default function Footer({ onDonateClick }) {
  return (
    <footer className="relative py-16 px-4 border-t border-slate-800">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-12 text-center md:text-left">
          {/* Info do Evento */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              16º Culto de Ação de Graças
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              Um evento especial de gratidão e celebração promovido pelas congregações Parque Savoy e Guarulhos.
            </p>
            <div className="flex gap-2 text-2xl justify-center md:justify-start">
              <span>🙏</span>
              <span>❤️</span>
              <span>✨</span>
            </div>
          </div>

          {/* Data e Local */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">📅 Informações</h4>
            <ul className="space-y-2 text-gray-400 text-sm inline-block md:block text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>20, 21 e 22 de Novembro de 2026</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>São Paulo - SP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Congregações Parque Savoy & Guarulhos</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">💝 Contribua</h4>
            <p className="text-gray-400 text-sm mb-4">
              Sua doação é fundamental para a realização deste evento especial.
            </p>
            <ShimmerButton onClick={onDonateClick} className="w-full text-base mx-auto md:mx-0">
              Fazer Doação
            </ShimmerButton>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2026 16º Culto de Ação de Graças. Todos os direitos reservados.</p>
            <p className="mt-2">
              Desenvolvido com ❤️ para a glória de Deus
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
