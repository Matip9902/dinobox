package cl.dinobox.controller;

import cl.dinobox.model.Encomienda;
import cl.dinobox.model.EstadoEncomienda;
import cl.dinobox.service.EncomiendaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/encomienda")
@CrossOrigin(origins = "http://localhost:5173")
public class EncomiendaController {

    private final EncomiendaService service;

    public EncomiendaController(EncomiendaService service) {
        this.service = service;
    }

    public record DatosEncomienda(
            @NotBlank @Size(max = 255) String remitente,
            @NotBlank @Size(max = 255) String destinatario,
            @NotBlank @Size(max = 255) String direccionDestino,
            @NotBlank @Size(max = 255) String descripcion,
            @NotBlank @Size(max = 255) String ubicacionActual
    ) {
        public Encomienda convertirAEntidad() {
            Encomienda encomienda = new Encomienda();
            encomienda.setRemitente(remitente);
            encomienda.setDestinatario(destinatario);
            encomienda.setDireccionDestino(direccionDestino);
            encomienda.setDescripcion(descripcion);
            encomienda.setUbicacionActual(ubicacionActual);
            return encomienda;
        }
    }

    public record CambioEstado(
            @NotNull EstadoEncomienda estado,
            @NotBlank @Size(max = 255) String ubicacionActual
    ) {
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Encomienda crear(@Valid @RequestBody DatosEncomienda datos) {
        return service.crear(datos.convertirAEntidad());
    }

    @GetMapping
    public List<Encomienda> listar() {
        return service.listar();
    }

    @GetMapping("/{codigo}")
    public Encomienda buscar(@PathVariable String codigo) {
        return service.buscarPorCodigo(codigo);
    }

    @PutMapping("/{codigo}")
    public Encomienda actualizarEstado(
            @PathVariable String codigo,
            @Valid @RequestBody CambioEstado datos
    ) {
        return service.actualizarEstado(
                codigo,
                datos.estado(),
                datos.ubicacionActual()
        );
    }

    @PutMapping("/{codigo}/datos")
    public Encomienda editar(
            @PathVariable String codigo,
            @Valid @RequestBody DatosEncomienda datos
    ) {
        return service.editar(codigo, datos.convertirAEntidad());
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String codigo) {
        service.eliminar(codigo);
    }
}