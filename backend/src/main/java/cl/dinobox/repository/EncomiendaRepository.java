package cl.dinobox.repository;

import cl.dinobox.model.Encomienda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EncomiendaRepository
        extends JpaRepository<Encomienda, Long> {

    Optional<Encomienda> findByCodigoSeguimiento(String codigoSeguimiento);

    boolean existsByCodigoSeguimiento(String codigoSeguimiento);
}