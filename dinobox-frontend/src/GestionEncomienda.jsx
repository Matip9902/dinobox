import { useState } from 'react'

const API = 'http://localhost:8080/api/v1/encomienda'

const campos = [
  ['remitente', 'Remitente'],
  ['destinatario', 'Destinatario'],
  ['direccionDestino', 'Dirección de destino'],
  ['descripcion', 'Descripción'],
  ['ubicacionActual', 'Ubicación actual'],
]

export default function GestionEncomienda({ encomienda, onCambio }) {
  const [datos, setDatos] = useState({
    remitente: encomienda.remitente,
    destinatario: encomienda.destinatario,
    direccionDestino: encomienda.direccionDestino,
    descripcion: encomienda.descripcion,
    ubicacionActual: encomienda.ubicacionActual,
  })
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function guardar(evento) {
    evento.preventDefault()
    setError('')
    setMensaje('')

    const datosLimpios = Object.fromEntries(
      Object.entries(datos).map(([campo, valor]) => [
        campo,
        valor.trim(),
      ])
    )

    if (Object.values(datosLimpios).some((valor) => !valor)) {
      setError('Completa todos los campos sin dejar solo espacios.')
      return
    }

    setOcupado(true)

    try {
      const respuesta = await fetch(
        `${API}/${encodeURIComponent(encomienda.codigoSeguimiento)}/datos`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosLimpios),
        }
      )

      if (!respuesta.ok) {
        throw new Error(`No se pudo editar (HTTP ${respuesta.status}).`)
      }

      const actualizada = await respuesta.json()
      setDatos(datosLimpios)
      setMensaje('Datos guardados. Pulsa Buscar para actualizar los detalles.')
      onCambio()
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'No se pudo conectar con el backend.'
          : error.message
      )
    } finally {
      setOcupado(false)
    }
  }

  async function eliminar() {
    const confirmado = window.confirm(
      `¿Eliminar definitivamente la encomienda ${encomienda.codigoSeguimiento}?`
    )

    if (!confirmado) return

    setError('')
    setMensaje('')
    setOcupado(true)

    try {
      const respuesta = await fetch(
        `${API}/${encodeURIComponent(encomienda.codigoSeguimiento)}`,
        { method: 'DELETE' }
      )

      if (!respuesta.ok) {
        throw new Error(`No se pudo eliminar (HTTP ${respuesta.status}).`)
      }

      onCambio(true)
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'No se pudo conectar con el backend.'
          : error.message
      )
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="mt-4 border-top pt-4">
      <h3 className="h5">Editar datos de la encomienda</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      <form onSubmit={guardar} className="row g-3">
        {campos.map(([nombre, etiqueta]) => (
          <div className="col-md-6" key={nombre}>
            <label htmlFor={`editar-${nombre}`} className="form-label">
              {etiqueta}
            </label>
            <input
              id={`editar-${nombre}`}
              className="form-control"
              value={datos[nombre]}
              onChange={(evento) =>
                setDatos((anteriores) => ({
                  ...anteriores,
                  [nombre]: evento.target.value,
                }))
              }
              required
              maxLength={255}
              disabled={ocupado}
            />
          </div>
        ))}

        <div className="d-flex gap-2 flex-wrap">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={ocupado}
          >
            {ocupado ? 'Procesando…' : 'Guardar datos'}
          </button>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={eliminar}
            disabled={ocupado}
          >
            Eliminar encomienda
          </button>
        </div>
      </form>
    </div>
  )
}