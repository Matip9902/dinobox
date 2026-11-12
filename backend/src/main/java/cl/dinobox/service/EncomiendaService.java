package cl.dinobox.service;

import cl.dinobox.model.Encomienda;
import cl.dinobox.model.EstadoEncomienda;
import cl.dinobox.repository.EncomiendaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EncomiendaService {

    private final EncomiendaRepository repository;

    public EncomiendaService(EncomiendaRepository repository) {
        this.repository = repository;
    }

    public Encomienda crear(Encomienda solicitud) {
        Encomienda encomienda = new Encomienda();

        encomienda.setRemitente(solicitud.getRemitente());
        encomienda.setDestinatario(solicitud.getDestinatario());
        encomienda.setDireccionDestino(solicitud.getDireccionDestino());
        encomienda.setDescripcion(solicitud.getDescripcion());
        encomienda.setUbicacionActual(solicitud.getUbicacionActual());

        encomienda.setCodigoSeguimiento(generarCodigo());
        encomienda.setEstado(EstadoEncomienda.EN_RECEPCION);

        return repository.save(encomienda);
    }

    @Transactional(readOnly = true)
    public List<Encomienda> listar() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Encomienda buscarPorCodigo(String codigo) {
        return repository.findByCodigoSeguimiento(codigo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe una encomienda con ese código"
                ));
    }

    public Encomienda actualizarEstado(
            String codigo,
            EstadoEncomienda estado,
            String ubicacionActual
    ) {
        Encomienda encomienda = buscarPorCodigo(codigo);

        encomienda.setEstado(estado);
        encomienda.setUbicacionActual(ubicacionActual);

        return repository.save(encomienda);
    }

    public Encomienda editar(String codigo, Encomienda datos) {
        Encomienda encomienda = buscarPorCodigo(codigo);

        encomienda.setRemitente(datos.getRemitente());
        encomienda.setDestinatario(datos.getDestinatario());
        encomienda.setDireccionDestino(datos.getDireccionDestino());
        encomienda.setDescripcion(datos.getDescripcion());

        return repository.save(encomienda);
    }

    public void eliminar(String codigo) {
        Encomienda encomienda = buscarPorCodigo(codigo);
        repository.delete(encomienda);
    }

    private String generarCodigo() {
        String codigo;

        do {
            codigo = "DINO-" + UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .toUpperCase();
        } while (repository.existsByCodigoSeguimiento(codigo));

        return codigo;
    }
}