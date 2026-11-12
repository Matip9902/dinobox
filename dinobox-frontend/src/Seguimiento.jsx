import { useState } from 'react'
import GestionEncomienda from './GestionEncomienda'

const API = 'http://localhost:8080/api/v1/encomienda'

const estados = [
  ['EN_RECEPCION', 'En Recepción'],
  ['EN_DESPACHO', 'En Despacho'],
  ['EN_TRANSITO', 'En Tránsito'],
  ['ENTREGADO', 'Entregado'],
]

export default function Seguimiento() {
  const [codigo, setCodigo] = useState('')
  const [encomienda, setEncomienda] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [actualizando, setActualizando] = useState(false)
  const [nuevoEstado, setNuevoEstado] = useState('EN_RECEPCION')
  const [nuevaUbicacion, setNuevaUbicacion] = useState('')

  const ocupado = buscando || actualizando

  function mostrarEncomienda(datos) {
    setEncomienda(datos)
    setNuevoEstado(datos.estado)
    setNuevaUbicacion(datos.ubicacionActual)
  }

  async function consultar(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')
    setEncomienda(null)

    const codigoLimpio = codigo.trim().toUpperCase()

    if (!codigoLimpio) {
      setError('Ingresa un código de seguimiento.')
      return
    }

    setBuscando(true)

    try {
      const respuesta = await fetch(
        `${API}/${encodeURIComponent(codigoLimpio)}`
      )

      if (respuesta.status === 404) {
        throw new Error('No existe una encomienda con ese código.')
      }

      if (!respuesta.ok) {
        throw new Error(
          `No se pudo consultar (HTTP ${respuesta.status}).`
        )
      }

      const datos = await respuesta.json()
      mostrarEncomienda(datos)
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'No se pudo conectar con el backend. Comprueba que Spring Boot esté ejecutándose.'
          : error.message
      )
    } finally {
      setBuscando(false)
    }
  }

  async function actualizarEstado(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    if (!encomienda) return

    const ubicacion = nuevaUbicacion.trim()

    if (!ubicacion) {
      setError('Ingresa una ubicación válida.')
      return
    }

    setActualizando(true)

    try {
      const respuesta = await fetch(
        `${API}/${encodeURIComponent(encomienda.codigoSeguimiento)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            estado: nuevoEstado,
            ubicacionActual: ubicacion,
          }),
        }
      )

      if (respuesta.status === 404) {
        throw new Error('La encomienda ya no existe.')
      }

      if (!respuesta.ok) {
        throw new Error(
          `No se pudo actualizar (HTTP ${respuesta.status}).`
        )
      }

      const datos = await respuesta.json()
      mostrarEncomienda(datos)
      setMensaje('Estado actualizado correctamente.')
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'No se pudo conectar con el backend.'
          : error.message
      )
    } finally {
      setActualizando(false)
    }
  }

  function gestionarCambio(eliminada) {
    setError('')
    setMensaje('')

    if (eliminada) {
      setEncomienda(null)
      setMensaje('Encomienda eliminada correctamente.')
    }
  }

  return (
    <section className="card shadow-sm mt-4">
      <div className="card-body p-4">
        <h2 className="h4 mb-4">Consultar encomienda</h2>

        <form onSubmit={consultar} className="row g-2">
          <div className="col-sm">
            <label htmlFor="codigoConsulta" className="form-label">
              Código de seguimiento
            </label>

            <input
              id="codigoConsulta"
              className="form-control"
              value={codigo}
              onChange={(evento) => setCodigo(evento.target.value)}
              placeholder="DINO-..."
              required
              disabled={ocupado}
            />
          </div>

          <div className="col-sm-auto d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={ocupado}
            >
              {buscando ? 'Buscando…' : 'Buscar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="alert alert-success mt-3" role="status">
            {mensaje}
          </div>
        )}

        {encomienda && (
          <div className="mt-4">
            <div className="row g-2 mb-4">
              {estados.map(([valor, etiqueta]) => (
                <div className="col-6 col-lg-3" key={valor}>
                  <div
                    className={`border rounded p-3 text-center h-100 ${
                      encomienda.estado === valor
                        ? 'bg-success text-white'
                        : 'bg-light'
                    }`}
                  >
                    {etiqueta}

                    {encomienda.estado === valor && (
                      <small className="d-block mt-1">
                        Estado actual
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <dl className="row mb-0">
              <dt className="col-sm-4">Código de seguimiento</dt>
              <dd className="col-sm-8 text-break">
                {encomienda.codigoSeguimiento}
              </dd>

              <dt className="col-sm-4">Remitente</dt>
              <dd className="col-sm-8">
                {encomienda.remitente}
              </dd>

              <dt className="col-sm-4">Destinatario</dt>
              <dd className="col-sm-8">
                {encomienda.destinatario}
              </dd>

              <dt className="col-sm-4">Dirección de destino</dt>
              <dd className="col-sm-8">
                {encomienda.direccionDestino}
              </dd>

              <dt className="col-sm-4">Descripción</dt>
              <dd className="col-sm-8">
                {encomienda.descripcion}
              </dd>

              <dt className="col-sm-4">Ubicación actual</dt>
              <dd className="col-sm-8">
                {encomienda.ubicacionActual}
              </dd>

              <dt className="col-sm-4">Fecha de registro</dt>
              <dd className="col-sm-8">
                {new Date(encomienda.fechaCreacion).toLocaleString('es-CL')}
              </dd>
            </dl>

            <hr className="my-4" />

            <h3 className="h5">Actualizar estado</h3>

            <form
              onSubmit={actualizarEstado}
              className="row g-3 mt-1"
            >
              <div className="col-md-4">
                <label htmlFor="nuevoEstado" className="form-label">
                  Estado
                </label>

                <select
                  id="nuevoEstado"
                  className="form-select"
                  value={nuevoEstado}
                  onChange={(evento) =>
                    setNuevoEstado(evento.target.value)
                  }
                  disabled={ocupado}
                >
                  {estados.map(([valor, etiqueta]) => (
                    <option key={valor} value={valor}>
                      {etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-8">
                <label
                  htmlFor="nuevaUbicacion"
                  className="form-label"
                >
                  Ubicación actual
                </label>

                <input
                  id="nuevaUbicacion"
                  className="form-control"
                  value={nuevaUbicacion}
                  onChange={(evento) =>
                    setNuevaUbicacion(evento.target.value)
                  }
                  required
                  maxLength={255}
                  disabled={ocupado}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={ocupado}
                >
                  {actualizando ? 'Actualizando…' : 'Guardar estado'}
                </button>
              </div>
            </form>

            <GestionEncomienda
              key={JSON.stringify(encomienda)}
              encomienda={encomienda}
              onCambio={gestionarCambio}
            />
          </div>
        )}
      </div>
    </section>
  )
}