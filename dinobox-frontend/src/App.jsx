import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Seguimiento from './Seguimiento'

const formularioInicial = {
  remitente: '',
  destinatario: '',
  direccionDestino: '',
  descripcion: '',
  ubicacionActual: '',
}

const campos = [
  ['remitente', 'Nombre del remitente'],
  ['destinatario', 'Nombre del destinatario'],
  ['direccionDestino', 'Dirección de destino'],
  ['descripcion', 'Descripción de la encomienda'],
  ['ubicacionActual', 'Sucursal de recepción'],
]

function App() {
  const [formulario, setFormulario] = useState(formularioInicial)
  const [encomiendaCreada, setEncomiendaCreada] = useState(null)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  async function registrarEncomienda(evento) {
    evento.preventDefault()
    setError('')
    setEncomiendaCreada(null)

    const datos = Object.fromEntries(
      Object.entries(formulario).map(([campo, valor]) => [
        campo,
        valor.trim(),
      ])
    )

    if (Object.values(datos).some((valor) => valor === '')) {
      setError('Completa todos los campos sin dejar solo espacios.')
      return
    }

    setGuardando(true)

    try {
      const respuesta = await fetch(
        'http://localhost:8080/api/v1/encomienda',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos),
        }
      )

      if (!respuesta.ok) {
        throw new Error(
          `No se pudo registrar la encomienda (HTTP ${respuesta.status}).`
        )
      }

      const encomienda = await respuesta.json()
      setEncomiendaCreada(encomienda)
      setFormulario(formularioInicial)
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'No se pudo conectar con el backend. Comprueba que Spring Boot esté ejecutándose.'
          : error.message
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="container py-5">
      <header className="mb-4">
        <h1 className="text-success fw-bold">Dinobox</h1>
        <p className="text-secondary">
          A un rawr de tu casa. Registra y consulta tus encomiendas.
        </p>
      </header>

      <section className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="h4 mb-4">Registrar encomienda</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {encomiendaCreada && (
            <div className="alert alert-success" role="status">
              <p className="mb-2">Encomienda registrada correctamente.</p>
              <strong>Código de seguimiento:</strong>
              <div className="codigo-seguimiento">
                {encomiendaCreada.codigoSeguimiento}
              </div>
              <small>Guarda este código para consultar tu envío.</small>
            </div>
          )}

          <form onSubmit={registrarEncomienda}>
            <div className="row g-3">
              {campos.map(([nombre, etiqueta]) => (
                <div className="col-md-6" key={nombre}>
                  <label htmlFor={nombre} className="form-label">
                    {etiqueta}
                  </label>
                  <input
                    id={nombre}
                    name={nombre}
                    className="form-control"
                    value={formulario[nombre]}
                    onChange={cambiarCampo}
                    required
                    maxLength={255}
                    disabled={guardando}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-success mt-4"
              disabled={guardando}
            >
              {guardando ? 'Registrando…' : 'Registrar encomienda'}
            </button>
          </form>
        </div>
      </section>
      < Seguimiento/>
    </main>
  )
}

export default App