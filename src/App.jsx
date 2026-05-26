import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8 text-texto-secundario">
        Conteúdo da página vem aqui...
      </main>
      <Footer />
    </div>
  )
}

export default App