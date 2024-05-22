package project.with.rxjs.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import project.with.rxjs.server.model.Server;

public interface ServerRepo extends JpaRepository<Server, Long> {
    Server findByIpAddress(String ipAddress);
}
